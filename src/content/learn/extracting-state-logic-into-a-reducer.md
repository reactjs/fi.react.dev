---
title: Tilalogiikan siirtäminen reduktoriin
---

<Intro>

Komponentit joissa on paljon tilapäivityksiä ja jotka jakavat tilan päivitykset useiden tapahtumankäsittelijöiden välillä, voivat olla hämmentäviä. Näissä tapauksissa voit yhdistää kaiken tilanpäivityslogiikan komponentin ulkopuolelle yhteen funktioon, jota kutsutaan _reduktoriksi_ (engl. _reducer_). 

</Intro>

<YouWillLearn>

- Mikä on reduktorifunktio
- Miten refaktoroidaan `useState` `useReducer`-käyttöön
- Milloin reduktoria kannattaa käyttää
- Miten se kirjoitetaan hyvin

</YouWillLearn>

## Tilalogiikan yhdistäminen reduktoriin {/*consolidate-state-logic-with-a-reducer*/}

Kun komponenttisi kasvavat monimutkaisemmiksi, voi olla vaikeampaa nähdä yhdellä silmäyksellä kaikkia eri tapoja, joilla komponentin tilaa päivitetään. Esimerkiksi alla oleva `TaskApp`-komponentti sisältää taulukon `tasks` ja käyttää kolmea eri tapahtumankäsittelijää tehtävien lisäämiseen, poistamiseen ja muokkaamiseen:

<Sandpack>

```js App.js
import { useState } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, setTasks] = useState(initialTasks);

  function handleAddTask(text) {
    setTasks([
      ...tasks,
      {
        id: nextId++,
        text: text,
        done: false,
      },
    ]);
  }

  function handleChangeTask(task) {
    setTasks(
      tasks.map((t) => {
        if (t.id === task.id) {
          return task;
        } else {
          return t;
        }
      })
    );
  }

  function handleDeleteTask(taskId) {
    setTasks(tasks.filter((t) => t.id !== taskId));
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

Kukin tapahtumankäsittelijä kutsuu `setTasks`-funktiota tilan päivittämiseksi. Kun komponentti kasvaa, kasvaa myös tilalogiikan määrä. Tilalogiikan vähentämiseksi ja sen helpottamiseksi voit siirtää tilan logiikan yksittäiseen funktioon komponentin ulkopuolelle, **jota kutsutaan "reduktoriksi".**

Reduktorit ovat erilainen tapa käsitellä tilaa. Voit siirtyä `useState`sta `useReducer`iin kolmessa vaiheessa:

1. **Siirrä** tilan asettaminen toiminnon lähettämiseksi.
2. **Kirjoita** reduktorifunktio.
3. **Käytä** reduktoria komponentistasi.

### 1. Vaihe: Päivitä tilan asettaminen toiminnon lähettämiseksi {/*step-1-move-from-setting-state-to-dispatching-actions*/}

Tapahtumankäsittelijäsi määrittävät _mitä tehdä_ asettamalla tilan:

```js
function handleAddTask(text) {
  setTasks([
    ...tasks,
    {
      id: nextId++,
      text: text,
      done: false,
    },
  ]);
}

function handleChangeTask(task) {
  setTasks(
    tasks.map((t) => {
      if (t.id === task.id) {
        return task;
      } else {
        return t;
      }
    })
  );
}

