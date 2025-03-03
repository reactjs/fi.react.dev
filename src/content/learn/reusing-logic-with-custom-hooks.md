---
title: 'Logiikan uudelleenkäyttö omilla Hookeilla'
---

<Intro>

React sisältää useita sisäänrakennettuja Hookkeja kuten `useState`, `useContext`, ja `useEffect`. Joskus saatat haluta, että olisi Hookki johonkin tiettyyn tarkoitukseen: esimerkiksi, datan hakemiseen, käyttäjän verkkoyhteyden seuraamiseen, tai yhteyden muodostamiseen chat-huoneeseen. Et välttämättä löydä näitä Hookkeja Reactista, mutta voit luoda omia Hookkeja sovelluksesi tarpeisiin.

</Intro>

<YouWillLearn>

- Mitä omat Hookit ovat ja miten voit kirjoittaa niitä
- Miten voit jakaa logiikkaa komponenttien välillä
- Miten nimetä ja järjestää omat Hookit
- Milloin ja miksi omat Hookit kannattaa tehdä

</YouWillLearn>

## Omat Hookit: Logiikan jakaminen komponenttien välillä {/*custom-hooks-sharing-logic-between-components*/}

Kuvittele, että olet kehittämässä sovellusta, joka tukeutuu paljolit verkkoon (kuten useimmat sovellukset). Haluat varoittaa käyttäjää, jos heidän verkkoyhteytensä on vahingossa katkennut, kun he käyttivät sovellustasi. Miten lähestyisit tätä? Näyttää siltä, että tarvitset kaksi asiaa komponentissasi:

1. Palan tilaa, joka seuraa onko verkkoyhteys saatavilla.
2. Efektin, joka tilaa globaalin [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) ja [`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event) tapahtumat, ja päivittää tilan.

Tämä pitää komponenttisi [synkronoituna](/learn/synchronizing-with-effects) verkon tilan kanssa. Voit aloittaa tällaisella:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}
```

</Sandpack>

Kokeile yhdistää verkko päälle ja pois, ja huomaa miten `StatusBar` päivittyy toimintasi mukaan.

Kuvittele nyt, että haluat *myös* käyttää samaa logiikkaa toisessa komponentissa. Haluat toteuttaa Tallenna -painikkeen, joka menee pois käytöstä ja näyttää "Yhdistetään..." sen sijaan, että se näyttäisi "Tallenna" kun verkko on pois päältä.

Aloittaaksesi, voit kopioida ja liittää `isOnline` tilan ja Efektin `SaveButton`iin:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

</Sandpack>

Varmista, että jos käännät verkon pois päältä, painike muuttaa ulkonäköään.

Nämä kaksi komponenttia toimivat, mutta niiden logiikan kopiointi on valitettavaa. Vaikuttaa siltä, että vaikka niillä on erilainen *visuaalinen ulkonäkö*, haluat jakaa niiden logiikkaa.

### Oman Hookin tekeminen komponentista {/*extracting-your-own-custom-hook-from-a-component*/}

Kuvttele, että samalla tavalla kuin [`useState`](/reference/react/useState) ja [`useEffect`](/reference/react/useEffect), olisi olemassa sisäänrakennettu `useOnlineStatus` Hookki. Sitten molemmat näistä komponenteista voitaisiin yksinkertaistaa ja voit poistaa niiden toistetun logiikan:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

Vaikka tällaista sisäänrakennettua Hookkia ei ole, voit kirjoittaa sen itse. Määrittele funktio nimeltä `useOnlineStatus` ja siirrä kaikki toistettu koodi komponenteista siihen:

```js {2-16}
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

Funktion lopussa, palauta `isOnline`. Tämä antaa komponenttien lukea arvoa:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

Vahvista, että verkon kytkeminen päälle ja pois päältä päivittää molemmat komponentit.

Nyt komponenttisi ei sisällä niin paljon toistettua logiikkaa. **Tärkeämpää on, että niiden sisällä oleva koodi kuvailee *mitä ne haluavat tehdä* (käyttää verkon tilaa!) sen sijaan, että *miten se tehdään* (tilaamalla selaimen tapahtumia).**

Kun siirrät logiikan omiin Hookkeihin, voit piilottaa miten käsittelet jotain ulkoista järjestelmää tai selaimen API:a. Komponenttisi koodi ilmaisee aikomuksesi, ei toteutusta.

### Hookkien nimet alkavat aina `use` -etuliitteellä {/*hook-names-always-start-with-use*/}

React sovellukset rakennetaan komponenteista. Komponentit ovat rakennettu Hookeista, sisäänrakennetuista tai omista. Todennäköisesti käytät usein muiden tekemiä omia Hookkeja, mutta joskus saatat kirjoittaa oman!

Sinun täytyy noudattaa näitä nimeämiskäytäntöjä:

1. **React komponenttien nimien on alettava isolla alkukirjaimella,** kuten `StarBar` ja `SaveButton`. React komponenttien täytyy myös palauttaa jotain, mitä React osaa näyttää, kuten JSX-palasen.
2. **Hookkien nimien on alettava `use` etuliitteellä, jota seuraa iso alkukirjain,** kuten [`useState`](/reference/react/useState) (sisäänrakennettu) tai `useOnlineStatus` (oma, kuten aiemmin sivulla). Hookit voivat palauttaa mitä tahansa arvoja.

Tämä yleinen tapa takaa sen, että voit aina katsoa komponenttia ja tiedät missä kaikki sen tila, Efekti, ja muut React toiminnot saatat "piiloutua". Esimerkiksi, jos näet `getColor()` funktiokutsun komponentissasi, voit olla varma, että se ei voi sisältää React tilaa sisällä koska sen nimi ei ala `use` -etuliitteellä. Kuitenkin, funktiokutsu kuten `useOnlineStatus()` todennäköisesti sisältää kutsuja muihin Hookkeihin sen sisällä!

<Note>

Jos linterisi on [määritelty Reactille,](/learn/editor-setup#linting) se takaa tämän nimeämiskäytännön. Selaa yllä olevaan esimerkkiin ja nimeä `useOnlineStatus` uudelleen `getOnlineStatus`:ksi. Huomaa, että linteri ei enää salli sinun kutsua `useState` tai `useEffect` -funktioita sen sisällä. Vain Hookit ja komponentit voivat kutsua muita Hookkeja!

</Note>

<DeepDive>

#### Pitäisikö kaikkien renderöinnin aikana kutsuttujen funktioiden käyttää use -etuliitettä? {/*should-all-functions-called-during-rendering-start-with-the-use-prefix*/}

Funktiot, jotka eivät *kutsu* Hookkeja eivät tarvitse olla Hookkeja.

Jos funktiosi ei kutsu yhtään Hookkia, vältä `use` etuliitteen käyttöä. Sen sijaan, kirjoita se kuten tavallinen funktio *ilman* `use` etuliitettä. Esimerkiksi, alla oleva `useSorted` ei kutsu Hookkeja, joten sen sijaan kutsu sitä `getSorted` nimellä:

```js
// 🔴 Vältä: Hookki, joka ei käytä Hookkeja
function useSorted(items) {
  return items.slice().sort();
}

// ✅ Hyvä: Tavallinen funktio, joka ei käytä Hookkeja
function getSorted(items) {
  return items.slice().sort();
}
```

Tämä takaa sen, että koodisi voi kutsua tätä funktiota missä tahansa, mukaan lukien ehtolauseissa:

```js
function List({ items, shouldSort }) {
  let displayedItems = items;
  if (shouldSort) {
    // ✅ On ok kutsua getSorted() ehdollisesti, koska se ei ole Hookki
    displayedItems = getSorted(items);
  }
  // ...
}
```

Anna `use` etuliite funktiolle (ja siten tee siitä Hookki) jos se käyttää edes yhtä Hookkia sen sisällä:

```js
// ✅ Hyvä: Hookki, joka käyttää muita Hookkeja
function useAuth() {
  return useContext(Auth);
}
```

Teknisesti ottaen tätä ei pakoteta Reactissa. Periaatteessa, voit tehdä Hookin, joka ei kutsu muita Hookkeja. Tämä on usein hämmentävää ja rajoittavaa, joten on parasta välttää tätä mallia. Kuitenkin, voi olla harvinaisia tapauksia, joissa se on hyödyllistä. Esimerkiksi, ehkä funktiosi ei käytä yhtään Hookkia juuri nyt, mutta suunnittelet lisääväsi siihen Hookkien kutsuja tulevaisuudessa. Silloin on järkevää nimetä se `use` etuliitteellä:

```js {3-4}
// ✅ Hyvä: Hoookki, joka saattaa kutsua toisia Hookkeja myöhemmin
function useAuth() {
  // TODO: Korvaa tämä rivi kun autentikointi on toteutettu:
  // return useContext(Auth);
  return TEST_USER;
}
```

Silloin komponentit eivät voi kutsua sitä ehdollisesti. Tästä tulee tärkeää kun haluat lisätä Hookkien kutsuja sen sisään. Jos et suunnittele lisääväsi Hookkien kutsuja sen sisään (taikka myöhemmin), älä tee siitä Hookkia.

</DeepDive>

### Omien Hookkien avulla voit jakaa tilallista logiikkaa, et tilaa suoraan {/*custom-hooks-let-you-share-stateful-logic-not-state-itself*/}

Aiemmassa esimerkissä, kun käänsit verkon päälle ja pois päältä, molemmat komponentit päivittyivät yhdessä. Kuitenkin, on väärin ajatella, että yksi `isOnline` tilamuuttuja on jaettu niiden välillä. Katso tätä koodia:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Se toimii samalla tavalla kuin ennen toistetun logiikan poistamista:

```js {2-5,10-13}
function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}

function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}
```

Nämä ovat kaksi täysin toisistaan erillä olevia tilamuuttujia ja Effekteja! Ne sattuivat olemaan saman arvoisia samaan aikaan koska synkronoit ne samalla ulkoisella arvolla (onko verkko päällä).

Tämän paremmin havainnollistaaksesi, tarvitsemme erilaisen esimerkin. Kuvittele tämä `Form` komponentti:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('Mary');
  const [lastName, setLastName] = useState('Poppins');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <label>
        First name:
        <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name:
        <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p><b>Good morning, {firstName} {lastName}.</b></p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

Jokaisessa lomakkeen kentässä on toistettua logiikkaa:

1. On pala tilaa: (`firstName` and `lastName`).
1. On tapahtumankäsittelijöitä: (`handleFirstNameChange` and `handleLastNameChange`).
1. On pala JSX koodia, joka määrittelee `value`:n ja`onChange` attribuutin syöttökentälle.

Voit siirtää toistuvan logiikan tästä `useFormInput` omaksi Hookiksi:

<Sandpack>

```js
import { useFormInput } from './useFormInput.js';

