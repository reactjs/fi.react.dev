---
title: 'Tapahtumien erottaminen Efekteistä'
---

<Intro>

Tapahtumankäsittelijät suoritetaan uudelleen ainoastaan kun suoritat saman vuorovaikutuksen uudelleen. Toisin kuin Tapahtumankäsittelijät, Efektit synkronoituvat jos jokin arvo jota ne luki, kuten propsi tai tilamuuttuja, on muuttunut viimeisestä renderöinnistä. Joskus haluat myös sekoituksen molemmista käyttäytymisistä: Efekti joka suoritetaan uudelleen vastauksena joihinkin arvoihin mutta ei toisiin. Tällä sivulla opit miten se tehdään.

</Intro>

<YouWillLearn>

- Miten valita Tapahtumankäsittelijän ja Efektin välillä
- Miksi Efektit ovat reaktiivisia ja Tapahtumankäsittelijät eivät
- Mitä tehdä kun haluat osan Efektin koodista ei reaktiivisen
- Mitä Efekektitapahtumat ovat ja miten erottaa ne Efekteistä
- Miten lukea viimeisin propsin ja tilan arvo Efekteistä käyttäen Efektitapahtumia

</YouWillLearn>

## Valinta tapahtumankäsittelijöiden ja Efektien välillä {/*choosing-between-event-handlers-and-effects*/}

Ensiksi kertaus tapahtumankäsittelijöiden ja Efektien välillä.

Kuvittele, että olet toteuttamassa chat-huoneen komponenttia. Vaatimuksesi näyttävät tältä:

1. Komponenttisi tulisi automaattisesti yhdistää valittuun chat-huoneeseen.
2. Kun painat "Lähetä" painiketta, sen tulisi lähettää viesti chattiin.

Sanotaan, että olet jo toteuttanut koodin niille, mutta et ole varma minne laittaa sen. Pitäisikö sinun käyttää tapahtumankäsittelijöitä vai Efektejä? Joka kerta kun sinun täytyy vastata tähän kysymykseen, harkitse [*miksi* koodi täytyy suorittaa.](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events)

### Tapahtumankäsittelijät suoritetaan vastauksena tiettyihin vuorovaikutuksiin {/*event-handlers-run-in-response-to-specific-interactions*/}

Käyttäjän näkökulmasta, viestin lähettäminen tapahtuu *koska* tietty "Lähetä" painike painettiin. Käyttäjä suuttuu jos lähetät heidän viestinsä mihin tahansa muuhun aikaan tai mistä tahansa muusta syystä. Tämän takia viestin lähettäminen tulisi olla tapahtumankäsittelijä. Tapahtumankäsittelijät antavat sinun käsitellä tiettyjä vuorovaikutuksia:

```js {4-6}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');
  // ...
  function handleSendClick() {
    sendMessage(message);
  }
  // ...
  return (
    <>
      <input value={message} onChange={e => setMessage(e.target.value)} />
<<<<<<< HEAD
      <button onClick={handleSendClick}>Lähetä</button>;
=======
      <button onClick={handleSendClick}>Send</button>
>>>>>>> d34c6a2c6fa49fc6f64b07aa4fa979d86d41c4e8
    </>
  );
}
```

Tapahtumankäsittelijällä voit olla varma, että `sendMessage(message)` suoritetaan *vain* jos käyttäjä painaa painiketta.

### Efektit suoritetaan kun synkronointi on tarpeen {/*effects-run-whenever-synchronization-is-needed*/}

Muista, että sinun täytyy myös pitää komponentti yhdistettynä chat-huoneeseen. Mihin se koodi laitetaan?

Mikään tietty vuorovaikutus ei ole *syy* miksi tämä koodi suoritetaan. Sillä ei ole väliä miten tai miksi käyttäjä siirtyi chat-huone -sivulle. Nyt kun ne katsovat sitä ja voivat olla vuorovaikutuksessa sen kanssa, komponentin täytyy pysyä yhteydessä valittuun chat-palvelimeen. Vaikka chat-huone komponenetti olisi sovelluksen aloitusruutu, ja käyttäjä ei ole suorittanut mitään vuorovaikutuksia, sinun täytyy *silti* yhdistää. Tämän takia se on Efekti:

```js {3-9}
function ChatRoom({ roomId }) {
  // ...
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

Tällä koodilla, voit olla varma että on aina aktiivinen yhteys valittuun chat-palvelimeen, *riippumatta* käyttäjän suorittamista vuorovaikutuksista. Olipa käyttäjä vain avannut sovelluksesi, valinnut eri huoneen, tai navigoinut toiselle sivulle ja takaisin, Efektisi varmistaa että komponentti *pysyy synkronoituna* valittuun huoneeseen, ja [yhdistää uudelleen aina kun se on tarpeen.](/learn/lifecycle-of-reactive-effects#why-synchronization-may-need-to-happen-more-than-once)

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  function handleSendClick() {
    sendMessage(message);
  }

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Lähetä</button>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
export function sendMessage(message) {
  console.log('🔵 You sent: ' + message);
}

export function createConnection(serverUrl, roomId) {
  // Todellinen toteutus yhdistäisi palvelimeen oikeasti
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input, select { margin-right: 20px; }
```

</Sandpack>

## Reaktiiviset arvot ja reaktiivinen logiikka {/*reactive-values-and-reactive-logic*/}

Intuitiivisesti, voisit sanoa, että tapahtumankäsittelijät ovat aina käynnistetty "manuaalisesti", esimerkiksi painamalla nappia. Efektit, ovat toisaalta "automaattisia": ne suoritetaan ja suoritetaan uudelleen niin usein kuin on tarpeen pysyäkseen synkronoituna.

On tarkempi tapa ajatella tätä.

Propsit, tila, ja komponentissa määritellyt muuttujat ovat <CodeStep step={2}>reaktiivisia arvoja</CodeStep>. Tässä esimerkissä, `serverUrl` ei ole reaktiivinen arvo, mutta `roomId` ja `message` ovat. Ne osallistuvat renderöinnin datavirtaan:

```js [[2, 3, "roomId"], [2, 4, "message"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // ...
}
```

Tämän kaltaiset reaktiiviset arvot voivat muuttua renderöinnin yhteydessä. Esimerkiksi, käyttäjä saattaa muokata `message` tilaa tai valita eri `roomId`:n pudotusvalikosta. Tapahtumankäsittelijät ja Efektit reagoivat muutoksiin eri tavalla:

- **Tapahtumankäsittelijöissä oleva logiikka *ei ole reaktiivista.*** Sitä ei suoriteta ellei käyttäjä suorita samaa vuorovaikutusta (esim. klikkausta) uudelleen. Tapahtumankäsittelijät voivat lukea reaktiivisia arvoja ilman että ne "reagoivat" niiden muutoksiin.
- **Efekteissa oleva logiikka *on reaktiivsta.*** Jos Efektisi lukee reaktiivista arvoa, [sinun täytyy määritellä se riippuvuudeksi.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Sitte, jos uudelleenrenderöinti aiheuttaa arvon muuttumisen, React suorittaa Efektisi logiikan uudelleen uudella arvolla.

Käydään edellinen esimerkki läpi uudelleen eron havainnollistamiseksi.

### Logiikka tapahtumankäsittelijöissä ei ole reaktiivista {/*logic-inside-event-handlers-is-not-reactive*/}

Katso tätä koodiriviä. Pitäisikö tämän logiikan olla reaktiivista vai ei?

```js [[2, 2, "message"]]
    // ...
    sendMessage(message);
    // ...
```

Käyttäjän näkökulmasta, **muutos `message`:en _ei_ tarkoita, että he haluavat lähettää viestin.** Se tarkoittaa vain, että käyttäjä kirjoittaa. Toisin sanoen, logiikka joka lähettää viestin ei tulisi olla reaktiivista. Sitä ei pitäisi suorittaa uudelleen vain koska <CodeStep step={2}>reaktiivinen arvo</CodeStep> on muuttunut. Tämän takia se kuuluu tapahtumankäsittelijään:

```js {2}
  function handleSendClick() {
    sendMessage(message);
  }
```

Tapahtumankäsittelijät eivät ole reaktiivisia, joten `sendMessage(message)` suoritetaan ainoastaan kun käyttäjä painaa Lähetä painiketta.

### Logiikka Efekteissa on reaktiivista {/*logic-inside-effects-is-reactive*/}

Nyt palataan näihin riveihin:

```js [[2, 2, "roomId"]]
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    // ...
```

Käyttäjän näkökulmasta, **muutos `roomId` tilaan *tarkoittaa* että he haluavat yhdistää eri huoneeseen.** Toisin sanoen, logiikka huoneen yhdistämiseen tulisi olla reaktiivista. *Haluat*, että nämä koodirivit "pysyvät mukana" <CodeStep step={2}>reaktiivisessa arvossa</CodeStep>, ja suoritetaan uudelleen jos arvo on eri. Tämän takia se kuuluu Efektiin:

```js {2-3}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId]);
```

Efektit ovat reaktiivisia, joten `createConnection(serverUrl, roomId)` ja `connection.connect()` suoritetaan jokaiselle eri `roomId` arvolle. Efektisi pitää chat-yhteyden synkronoituna valittuun huoneeseen.

## Ei-reaktiivisen logiikan irroittaminen Efekteista {/*extracting-non-reactive-logic-out-of-effects*/}

Asioista tulee hankalampia kun haluat sekoittaa reaktiivista logiikkaa ei-reaktiiviseen logiikkaan.

Esimerkiksi, kuvittele, että haluat näyttää ilmoituksen kun käyttäjä yhdistää chattiin. Luet nykyisen teeman (tumma tai vaalea) propsista jotta voit näyttää ilmoituksen oikeassa värissä:

```js {1,4-6}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    // ...
```

Kuitenkin, `theme` on reaktiivinen arvo (se voi muuttua renderöinnin yhteydessä), ja [kaikki Efektin lukemat reaktiiviset arvot täytyy lisätä sen riippuvuuksiin.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Nyt sinun täytyy lisätä `theme` Efektisi riippuvuuksiin:

```js {5,11}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId, theme]); // ✅ Kaikki riippuvuudet määritelty
  // ...
```

Kokeile tätä esimerkkiä ja katso jos huomaat ongelman tämän käyttökokemuksen kanssa:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Todellinen toteutus yhdistäisi palvelimeen
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

Kun `roomId` muuttuu, chat yhdistää uudelleen kuten odotit. Mutta koska `theme` on myös riippuvuus, chat yhdistää *myös* joka kerta kun vaihdat tumman ja vaalean teeman välillä. Ei hyvä!

Toisin sanoen, *et* halua tämän rivin olevan reaktiivinen, vaikka se on Efektissä (joka on reaktiivinen):

```js
      // ...
      showNotification('Connected!', theme);
      // ...
```

Tarvitset tavan erottaa tämän ei-reaktiivisen logiikan reaktiivisesta Efektistä.

### Efektitapahtuman määrittäminen {/*declaring-an-effect-event*/}

<Wip>

Tämä kohta kuvailee **kokeellista API:a joka ei ole vielä julkaistu** Reactin vakaassa versiossa.

</Wip>

Käytä erityistä Hookia nimeltä [`useEffectEvent`](/reference/react/experimental_useEffectEvent) irroittaaksesi tämän ei-reaktiivisen logiikan Efektistä:

```js {1,4-6}
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });
  // ...
```

Tässä, `onConnected` kutsutaan *Efektitapahtumaksi*. Se on osa Efektisi logiikkaa, mutta se käyttäytyy enemmän tapahtumankäsittelijän tavoin. Logiikka sen sisällä ei ole reaktiivista, ja se "näkee" aina viimeisimmät propsin ja tilan arvot.

Nyt voit kutsua `onConnected` Efektitapahtumaa Efektisi sisältä:

```js {2-4,9,13}
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Kaikki riippuvuudet määritelty
  // ...
```

<<<<<<< HEAD
Tämä korjaa ongelman. Huomaa, että sinun täytyi *poistaa* `onConnected` Efektisi riippuvuuksien listalta. **Efektitapahtumat eivät ole reaktiivisia ja ne täytyy jättää pois riippuvuuksien listalta.**
=======
This solves the problem. Note that you had to *remove* `theme` from the list of your Effect's dependencies, because it's no longer used in the Effect. You also don't need to *add* `onConnected` to it, because **Effect Events are not reactive and must be omitted from dependencies.**
>>>>>>> d34c6a2c6fa49fc6f64b07aa4fa979d86d41c4e8

Varmista, että uusi käyttäytyminen toimii odotetusti:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Todellinen toteutus yhdistäisi palvelimeen oikeasti
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

Voit ajatella Efektitapahtumien olevat hyvin samanlaisia kuin tapahtumankäsittelijät. Pääero on, että tapahtumankäsittelijät suoritetaan vastauksena käyttäjän vuorovaikutukseen, kun taas Efektitapahtumat käynnistetään Efektistäsi. Efektitapahtumat antavat sinun "katkaista ketjun" Efektien reaktiivisuuden ja koodin välillä, jonka ei tulisi olla reaktiivista.

### Viimeisimmän propsin ja tilan lukeminen Efektitapahtumilla {/*reading-latest-props-and-state-with-effect-events*/}

<Wip>

Tämä kohta kuvailee **kokeellista API:a joka ei ole vielä julkaistu** Reactin vakaassa versiossa.

</Wip>

Efektitapahtumien avulla voit korjata monia tapauksia, joissa saattaisit kokea houkutuksen linterin hiljentämiseen.

Sanotaan esimerkiksi, että sinulla on Efekti, joka kerää sivun vierailut:

```js
function Page() {
  useEffect(() => {
    logVisit();
  }, []);
  // ...
}
```

Myöhemmin, lisäät useita reittejä sivustollesi. Nyt `Page` komponenttisi saa `url` propsin nykyisellä polulla. Haluat välittää `url`:n osana `logVisit` kutsua, mutta riippuvuus-linteri valittaa:

```js {1,3}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'url'
  // ...
}
```

Ajattele mitä haluat koodin tekevän. Nyt *haluat* sen kirjaavan lokin jokaisesta eri URL:n vierailusta, koska jokainen URL edustaa eri sivua. Toisin sanoen, tämä `logVisit` kutsu *täytyy* olla reaktiivinen `url`:n suhteen. Tämän takia, tässä tapauksessa, on järkevää seurata riippuvuus-linteriä, ja lisätä `url` riippuvuudeksi:

```js {4}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, [url]); // ✅ Kaikki riippuvuudet määritelty
  // ...
}
```

Nyt sanotaan, että haluat sisällyttää ostoskorin tuotteiden määrän jokaisen sivun vierailun yhteydessä:

```js {2-3,6}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
  }, [url]); // 🔴 React Hook useEffect has a missing dependency: 'numberOfItems'
  // ...
}
```

Käytit `numberOfItems` Efektin sisällä, joten linter pyytää lisäämään sen riippuvuudeksi. *Et* kuitenkaan halua `logVisit` kutsun olevan reaktiivinen `numberOfItems`:n suhteen. Jos käyttäjä laittaa jotain ostoskoriin, ja `numberOfItems` muuttuu, tämä *ei tarkoita* että käyttäjä vieraili sivulla uudelleen. Toisin sanoen, *sivulla vierailu* on, jollain tapaa, "tapahtuma". Se tapahtuu tiettynä hetkenä.

Jaa koodi kahteen osaan:

```js {5-7,10}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ Kaikki riippuvuudet määritelty
  // ...
}
```

Tässä, `onVisit` on Efektitapahtuma. Koodi sen sisällä ei ole reaktiivista. Tämän takia voit käyttää `numberOfItems`:a (tai mitä tahansa reaktiivista arvoa!) huoletta, että se aiheuttaisi ympäröivän koodin uudelleen suorittamisen muutoksien yhteydessä.

Toisaalta, Efekti itsessään pysyy reaktiivisena. Koodi Efektin sisällä käyttää `url` propsia, joten Efekti tullaan suoritamaan uudelleen jokaisen uudelleenrenderöinnin yhteydessä eri `url`:lla. Tämä, puolestaan, kutsuu `onVisit` Efektitapahtumaa.

Tämän seurauksena kutsut `logVisit` funktiota jokaisen `url` muutoksen yhteydessä, ja luet aina uusimman `numberOfItems`:n. Kuitenkin, jos `numberOfItems` muuttuu itsestään, tämä ei aiheuta koodin uudelleen suorittamista.

<Note>

Saatat miettiä voisitko kutsua `onVisit()` ilman argumentteja, ja lukea `url`:n sen sisällä:

```js {2,6}
  const onVisit = useEffectEvent(() => {
    logVisit(url, numberOfItems);
  });

  useEffect(() => {
    onVisit();
  }, [url]);
```

Tämä voisi toimia, mutta on parempi välittää `url` Efektitapahtumalle eksplisiittisesti. **Välittämällä `url`:n argumenttina Efektitapahtumalle, sanot että sivulla vierailu eri `url`:lla muodostaa erillisen "tapahtuman" käyttäjän näkökulmasta.** `visitedUrl` on osa "tapahtumaa" joka tapahtui:

```js {1-2,6}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]);
```

Sillä Efektitapahtumasi eksplisiittisesti "kysyy" `visitedUrl`:aa, nyt et voi vahingossa poistaa `url`:a Efektisi riippuvuuksista. Jos poistat `url` riippuvuuden (erilliset vierailut lasketaan yhdeksi), linteri varoittaa siitä. Haluat `onVisit`:n olevan reaktiivinen `url`:n suhteen, joten sen sijaan että lukisit `url`:n sisältä (jossa se ei olisi reaktiivinen), välität sen *Efektistä*.

Tästä tulee erityisen tärkeää jos Efektissä on jotain asynkronista logiikkaa:

```js {6,8}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    setTimeout(() => {
      onVisit(url);
    }, 5000); // Viivästä vierailujen kirjaamista
  }, [url]);
```

Tässä, `url` `onVisit`:n sisällä vastaa *viimeisintä* `url`:ää (joka saattaa olla jo muuttunut), mutta `visitedUrl` vastaa `url`:ää joka alunperin aiheutti tämän Efektin (ja tämän `onVisit` kutsun) suorittamisen.

</Note>

<DeepDive>

#### Onko oikein hiljentää riippuvuuslintteri? {/*is-it-okay-to-suppress-the-dependency-linter-instead*/}

Olemassa olevissa koodipohjissa, saatat törmätä linterin hiljentämiseen tällä tavalla:

```js {7-9}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
    // 🔴 Vältä linterin hiljentämistä tällä tavalla:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  // ...
}
```

Kun `useEffectEvent`:sta tulee vakaa osa Reactia, suosittelemme **älä koskaan hiljennä linteriä**.

Ensimmäinen haittapuoli linterin hiljentämisessä on, että React ei enää varoita sinua kun Efektisi tarvitsee "reagoida" uuteen reaktiiviseen riippuvuuteen, jonka olet lisännyt koodiisi. Aiemmassa esimerkissä, lisäsit `url`:n riippuvuudeksi *koska* React muistutti sinua siitä. Et enää saa tällaisia muistutuksia tulevista muutoksista Efektiin jos hiljennät linterin. Tämä johtaa bugeihin.

Tässä on esimerkki sekavasta viasta linterin hiljentäminen on aiheuttanut. Tässä esimerkissä, `handleMove` funktion on tarkoitus lukea nykyinen `canMove` tilamuuttujan arvo päättääkseen seuraako piste hiirtä. Kuitenkin, `canMove` on aina `true` `handleMove`:n sisällä.

Löydätkö miksi?

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  function handleMove(e) {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  }

  useEffect(() => {
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        The dot is allowed to move
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>


Ongelma koodissa on riippuvuuslinterin hiljentäminen. Jos poistat hiljennyksen, huomaat että tämä Efekti tarvitsee `handleMove` funktion riippuvuudeksi. Tämä on järkevää: `handleMove` on määritelty komponentin sisällä, joka tekee siitä reaktiivisen arvon. Jokaisen reaktiivisen arvon täytyy olla määritelty riippuvuudeksi, tai se voi vanhentua ajan myötä!

Alkuperäisen koodin kirjoittaja on "valehdellut" Reactille kertomalla sille, että Efekti ei riipu (`[]`) yhdestäkään reaktiivisesta arvosta. Tämän takia React ei uudelleen synkronoi Efektia sen jälkeen kun `canMove` on muuttunut (ja `handleMove`:a sen mukana). Koska React ei uudelleen synkronoinut Efektiä, `handleMove` joka on liitetty tapahtumankäsittelijäksi on `handleMove` funktio, joka on luotu ensimmäisen renderöinnin aikana. Ensimmäisen renderöinnin aikana, `canMove` oli `true`, minkä takia `handleMove` ensimmäiseltä renderöinniltä näkee aina tämän arvon.

**Jos et koskaan hiljennä linteria, et koskaan näe ongelmia vanhentuneiden arvojen kanssa.**

Käyttämällä `useEffectEvent` hookkia, ei ole tarpeen "valehdella" linterille, ja koodi toimii kuten oletat:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  const onMove = useEffectEvent(e => {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  });

  useEffect(() => {
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        The dot is allowed to move
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

Tämä ei tarkoita, että `useEffectEvent` olisi *aina* oikea ratkaisu. Sinun tulisi käyttää sitä vain koodiriveillä, joiden et halua olevan reaktiivisia. Yllä olevassa hiekkalaatikossa, et halunnut Efektin koodin olevan reaktiivista `canMove`:n suhteen. Tämän takia oli järkevää irroittaa Efektitapahtuma.

Lue [Riippuvuuksien poistaminen Efektista](/learn/removing-effect-dependencies) muita oikeita vaihtoehtoja linterin hiljentämisen sijaan.

</DeepDive>

### Efektitapahtumien rajoitteet {/*limitations-of-effect-events*/}

<Wip>

Tämä kohta kuvailee **kokeellista API:a joka ei ole vielä julkaistu** Reactin vakaassa versiossa.

</Wip>

Efektitapahtumat ovat hyvin rajattuja siinä miten voit käyttää niitä:

* **Kutsu vain Efektin sisältä.**
* **Älä koskaan välitä niitä toisiin komponentteihin tai Hookkeihin.**

Esimerkiksi, älä määrittele ja välitä Efektitapahtumaa näin:

```js {4-6,8}
function Timer() {
  const [count, setCount] = useState(0);

  const onTick = useEffectEvent(() => {
    setCount(count + 1);
  });

  useTimer(onTick, 1000); // 🔴 Vältä: Efektitapahtuman välittäminen

  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  useEffect(() => {
    const id = setInterval(() => {
      callback();
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay, callback]); // Täytyy määritellä "callback" riippuvuuksissa
}
```

Sen sijaan, määrittele Efektitapahtumat aina suoraan Efektien vieressä, jotka niitä käyttävät:

```js {10-12,16,21}
function Timer() {
  const [count, setCount] = useState(0);
  useTimer(() => {
    setCount(count + 1);
  }, 1000);
  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  const onTick = useEffectEvent(() => {
    callback();
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick(); // ✅ Hyvä: Kutsutaan vain paikallisesti Efektin sisässä
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay]); // Ei tarvetta määritellä "onTick" (Efektitapahtumaa) riippuvuudeksi
}
```

Efektitapahtumat ovat ei-reaktiivisia "palasia" Efektisi koodistasi. Niiden tulisi olla Efektin vieressä, joka niitä käyttää.

<Recap>

- Tapahtumankäsittelijät suoritetaan vastauksena tiettyihin vuorovaikutuksiin.
- Efektit suoritetaan aina kun synkronointi on tarpeen.
- Logiikka tapahtumankäsittelijän sisällä ei ole reaktiivista.
- Logiikka Efektissa on reaktiivista.
- Voit siirtää ei-reaktiivisen logiikan Efektista Efektitapahtumiin.
- Kutsu vain Efektitapahtumia Efektien sisältä.
- Älä välitä Efektitapahtumia muihin komponentteihin tai Hookkeihin.

</Recap>

<Challenges>

#### Korjaa muuttuja joka ei päivity {/*fix-a-variable-that-doesnt-update*/}

Tämä `Timer` komponentti pitää `count` tilamuuttujan, joka kasvaa joka sekunti. Arvo jolla se kasvaa on tallennettu `increment` tilamuuttujaan. Voit hallita `increment` muuttujaa plus ja miinus napeilla.

Kuitenkin, sillä ei ole väliä miten monta kertaa painat plus painiketta, laskuri kasvaa silti yhdellä joka sekunti. Mikä on vikana tässä koodissa? Miksi `increment` on aina yhtä suuri kuin `1` Efektin koodissa? Etsi virhe ja korjaa se.

<Hint>

Korjataksesi tämä koodi, riittää että seuraat sääntöjä.

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```


```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

Kuten yleensä, kun etsit bugeja Efekteista, aloita etsimällä linterin hiljennyksiä.

Jos poistat hiljennykommentin, React kertoo sinulle, että tämän Efektin koodi riippuu `increment`:sta, mutta "valehtelit" Reactille väittämällä, että tämä Efekti ei riipu mistään reaktiivisista arvoista (`[]`). Lisää `increment` riippuvuuslistalle:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

Nyt kun `increment` muuttuu, React uudelleen synkronoi Efektisi, joka käynnistää uudelleen laskurin.

</Solution>

#### Korjaa jumittuva laskuri {/*fix-a-freezing-counter*/}

Tämä `Timer` komponentti pitää `count` tilamuuttujan, joka kasvaa joka sekunti. Arvo jolla se kasvaa on tallennettu `increment` tilamuuttujaan, jota voit hallita plus ja miinus napeilla. Esimerkiksi, kokeile painaa plus nappia yhdeksän kertaa, ja huomaa että `count` kasvaa nyt joka sekunti kymmenellä, eikä yhdellä.

Käyttöliittymässä on pieni ongelma. Saatat huomata sen jos painat plus tai miinus painikkeita nopeammin kuin kerran sekuntissa, ajastin näyttää pysähtyvän. Se jatkaa vain kun on kulunut sekunti siitä kun painoit jotain painiketta. Etsi miksi tämä tapahtuu, ja korjaa ongelma niin että ajastin tikittää *joka* sekunti ilman keskeytyksiä.

<Hint>

Näyttää siltä, että Efekti joka asettaa ajastimen "reagoi" `increment` arvoon. Tarvitseeko rivi joka käyttää nykyistä `increment` arvoa kutsuakseen `setCount`:ia olla reaktiivinen?

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

Ongelma on Efektin sisällä oleva koodi, joka käyttää `increment` tilamuuttujaa. Koska se on Efektin riippuvuus, joka muutos `increment` muuttujaan aiheuttaa Efektin uudelleen synkronoinnin, joka aiheuttaa laskurin nollaamisen. Jos jatkat ajastimen nollaamista ennen kuin se ehtii laueta, se näyttää siltä kuin ajastin olisi pysähtynyt.

Korjataksesi ongelman, irroita `onTick` Efektitapahtuma Efektistä:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```


```css
button { margin: 10px; }
```

</Sandpack>

Koska `onTick` on Efektitapahtuma, koodi sen sisällä ei ole reaktiivista. Muutos `increment` muuttujaan ei aiheuta Efektien uudelleen synkronointia.

</Solution>

#### Korjaa muuttumaton viive {/*fix-a-non-adjustable-delay*/}

Tässä esimerkissä, voit mukauttaa laskurin viivettä. Se ylläpidetään `delay` tilamuuttujassa, jota päivitetään kahdella painikkeella. Kuitenkin, vaikka jos painat "plus 100 ms" painiketta kunnes `delay` on 1000 millisekuntia (eli sekuntin), huomaat, että ajastin silti kasvaa hyvin nopeasti (joka 100 ms). Tuntuu kuin muutoksesi `delay` muuttujaan jätetään huomiotta. Etsi ja korjaa bugi.

<Hint>

Koodi Efektitapahtuman sisällä ei ole reaktiivista. Onko tapauksia joissa haluaisit `setInterval` kutsun suorittuvan uudelleen?

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  const onMount = useEffectEvent(() => {
    return setInterval(() => {
      onTick();
    }, delay);
  });

  useEffect(() => {
    const id = onMount();
    return () => {
      clearInterval(id);
    }
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Increment delay:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```


```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

Ongelma yllä olevassa esimerkissä on, että se erotti Efektitapahtuman nimeltä `onMount` ottamatta huomioon mitä koodin pitäisi oikeasti tehdä. Sinun tulisi erottaa Efektitapahtumia vain tiettyyn tarkoitukseen: kun haluat tehdä osan koodistasi ei-reaktiiviseksi. Kuitenkin, `setInterval` kutsun *pitäisi* olla reaktiivinen `delay` tilamuuttujan suhteen. Jos `delay` muuttuu, haluat asettaa ajastimen alusta! Korjataksesi tämän koodin, siirrä kaikki reaktiivinen koodi takaisin Efektiin:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, delay);
    return () => {
      clearInterval(id);
    }
  }, [delay]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Increment delay:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

Yleisesti ottaen, sinun tulisi olla epäileväinen funktioista kuten `onMount`, jotka keskittyvät *ajoitukseen* *tarkoituksen* sijasta. Saattaa tuntua "kuvaavammalta" aluksi, mutta se piilottaa tarkoituksesi. Nyrkkisääntönä, Efektitapahtumien tulisi vastata jotain joka tapahtuu *käyttäjän* näkökulmasta. Esimerkiksi, `onMessage`, `onTick`, `onVisit`, tai `onConnected` ovat hyviä Efektitapahtuman nimiä. Koodi niiden sisällä ei todennäköisesti tarvitse olla reaktiivista. Toisaalta, `onMount`, `onUpdate`, `onUnmount`, tai `onAfterRender` ovat niin geneerisiä, että on helppo vahingossa laittaa koodia jonka *pitäisi* olla reaktiivista niihin. Tämän takia sinun tulisi nimetä Efektitapahtumasi sen mukaan *mitä käyttäjä ajattelee tapahtuneen*, ei milloin jokin koodi sattui ajautumaan. 

</Solution>

#### Korjaa viivästynyt ilmoitus {/*fix-a-delayed-notification*/}

Kun liityty chat-huoneeseen, tämä komponentti näyttää ilmoituksen. Se ei kuitenkaan näytä ilmoitusta heti. Sen sijaan, ilmoitus on keinotekoisesti viivästetty kahdella sekuntilla, jotta käyttäjällä on mahdollisuus katsoa ympärilleen käyttöliittymässä.

Tämä melkein toimii, mutta siinä on bugi. Kokeile vaihtaa pudotusvalikosta "general" huoneeseen "travel" ja sitten "music" hyvin nopeasti. Jos teet sen tarpeeksi nopeasti, näet kaksi ilmoitusta (kuten odotettua!) mutta molemmat sanovat "Welcome to music".

Korjaa tämä siten, jotta kun vaihdat "general" arvosta "travel" arvoon ja sitten "music" arvoon erittäin nopeasti, näet kaksi ilmoitusta, ensimmäisenä "Welcome to travel" ja toisena "Welcome to music". (Lisähaasteena, olettaen että olet *jo* korjannut ilmoitukset näyttämään oikeat huoneet, muuta koodia siten, että vain jälkimmäinen ilmoitus näytetään.)

<Hint>

Efektisi tietää mihin huoneeseen se on yhdistetty. Onko mitään tietoa, jonka haluaisit välittää Efektitapahtumalle?

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Welcome to ' + roomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected();
      }, 2000);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Todellinen toteutus yhdistäisi palvelimeen oikeasti
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution>

Tapahtumankäsittelijän sisällä, `roomId` on arvoltaan *siinä ajassa kun Efektitapahtuma kutsuttiin*.

Efektitapahtumasi on kutsuttu kahden sekuntin viiveellä. Jos nopeasti vaihdat travel huoneesta music huoneeseen, siihen mennessä kun travel huoneen ilmoitus näytetään, `roomId` on jo `"music"`. Tämän takia molemmat ilmoitukset sanovat "Welcome to music".

Korjataksesi ongelma, sen sijaan että lukisit *uusimman* `roomId` arvon Efektitapahtuman sisällä, tee siitä Efektitapahtuman argumentti, kuten `connectedRoomId` alla. Sitten välitä `roomId` Efektista kutsuen `onConnected(roomId)`:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Welcome to ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Todellinen toteutus yhdistäisi palvelimeen oikeasti
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

Efekti jolla oli `roomId` arvona `"travel"` (joten se yhdisti `"travel"` huoneeseen) näyttää ilmoituksen `"travel"` huoneelle. Efekti jolla oli `roomId` arvona `"music"` (joten se yhdisti `"music"` huoneeseen) näyttää ilmoituksen `"music"` huoneelle. Toisin sanoen, `connectedRoomId` tulee Efektistäsi (joka on reaktiivinen), kun taas `theme` käyttää aina uusinta arvoa.

Ratkaistaksesi lisähaasteen, tallenna ilmoituksen viiveen ID ja siivoa se Efektin siivousfunktiossa:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Welcome to ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    let notificationTimeoutId;
    connection.on('connected', () => {
      notificationTimeoutId = setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => {
      connection.disconnect();
      if (notificationTimeoutId !== undefined) {
        clearTimeout(notificationTimeoutId);
      }
    };
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Oikea toteutus yhdistäisi palvelimeen oikeasti
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

Tämä takaa sen, että jo aikataulutetut (mutta ei vielä näytetyt) ilmoitukset peruutetaan, kun vaihdat huoneita.

</Solution>

</Challenges>