function handleDeleteTask(taskId) {
  setTasks(tasks.filter((t) => t.id !== taskId));
}
```

Poista kaikki tilan asettamisen logiikka. Jäljelle jää kolme tapahtumankäsittelijää:

- `handleAddTask(text)` kutsutaan kun käyttäjä painaa "Add".
- `handleChangeTask(task)` kutsutaan kun käyttäjä vaihtaa tehtävän tilaa tai painaa "Save".
- `handleDeleteTask(taskId)` kutsutaan kun käyttäjä painaa "Delete".

Tilan hallinta reduktoreilla on hieman erilaista kuin suoraan tilan asettaminen. Sen sijaan että kerrot Reactille "mitä tehdä" asettamalla tilan, määrität "mitä käyttäjä juuri teki" lähettämällä "toimintoja" tapahtumankäsittelijöistäsi. (Tilan päivityslogiikka asuu muualla!) Joten sen sijaan että "asettaisit `tasks`in" tapahtumankäsittelijässä, lähettäisit "lisätty/muokattu/poistettu tehtävä" -toiminnon. Tämä on kuvaavampi käyttäjän tarkoituksesta.

```js
function handleAddTask(text) {
  dispatch({
    type: 'added',
    id: nextId++,
    text: text,
  });
}

function handleChangeTask(task) {
  dispatch({
    type: 'changed',
    task: task,
  });
}

function handleDeleteTask(taskId) {
  dispatch({
    type: 'deleted',
    id: taskId,
  });
}
```

Olio jonka välität `dispatch`lle on nimeltään "toiminto":

```js {3-7}
function handleDeleteTask(taskId) {
  dispatch(
    // "action" olio:
    {
      type: 'deleted',
      id: taskId,
    }
  );
}
```

Se on tavallinen JavaScript-olio. Päätät mitä sinne laitat, mutta yleensä se pitäisi sisällään vähimmäistiedot _mitä tapahtui_. (Lisäät `dispatch`-funktion itse myöhemmin.)

<Note>

Toiminto-olion muoto voi olla mitä tahansa.

Käytännön mukaan, on yleistä antaa sille merkkijono `type`, joka kuvaa mitä tapahtui, ja lähettää lisätietoja muissa kentissä. `type` on erityinen komponentille, joten tässä esimerkissä joko `'added'` tai `'added_task'` olisi hyvä. Valitse nimi, joka kertoo mitä tapahtui!

```js
dispatch({
  // erityinen komponentille
  type: 'mita_tapahtui',
  // muut kentät tulee tänne
});
```

</Note>

### 2. Vaihe: Kirjoita reduktorifunktio {/*step-2-write-a-reducer-function*/}

Reduktorifunktio on paikka, johon laitat tilalogiikan. Se ottaa kaksi argumenttia, nykyisen tilan ja toiminnon olion, ja palauttaa seuraavan tilan:

```js
function yourReducer(state, action) {
  // palauta seuraava tila Reactille asetettavaksi
}
```

React asettaa tilaksi sen mitä palautat reduktorista.

Siirtääksesi tilan asettamislogiikan tapahtumankäsittelijöistäsi reduktorifunktioon tässä esimerkissä, sinun pitää:

1. Määritä nykyinen tila (`tasks`) ensimmäisenä argumenttina.
2. Määritä `action`-olio toisena argumenttina.
3. Palauta _seuraava_ tila reduktorista (jonka React asettaa tilaksi).

Tässä on kaikki tilanasettamislogiikka siirretty reduktorifunktioon:

```js
function tasksReducer(tasks, action) {
  if (action.type === 'added') {
    return [
      ...tasks,
      {
        id: action.id,
        text: action.text,
        done: false,
      },
    ];
  } else if (action.type === 'changed') {
    return tasks.map((t) => {
      if (t.id === action.task.id) {
        return action.task;
      } else {
        return t;
      }
    });
  } else if (action.type === 'deleted') {
    return tasks.filter((t) => t.id !== action.id);
  } else {
    throw Error('Unknown action: ' + action.type);
  }
}
```

> Koska reduktorifunktio ottaa tilan (`tasks`) argumenttina, voit **määritellä sen komponentin ulkopuolella.** Tämä pienentää sisennystasoa ja voi tehdä koodistasi helpommin luettavaa.

<Note>

Koodi yllä käyttää if/else -lauseita, mutta on tapana käyttää [switch-lauseita](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/switch) reduktoreissa. Tulos on sama, mutta switch-lauseet ovat helpompi lukea silmäyksellä.

Käytämme niitä tässä dokumentaatiossa loppuun asti seuraavasti:

```js
function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