export default function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');

  return (
    <>
      <label>
        First name:
        <input {...firstNameProps} />
      </label>
      <label>
        Last name:
        <input {...lastNameProps} />
      </label>
      <p><b>Good morning, {firstNameProps.value} {lastNameProps.value}.</b></p>
    </>
  );
}
```

```js src/useFormInput.js active
import { useState } from 'react';

export function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  const inputProps = {
    value: value,
    onChange: handleChange
  };

  return inputProps;
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

Huomaa miten se vain määrittelee *yhden* tilamuuttujan nimeltä `value`.

Kuitenkin, `Form` komponentti kutsuu `useFormInput`:a *kahdesti:*

```js
function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');
  // ...
```

Tämän takia se toimii kuten kaksi erillistä tilamuuttujaa!

**Omien Hookkien avulla voit jakaa *tilallista logiikkaa' muttet *tilaa itsessään.* Jokainen kutsu Hookkiin on täysin eristetty toisista kutsuista samaan Hookkiin.** Tämän takia kaksi yllä olevaa hiekkalaatikkoa ovat täysin samanlaisia. Jos haluat, selaa ylös ja vertaa niitä. Käyttäytyminen ennen ja jälkeen oman Hookin tekemiseen on identtinen.

Kun haluat jakaa tilaa kahden komponentin välillä, [nosta se ylös ja välitä se alaspäin](/learn/sharing-state-between-components).

## Reaktiivisten arvojen välittäminen Hookkien välillä {/*passing-reactive-values-between-hooks*/}

Koodi oman Hookkisi sisällä suoritetaan joka kerta komponentin renderöinnin yhteydessä. Tämän takia, kuten komponenttien, omien Hookkien [täytyy olla puhtaita.](/learn/keeping-components-pure) Ajattele oman Hookkisi koodia osana komponenttisi sisältöä!

Koska omat Hookit renderöidään yhdessä komponenttisi kanssa, ne saavat aina uusimmat propit ja tilan. Katso mitä tämä tarkoittaa, harkitse tätä chat-huone esimerkkiä. Muuta palvelimen URL tai chat-huone:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Todellinen toteutus yhdistäisi palvelimeen oikeasti
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Kun muutat `serverUrl` tai `roomId`, Efekti ["reagoi" muutoksiisi](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) ja synkronoituu uudelleen. Voit nähdä tämän konsoliviesteistä, että chat yhdistää uudelleen joka kerta kun muutat Efektin riippuvuuksia.

Nyt siirrä Efektin koodi omaan Hookkiisi:

```js {2-13}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

Tämän avulla `ChatRoom` komponenttisi kutsuu omaa Hookkiasi huolimatta siitä miten se toimii:

```js {4-7}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

Tämä näyttää paljon yksinkertaisemmalta! (Mutta tekee saman asian.)

Huomaa miten logiikka *silti reagoi* propsin ja tilan muutoksiin. Kokeile muokata palvelimen URL tai valittua huonetta:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Todellinen toteutus yhdistäisi palvelimeen oikeasti
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Huomaa miten, otat yhden Hookin palautusarvon:

```js {2}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

ja välität sen toisen Hookin sisään:

```js {6}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

Joka kerta kun `ChatRoom` komponenttisi renderöityy, se välittää viimeisimmän `roomId` ja `serverUrl`:n Hookillesi. Tämän takia Efektisi yhdistää chattiin joka kerta kun niiden arvot muuttuvat edellisestä renderöinnistä. (Jos olet koskaan työskennellyt ääni- tai videokäsittelyohjelmistojen kanssa, Hookkien ketjuttaminen saattaa muistuttaa sinua visuaalisten tai ääniefektien ketjuttamisesta. Se on kuin `useState` -tulosteen "syöttäminen" `useChatRoom` -syötteeseen.)

### Tapahtumankäsittelijöiden välittäminen omiin Hookkeihin {/*passing-event-handlers-to-custom-hooks*/}

<Wip>

Tämä osio kuvailee **kokeellista API:a, joka ei ole vielä julkaistu** vakaassa React versiossa.

</Wip>

Kun alat käyttämään `useChatRoom` Hookkia useammissa komponenteissa, saatat haluta antaa komponenttien muokata sen toimintaa. Esimerkiksi, tällä hetkellä, logiikka sille mitä tehdä kun viesti saapuu on kovakoodattu Hookkiin:

```js {9-11}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

Sanotaan, että haluat siirtää tämän logiikan takaisin komponenttiisi:

```js {7-9}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });
  // ...
