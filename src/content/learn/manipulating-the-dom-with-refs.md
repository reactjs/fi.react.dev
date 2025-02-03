---
title: DOM:in manipulointi Refillä
---

<Intro>

React automaattisesti päivittää [DOM:in](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction) vastaamaan renderöinnin lopputulosta, joten sitä ei usein tarvitse manipuloida. Kuitenkin joskus saatat tarvita pääsyn Reactin hallinnoimiin DOM elementteihin--esimerkiksi, kohdentaaksesi elementtiin, scrollata siihen, tai mitata sen kokoa ja sijaintia. Reactissa ei ole sisäänrakennettua tapaa tehdä näitä asioita, joten tarvitset viittauksen eli *refin* DOM noodiin.

</Intro>

<YouWillLearn>

- Miten päästä käsiksi Reactin hallinnoimaan DOM noodiin `ref` attribuutilla
- Miten `ref` attribuutti liittyy `useRef` Hookkiin
- Miten päästä käsiksi toisen komponentin DOM noodiin
- Missä tapauksissa on turvallista muokata Reactin hallinnoimaa DOM:ia

</YouWillLearn>

## Refin saaminen noodille {/*getting-a-ref-to-the-node*/}

Päästäksesi käsiksi Reactin hallinnoimaan DOM noodiin, ensiksi, tuo `useRef` Hookki:

```js
import { useRef } from 'react';
```

Sitten, käytä sitä määrittääksesi ref komponentissasi:

```js
const myRef = useRef(null);
```

Lopuksi, välitä se `ref` -attribuuttina JSX-tagille, jonka DOM-elementin haluat saada:

```js
<div ref={myRef}>
```