Suosittelemme käärimään jokaisen `case`-lohkon `{` ja `}` aaltosulkeisiin, jotta eri `case`-lohkoissa määritellyt muuttujat eivät sekoitu keskenään. Lisäksi `case`-lohkossa pitäisi yleensä loppua `return`-lauseella. Jos unohdat `return`-lauseen, koodi "tippuu" seuraavaan `case`-lohkoon, mikä voi johtaa virheisiin!

Jos et ole vielä mukavuusalueellasi switch-lauseilla, if/else on täysin ok.

</Note>

<DeepDive>

#### Miksi reduktoreita kutsutaan tällä tavalla? {/*why-are-reducers-called-this-way*/}

Vaikka reduktoreita voidaan käyttää koodin vähentämiseen komponenteissa, ne nimetään [`reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)-toiminnon mukaan, jota voit suorittaa taulukoilla.

`reduce()`-toiminnolla voit ottaa taulukon ja "kerätä" yhden arvon monista:

```
const arr = [1, 2, 3, 4, 5];
const sum = arr.reduce(
  (result, number) => result + number
); // 1 + 2 + 3 + 4 + 5
```

Funktio jonka välität `reduce` -funktioon kutsutaan "reduktoriksi". Se ottaa _tuloksen tähän mennessä_ ja _nykyisen kohteen_ ja palauttaa _seuraavan tuloksen_. React-reduktorit ovat samaa ideaa: ne ottaa _tilan tähän mennessä_ ja _toiminnon_ ja palauttaa _seuraavan tilan_. Tällä tavalla ne keräävät toimintoja ajan myötä tilaan.

Voisit jopa käyttää `reduce()`-metodia `initialState`- ja `actions`-taulukoiden kanssa lopullisen tilan laskemiseen välittämällä sille reduktorifunktion:

<Sandpack>

```js index.js active
import tasksReducer from './tasksReducer.js';

let initialState = [];
let actions = [
  {type: 'added', id: 1, text: 'Visit Kafka Museum'},
  {type: 'added', id: 2, text: 'Watch a puppet show'},
  {type: 'deleted', id: 1},
  {type: 'added', id: 3, text: 'Lennon Wall pic'},
];

let finalState = actions.reduce(tasksReducer, initialState);

const output = document.getElementById('output');
output.textContent = JSON.stringify(finalState, null, 2);
```

```js tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```html public/index.html
<pre id="output"></pre>
```

</Sandpack>

Sinun ei välttämättä tarvitse tehdä tätä itse, mutta tämä on samankaltaista kuin mitä React tekee.

</DeepDive>

### 3. Vaihe: Käytä reduktoria komponentistasi {/*step-3-use-the-reducer-from-your-component*/}

Lopuksi, sinun täytyy liittää `tasksReducer` komponenttiisi. Tuot `useReducer` Hookki Reactista:

```js
import { useReducer } from 'react';
```

Sitten voit korvata `useState`n:

```js
const [tasks, setTasks] = useState(initialTasks);
```

`useReducer`lla kuten tässä:

```js
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

`useReducer` hookki on samankaltainen kuin `useState`-hookki. Sinun täytyy antaa sille alkuarvo niin se palauttaa tilan arvon ja tavan asettaa tilan (tässä tapauksessa `dispatch`-funktio). Mutta se on hieman erilainen.

`useReducer` hookki ottaa kaksi argumenttia:

1. Reduktorifunktion
2. Alkutilan

Ja se palauttaa:

1. Tilan
2. Toiminnonlähetysfunktion (joka "dispatchaa" käyttäjän toimintoja reduktoriin)

Nyt se on täysin kytketty! Tässä reduktori on määritelty komponentin tiedoston alaosassa:

<Sandpack>

```js App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

Jos haluat, voit siirtää reduktorin eri tiedostoon:

<Sandpack>

```js App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import tasksReducer from './tasksReducer.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

Komponentin logiikka on helpompi lukea, kun erotat asiat kuten tämä. Nyt tapahtumankäsittelijät määrittelevät vain _mitä tapahtui_ lähettämällä toimintoja, ja reduktori määrittelee _miten tila päivittyy_ vastaamaan niitä.

## `useState` ja `useReducer` vertailussa {/*comparing-usestate-and-usereducer*/}

Reduktorit eivät ole ilman haittoja! Tässä on muutamia tapoja verrata niitä:

- **Koodin koko:** Yleensä `useState` -käyttöönottoon tarvitaan vähemmän koodia. `useReducer` -käyttöönottoon tarvitaan sekä reduktori-funktio _että_ toimintoja. Kuitenkin `useReducer` voi auttaa vähentämään koodia, jos monet tapahtumankäsittelijät muuttavat tilaa samalla tavalla.
- **Luettavuus:** `useState` on erittäin helppo lukea, kun tilan päivitykset ovat yksinkertaisia. Kun niistä tulee monimutkaisempia, ne voivat paisuttaa komponentin koodia ja tehdä sen vaikeaksi lukea. Tässä tapauksessa `useReducer`lla voit erottaa selkeästi päivityslogiikan toiminnon itse tapahtumasta.
- **Debuggaus:** Kun sinulla on bugi `useState` hookin kanssa, se saattaa olla hankalaa selvittää _missä_ tila asetettiin väärin ja _miksi_. `useReducer` hookin kanssa voit lisätä reduktorifunktioon lokikirjauksen konsoliin, jotta näet jokaisen tilan päivityksen ja _miksi_ se tapahtui (minkä `action`in perusteella). Jos jokainen `action` on oikein, tiedät, että virhe on reduktorifunktion logiikassa. Kuitenkin sinun on käytävä läpi enemmän koodia kuin `useState` hookin kanssa.
- **Testaaminen:** A reducer is a pure function that doesn't depend on your component. This means that you can export and test it separately in isolation. While generally it's best to test components in a more realistic environment, for complex state update logic it can be useful to assert that your reducer returns a particular state for a particular initial state and action.
- **Testaaminen:** Reduktori on puhdas funktio, joka ei riipu komponentistasi. Tämä tarkoittaa, että voit exportata ja testata sitä erikseen eristettynä. Yleensä parasta on testata komponentteja realistisemmassa ympäristössä, mutta monimutkaisen tilan päivityslogiikan tapauksessa voi olla hyödyllistä varmistaa, että reduktori palauttaa tietyn tilan aina tiettyyn alkutilaan ja toimintoon.
- **Oma mieltymys:** Toiset pitävät reduktoreista, toiset eivät. Se on ok. Se on mielipidekysymys. Voit aina muuttaa `useState` ja `useReducer` koodit toisistaan: ne ovat yhtä hyviä!

Suosittelemme käyttämään reduktoria, jos kohtaat usein virheitä tilan päivityksissä jossakin komponentissa ja haluat lisätä koodiin enemmän rakennetta. Et tarvitse reduktoria kaikkeen: käytä vapaasti! Voit jopa käyttää `useState` ja `useReducer` hookkeja samassa komponentissa.

## Hyvän reduktorin kirjoittaminen {/*writing-reducers-well*/}

Pidä nämä kaksi vinkkiä mielessäsi, kun kirjoitat reduktoreita:

- **Reduktorien on oltava puhtaita.** Samanlailla kuin [tilan päivitysfunktiot](/learn/queueing-a-series-of-state-updates), reduktorit suoritetaan renderöinnin aikana! (Toiminnot ovat jonossa seuraavaan renderöintiin.) Tämä tarkoittaa, että reduktorien [on oltava puhtaita](/learn/keeping-components-pure)—samat lähtötiedot tuottavat aina saman lopputuloksen. Niiden ei tulisi lähettää kutsuja, ajastaa aikakatkaisuja, tai tehdä sivuvaikutuksia (toimintoja, jotka vaikuttavat asioihin komponentin ulkopuolella). Niiden tulisi päivittää [olioita](/learn/updating-objects-in-state) ja [taulukoita](/learn/updating-arrays-in-state) ilman mutaatiota.
- **Jokainen toiminto kuvastaa yksittäisen käyttäjän vuorovaikutusta, vaikka se johtaisi useampiin muutoksiin datassa.** Esimerkiksi, jos käyttäjä painaa "Reset" painiketta lomakkeessa, jossa on viisi kenttää hallittuna reduktorilla, on järkevämpää lähettää yksi `reset_form` toiminto kuin viisi erillistä `set_field` toimintoa. Jos lokitetaan jokainen toiminto reduktorissa, lokin tulisi olla riittävän selkeä, jotta voit rakentaa mitä vuorovaikutuksia tai vastauksia tapahtui missä järjestyksessä. Tämä auttaa virheenkorjauksessa!

## Tiiviin reduktorin kirjoittaminen Immerin avulla {/*writing-concise-reducers-with-immer*/}

Juuri kuten [olioiden](/learn/updating-objects-in-state#write-concise-update-logic-with-immer) ja [taulukoiden](/learn/updating-arrays-in-state#write-concise-update-logic-with-immer) päivittämisen kanssa, voit käyttää Immer kirjastoa reduktoreiden kirjoittamiseen tiiviimmäksi. Tässä, [`useImmerReducer`](https://github.com/immerjs/use-immer#useimmerreducer):n avulla voit muuttaa tilan `push` tai `arr[i] =` määrityksellä:

<Sandpack>

```js App.js
import { useImmerReducer } from 'use-immer';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added': {
      draft.push({
        id: action.id,
        text: action.text,
        done: false,
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex((t) => t.id === action.task.id);
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(tasksReducer, initialTasks);

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

Reduktorien on oltava puhtaita, joten niiden ei tulisi mutatoida tilaa. Mutta Immer tarjoaa sinulle erikoisen `draft`-olion, jota voi turvallisesti mutatoida. Immer luo taustalla kopion tilasta muutoksilla, jotka teit `draft`:iin. Tämän takia `useImmerReducer`:n hallinnoimat reduktorit voivat mutatoida niiden ensimmäistä argumenttiaan ja ei tarvitse palauttaa tilaa.

<Recap>

- `useState`sta `useReducer`iin muuttaminen:
  1. Lähetä toimintoja tapahtumankäsittelijöistä.
  2. Kirjoita reduktorifunktio, joka palauttaa seuraavan tilan annetulle tilalle ja toiminnolle.
  3. Korvaa `useState` `useReducer`:lla.
- Reduktorit vaativat hieman enemmän koodia, mutta ne auttavat virheenetsinnässä ja testauksessa.
- Reduktorien on oltava puhtaita.
- Kullakin toiminnolla on yksi käyttäjän vuorovaikutus.
- Käytä Immeriä, jos haluat kirjoittaa reduktorit muuttavalla tyylillä.

</Recap>

<Challenges>

#### Lähetä toimintoja tapahtumankäsittelijöistä {/*dispatch-actions-from-event-handlers*/}

Tällä hetkellä, tapahtumankäsittelijät `ContactList.js` ja `Chat.js` tiedostoissa sisältävät `// TODO` kommentteja. Tämän takia kirjoittaminen ei toimi ja nappien painaminen ei vaihda valittua vastaanottajaa.

Korvaa nämä kaksi `// TODO` kommenttia koodilla, joka lähettää `dispatch`llä toimintoja. Katso toiminnon odotettu muoto ja tyyppi reduktorista, `messengerReducer.js` tiedostosta. Reduktori on jo kirjoitettu, joten sinun ei tarvitse muuttaa sitä. Sinun tarvitsee vain lähettää toimintoja `ContactList.js` ja `Chat.js` tiedostoissa.

<Hint>

`dispatch` funktio on jo saatavilla molemmissa näissä komponenteissa, sillä se välitettiin propsina. Joten sinun täytyy kutsua `dispatch` funktiota vastaavalla toiminto-olio.

Katso toiminto-olion muoto reduktorista ja katso mitä `action` kenttiä se odottaa näkevänsä. Esimerkiksi `changed_selection` tapauksessa reduktorissa näyttää tältä:

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId
  };
}
```

Tämä tarkoittaa, että toiminto-oliosi pitäisi sisältää `type: 'changed_selection'` kentän. Voit myös nähdä, että `action.contactId`:tä käytetään, joten sinun on sisällytettävä `contactId` kenttä toiminto-olioosi.

</Hint>

<Sandpack>

```js App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                // TODO: dispatch changed_selection
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          // TODO: dispatch edited_message
          // (Read the input value from e.target.value)
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

Reduktorin koodista voit päätellä toimintojen on näytettävä tältä:

```js
// Kun käyttäjä painaa "Alice"
dispatch({
  type: 'changed_selection',
  contactId: 1,
});

// Kun käyttäjä kirjoittaa "Hello!"
dispatch({
  type: 'edited_message',
  message: 'Hello!',
});
```

Tässä on esimerkki päivitetty lähettämään vastaavat viestit:

<Sandpack>

```js App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

</Solution>

#### Tyhjää viestikenttä lähettämisen jälkeen {/*clear-the-input-on-sending-a-message*/}

Tällä hetkellä, "Lähetä" ei tee mitään. Lisää tapahtumankäsittelijä "Lähetä" painikkeelle, joka tekee seuraavat asiat:

1. Näytä `alert` vastaanottajan sähköpostiosoitteella ja viestillä.
2. Tyhjää viestikenttä lähettämisen jälkeen.

<Sandpack>

```js App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

On muutama tapa, jolla voit tehdä sen "Lähetä" painikkeen tapahtumankäsittelijässä. Yksi tapa on näyttää `alert` ja sitten lähettää `edited_message` toiminto tyhjällä `message` kentällä:

<Sandpack>

```js App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'edited_message',
            message: '',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Tämä toimii ja tyhjää kentän kun painat "Lähetä".

Kuitenkin, _käyttäjän näkökulmasta_, viestin lähettäminen on eri toiminto kuin kentän muokkaaminen. Tätä vastatakseen, voisit luoda _uuden_ toiminnon nimeltä `sent_message`, ja käsitellä sitä erikseen reduktorissa:

<Sandpack>

```js App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js active
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Lopullinen tulos on sama. Pidä kuitenkin mielessä, että toiminto-tyyppien tulisi ideaalisti kuvata "mitä käyttäjä teki" toisin kuin "miten haluat tilan muuttuvan". Tämä tekee uusien ominaisuuksien lisäämisestä helpompaa myöhemmin.

Molemmilla vaihtoehdoilla, on tärkeää, että **et* sijoita `alert` kutsua reduktorin sisään. Reduktorin tulisi olla puhdas funktio--sen tulisi laskea vain seuraava tila. Sen ei tulisi "tehdä" mitään, mukaanlukien näyttää käyttäjälle viestiä. Sen tulisi tapahtua Tapahtumankäsittelijässä. (Helpottaaksesi tämän kaltaisten virheiden löytämistä, React kutsuu reduktoreitasi useita kertoja StrictModessa. Tämän takia jos laitat ilmoituksen reduktoriin, sitä kutsutaan kahdesti.)

</Solution>

#### Palauta syöttölaatikon arvot välilehtiä vaihtaessa {/*restore-input-values-when-switching-between-tabs*/}

Tässä esimerkissä, vaihtaminen vastaanottajien välillä tyhjää aina tekstisyötteen:

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId,
    message: '' // Clears the input
  };
