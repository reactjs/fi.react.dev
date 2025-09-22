---
title: Pelastusluukut
---

<Intro>

Jotkin komponenteistasi saattavat tarvita kontrolloida ja synkronoida Reactin ulkopuolisten järjestelmien kanssa. Esimerkiksi saatat tarvita fokuksen syöttölaatikkoon käyttäen selaimen API:a, toistaa ja pysäyttää videon toistoa Reactin ulkopuolisella videotoistimella tai yhdistää ja kuunnella viestejä etäpalvelimelta. Tässä luvussa opit pelastusluukut, jotka antavat sinun "astua ulos" Reactista ja yhdistää ulkoisiin järjestelmiin. Suurin osa sovelluksesi logiikasta ja datavirrasta ei pitäisi nojata näihin ominaisuuksiin.

</Intro>

<YouWillLearn isChapter={true}>

* [Miten "muistaa" tietoa renderöimättä](/learn/referencing-values-with-refs)
* [Miten käsitellä Reactin hallitsemia DOM elementtejä](/learn/manipulating-the-dom-with-refs)
* [Miten synkronisoida komponentteja ulkoisten järjestelmien kanssa](/learn/synchronizing-with-effects)
* [Miten poistaa turhia Efektejä komponenteista](/learn/you-might-not-need-an-effect)
* [Miten Efektin elinkaari eroaa komponentin elinkaaresta](/learn/lifecycle-of-reactive-effects)
* [Miten estää Efekin käynnistyminen tietyillä arvoilla](/learn/separating-events-from-effects)
* [Miten saat Efektin suoriutumaan harvemmin](/learn/removing-effect-dependencies)
* [Miten jakaa logiikkaa komponenttien välillä](/learn/reusing-logic-with-custom-hooks)

</YouWillLearn>

## Arvoihin viittaaminen Refillä {/*referencing-values-with-refs*/}

Kun haluat komponentin "muistavan" tietoa, mutta et halua sen tiedon [aiheuttavan uusia renderöintejä](/learn/render-and-commit), voit käyttää *refiä*:

```js
const ref = useRef(0);
```