```

Saadaksesi tämä toimimaan, muuta oma Hookkisi vastaanottamaan `onReceiveMessage` yhtenä nimetyistä vaihtoehdoista:

```js {1,10,13}
export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onReceiveMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl, onReceiveMessage]); // ✅ Kaikki muuttujat määritelty
}
```

Tämä silti toimii, mutta on yksi parannus, jonka voit tehdä kun oma Hookkisi hyväksyy tapahtumankäsittelijöitä.

`onReceiveMessage` riippuvuuden lisääminen ei ole ihanteellista, koska se aiheuttaa chattiin yhdistämisen joka kerta kun komponentti renderöityy. [Kääri tämä tapahtumankäsittelijä Efektitapahtumaan poistaaksesi sen riippuvuuksista:](/learn/removing-effect-dependencies#wrapping-an-event-handler-from-the-props)

```js {1,4,5,15,18}
import { useEffect, useEffectEvent } from 'react';
// ...

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ Kaikki riippuvuudet määritelty
}
```

Nyt chatti ei enää yhdistä uudelleen joka kerta, kun `ChatRoom` komponentti renderöidään uudelleen. Tässä on toimiva esimerkki tapahtumankäsittelijän välittämisestä omiin Hookkeihin, jota voit kokeilla:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Todellinen toteutus yhdistäisi palvelimeen oikeasti
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Huomaa miten sinun ei tarvitse enää tietää *miten* `useChatRoom` toimii käyttääksesi sitä. Voisit lisätä sen mihin tahansa muuhun komponenttiin, välittää mitä tahansa muita vaihtoehtoja, ja se toimisi samalla tavalla. Tämä on omien Hookkien voima.

## Milloin käyttää omia Hookkeja {/*when-to-use-custom-hooks*/}

Sinun ei tarvitse luoda omaa Hookkia jokaiselle toistetulle koodinpalaselle. Jotkut toistot ovat hyväksyttäviä. Esimerkiksi, oman `useFormInput` Hookin luominen yhden `useState` kutsun ympärille kuten aiemmin on todennäköisesti tarpeetonta.

Kuitenkin, joka kerta kun kirjoitat Efektiä, mieti olisiko selkeämpää kääriä se omaan Hookkiin. [Sinun ei tulisi tarvita Efektejä usein,](/learn/you-might-not-need-an-effect) joten jos olet kirjoittamassa yhtä, se tarkoittaa että sinun tulee "astua ulos Reactista" synkronoidaksesi jonkin ulkoisen järjestelmän kanssa tai tehdäksesi jotain, jolle Reactilla ei ole sisäänrakennettua API:a. Käärimällä sen omaan Hookkiin voit tarkasti kommunikoida aikeesi ja miten data virtaa sen läpi.

Esimerkiksi, harkitse `ShippingForm` komponenttia, joka näyttää kaksi pudotusvalikkoa: toinen näyttää kaupunkien listan, ja toinen näyttää valitun kaupungin alueiden listan. Voit aloittaa koodilla, joka näyttää tältä:

```js {3-16,20-35}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  // Tämä Efekti hakee kaupungit maalle
  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]);

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  // Tämä Efekti hakee alueet valitulle kaupungille
  useEffect(() => {
    if (city) {
      let ignore = false;
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [city]);

  // ...
```

Vaikka tämä koodi on toistuvaa, [on oiken pitää nämä Efektit erillään toisistaan.](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things) Ne synkronoivat kahta eri asiaa, joten sinun ei tulisi yhdistää niitä yhdeksi Efektiksi. Sen sijaan, voit yksinkertaistaa `ShippingForm` komponenttia yllä käärimällä yhteisen logiikan omaksi `useData` Hookiksi:

```js {2-18}
function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (url) {
      let ignore = false;
      fetch(url)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setData(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [url]);
  return data;
}
```

Nyt voit korvata molemmat Efektit `ShippingForm` komponentissa `useData` kutsuilla:

```js {2,4}
function ShippingForm({ country }) {
  const cities = useData(`/api/cities?country=${country}`);
  const [city, setCity] = useState(null);
  const areas = useData(city ? `/api/areas?city=${city}` : null);
  // ...
```

Omien Hookkien tekeminen tekee datavirtauksesta eksplisiittisempää. Syötät `url` arvon sisään ja saat `data`:n ulos. "Piilottamalla" Efektin `useData`:n sisään, vältät myös sen, että joku joka työskentelee `ShippingForm` komponentin kanssa lisää [turhia riippuvuuksia](/learn/removing-effect-dependencies) siihen. Ajan myötä, suurin osa sovelluksesi Efekteistä on omien Hookkien sisällä.

<DeepDive>

#### Pidä Hookkisi konkreettisissa korkean tason käyttötapauksissa {/*keep-your-custom-hooks-focused-on-concrete-high-level-use-cases*/}

Aloita valitsemalla oman Hookkisi nimi. Jos sinulla on vaikeuksia valita selkeä nimi, se saattaa tarkoittaa, että Efektisi on liian kytketty komponenttisi logiikkaan, eikä ole vielä valmis eristettäväksi.

Ihanteellisesti, oman Hookkisi nimi tulisi olla tarpeeksi selkeä, että jopa henkilö joka ei kirjoita koodia usein voisi arvata mitä oma Hookkisi tekee, mitä se ottaa vastaan, ja mitä se palauttaa:

* ✅ `useData(url)`
* ✅ `useImpressionLog(eventName, extraData)`
* ✅ `useChatRoom(options)`

Kun synkronoit ulkoisen järjestelmän kanssa, oman Hookkisi nimi saattaa olla teknisempi ja käyttää kyseisen järjestelmän jargonia. On hyvä asia, kunhan se olisi selvää henkilölle joka on tuttu kyseisen järjestelmän kanssa:

* ✅ `useMediaQuery(query)`
* ✅ `useSocket(url)`
* ✅ `useIntersectionObserver(ref, options)`

**Pidä omat Hookkisi keskittyneinä konkreettisiin korkean tason käyttötapauksiin.** Vältä luomasta ja käyttämästä omia elinkaaren Hookkeja, jotka toimivat vaihtoehtoina ja kätevinä kääreinä `useEffect` API:lle:

* 🔴 `useMount(fn)`
* 🔴 `useEffectOnce(fn)`
* 🔴 `useUpdateEffect(fn)`

Esimerkiksi, tämä `useMount` Hookki pyrkii takamaan, että jotain koodia suoritetaan vain "mountissa":

```js {4-5,14-15}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // 🔴 Vältä: käyttämästä omia elinkaaren Hookkeja
  useMount(() => {
    const connection = createConnection({ roomId, serverUrl });
    connection.connect();

    post('/analytics/event', { eventName: 'visit_chat' });
  });
  // ...
}

// 🔴 Vältä: luomasta omia elinkaaren Hookkeja
function useMount(fn) {
  useEffect(() => {
    fn();
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'fn'
}
```

**Omat "elinkaaren" Hookit kuten `useMount` eivät sovi hyvin Reactin paradigman kanssa.** Esimerkiksi, tässä koodissa on virhe (se ei "reagoi" `roomId` tai `serverUrl` muutoksiin), mutta linteri ei varoita sinua siitä, koska linteri tarkistaa vain suoria `useEffect` kutsuja. Se ei tiedä omasta Hookistasi.

Jos olet kirjoittamassa Efektiä, aloita käyttämällä React APIa suoraan:

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ Hyvä: kaksi raakaa Efektiä jaettu eri tarkoituksiin

  useEffect(() => {
    const connection = createConnection({ serverUrl, roomId });
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]);

  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_chat', roomId });
  }, [roomId]);

  // ...
}
```

Sitten, voit (mutta sinun ei tarvitse) eristää omia Hookkeja eri korkean tason käyttötapauksille:

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ Hyvä: omat Hookit nimetty tarkoitusten perusteella
  useChatRoom({ serverUrl, roomId });
  useImpressionLog('visit_chat', { roomId });
  // ...
}
```

**Hyvä Hookki tekee koodin kutsumisesta deklaratiivisempaa rajoittamalla mitä se tekee.** Esimerkiksi, `useChatRoom(options)` voi vain yhdistää chattiin, kun taas `useImpressionLog(eventName, extraData)` voi vain lähettää näyttökerran analytiikkaan. Jos oma Hookkisi API ei rajoita käyttötapauksia ja on hyvin abstrakti, pitkällä aikavälillä se todennäköisesti aiheuttaa enemmän ongelmia kuin ratkaisee.

</DeepDive>

### Omat Hookit auttavat siirtymään parempiin toimintatapoihin {/*custom-hooks-help-you-migrate-to-better-patterns*/}

Efektit ovat ["pelastusluukku"](/learn/escape-hatches): käytät niitä kun sinun täytyy "astua ulos Reactista" ja kun parempaa sisäänrakennettua ratkaisua käyttötapaukseesi ei ole. Ajan myötä, React tiimin tavoite on vähentää Efektien määrää sovelluksessasi minimiin tarjoamalla tarkempia ratkaisuja tarkempiin ongelmiin. Efektiesi kääriminen omiin Hookkeihin tekee koodin päivittämisestä helpompaa kun nämä ratkaisut tulevat saataville.

Palataan tähän esimerkkiin:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js active
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

Yllä olevassa esimerkissä, `useOnlineStatus` on toteutettu [`useState`](/reference/react/useState) ja [`useEffect`.](/reference/react/useEffect) Hookeilla. Kuitenkin, tämä ei ole paras ratkaisu. On useita reunatapauksia, joita se ei huomioi. Esimerkiksi, se olettaa komponentin mountatessa, `isOnline` olisi jo `true`, vaikka tämä voi olla väärin jos verkkoyhteys on jo katkennut. Voit käyttää selaimen [`navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine) API:a tarkistaaksesi tämän, mutta sitä ei voi käyttää suoraan palvelimella HTML:n generointiin. Lyhyesti, tätä koodia voisi parantaa.

Onneksi, React 18 sisältää dedikoidun APIn nimeltään [`useSyncExternalStore`](/reference/react/useSyncExternalStore), joka huolehtii kaikista näistä ongelmista puolestasi. Tässä on miten `useOnlineStatus` Hookkisi kirjoitetaan uudelleen hyödyntämään tätä uutta API:a:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js active
import { useSyncExternalStore } from 'react';

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine, // Miten haet arvon päätelaitteella
    () => true // Miten haet arvon palvelimella
  );
}