```

Tämä tapahtuu, sillä et halua jakaa yhtä viestin luonnosta useiden vastaanottajien välillä. Mutta olisi parempi, jos sovellus "muistaisi" luonnoksen jokaiselle vastaanottajalle erikseen, ja palauttaisi sen, kun vaihdat vastaanottajia.

Tehtäväsi on muuttaa tilan rakennetta siten, että muistat erillisen viestin luonnoksen _jokaiselle vastaanottajalle_. Sinun täytyy tehdä muutamia muutoksia reduktoriin, alkutilaan ja komponentteihin.

<Hint>

Voit rakentaa tilasi näin:

```js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor', // Luonnos kontaktille contactId = 0
    1: 'Hello, Alice', // Luonnos kontaktille contactId = 1
  },
};
```

`[key]: value` [computed property](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#computed_property_names) -syntaksi saattaa auttaa `messages` olion päivittämisessä:

```js
{
  ...state.messages,
  [id]: message
}
```

</Hint>

<Sandpack>

```js App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

Sinun täytyy päivittää reduktori tallentamaan ja päivittämään erilliset luonnosviestit jokaista vastaanottajaa kohtaan:

```js
// Kun kenttää muokataan
case 'edited_message': {
  return {
    // Pidä muu tila, kuten valinnat
    ...state,
    messages: {
      // Pidä viestit muille yhteystiedoille
      ...state.messages,
      // Mutta muuta valitun yhteystiedon viesti
      [state.selectedId]: action.message
    }
  };
}
```