`useRef` Hookki palauttaa olion yhdellä `current` propertyllä. Aluksi, `myRef.current` on `null`. Kun React luo DOM noodin tästä `<div>`:stä, React asettaa viitteen tähän noodiin `myRef.current`:iin. Voit sitten päästä käsiksi tähän DOM noodiin [Tapahtumankäsittelijästäsi](/learn/responding-to-events) ja käyttää sisäänrakennettuja [selaimen rajapintoja](https://developer.mozilla.org/docs/Web/API/Element) jotka siihen on määritelty.

```js
// Voit käyttää mitä tahansa selaimen rajapintoja, esimerkiksi:
myRef.current.scrollIntoView();
```

### Esimerkki: Tekstikentän kohdentaminen {/*example-focusing-a-text-input*/}

Tässä esimerkissä, tekstikenttä kohdentuu klikkaamalla nappia:

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

Toteuttaaksesi tämän:

1. Määritä `inputRef` `useRef` Hookilla.
2. Välitä se seuraavasti `<input ref={inputRef}>`. Tämä pyytää Reactia **asettamaan tämän `<input>`:n DOM noodin `inputRef.current`:iin.**
3. `handleClick` Tapahtumankäsittelijässä, lue tekstikentän DOM noodi `inputRef.current`:sta ja kutsu sen [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) funktiota, `inputRef.current.focus()`:lla.
4. Välitä `handleClick` Tapahtumankäsittelijä `<button>`:lle `onClick` attribuutilla.

Vaikka DOM manipulaatio on yleisin käyttötapaus refseille, `useRef` Hookia voidaan myös käyttää tallentamaan Reactin ulkopuolella olevia asioita, kuten ajastimien ID:tä. Juuri kuten tila, refit pysyvät renderöintien välillä. Refit ovat tilamuuttujia, jotka eivät aiheuta uudelleenrenderöintiä, kun niitä asetetaan. Lue refien esittely: [Viittausten käyttö Refseillä.](/learn/referencing-values-with-refs)

### Esimerkki: Scrollaaminen elementtiin {/*example-scrolling-to-an-element*/}

Sinulla voi olla enemmän kuin yksi ref komponentissa. Tässä esimerkissä on karuselli kolmesta kuvasta. Jokainen nappi keskittää kuvan kutsumalla vastaavan DOM noodin [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) metodia vastaavalla DOM noodilla:

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const firstCatRef = useRef(null);
  const secondCatRef = useRef(null);
  const thirdCatRef = useRef(null);

  function handleScrollToFirstCat() {
    firstCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToSecondCat() {
    secondCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToThirdCat() {
    thirdCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={handleScrollToFirstCat}>
          Neo
        </button>
        <button onClick={handleScrollToSecondCat}>
          Millie
        </button>
        <button onClick={handleScrollToThirdCat}>
          Bella
        </button>
      </nav>
      <div>
        <ul>
          <li>
            <img
              src="https://placecats.com/neo/300/200"
              alt="Neo"
              ref={firstCatRef}
            />
          </li>
          <li>
            <img
              src="https://placecats.com/millie/200/200"
              alt="Millie"
              ref={secondCatRef}
            />
          </li>
          <li>
            <img
              src="https://placecats.com/bella/199/200"
              alt="Bella"
              ref={thirdCatRef}
            />
          </li>
        </ul>
      </div>
    </>
  );
}
```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

<DeepDive>

#### Miten hallita listaa refseistä ref-callbackin avulla {/*how-to-manage-a-list-of-refs-using-a-ref-callback*/}

Yllä olevissa esimerkeissä on määritelty valmiiksi refsejä. Joskus kuitenkin tarvitset refin jokaiseen listan kohteeseen, ja et tiedä kuinka monta niitä on. Seuraavanlainen koodi **ei toimi**:

```js
<ul>
  {items.map((item) => {
    // Ei toimi!
    const ref = useRef(null);
    return <li ref={ref} />;
  })}
</ul>
```

Tämä tapahtuu koska **Hookit on kutsuttava vain komponentin ylimmällä tasolla.** Et voi kutsua `useRef`:ia silmukassa, ehtolauseessa tai `map()` kutsussa.

Yksi mahdollinen tapa ratkaista tämä on hakea yksi ref ylemmälle elementille, ja käyttää sitten DOM manipulaatiomenetelmiä kuten [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) löytääksesi yksittäiset lapsinoodit. Tämä on kuitenkin herkkä ja voi rikkoutua, jos DOM-rakenne muuttuu.

Toinen mahdollinen ratkaisu on **välittää funktio `ref` attribuuttiin.** Tätä kutsutaan [`ref` callbackiksi.](/reference/react-dom/components/common#ref-callback) React kutsuu ref-callbackkia DOM noodilla kun on aika asettaa ref, ja `null`:lla kun se on aika tyhjentää se. Tämä mahdollistaa omien taulukoiden tai [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map):n ylläpidon, ja mahdollistaa refin hakemisen indeksin tai jonkinlaisen ID:n perusteella.

Tämä esimerkki näyttää miten voit käyttää tätä menetelmää scrollataksesi mihin tahansa kohtaan pitkässä listassa:

<Sandpack>

```js
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef(null);
  const [catList, setCatList] = useState(setupCatList);

  function scrollToCat(cat) {
    const map = getMap();
    const node = map.get(cat);
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  function getMap() {
    if (!itemsRef.current) {
      // Alusta Map ensimmäisellä kerralla.
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToCat(catList[0])}>Neo</button>
        <button onClick={() => scrollToCat(catList[5])}>Millie</button>
        <button onClick={() => scrollToCat(catList[9])}>Bella</button>
      </nav>
      <div>
        <ul>
          {catList.map((cat) => (
            <li
              key={cat}
              ref={(node) => {
                const map = getMap();
                map.set(cat, node);

                return () => {
                  map.delete(cat);
                };
              }}
            >
              <img src={cat} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push("https://loremflickr.com/320/240/cat?lock=" + i);
  }

  return catList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

Tässä esimerkissä `itemsRef` ei sisällä yhtäkään DOM noodia. Sen sijaan se sisältää [Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map):n, jossa on jokaisen kohteen ID ja DOM noodi. ([Refseissä voi olla mitä tahansa arvoja!](/learn/referencing-values-with-refs)) Jokaisen listan kohteen `ref` callback huolehtii siitä, että Map päivitetään:

```js
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
<<<<<<< HEAD
    if (node) {
      // Lisää Map:iin
      map.set(cat.id, node);
    } else {
      // Poista Map:sta
      map.delete(cat.id);
    }
=======
    // Add to the Map
    map.set(cat, node);

    return () => {
      // Remove from the Map
      map.delete(cat);
    };
>>>>>>> 6fc98fffdaad3b84e6093d1eb8def8f2cedeee16
  }}
>
```

Tämän avulla voit lukea yksittäiset DOM noodit Map:sta myöhemmin.

<Note>

When Strict Mode is enabled, ref callbacks will run twice in development.

Read more about [how this helps find bugs](/reference/react/StrictMode#fixing-bugs-found-by-re-running-ref-callbacks-in-development) in callback refs.

</Note>

</DeepDive>

## Pääsy toisen komponentin DOM-noodiin {/*pääsy-toisen-komponentin-dom-solmiin*/}

<<<<<<< HEAD
Kun asetat refin sisäänrakennettuun komponenttiin, joka tuottaa selaimen elementin kuten `<input />`:n, React asettaa refin `current` propertyn vastaamaan DOM noodia (kuten todellista `<input />`:ia selaimessa).

Kuitenkin, jos yrität asettaa refin **omalle** komponentillesi, kuten `<MyInput />`, oletuksena saat `null`:n. Näet sen tässä esimerkissä. Huomaa miten painikkeen painaminen **ei** keskitä inputia:

=======
<Pitfall>
Refs are an escape hatch. Manually manipulating _another_ component's DOM nodes can make your code fragile.
</Pitfall>

You can pass refs from parent component to child components [just like any other prop](/learn/passing-props-to-a-component).

```js {3-4,9}
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
}

function MyForm() {
  const inputRef = useRef(null);
  return <MyInput ref={inputRef} />
}
```

In the above example, a ref is created in the parent component, `MyForm`, and is passed to the child component, `MyInput`. `MyInput` then passes the ref to `<input>`. Because `<input>` is a [built-in component](/reference/react-dom/components/common) React sets the `.current` property of the ref to the `<input>` DOM element.

The `inputRef` created in `MyForm` now points to the `<input>` DOM element returned by `MyInput`. A click handler created in `MyForm` can access `inputRef` and call `focus()` to set the focus on `<input>`.
>>>>>>> 6fc98fffdaad3b84e6093d1eb8def8f2cedeee16

<Sandpack>

```js
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
}

export default function MyForm() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<<<<<<< HEAD
Helpottaaksesi ongelman havaitsemista, React tulostaa myös virheen konsoliin:

<ConsoleBlock level="error">

Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?

</ConsoleBlock>

Tämä tapahtuu, koska oletuksena React ei anna komponenttien päästä muiden komponenttien DOM noodeihin käsiksi. Ei edes omille lapsille! Tämä on tarkoituksellista. Refit ovat pelastusluukku, jota pitäisi käyttää niukasti. _Toisen_ komponentin DOM noodin käsin manipulaatio tekee koodistasi vieläkin hauraamman.

Sen sijaan, komponentit jotka _haluavat_ antaa muille pääsyn DOM noodehin, täytyy niiden **eksplisiittisesti** ottaa käyttöön tämä toiminto. Komponentti voi määrittää, että se "välittää" sen refit yhdelle lapsistaan. Tässä on tapa, jolla `MyInput` voi käyttää `forwardRef` API:a:

```js
const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});
```

Tässä miten se toimii:

1. `<MyInput ref={inputRef} />` kertoo Reactille että asettaa vastaavan DOM noodin `inputRef.current`:iin. Kuitenkin, on se `MyInput` komponentin vastuulla ottaa tämä käyttöön--oletuksena se ei tee sitä.
2. `MyInput` komponentti on määritelty käyttäen `forwardRef`:ia. **Tämä antaa sen vastaanottaa `inputRef`:in yllä olevasta `ref` argumentista, joka on määritelty `props`:n jälkeen**.
3. `MyInput` komponentti välittää saamansa `ref`:n sen sisällä olevalle `<input>` komponentille.

Nyt painikkeen painaminen keskittää inputin:

<Sandpack>

```js
import { forwardRef, useRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

Design-järjestelmissä yleinen malli on, että alhaisen tason komponentit kuten painikkeet, inputit ja muut, välittävät refit DOM noodeihinsa. Toisaalta, korkean tason komponentit kuten lomakkeet, listat tai sivun osat eivät yleensä välitä DOM noodejaan, jotta välteittäisiin tahallinen riippuvuus DOM rakenteesta.

=======
>>>>>>> 6fc98fffdaad3b84e6093d1eb8def8f2cedeee16
<DeepDive>

#### API:n osajoukon julkaisu imperatiivisella käsittelyllä {/*exposing-a-subset-of-the-api-with-an-imperative-handle*/}

<<<<<<< HEAD
Yllä olevassa esimerkissä `MyInput` julkaisee alkuperäisen DOM input elementin. Tämä mahdollistaa ylemmän tason komponentin kutsun `focus()`:iin. Kuitenkin, tämä mahdollistaa myös sen, että ylemmän tason komponentti voi tehdä jotain muuta--esimerkiksi muuttaa sen CSS tyylejä. Harvoin tapahtuvissa tapauksissa, saatat haluta rajoittaa julkistettua toiminnallisuutta. Voit tehdä sen `useImperativeHandle`:n avulla:
=======
In the above example, the ref passed to `MyInput` is passed on to the original DOM input element. This lets the parent component call `focus()` on it. However, this also lets the parent component do something else--for example, change its CSS styles. In uncommon cases, you may want to restrict the exposed functionality. You can do that with [`useImperativeHandle`](/reference/react/useImperativeHandle):
>>>>>>> 6fc98fffdaad3b84e6093d1eb8def8f2cedeee16

<Sandpack>

```js
import { useRef, useImperativeHandle } from "react";

function MyInput({ ref }) {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // Julkaise vain focus eikä mitään muuta
    focus() {
      realInputRef.current.focus();
    },
  }));
  return <input ref={realInputRef} />;
};

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>Focus the input</button>
    </>
  );
}
```

</Sandpack>

<<<<<<< HEAD
Tässä, `MyInput`:n sisällä `realInputRef` sisältää oikean input DOM noodin. Kuitenkin, `useImperativeHandle` ohjeistaa Reactia antamaan oman erityisen olion refin arvona ylemmälle komponentille. Joten `Form`:n sisällä `inputRef.current` pitää sisällään vain `focus` metodin. Tässä tapauksessa, ref "handle" ei ole DOM noodi, vaan oma olio, joka luotiin `useImperativeHandle` kutsussa.
=======
Here, `realInputRef` inside `MyInput` holds the actual input DOM node. However, [`useImperativeHandle`](/reference/react/useImperativeHandle) instructs React to provide your own special object as the value of a ref to the parent component. So `inputRef.current` inside the `Form` component will only have the `focus` method. In this case, the ref "handle" is not the DOM node, but the custom object you create inside [`useImperativeHandle`](/reference/react/useImperativeHandle) call.
>>>>>>> 6fc98fffdaad3b84e6093d1eb8def8f2cedeee16

</DeepDive>

## Kun React liittää refit {/*when-react-attaches-the-refs*/}

Reactissa jokainen päivitys on jaettu [kahteen vaiheeseen](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom):

* **Renderöinnin** aikana React kutsuu komponenttisi selvittääksesi mitä pitäisi näkyä ruudulla.
* **Kommitoinnin** aikana React ottaa muutokset käyttöön DOM:ssa.

Yleensä [ei kannata](/learn/referencing-values-with-refs#best-practices-for-refs) käyttää refseja renderöinnin aikana. Tämä koskee myös refseja, jotka sisältävät DOM noodeja. Ensimmäisellä renderöinnillä, DOM noodeja ei ole vielä luotu, joten `ref.current` on `null`. Ja päivitysten renderöinnin aikana, DOM noodeja ei ole vielä päivitetty. Joten on liian aikaista lukea niitä.

React asettaa `ref.current`:n kommitoinnin aikana. Ennen DOM:n päivittämistä, React asettaa `ref.current` arvot `null`:ksi. Päivittämisen jälkeen, React asettaa ne välittömästi vastaaviin DOM noodeihin.

<<<<<<< HEAD
**Useiten saatat käyttää refseja Tapahtumankäsittelijöiden sisällä.** Jos haluat tehdä jotain refin kanssa, mutta ei ole tiettyä tapahtumaa jota käyttää, saatat tarvita Effektiä. Seuraavilla sivuilla käymme läpi Effektin.
=======
**Usually, you will access refs from event handlers.** If you want to do something with a ref, but there is no particular event to do it in, you might need an Effect. We will discuss Effects on the next pages.
>>>>>>> 6fc98fffdaad3b84e6093d1eb8def8f2cedeee16

<DeepDive>

#### Tilapäivityksen tyhjentäminen synkronisesti flushSync:llä {/*flushing-state-updates-synchronously-with-flush-sync*/}

Harkitse seuraavaa koodia, joka lisää uuden tehtävän listaan ja selaa ruudun listan viimeiseen lapsinoodiin. Huomaa, miten jostain syystä se aina selaa tehtävään, joka oli *juuri ennen* viimeksi lisättyä:

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    setText('');
    setTodos([ ...todos, newTodo]);
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Add
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

</Sandpack>

Ongelma on näiden kahden rivin kanssa:

```js
setTodos([ ...todos, newTodo]);
listRef.current.lastChild.scrollIntoView();
```

Reactissa, [tilapäivitykset ovat jonossa.](/learn/queueing-a-series-of-state-updates) Useiten tämä on haluttu toiminto. Kuitenkin tässä tapauksessa se aiheuttaa ongelman, koska `setTodos` ei päivitä DOM:ia välittömästi. Joten aikana jolloin listaa selataan viimeiseen elementtiin, tehtävää ei ole vielä lisätty. Tästä syystä, scrollaus "jää" aina yhden elementin jälkeen.

Korjataksesi tämän ongelman, voit pakottaa Reactin päivittämään ("flush") DOM:n synkronisesti. Tämän saa aikaan tuomalla `flushSync`:n `react-dom` kirjastosta ja **ympäröimällä tilapäivityksen** `flushSync` kutsulla:

```js
flushSync(() => {
  setTodos([ ...todos, newTodo]);
});
listRef.current.lastChild.scrollIntoView();
```

Tämä ohjeistaa Reactia päivittämään DOM:n synkronisesti heti `flushSync`:n ympäröimän koodin suorituksen jälkeen. Tämän seurauksena, viimeinen tehtävä on jo DOM:ssa, kun yrität scrollata siihen:

<Sandpack>

```js
import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    flushSync(() => {
      setText('');
      setTodos([ ...todos, newTodo]);
    });
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Add
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

</Sandpack>

</DeepDive>

## Parhaat käytännöt DOM-manipulaatioon refeillä {/*best-practices-for-dom-manipulation-with-refs*/}

Refit ovat pelastusluukku. Niitä tulisi käyttää vain kun sinun täytyy "astua Reactin ulkopuolelle". Yleisiä esimerkkejä tästä ovat kohdentamisesta, scrollaamisesta tai selaimen API:sta, jota React ei tarjoa.

Jos pysyttelet ei-destruktivisissa toiminnoissa kuten kohdentamisessa ja scrollaamisessa, sinun ei tulisi törmätä ongelmiin. Kuitenkin, jos yrität **muokata** DOM:ia manuaalisesti, saatat riskeerata ristiriidan Reactin tekemien muutosten kanssa.

Ongelman kuvainnollistamiseksi, tämä esimerkki sisältää tervetuloviestin sekä kaksi painiketta. Ensimmäinen painike vaihtaa sen näkyvyyttä käyttäen [ehdollista renderöintiä](/learn/conditional-rendering) ja [tilaa](/learn/state-a-components-memory), kuten yleensä Reactissa on tapana. Toinen painike käyttää [`remove()` DOM API:a](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove) poistaakseen sen DOM:ista väkisin Reactin ulkopuolella.

Kokeile painamalla "Toggle with setState" painiketta muutaman kerran. Viestin pitäisi hävitä ja ilmestyä uudelleen. Paina sitten "Remove from the DOM". Tämä poistaa sen väkisin. Lopuksi paina "Toggle with setState":

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Counter() {
  const [show, setShow] = useState(true);
  const ref = useRef(null);

  return (
    <div>
      <button
        onClick={() => {
          setShow(!show);
        }}>
        Toggle with setState
      </button>
      <button
        onClick={() => {
          ref.current.remove();
        }}>
        Remove from the DOM
      </button>
      {show && <p ref={ref}>Hello world</p>}
    </div>
  );
}
```

```css
p,
button {
  display: block;
  margin: 10px;
}
```

</Sandpack>

Manuaalisen DOM elementin poiston jälkeen, kokeile `setState`:n käyttöä näyttääksesi sen uudelleen. Tämä johtaa kaatumiseen. Tämä johtuu siitä, että olet muuttanut DOM:ia, ja React ei tiedä miten jatkaa sen hallintaa oikein. 

**Vältä Reactin hallinnoimien DOM elementtien muuttamista.** Reactin hallinnoimien elementtien muuttaminen, lasten lisääminen tai lasten poistaminen voi johtaa epäjohdonmukaisiin näkymiin tai kaatumisiin kuten yllä.

However, this doesn't mean that you can't do it at all. It requires caution. **You can safely modify parts of the DOM that React has _no reason_ to update.** For example, if some `<div>` is always empty in the JSX, React won't have a reason to touch its children list. Therefore, it is safe to manually add or remove elements there.

Kuitenkin, tämä ei tarkoita, etteikö sitä voisi tehdä ollenkaan. Tämä vaatii varovaisuutta. **Voit turvallisesti muokata osia DOM:ista, joita React:lla ei _syytä_ päivittää.** Esimerkiksi, jos jokin `<div>` on aina tyhjä JSX:ssä, Reactilla ei ole syytä koskea sen lasten listaan. Näin siinä on turvallista manuaalisesti lisätä tai poistaa elementtejä.

<Recap>

- Refit ovat yleinen konsepti, mutta yleensä käytät niitä pitämään DOM elementtejä.
- Ohjeistat Reactia laittamaan DOM noodin `myRef.current`-propertyyn `<div ref={myRef}>`:lla.
- Useiten, käytät refejä ei-destruktivisille toiminnoille kuten kohdentamiselle, scrollaamiselle tai DOM elementtien mitoittamiselle.
- Komponentti ei julkaise sen DOM noodia oletuksena. Voit julkaista DOM noodin käyttämällä `forwardRef`:ia ja välittämällä toisen `ref`-argumentin alas tiettyyn noodiin.
- Vältä Reactin hallinnoimien DOM elementtien muuttamista.
- Mikäli muokkaat Reactin hallinnoimaa DOM noodia, muokkaa osia, joita Reactilla ei ole syytä päivittää.

</Recap>



<Challenges>

#### Toista ja pysäytä video {/*play-and-pause-the-video*/}


In this example, the button toggles a state variable to switch between a playing and a paused state. However, in order to actually play or pause the video, toggling state is not enough. You also need to call [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) and [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) on the DOM element for the `<video>`. Add a ref to it, and make the button work.

Tässä esimerkissä, painike vaihtaa tilamuuttujaa vaihtaakseen toistamisen ja pysäytetyn tilan välillä. Kuitenkin, jotta video oikeasti toistuisi tai pysähtyisi, tilan vaihtaminen ei riitä. Sinun täytyy myös kutsua `<video>` DOM elementin [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) ja [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) funktioita. Lisää ref elementille, ja tee painike toimivaksi.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video width="250">
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

Lisähaasteena, pidä "Play" painike synkronoituna videon toiston tilan kanssa, vaikka käyttäjä klikkaisi videota hiiren oikealla painikkeella ja toistaa sen käyttämällä selaimen sisäisiä media-ohjauksia. Saatat tarvita Tapahtumankäsittelijää `onPlay` ja `onPause` video-elementillä tämän toteuttaaksesi.

<Solution>

Määritä ref ja aseta se `<video>` elementtiin. Sitten kutsu `ref.current.play()` ja `ref.current.pause()` Tapahtumankäsittelijässä riippuen seuraavasta tilasta.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video
        width="250"
        ref={ref}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

Jotta voisit käsitellä selaimen sisäisiä media-ohjauksia, voit lisätä `onPlay` ja `onPause` Tapahtumankäsittelijät `<video>` elementille ja kutsua `setIsPlaying` niistä. Tällä tavalla, jos käyttäjä toistaa videon käyttämällä selaimen sisäisiä media-ohjauksia, tila muuttuu vastaavasti.

</Solution>

#### Kohdenna hakukenttä {/*focus-the-search-field*/}

Tee niin, että "Search" -painikkeen painaminen siirtää kohdistuksen hakukenttään.

<Sandpack>

```js
export default function Page() {
  return (
    <>
      <nav>
        <button>Search</button>
      </nav>
      <input
        placeholder="Looking for something?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Lsää ref hakukenttään ja kutsu DOM elementin `focus()` metodia kohdistaaksesi sen:

<Sandpack>

```js
import { useRef } from 'react';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <button onClick={() => {
          inputRef.current.focus();
        }}>
          Search
        </button>
      </nav>
      <input
        ref={inputRef}
        placeholder="Looking for something?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### Scrollaava kuvakaruselli {/*scrolling-an-image-carousel*/}

Tässä kuvakaruselissa on "Next" painike, joka vaihtaa aktiivista kuvaa. Aseta galleria scrollaamaan vaakasuunnassa aktiiviseen kuvaan painikkeen painamisen jälkeen. Saatat haluta kutsua aktiivisen kuvan DOM noodin [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) metodia:

```js
node.scrollIntoView({
  behavior: 'smooth',
  block: 'nearest',
  inline: 'center'
});
```

<Hint>

Tämän harjoituksen aikana et tarvitse refiä jokaiseen kuvaan. Riittää, että on ref aktiiviseen kuvaan tai itse listaan. Käytä `flushSync` varmistaaksesi, että DOM päivittyy *ennen* kuin scrollataan.

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function CatFriends() {
  const [index, setIndex] = useState(0);
  return (
    <>
      <nav>
        <button onClick={() => {
          if (index < catList.length - 1) {
            setIndex(index + 1);
          } else {
            setIndex(0);
          }
        }}>
          Next
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li key={cat.id}>
              <img
                className={
                  index === i ?
                    'active' :
                    ''
                }
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://loremflickr.com/250/200/cat?lock=' + i
  });
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

<Solution>

You can declare a `selectedRef`, and then pass it conditionally only to the current image:

```js
<li ref={index === i ? selectedRef : null}>
```

When `index === i`, meaning that the image is the selected one, the `<li>` will receive the `selectedRef`. React will make sure that `selectedRef.current` always points at the correct DOM node.

Note that the `flushSync` call is necessary to force React to update the DOM before the scroll. Otherwise, `selectedRef.current` would always point at the previously selected item.

<Sandpack>

```js
import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';

export default function CatFriends() {
  const selectedRef = useRef(null);
  const [index, setIndex] = useState(0);

  return (
    <>
      <nav>
        <button onClick={() => {
          flushSync(() => {
            if (index < catList.length - 1) {
              setIndex(index + 1);
            } else {
              setIndex(0);
            }
          });
          selectedRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });            
        }}>
          Next
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li
              key={cat.id}
              ref={index === i ?
                selectedRef :
                null
              }
            >
              <img
                className={
                  index === i ?
                    'active'
                    : ''
                }
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://loremflickr.com/250/200/cat?lock=' + i
  });
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

</Solution>

#### Kohdenna hakukenttä erillisillä komponenteilla {/*focus-the-search-field-with-separate-components*/}

Make it so that clicking the "Search" button puts focus into the field. Note that each component is defined in a separate file and shouldn't be moved out of it. How do you connect them together?

Tee niin, että "Search" -nappia painamalla hakukenttään kohdistetaan. Huomaa, että jokainen komponentti on määritelty erillisessä tiedostossa ja niitä ei tule siirtää pois tiedostoistaan. Miten yhdistät ne toisiinsa?

<Hint>

Sinun täytyy käyttää `forwardRef`:ia, jotta voit julkaista DOM noodin omasta komponentistasi kuten `SearchInput`:sta.

</Hint>

<Sandpack>

```js src/App.js
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  return (
    <>
      <nav>
        <SearchButton />
      </nav>
      <SearchInput />
    </>
  );
}
```

```js src/SearchButton.js
export default function SearchButton() {
  return (
    <button>
      Search
    </button>
  );
}
```

```js src/SearchInput.js
export default function SearchInput() {
  return (
    <input
      placeholder="Looking for something?"
    />
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

You'll need to add an `onClick` prop to the `SearchButton`, and make the `SearchButton` pass it down to the browser `<button>`. You'll also pass a ref down to `<SearchInput>`, which will forward it to the real `<input>` and populate it. Finally, in the click handler, you'll call `focus` on the DOM node stored inside that ref.

Sinun täytyy lisätä `onClick` propsi `SearchButton`:iin ja laittaa `SearchButton` välittämään se eteenpäin selaimen `<button>`:lle. Välitä myös ref `<SearchInput>`:iin, joka välittää sen oikealle `<input>`:lle ja täyttää sen. Lopuksi klikkauksen käsittelijässä sinun täytyy kutsua refiin tallennetun DOM noodin `focus` metodia.

<Sandpack>

```js src/App.js
import { useRef } from 'react';
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <SearchButton onClick={() => {
          inputRef.current.focus();
        }} />
      </nav>
      <SearchInput ref={inputRef} />
    </>
  );
}
```

```js src/SearchButton.js
export default function SearchButton({ onClick }) {
  return (
    <button onClick={onClick}>
      Search
    </button>
  );
}
```

```js src/SearchInput.js
import { forwardRef } from 'react';

export default forwardRef(
  function SearchInput(props, ref) {
    return (
      <input
        ref={ref}
        placeholder="Looking for something?"
      />
    );
  }
);
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

</Challenges>