```

</Sandpack>

Huomaa miten **sinun ei tarvinnut muuttaa mitään komponenteissa** tehdäksesi tämän siirtymän:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Tämä on yksi syy miksi Efektien kääriminen omiin Hookkeihin on usein hyödyllistä:

1. Teet datavirtauksesta Efektiin ja Efektistä eksplisiittistä.
2. Annat komponenttien keskittyä tarkoitukseen tarkan Efektin toteutuksen sijaan.
3. Kun React lisää uusia ominaisuuksia, voit poistaa nämä Efektit muuttamatta komponenntejasi.

Samoin kuin [design -järjestelmissä,](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969) saatat kokea yleisten ilmaisujen eristämisen omista komponenteista omiin Hookkeihin hyödylliseksi. Tämä pitää komponenttiesi koodin keskittyneenä tarkoitukseen, ja antaa sinun välttää raakojen Efektien kirjoittamista hyvin usein. Monia erinomaisia omia Hookkeja ylläpitää Reactin yhteisö.

<DeepDive>

#### Tuleeko React tarjoamaan sisäänrakennetun ratkaisun tiedonhakuun? {/*will-react-provide-any-built-in-solution-for-data-fetching*/}

Työstämme yksityiskohtia, mutta odotamme että tulevaisuudessa, kirjoitat datan hakemisen näin:

```js {1,4,6}
import { use } from 'react'; // Ei vielä saatavilla!