Voisit myös päivittää `Messenger` komponentin lukemaan viestin valitulle yhteystiedolle:

```js
const message = state.messages[state.selectedId];
```

Tässä on kokonaisuus:

<Sandpack>

```js App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Huomaa, että sinun ei tarvinnut muuttaa yhtään tapahtumankäsittelijää tämän erilaisen toiminnan toteuttamiseksi. Ilman reduktoria sinun olisi pitänyt muuttaa jokainen tapahtumankäsittelijä, joka päivittää tilaa.

</Solution>

#### Toteuta `useReducer` alusta asti {/*implement-usereducer-from-scratch*/}

Aiemmissa esimerkeissä importtasit `useReducer` hookin Reactista. Tällä kertaa tulet toteuttamaan _`useReducer` hookin itse!_ Tässä on pohja päästäksesi alkuun. Sen ei tulisi vie enempää kuin 10 riviä koodia.

Testataksesi muutoksiasi, yritä kirjoittaa tekstiä kenttään tai valitse yhteystieto.

<Hint>

Tässä on tarkempi luonnos toteutuksesta:

```js
export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    // ???
  }

  return [state, dispatch];
}
```

Muista, että reduktorifunktio otta kaksi argumenttia: nykyisen tilan ja toimintotiedon. Se palauttaa seuraavan tilan. Mitä `dispatch`-toimintosi tulisi tehdä sen kanssa?

</Hint>

<Sandpack>

```js App.js
import { useReducer } from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js MyReact.js active
import { useState } from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  // ???

  return [state, dispatch];
}
```

```js ContactList.js hidden
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js hidden
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

Toiminnon lähettäminen kutsuu reduktoria nykyisen tilan ja toiminnon kanssa ja tallentaa tuloksen seuraavaksi tilaksi. Tältä se näyttää koodissa:

<Sandpack>

```js App.js
import { useReducer } from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js MyReact.js active
import { useState } from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

```js ContactList.js hidden
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js hidden
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Vaikka sillä ei ole väliä useimmissa tapauksissa, tarkempi toteutus näyttää tältä:

```js
function dispatch(action) {
  setState((s) => reducer(s, action));
}
```

Tämä johtuu siitä, että lähetetyt toiminnot jonotetaan seuraavaan renderöintiin, [kuten päivittäjäfunktioihin.](/learn/queueing-a-series-of-state-updates)

</Solution>

</Challenges>