Kuten tila, React säilyttää refit uudelleenrenderöintien välillä. Kuitenkin tilan asettaminen uudelleenrenderöi komponentin. Refin muuttaminen ei! Voit käyttää refiä sen nykyisen arvon hakemiseen `ref.current` ominaisuuden kautta.

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}
```

</Sandpack>

Ref on kuin salainen tasku komponentissasi, jota React ei seuraa. Esimerkiksi, voit käyttää refiä tallentamaan [timeout ID:tä](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#return_value), [DOM elementtejä](https://developer.mozilla.org/en-US/docs/Web/API/Element) ja muita olioita, jotka eivät vaikuta komponentin renderöintiin.

<LearnMore path="/learn/referencing-values-with-refs">

Lue **[Arvoihin viittaaminen Refillä](/learn/referencing-values-with-refs)** oppiaksesi kuinka käyttää refiä muistamaan tietoa.

</LearnMore>

## DOM:in manipulointi Refillä {/*manipulating-the-dom-with-refs*/}

React automaattisesti päivitää DOMin vastaamaan renderöinnin lopputulosta, joten komponenttisi ei tarvitse usein manipuloida sitä. Kuitenkin, joskus saatat tarvita pääsyn DOM elementteihin, joita React hallitsee—esimerkiksi, kohdentamaan solun, vierittämään siihen tai mittaamaan sen kokoa ja sijaintia. Reactissa ei ole sisäänrakennettua tapaa tehdä näitä asioita, joten tarvitset refin DOM elementtiin. Esimerkiksi, klikkaamalla nappia syöttölaatikko kohdentuu käyttäen refiä:

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

<LearnMore path="/learn/manipulating-the-dom-with-refs">

Lue **[DOM:in manipulointi Refillä](/learn/manipulating-the-dom-with-refs)** oppiaksesi miten käsitellä Reactin hallinnoimia DOM elementtejä.

</LearnMore>

## Synkronointi Efekteillä {/*synchronizing-with-effects*/}

Joidenkin komponenttien täytyy synkronoida ulkoisten järjestelmien kanssa. Esimerkiksi, saatat haluta kontrolloida Reactin ulkopuolista komponenttia Reactin tilan perusteella, luoda yhteyden palvelimeen tai lähettää analytiikkalokin kun komponentti ilmestyy näytölle. Toisin kuin tapahtumankäsittelijät, jotka antavat sinun käsitellä tiettyjä tapahtumia, *Efektit* antavat sinun suorittaa koodia renderöinnin jälkeen. Käytä niitä synkronoidaksesi komponenttisi Reactin ulkopuolisen järjestelmän kanssa.

Paina Play/Pause muutaman kerran ja katso miten videotoistin pysyy synkronoituna `isPlaying` propsin kanssa:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Monet Efektit myös "siivoavat" jälkensä. Esimerkiksi, Efekti joka luo yhteyden chat palvelimeen, pitäisi palauttaa *siivousfunktio* joka kertoo Reactille miten katkaista yhteys palvelimeen:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // Todellinen toteutus yhdistäisi palvelimeen oikeasti
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

Kehityksessä React suorittaa ja siivoaa Efektisi yhden kerran ylimääräisesti. Tämä on syy miksi näet `"✅ Connecting..."` tulostettuna kahdesti. Tämä varmistaa, ettet unohda toteuttaa siivousfunktiota.

<LearnMore path="/learn/synchronizing-with-effects">

Lue **[Synkronointi Efekteillä](/learn/synchronizing-with-effects)** oppiaksesi miten synkronoida komponentteja ulkoisten järjestelmien kanssa.

</LearnMore>

## Et ehkä tarvitse Efektiä {/*you-might-not-need-an-effect*/}

Efektit ovat pelastusluukku Reactin paradigmasta. Niiden avulla voit "astua ulos" Reactista ja synkronoida komponenttisi jonkin ulkoisen järjestelmän kanssa. Jos ulkoista järjestelmää ei ole mukana (esimerkiksi, jos haluat päivittää komponentin tilan kun jotkin propsit tai tila muuttuvat), et tarvitse Efektiä. Turhien Efektien poistaminen tekee koodistasi helpommin seurattavaa, nopeampaa suorittaa ja vähemmän virhealtista.

On kaksi yleistä tapaa missä et tarvitse Efektiä:
- **Et tarvitse Efektiä muuntaaksesi dataa renderöintiin.**
- **Et tarvitse Efektiä käsitelläksesi käyttäjän tapahtumia.**

Esimerkiksi, et tarvitse Efektiä säätääksesi jotain tilaa toisen tilan perusteella:

```js {expectedErrors: {'react-compiler': [8]}} {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Vältä: toistuva tila ja turha Efekti
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

Sen sijaan laske niin paljon kuin voit renderöinnin aikana:

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Hyvä: laskettu renderöinnin aikana
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

Kuitenkin *tarvitset* Efektin synkronoidaksesi ulkoisten järjestelmien kanssa.

<LearnMore path="/learn/you-might-not-need-an-effect">

Lue **[Et ehkä tarvitse Efektiä](/learn/you-might-not-need-an-effect)** oppiaksesi miten poistaa turhat Efektit.

</LearnMore>

## Reaktiivisten Efektien elinkaari {/*lifecycle-of-reactive-effects*/}

Efekteilla on eri elinkaari komponenteista. Komponentit voivat mountata, päivittyä, tai un-mountata. Efekti voi tehdä vain kaksi asiaa: aloittaa synkronoimaan jotain, ja myöhemmin lopettaa synkronointi. Tämä sykli voi tapahtua useita kertoja, jos Efekti riippuu propseista ja tilasta, jotka muuttuvat ajan myötä.

Tämä Efekti riippuu `roomId` propsin arvosta. Propsit ovat *reaktiivisia arvoja,* mikä tarkoittaa, että ne voivat muuttua renderöinnin yhteydessä. Huomaa, että Efekti *synkronoituu* (ja yhdistää palvelimeen) jos `roomId` muuttuu:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
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
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

React tarjoaa linter-säännön, joka tarkistaa, että olet määrittänyt Efektin riippuvuudet oikein. Jos unohdat määrittää `roomId` riippuvuuslistassa yllä olevassa esimerkissä, linteri löytää virheen automaattisesti.

<LearnMore path="/learn/lifecycle-of-reactive-effects">

Lue **[Reaktiivisten Efektien elinkaari](/learn/lifecycle-of-reactive-effects)** oppiaksesi miten Efektin elinkaari eroaa komponentin elinkaaresta.

</LearnMore>

## Tapahtumien erottaminen Efekteistä {/*separating-events-from-effects*/}

<Wip>

Tämä osio kuvailee **kokeellista API:a, joka ei ole vielä julkaistu** Reactin vakaassa versiossa.

</Wip>

Tapahtumankäsittelijät suoritetaan uudelleen ainoastaan kun suoritat saman vuorovaikutuksen uudelleen. Toisin kuin Tapahtumankäsittelijät, Efektit synkronoituvat jos jokin arvo jota ne luki, kuten propsi tai tilamuuttuja, on muuttunut viimeisestä renderöinnistä. Joskus haluat myös sekoituksen molemmista käyttäytymisistä: Efekti joka suoritetaan uudelleen vastauksena joihinkin arvoihin mutta ei toisiin.

Kaikki koodi Efektin sisällä on *reaktiivista.* Se suoritetaan uudelleen mikäli jokin reaktiivinen arvo jota se lukee on muuttunut renderöinnin yhteydessä. Esimerkiksi, tämä Efekti yhdistää uudelleen chattiin jos joko `roomId` tai `theme` on muuttunut:

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

Tämä ei ole ihanteellista. Haluat yhdistää uudelleen chattiin vain jos `roomId` on muuttunut. Teeman vaihtaminen ei pitäisi yhdistää uudelleen chattiin! Siirrä koodi joka lukee `theme` ulos Efektistäsi *Efektitapahtumaan*:

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

Koodi Efektitapahtuman sisällä ei ole reaktiivista, joten `theme`:n muuttaminen ei enää saa Efektiäsi yhdistämään uudelleen.

<LearnMore path="/learn/separating-events-from-effects">

Lue **[Tapahtumien erottaminen Efekteistä](/learn/separating-events-from-effects)** oppiaksesi miten estää Efektin käynnistys tiettyjen arvojen muuttuessa.

</LearnMore>

## Efektin riippuvuuksien poistaminen {/*removing-effect-dependencies*/}

Kun kirjoitat Efektia, linter tarkistaa, että olet sisällyttänyt jokaisen reaktiivisen arvon (kuten propsit ja tilan) Efektisi riippuvuuslistalle. Tämä varmistaa, että Efektisi pysyy synkronoituna komponenttisi viimeisimpien propsien ja tilan kanssa. Tarpeettomat riippuvuudet voivat aiheuttaa Efektisi suorittamisen liian usein tai jopa luoda äärettömän silmukan. Tapa jolla poistat ne riippuvat tilanteesta.

Esimerkiksi, tämä Efekti riippuu `options` oliosta, joka luodaan uusiksi joka kerta kun muokkaat syöttölaatikkoa:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
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
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Et halua chatin yhdistävän uudelleen joka kerta kun aloitat viestin kirjoittamisen siihen. Korjataksesi tämän ongelman, siirrä `options` olion luonti Efektin sisälle jotta Efekti riippuu vain `roomId` merkkijonosta:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
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
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Huomaa, että et aloittanut muokkaamalla riippuvuuslistaa poistaaksesi `options` riippuvuuden. Se olisi väärin. Sen sijaan, muutit ympäröivää koodia niin, että riippuvuudesta tuli *tarpeeton.* Ajattele riippuvuuslistaa listana kaikista reaktiivisista arvoista, joita Efektisi koodi käyttää. Et valitse tarkoituksella mitä lisätä sille listalle. Lista *kuvastaa* koodiasi. Muuttaaksesi riippuvuuslistaa, muuta koodia.

<LearnMore path="/learn/removing-effect-dependencies">

Lue **[Efektin riippuvuuksien poistaminen](/learn/removing-effect-dependencies)** oppiaksesi miten saat Efektisi suoriutumaan harvemmin.

</LearnMore>

## Logiikan uudelleenkäyttö omilla Hookeilla {/*reusing-logic-with-custom-hooks*/}

React sisältää useita sisäänrakennettuja Hookkeja kuten `useState`, `useContext`, ja `useEffect`. Joskus saatat haluta, että olisi Hookki johonkin tiettyyn tarkoitukseen: esimerkiksi, datan hakemiseen, käyttäjän verkkoyhteyden seuraamiseen, tai yhteyden muodostamiseen chat-huoneeseen. Tehdäksesi tämän voit luoda omia Hookkeja sovelluksesi tarpeisiin.

Tässä esimerkissä, `usePointerPosition` Hookki seuraa kursorin sijaintia, kun taas `useDelayedValue` Hookki palauttaa arvon joka on "jäljessä" arvosta jonka annoit sille tietyn määrän millisekunteja. Liikuta kursoria esikatselualueen yli nähdäksesi liikkuvan jäljen pisteistä jotka seuraavat kursoria:

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';
import { useDelayedValue } from './useDelayedValue.js';

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos4, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js src/usePointerPosition.js
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

```js src/useDelayedValue.js
import { useState, useEffect } from 'react';

export function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

Voit luoda omia Hookkeja, yhdistää niitä yhteen, välittää dataa niiden välillä, ja uudelleenkäyttää niitä komponenttien välillä. Sovelluksesi kasvaessa, kirjoitat vähemmän Efektejä käsin koska voit uudelleenkäyttää omia Hookkejasi joita olet jo kirjoittanut. On myös monia erinomaisia Reactin yhteisön ylläpitämiä Hookkeja .

<LearnMore path="/learn/reusing-logic-with-custom-hooks">

Lue **[Logiikan uudelleenkäyttö omilla Hookeilla](/learn/reusing-logic-with-custom-hooks)** oppiaksesi miten jakaa logiikkaa komponenttien välillä.

</LearnMore>

## Mitä seuraavaksi? {/*whats-next*/}

Hyppää [Arvoihin viittaaminen Refillä](/learn/referencing-values-with-refs) sivulle aloittaaksesi lukemaan tämän luvun sivuja sivu sivulta!