function ShippingForm({ country }) {
  const cities = use(fetch(`/api/cities?country=${country}`));
  const [city, setCity] = useState(null);
  const areas = city ? use(fetch(`/api/areas?city=${city}`)) : null;
  // ...
```

Jos käytät omia Hookkeja kuten `useData` yllä sovelluksessasi, se vaatii vähemmän muutoksia siirtyä lopulta suositeltuun lähestymistapaan kuin jos kirjoitat raakoja Efektejä jokaiseen komponenttiin manuaalisesti. Kuitenkin, vanha lähestymistapa toimii edelleen hyvin, joten jos tunnet olosi onnelliseksi kirjoittaessasi raakoja Efektejä, voit jatkaa niiden käyttämistä.

</DeepDive>

### On useampi tapa tehdä se {/*there-is-more-than-one-way-to-do-it*/}

Sanotaan, että haluat toteuttaa häivitysanimaation *alusta saakka* käyttäen selaimen [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) APIa. Saatat aloittaa Efektillä joka asettaa animaatiosilmukan. Jokaisen animaatiokehyksen aikana, voisit muuttaa DOM solmun läpinäkyvyyttä, jonka [pidät ref:ssä](/learn/manipulating-the-dom-with-refs) kunnes se saavuttaa `1`. Koodisi saattaisi alkaa näyttää tältä:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const duration = 1000;
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // On silti enemmän kehyksiä tehtävänä
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, []);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Tehdäksesi komponentista luettavemman, saatat eristää logiikan `useFadeIn` omaksi Hookiksi:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/useFadeIn.js
import { useEffect } from 'react';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // Meillä on vielä enemmän kehyksiä tehtävänä
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, [ref, duration]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Voit pitää `useFadeIn` koodin sellaisenaan, mutta voit myös refaktoroida sitä enemmän. Esimerkiksi, voit eristää logiikan animaatiosilmukan asettamisen `useFadeIn` ulkopuolelle omaksi `useAnimationLoop` Hookiksi:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/useFadeIn.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useFadeIn(ref, duration) {
  const [isRunning, setIsRunning] = useState(true);

  useAnimationLoop(isRunning, (timePassed) => {
    const progress = Math.min(timePassed / duration, 1);
    ref.current.style.opacity = progress;
    if (progress === 1) {
      setIsRunning(false);
    }
  });
}

function useAnimationLoop(isRunning, drawFrame) {
  const onFrame = useEffectEvent(drawFrame);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const startTime = performance.now();
    let frameId = null;

    function tick(now) {
      const timePassed = now - startTime;
      onFrame(timePassed);
      frameId = requestAnimationFrame(tick);
    }

    tick();
    return () => cancelAnimationFrame(frameId);
  }, [isRunning]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

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

</Sandpack>

Kuitenkaan sinun ei ole *pakko* tehdä sitä. Kuten tavallisten funktioiden kanssa, lopulta päätät missä piirrät rajat eri osien välille koodissasi. Voit myös ottaa hyvin erilaisen lähestymistavan. Sen sijaan, että pitäisit logiikan Efektissä, voit siirtää suurimman osan imperatiivisesta logiikasta JavaScript [luokkaan:](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/useFadeIn.js active
import { useState, useEffect } from 'react';
import { FadeInAnimation } from './animation.js';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [ref, duration]);
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress === 1) {
      this.stop();
    } else {
      // We still have more frames to paint
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Efektien avulla yhdistät Reactin ulkoisiin järjestelmiin. Mitä enemmän koordinaatiota Efektien välillä tarvitaan (esimerkiksi, ketjuttaaksesi useita animaatioita), sitä enemmän on järkeä eristää logiikka Efekteistä ja Hookkeista *täysin* kuten yllä olevassa esimerkissä. Sitten, eristämäsi koodi *tulee* "ulkoiseksi järjestelmäksi". Tämä pitää Efektisi yksinkertaisina koska niiden täytyy vain lähettää viestejä järjestelmään jonka olet siirtänyt Reactin ulkopuolelle.

Esimerkki yllä olettaa, että häivityslogiikka täytyy kirjoittaa JavaScriptillä. Kuitenkin, tämä tietty häivitysanimaatio on sekä yksinkertaisempi että paljon tehokkaampi toteuttaa tavallisella [CSS animaatiolla:](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations)

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import './welcome.css';

function Welcome() {
  return (
    <h1 className="welcome">
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```css src/styles.css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

```css src/welcome.css active
.welcome {
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);

  animation: fadeIn 1000ms;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

```

</Sandpack>

Joskus et edes tarvitse Hookkia!

<Recap>

- Omien Hookkien avulla voit jakaa logiikkaa komponenttien välillä.
- Omat Hookit on nimettävä `use`-alkuisiksi ja niiden täytyy alkaa isolla kirjaimella.
- Omat Hookit jakavat vain tilallisen logiikan, ei itse tilaa.
- Voit välittää reaktiivisia arvoja Hookista toiseen ja ne pysyvät ajan tasalla.
- Kaikki Hookit suoritetaan joka kerta kun komponenttisi renderöityy.
- Hookin koodin tulisi olla puhdasta, kuten komponenttisi koodi.
- Kääri tapahtumankäsittelijät jotka Hookkisi vastaanottaa Efektitapahtumiin.
- Älä luo omia Hookkeja kuten `useMount`. Pidä niiden tarkoitus tarkkana.
- Sinä päätät miten ja missä valitset koodisi rajat.

</Recap>

<Challenges>

#### Tee `useCounter` Hookki {/*extract-a-usecounter-hook*/}

Tämä komponentti käyttää tilamuuttujaa ja Efektiä näyttääkseen numeron joka kasvaa joka sekunti. Eristä tämä logiikka omaksi Hookiksi nimeltä `useCounter`. Tavoitteesi on saada `Counter` komponentin toteutus näyttämään tältä:

```js
export default function Counter() {
  const count = useCounter();
  return <h1>Seconds passed: {count}</h1>;
}
```

<<<<<<< HEAD
Sinun täytyy kirjoittaa oma Hookkisi `useCounter.js` tiedostoon ja tuoda se `Counter.js` tiedostoon.
=======
You'll need to write your custom Hook in `useCounter.js` and import it into the `App.js` file.
>>>>>>> 6326e7b1b9fa2a7e36a555792e2f1b97cfcf2669

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <h1>Seconds passed: {count}</h1>;
}
```

<<<<<<< HEAD
```js useCounter.js
// Kirjoita oma Hookkisi tähän tiedostoon!
=======
```js src/useCounter.js
// Write your custom Hook in this file!
>>>>>>> 6326e7b1b9fa2a7e36a555792e2f1b97cfcf2669
```

</Sandpack>

<Solution>

Koodisi tulisi näyttää tältä:

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter();
  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

Huomaa miten `App.js`:n ei tarvitse importata `useState`:a taikka `useEffect`:ia enää.

</Solution>

#### Tee laskurin viiveestä muutettava {/*make-the-counter-delay-configurable*/}

Tässä esimerkissä on `delay` tilamuuttuja jota hallitaan liukusäätimellä, mutta sen arvoa ei käytetä. Välitä `delay` arvo omalle `useCounter` Hookillesi, ja muuta `useCounter` Hookkia käyttämään annettua `delay` arvoa sen sijaan että se kovakoodaisi `1000` ms.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter();
  return (
    <>
      <label>
        Tick duration: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

<Solution>

Välitä `delay` Hookillesi `useCounter(delay)` avulla. Sitten, Hookissa, käytä `delay`:ta kovakoodatun `1000` arvon sijaan. Sinun täytyy lisätä `delay` Efektisi riippuvuuksiin. Tämä varmistaa että `delay`:n muutos nollaa laskurin.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter(delay);
  return (
    <>
      <label>
        Tick duration: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

</Sandpack>

</Solution>

#### Siirrä `useInterval` Hookki `useCounter` Hookista {/*extract-useinterval-out-of-usecounter*/}

Nykyisellään, `useCounter` Hookkisi tekee kaksi asiaa. Se asettaa laskurin, ja se myös kasvattaa tilamuuttujaa joka kehyksellä. Eristä logiikka, joka asettaa laskurin omaksi Hookiksi nimeltä `useInterval`. Sen tulisi ottaa kaksi argumenttia: `onTick` callbackki, ja `delay`. Tämän muutoksen jälkeen, `useCounter` toteutuksesi tulisi näyttää tältä:

```js
export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

Kirjoita `useInterval` `useInterval.js` tiedostoon ja tuo se `useCounter.js` tiedostoon.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

<<<<<<< HEAD
```js useInterval.js
// Kirjoita oma Hookkisi tähän tiedostoon!
=======
```js src/useInterval.js
// Write your Hook here!
>>>>>>> 6326e7b1b9fa2a7e36a555792e2f1b97cfcf2669
```

</Sandpack>

<Solution>

Logiikka `useInterval`:n sisällä tulisi aloittaa ja lopettaa laskuri. Sen ei tarvitse tehdä mitään muuta.

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js active
import { useEffect } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [onTick, delay]);
}
```

</Sandpack>

Huomaa, että tässä ratkaisussa on pieni ongelma, jonka ratkaiset seuraavassa haasteessa.

</Solution>

#### Korjaa nollautuva laskuri {/*fix-a-resetting-interval*/}

Tässä esimerkissä on *kaksi* erillistä laskuria.

`App` komponentti kutsuu `useCounter` Hookkia, joka kutsuu `useInterval` Hookkia päivittääkseen laskurin joka sekunti. Mutta `App` komponentti *myös* kutsuu `useInterval` Hookkia satunnaisesti päivittääkseen sivun taustavärin kahden sekuntin välein.

Jostain syystä, callbackkia joka päivittää sivun taustavärin ei koskaan suoriteta. Lisää konsoliloki `useInterval`:iin:

```js {2,5}
  useEffect(() => {
    console.log('✅ Setting up an interval with delay ', delay)
    const id = setInterval(onTick, delay);
    return () => {
      console.log('❌ Clearing an interval with delay ', delay)
      clearInterval(id);
    };
  }, [onTick, delay]);
```

Vastaavatko lokit sitä mitä odotat tapahtuvan? Jos jotkut Efekteistäsi näyttävät synkronisoituvan tarpeettomasti, pystytkö arvaamaan mikä riippuvuus aiheuttaa sen? Olisiko jokin tapa [poistaa riippuvuus](/learn/removing-effect-dependencies) Efektistäsi?

Kun olet korjannut ongelman, sivun taustavärin tulisi päivittyä joka toinen sekunti.

<Hint>

Näyttää siltä että `useInterval` Hookkisi hyväksyy tapahtumankäsittelijän argumenttina. Voitko keksiä jonkin tavan kääriä tapahtumankäsittelijä niin että sen ei tarvitse olla Efektisi riippuvuus?

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
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => {
      clearInterval(id);
    };
  }, [onTick, delay]);
}
```

</Sandpack>

<Solution>

`useInterval` Hookkisi sisällä, kääri tick callbackki Efektitapahtumaksi, kuten teit [tämän sivun aiemmassa osassa.](/learn/reusing-logic-with-custom-hooks#passing-event-handlers-to-custom-hooks)

Tämä mahdollistaa `onTick`:in jättämisen Efektisi riippuvuuksista pois. Efekti ei synkronisoidu joka renderöinnin yhteydessä, joten sivun taustavärin muutos ei nollaudu joka sekunti ennen kuin sillä on mahdollisuus suorittua.

Tällä muutoksella, molemmat laskurit toimivat odotetusti eivätkä häiritse toisiaan:

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
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js active
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useInterval(callback, delay) {
  const onTick = useEffectEvent(callback);
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

</Sandpack>

</Solution>

#### Toteuta porrastettu liike {/*implement-a-staggering-movement*/}

Tässä eismerkissä, `usePointerPosition()` Hookki seuraa nykyistä osoittimen sijaintia. Kokeile liikuttaa hiirtäsi tai sormeasi esikatselualueen yli ja näe kuinka punainen piste seuraa liikettäsi. Sen sijainti tallennetaan `pos1` muuttujaan.

Itse asiassa, viisi (!) punaista pistettä renderöidään. Et näe niitä, koska tällä hetkellä ne kaikki näkyvät samassa paikassa. Tämä on mitä sinun täytyy korjata. Sen sijaan mitä haluat toteuttaa on "portaikko" liike: jokaisen pisteen tulisi "seurata" edellisen pisteen polkua. Esimerkiksi, jos liikutat kursoriasi nopeasti, ensimmäisen pisteen tulisi seurata sitä välittömästi, toisen pisteen tulisi seurata ensimmäistä pistettä pienellä viiveellä, kolmannen pisteen tulisi seurata toista pistettä, ja niin edelleen.

Sinun täytyy toteuttaa `useDelayedValue` Hookki. Sen nykyinen toteutus palauttaa sille annetun `value`:n. Sen sijaan, haluat palauttaa arvon `delay` millisekuntia sitten. Saatat tarvita tilaa ja Efektin tehdäksesi tämän.

Kun olet toteuttanut `useDelayedValue`:n, sinun tulisi nähdä pisteiden liikkuvan toistensa perässä.

<Hint>

Sinun täytyy tallentaa `delayedValue` tilamuutujaan omassa Hookissasi. Kun `value` muuttuu, aja Efekti. Tämä Efekti tulisi päivittää `delayedValue` `delay`:n jälkeen. Saatat löytää hyödylliseksi kutsua `setTimeout` funktiota.

Tarvitseeko tämä Efekti siivousta? Miki tai miksi ei?

</Hint>

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  // TODO: Implement this Hook
  return value;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
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

```css
body { min-height: 300px; }
```

</Sandpack>

<Solution>

Tässä on toimiva versio. Pidät `delayedValue`:n tilamuuttujana. Kun `value` päivittyy, Efektisi aikatauluttaa laskurin päivittääkseen `delayedValue`:n. Tämä on miksi `delayedValue` aina "jää jälkeen" itse `value`:sta.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
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

```css
body { min-height: 300px; }
```

</Sandpack>

Huomaa, että tämä Efekti *ei tarvitse* siivousta. Jos kutsuit `clearTimeout` siivousfunktiossa, joka kerta kun `value` muuttuu, se nollaisi jo aikataulutetun laskurin. Jotta liike pysyisi jatkuvana, haluat, että kaikki timeoutit laukeavat.

</Solution>

</Challenges>
