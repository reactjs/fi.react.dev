---
title: 'Efektin riippuvuuksien poistaminen'
---

<Intro>

Kun kirjoitat Efektia, linter tarkistaa, että olet sisällyttänyt jokaisen reaktiivisen arvon (kuten propsit ja tilan) Efektisi riippuvuuslistalle. Tämä varmistaa, että Efektisi pysyy synkronoituna komponenttisi viimeisimpien propsien ja tilan kanssa. Tarpeettomat riippuvuudet voivat aiheuttaa Efektisi suorittamisen liian usein tai jopa luoda äärettömän silmukan. Seuraa tätä opasta tarkistaaksesi ja poistaaksesi tarpeettomat riippuvuudet Efekteistäsi.

</Intro>

<YouWillLearn>

- Miten korjata loputtomat Efekti-riippuvuus-silmukat
- Mitä tehdä kun haluat poistaa riippuvuuden
- Miten lukea arvo Efektistasi "reagoimatta" siihe
- Miten ja miksi välttää olioiden ja funktioiden riippuvuuksia
- Miksi riippuvuus-linterin hiljentäminen on vaarallista ja mitä tehdä sen sijaan

</YouWillLearn>

## Riippuvuuksien tulisi vastata koodia {/*dependencies-should-match-the-code*/}

Kun kirjoitat Efektia, sinun täytyy ensin määritellä miten [aloittaa ja lopettaa](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect) mitä ikinä haluat Efektisi tekevän:

```js {5-7}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  	// ...
}
```

Sitten, jos jätät Efektisi riippuvuudet tyhjäksi (`[]`), linter suosittelee oikeita riippuvuuksia:

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
  }, []); // <-- Fix the mistake here!
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

Täytä ne sen mukaan mitä linter kertoo:

```js {6}
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Kaikki riippuvuudet määritelty
  // ...
}
```

[Efektit "reagoivat" reaktiivisiin arvoihin.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Koska `roomId` on reaktiivinen arvo (se voi muuttua renderöinnin seurauksena), linter tarkistaa, että olet määritellyt sen riippuvuutena. Jos `roomId` vastaanottaa eri arvon, React synkronoi Efektisi uudelleen. Tämä takaa, että chat pysyy yhdistettynä valittuun huoneeseen ja "reagoi" pudotusvalikkoon:

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

### Poistaaksesi riippuvuuden, todista ettei se ole riippuvuus {/*to-remove-a-dependency-prove-that-its-not-a-dependency*/}

Huomaa, ettet voi "päättää" Efektisi riippuvuuksia. Jokainen <CodeStep step={2}>reaktiivinen arvo</CodeStep>, jota Efektisi koodi käyttää, täytyy olla määritelty riippuvuuslistalla. Riippuvuuslista määräytyy ympäröivän koodin mukaan:

```js [[2, 3, "roomId"], [2, 5, "roomId"], [2, 8, "roomId"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) { // Tämä on reaktiivinen arvo
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Tämä Efekti lukee reaktiivisen arvon
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Joten sinun täytyy määritellä tämä reaktiivinen arvo Efektisi riippuvuudeksi
  // ...
}
```

[Reaktiiviset arvot](/learn/lifecycle-of-reactive-effects#all-variables-declared-in-the-component-body-are-reactive) ovat propsit ja kaikki muuttujat ja funktiot määritelty suoraan komponentin sisällä. Koska `roomId` on reaktiivinen arvo, et voi poistaa sitä riippuvuuslistalta. Linter ei sallisi sitä:

```js {8}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'roomId'
  // ...
}
```

Ja linter on oikeassa! Koska `roomId` voi muuttua ajan myötä, tämä aiheuttaisi bugin koodiisi.

**Poistaaksesi riippuvuuden, "todista" linterille, että sen *ei tarvitse* olla riippuvuus.** Voit esimerkiksi siirtää `roomId` komponentin ulkopuolelle todistaaksesi, ettei se ole reaktiivinen eikä muutu uudelleenrenderöinneissä:

```js {2,9}
const serverUrl = 'https://localhost:1234';
const roomId = 'music'; // Ei ole reaktiivinen arvo enää

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ Kaikki riippuvuudet määritelty
  // ...
}
```

Now that `roomId` is not a reactive value (and can't change on a re-render), it doesn't need to be a dependency:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'music';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
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

Tämän takia voit nyt määritellä [tyhjän (`[]`) riippuvuuslistan.](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) Efektisi *ei todellakaan* riipu enää yhdestäkään reaktiivisesta arvosta, joten sitä *ei todellakaan* tarvitse suorittaa uudelleen kun komponentin propsit tai tila muuttuvat.

### Muuttaaksesi riippuvuuksia, muuta koodia {/*to-change-the-dependencies-change-the-code*/}

Olet saattanut huomata kaavan työskentelyssäsi:

1. Ensiksi, **muutat Efektisi koodia** tai miten reaktiiviset arvot on määritelty.
2. Sitten, seuraa linteria ja muuta riippuvuudet **vastaamaan muuttunutta koodia.**
3. Jos et ole tyytyväinen riippuvuuslistaan, voit **palata ensimmäiseen vaiheeseen** (ja muuttaa koodia uudelleen).

Viimeinen kohta on tärkeä. **Jos haluat muuttaa riippuvuuksia, muuta ensin ympäröivää koodia.** Voit ajatella riippuvuuslistaa [listana kaikista Efektisi koodissa käytetyistä reaktiivisista arvoista.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Et *valitse* mitä listaan laitat. Lista *kuvastaa* koodiasi. Muuttaaksesi riippuvuuslistaa, muuta koodia.

Tämä saattaa tuntua yhtälön ratkaisemiselta. Saatat aloittaa tavoitteesta (esimerkiksi poistaa riippuvuus), ja sinun täytyy "löytää" koodi, joka vastaa tavoitetta. Kaikki eivät pidä yhtälöiden ratkaisemisesta, ja samaa voisi sanoa Efektien kirjoittamisesta! Onneksi alla on lista yleisistä resepteistä, joita voit kokeilla.

<Pitfall>

Jos sinulla on olemassa oleva koodipohja, sinulla saattaa olla joitain Efektejä, jotka hiljentävät linterin näin:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Vältä linterin hiljentämistä tällä tavalla:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**Kun riippuvuudet eivät vastaa koodia, on erittäin suuri riski, että aiheutat bugeja.** Hiljentämällä linterin, "valehtelet" Reactille Efektisi riippuvuuksista.

Sen sijaan, käytä alla olevia tekniikoita.

</Pitfall>

<DeepDive>

#### Miksi linterin hiljentäminen on niin vaarallista? {/*why-is-suppressing-the-dependency-linter-so-dangerous*/}

Linterin hiljentäminen johtaa erittäin epäintuitiivisiin bugeihin, jotka ovat vaikeita löytää ja korjata. Tässä on yksi esimerkki:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  function onTick() {
	setCount(count + increment);
  }

  useEffect(() => {
    const id = setInterval(onTick, 1000);
    return () => clearInterval(id);
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

Sanotaan, että haluat suorittaa Efektin "vain mountissa". Olet lukenut, että [tyhjät (`[]`) riippuvuudet](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) tekevät sen, joten olet päättänyt hiljentää linterin ja määritellä `[]` riippuvuudeksi.

Tämän laskurin oli tarkoitus kasvaa joka sekunti kahdella painikkeella määriteltävällä määrällä. Kuitenkin, koska "valehtelit" Reactille, että tämä Efekti ei riipu mistään, React käyttää ikuisesti `onTick` funktiota ensimmäisestä renderöinnistä. [Tuon renderöinnin aikana,](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) `count` oli `0` ja `increment` oli `1`. Tämän takia `onTick` tuosta renderöinnistä kutsuu aina `setCount(0 + 1)` joka sekunti, ja näet aina `1`. Tällaisia bugeja on vaikeampi korjata kun ne ovat levinneet useisiin komponentteihin.

On aina parempi vaihtoehto kuin linterin hiljentäminen! Korjataksesi tämän koodin, lisää `onTick` riippuvuuslistalle. (Varmistaaksesi, että laskuri asetetaan vain kerran, [tee `onTick`:sta Efektitapahtuma.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events))

**Suosittelemme kohtelemaan riippuvuus-linterin virhettä käännösvirheenä. Jos et hiljennä sitä, et koskaan näe tällaisia bugeja.** Loput tästä sivusta listaavat vaihtoehtoja tähän ja muihin tapauksiin.

</DeepDive>

## Turhien riippuvuuksien poistaminen {/*removing-unnecessary-dependencies*/}

Joka kerta kun muutat Efektisi riippuvuuksia koodin mukaan, katso riippuvuuslistaa. Onko järkevää, että Efekti suoritetaan uudelleen kun jokin näistä riippuvuuksista muuttuu? Joskus vastaus on "ei":

* Saatat haluta suorittaa *eri osia* Efektistä eri olosuhteissa.
* Saatat haluta lukea *viimeisimmän arvon* jostain riippuvuudesta sen sijaan, että "reagoisit" sen muutoksiin.
* Riippuvuus voi muuttua liian usein *vahingossa* koska se on olio tai funktio.

Löytääksesi oikean ratkaisun, sinun täytyy vastata muutamaan kysymykseen Efektistäsi. Käydään ne läpi.

### Pitäisikö tämä koodi siirtää tapahtumankäsittelijään? {/*should-this-code-move-to-an-event-handler*/}

Ensimmäinen asia, jota sinun tulisi ajatella on pitäisikö tämä koodi olla Efekti ollenkaan.

Kuvittele lomake. Kun lähetät sen, asetat `submitted` tilamuuttujan arvoksi `true`. Sinun täytyy lähettää POST-pyyntö ja näyttää ilmoitus. Olet laittanut tämän logiikan Efektiin, joka "reagoi" `submitted` arvon ollessa `true`:

```js {6-8}
function Form() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      // 🔴 Vältä: Tapahtumakohtainen logiikka Efektissa
      post('/api/register');
      showNotification('Successfully registered!');
    }
  }, [submitted]);

  function handleSubmit() {
    setSubmitted(true);
  }

  // ...
}
```

Myöhemmin, haluat tyylittää ilmoituksen viestin nykyisen teeman mukaan, joten luet nykyisen teeman. Koska `theme` on määritelty komponentin sisällä, se on reaktiivinen arvo, joten lisäät sen riippuvuudeksi:

```js {3,9,11}
function Form() {
  const [submitted, setSubmitted] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (submitted) {
      // 🔴 Vältä: Tapahtumakohtainen logiikka Efektissa
      post('/api/register');
      showNotification('Successfully registered!', theme);
    }
  }, [submitted, theme]); // ✅ Kaikki riippuvuudet määritelty

  function handleSubmit() {
    setSubmitted(true);
  }

  // ...
}
```

Tekemällä tämän, olet aiheuttanut bugin. Kuvittele, että lähetät lomakkeen ensin ja sitten vaihdat teeman tummaksi. `theme` muuttuu, Efekti suoritetaan uudelleen, ja se näyttää saman ilmoituksen uudelleen!

**Ongelma on, että sen ei pitäisi olla Efekti alunperinkään.** Haluat lähettää POST-pyynnön ja näyttää ilmoituksen vastauksena *lomakkeen lähettämisen,* joka on tietty interaktio. Suorittaaksesi koodia tiettyyn interaktioon, laita se suoraan vastaavaan tapahtumankäsittelijään:

```js {6-7}
function Form() {
  const theme = useContext(ThemeContext);

  function handleSubmit() {
    // ✅ Hyvä: Tapahtumakohtainen logiikka kutsutaan Tapahtumankäsittelijästä
    post('/api/register');
    showNotification('Successfully registered!', theme);
  }

  // ...
}
```

Nyt kun koodi on Tapahtumankäsittelijässä, se ei ole reaktiivista--joten se suoritetaan vain kun käyttäjä lähettää lomakkeen. Lue [valinta tapahtumankäsittelijän ja Efektin välillä](/learn/separating-events-from-effects#reactive-values-and-reactive-logic) ja [miten poistaa turhia Efekteja.](/learn/you-might-not-need-an-effect)

### Tekeekö Efektisi useita toistaan riippumattomia asioita? {/*is-your-effect-doing-several-unrelated-things*/}

Seuraava kysymys jota sinun tulisi kysyä itseltäsi on tekeekö Efektisi useita toistaan riippumattomia asioita.

Kuvittele että luot toimituslomakkeen, jossa käyttäjän täytyy valita kaupunki ja alue. Haet `cities` listan palvelimelta valitun `country`:n mukaan näyttääksesi ne pudotusvalikossa:

```js
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);

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
  }, [country]); // ✅ Kaikki riippuvuudet määritelty

  // ...
```

Tämä on esimerkki [datan hakemisesta Efektissä.](/learn/you-might-not-need-an-effect#fetching-data) Synkronoit `cities` tilan verkon kanssa `country` propsin mukaan. Et voi tehdä tätä tapahtumankäsittelijässä koska sinun täytyy hakea heti kun `ShippingForm` näytetään ja aina kun `country` muuttuu (riippumatta siitä mikä interaktio aiheuttaa sen).

Sanotaan, että lisäät toisen pudotusvalikon kaupunkien alueille, joka hakee `areas` valitun `city`:n mukaan. Saatat aloittaa lisäämällä toisen `fetch` kutsun alueiden listalle samassa Efektissä:

```js {15-24,28}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    // 🔴 Vältä: Yksi Efekti synkronoi kahta erillistä prosessia
    if (city) {
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
    }
    return () => {
      ignore = true;
    };
  }, [country, city]); // ✅ Kaikki riippuvuudet määritelty

  // ...
```

Kuitenkin, koska Efekti käyttää nyt `city` tilamuuttujaa, olet joutunut lisäämään `city` riippuvuuslistalle. Tämä aiheutti ongelman: kun käyttäjä valitsee eri kaupungin, Efekti suoritetaan uudelleen ja kutsuu `fetchCities(country)`. Tämän takia haet tarpeettomasti kaupunkilistan monta kertaa.

**Ongelma tässä koodissa on, että synkronoit kaksi erillistä asiaa:**

1. Haluat synkronoida `cities` tilan verkon kanssa `country` propsin mukaan.
1. Haluat synkronoida `areas` tilan verkon kanssa `city` tilan mukaan.

Jaa logiikka kahteen Efektiin, joista kumpikin reagoi siihen propiin, jonka kanssa se tarvitsee synkronoida:

```js {19-33}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
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
  }, [country]); // ✅ Kaikki riippuvuudet määritelty

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
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
  }, [city]); // ✅ Kaikki riippuvuudet määritelty

  // ...
```

Nyt ensimmäinen Efekti suoritetaan vain jos `country` muuttuu, kun taas toinen Efekti suoritetaan kun `city` muuttuu. Olet erottanut ne tarkoituksen mukaan: kaksi erillistä asiaa synkronoidaan kahdella erillisellä Efektillä. Kahdella erillisellä Efektillä on kaksi erillistä riippuvuuslistaa, joten ne eivät käynnistä toisiaan vahingossa.

Lopullinen koodi on pidempi kuin alkuperäinen, mutta näiden Efektien jakaminen on silti oikein. [Kunkin Efektin tulisi edustaa erillistä synkronointiprosessia.](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) Tässä esimerkissä, yhden Efektin poistaminen ei riko toisen Efektin logiikkaa. Tämä tarkoittaa, että ne *synkronoivat eri asioita,* ja on hyvä jakaa ne osiin. Jos olet huolissasi toistosta, voit parantaa tätä koodia [poistamalla toistuvan logiikan omaksi Hookiksi.](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)

### Luetko jotain tilaa laskeaksesi seuraavan tilan? {/*are-you-reading-some-state-to-calculate-the-next-state*/}

Tämä Efekit päivittää `messages` tilamuuttujan uudella taulukolla joka kerta kun uusi viesti saapuu:

```js {2,6-8}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    // ...
```

Se käyttää `messages` muuttujaa [luodakseen uuden taulukon](/learn/updating-arrays-in-state) joka alkaa kaikilla olemassaolevilla viesteillä ja lisää uuden viestin loppuun. Koska `messages` on reaktiivinen arvo, jota Efekti lukee, sen täytyy olla riippuvuus:

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId, messages]); // ✅ Kaikki muuttujat määritelty
  // ...
```

Ja `messages` muuttujan lisääminen riippuvuudeksi aiheuttaa ongelman.

Joka kerta kun vastaanotat viestin, `setMessages()` aiheuttaa komponentin uudelleen renderöinnin uudella `messages` taulukolla, joka sisältää vastaanotetun viestin. Kuitenkin, koska tämä Efekti riippuu nyt `messages` muuttujasta, tämä *synkronoi myös* Efektin uudelleen. Joten jokainen uusi viesti aiheuttaa chatin uudelleenyhdistämisen. Käyttäjä ei pitäisi siitä!

Korjataksesi ongelman, älä lue `messages` tilaa Efektissä. Sen sijaan, välitä [päivittäjäfunktion](/reference/react/useState#updating-state-based-on-the-previous-state) `setMessages`:lle:

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ Kaikki riippuvuudet määritelty
  // ...
```

**Huomaa miten Efektisi ei lue `messages` muuttujaa ollenkaan.** Sinun täytyy vain välittää päivittäjäfunktio kuten `msgs => [...msgs, receivedMessage]`. React [laittaa päivittäjäfunktion jonoon](/learn/queueing-a-series-of-state-updates) ja tarjoaa `msgs` argumentin sille seuraavassa renderöinnissä. Tämän takia Efektin ei tarvitse enää riippua `messages` muuttujasta. Tämän korjauksen takia, chatin viestin vastaanottaminen ei enää aiheuta chatin uudelleenyhdistämistä.

### Haluatko lukea arvon "reagoimatta" sen muutoksiin? {/*do-you-want-to-read-a-value-without-reacting-to-its-changes*/}

<Wip>

Tämä osio kuvailee **kokeellista API:a, joka ei ole vielä julkaistu** vakaassa Reactin versiossa.

</Wip>

Oletetaan, että haluat toistaa äänen kun käyttäjä vastaanottaa uuden viestin, ellei `isMuted` ole `true`:

```js {3,10-12}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    // ...
```

Koska Efektisi käyttää nyt `isMuted` koodissaan, sinun täytyy lisätä se riippuvuuslistalle:

```js {10,15}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    return () => connection.disconnect();
  }, [roomId, isMuted]); // ✅ Kaikki riippuvuudet määritelty
  // ...
```

Ongelma on joka kerta kun `isMuted` muuttuu (esimerkiksi, kun käyttäjä painaa "Muted" kytkintä), Efekti synkronoituu uudelleen ja yhdistää uudelleen chattiin. Tämä ei ole haluttu käyttäjäkokemus! (Tässä esimerkissä, jopa linterin poistaminen ei toimisi--jos teet sen, `isMuted` jäisi "jumiin" vanhaan arvoonsa.)

Ratkaistaksesi tämän ongelman, sinun täytyy erottaa logiikka, joka ei saisi olla reaktiivista Efektistä. Et halua tämän Efektin "reagoivan" `isMuted` muutoksiin. [Siirrä tämä ei-reaktiivinen logiikka Efektitapahtumaan:](/learn/separating-events-from-effects#declaring-an-effect-event)

```js {1,7-12,18,21}
import { useState, useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  const onMessage = useEffectEvent(receivedMessage => {
    setMessages(msgs => [...msgs, receivedMessage]);
    if (!isMuted) {
      playSound();
    }
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ Kaikki riippuvuudet määritelty
  // ...
```

Efektitapahtumien avulla voit jakaa Efektit reaktiivisiin osiin (joiden tulisi "reagoida" reaktiivisiin arvoihin kuten `roomId` ja niiden muutoksiin) ja ei-reaktiivisiin osiin (jotka lukevat vain viimeisimmät arvot, kuten `onMessage` lukee `isMuted`). **Nyt kun luet `isMuted` tilan Efektitapahtumassa, sen ei tarvitse olla Efektisi riippuvuus.** Tämän takia chat ei yhdistä uudelleen kun kytket "Muted" asetuksen päälle ja pois, ratkaisten alkuperäisen ongelman!

#### Tapahtumankäsittelijän kääriminen propseista {/*wrapping-an-event-handler-from-the-props*/}

Saatat törmätä samanlaiseen ongelmaan kun komponenttisi vastaanottaa tapahtumankäsittelijän propsina:

```js {1,8,11}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onReceiveMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId, onReceiveMessage]); // ✅ Kaikki riippuvuudet määritelty
  // ...
```

Oletetaan, että vanhempi komponentti lähettää *eri* `onReceiveMessage` funktion joka renderöinnillä:

```js {3-5}
<ChatRoom
  roomId={roomId}
  onReceiveMessage={receivedMessage => {
    // ...
  }}
/>
```

Koska `onReceiveMessage` on riippuvuus, sen tulisi aiheuttaa Efektin uudelleensynkronointi jokaisen yläkomponentin renderöinnin yhteydessä. Tämä saisi sen yhdistämään uudelleen chattiin. Ratkaistaksesi tämän, kääri kutsu Efektitapahtumaan:

```js {4-6,12,15}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  const onMessage = useEffectEvent(receivedMessage => {
    onReceiveMessage(receivedMessage);
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ Kaikki riippuvuudet määritelty
  // ...
```

Efektitapahtumat eivät ole reaktiivisia, joten sinun ei tarvitse määritellä niitä riippuvuuksiksi. Tämän takia chat ei yhdistä uudelleen vaikka yläkomponentti lähettäisi funktion joka on eri jokaisella renderöinnillä.

#### Reaktiivisen ja ei-reaktiivisen koodin erottaminen {/*separating-reactive-and-non-reactive-code*/}

Tässä esimerkissä, haluat kirjata vierailun joka kerta kun `roomId` muuttuu. Haluat sisällyttää nykyisen `notificationCount` jokaiseen lokiin, mutta *et* halua muutoksen `notificationCount` tilaan käynnistävän lokitapahtumaa.

Ratkaisu on jälleen jakaa ei-reaktiivinen koodi Efektitapahtumaan:

```js {2-4,7}
function Chat({ roomId, notificationCount }) {
  const onVisit = useEffectEvent(visitedRoomId => {
    logVisit(visitedRoomId, notificationCount);
  });

  useEffect(() => {
    onVisit(roomId);
  }, [roomId]); // ✅ Kaikki riippuvuudet määritelty
  // ...
}
```

Haluat logiikkasi olevan reaktiivista `roomId` suhteen, joten luet `roomId` Efektissä. Kuitenkin, et halua muutoksen `notificationCount` tilaan kirjaavan ylimääräistä vierailua, joten luet `notificationCount` Efektitapahtumassa. [Lue lisää viimeisimpien propsien ja tilan lukemisesta Efekteistä käyttäen Efektitapahtumia.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)

### Muuttuuko jokin reaktiivinen arvo tarkoituksettomasti? {/*does-some-reactive-value-change-unintentionally*/}

Joskus *haluat* Efektisi "reagoivan" tiettyyn arvoon, mutta arvo muuttuu useammin kuin haluaisit--ja se ei välttämättä heijasta mitään todellista muutosta käyttäjän näkökulmasta. Esimerkiksi, sanotaan että luot `options` olion komponentin sisällä, ja luet sitten sen olion Efektistä:

```js {3-6,9}
function ChatRoom({ roomId }) {
  // ...
  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    // ...
```

Tämä olio on määritelty komponentin sisällä, joten se on [reaktiivinen arvo](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Kun luet tämän kaltaisen reaktiivisen arvon Efektin sisällä, määrittelet sen riippuvuudeksi. Tämä varmistaa, että Efektisi "reagoi" sen muutoksiin:

```js {3,6}
  // ...
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ Kaikki riippuvuudet määritelty
  // ...
```

On tärkeää määritellä se riippuvuudeksi! Tämä takaa, jos esimerkiksi `roomId` muuttuisi, Efektisi yhdistäisi uudelleen chattiin uusilla `options` arvoilla. Kuitenkin, ylläolevassa koodissa on myös ongelma. Nähdäksesi sen, kokeile kirjoittaa syöttölaatikkoon alla olevassa hiekkalaatikossa, ja katso mitä tapahtuu konsolissa:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // Tilapäisesti poista linter käytöstä ongelman osoittamiseksi
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

Yllä olevassa esimerkissä, syöttölaatikko päivittää vain `message` tilamuuttujaa. Käyttäjän näkökulmasta, tämä ei vaikuta chat-yhteyteen. Kuitenkin, joka kerta kun päivität `message` tilaa, komponenttisi renderöityy. Kun komponenttisi renderöityy, koodi sen sisällä ajetaan alusta asti.

Uusi `options` olio luodaan alusta asti jokaisella `ChatRoom` komponentin uudelleenrenderöinnillä. React näkee, että `options` olio on *eri olio* kuin `options` olio, joka luotiin edellisellä renderöinnillä. Tämän takia se synkronoi uudelleen Efektisi (joka riippuu `options` arvosta), ja chat yhdistää uudelleen kun kirjoitat.

**Tämä ongelma vaikuttaa vain olioihin ja funktioihin. JavaScriptissä, jokainen uusi luotu olio ja funktio katsotaan erilaiseksi kuin kaikki muut. Ei ole väliä, että niiden sisältö voi olla sama!**

```js {7-8}
// Ensimmäisen renderöinnin aikana
const options1 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// Seuraavan renderöinnin aikana
const options2 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// Nämä ovat kaksi eri oliota!
console.log(Object.is(options1, options2)); // false
```

**Olion ja funktion riippuvuudet voivat saada Efektisi synkronoimaan useammin kuin tarvitset.**

Tämän takia aina kun mahdollista, sinun tulisi pyrkiä välttämään olioita ja funktiota Efektin riippuvuuksina. Sen sijaan, kokeile siirtää niitä ulos komponentista, sisälle Efektiin, tai saada primitiiviset arvot niistä.

#### Siirrä staattiset oliot ja funktiot komponentin ulkopuolelle {/*move-static-objects-and-functions-outside-your-component*/}

Jos olio ei riipu mistään propseista tai tilasta, voit siirtää sen ulos komponentistasi:

```js {1-4,13}
const options = {
  serverUrl: 'https://localhost:1234',
  roomId: 'music'
};

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ Kaikki riippuvuudet määritelty
  // ...
```

Tällä tavalla *todistat* linterille, ettei se ole reaktiivinen. Se ei voi muuttua uudelleenrenderöinnin seurauksena, joten sen ei tarvitse olla riippuvuus. Nyt `ChatRoom` uudelleenrenderöinti ei aiheuta Efektisi uudelleensynkronointia.

Tämä toimii myös funktioille:

```js {1-6,12}
function createOptions() {
  return {
    serverUrl: 'https://localhost:1234',
    roomId: 'music'
  };
}

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ All dependencies declared
  // ...
```

Koska `createOptions` on määritelty komponentin ulkopuolella, se ei ole reaktiivinen arvo. Tämän takia sen ei tarvitse olla määritelty Efektisi riippuvuuksissa, eikä se koskaan aiheuta Efektisi uudelleensynkronointia.

#### Siirrä dynaamiset oliot ja funktiot Efektin sisään {/*move-dynamic-objects-and-functions-inside-your-effect*/}

Jos oliosi riippuu jostain reaktiivisesta arvosta, joka voi muuttua renderöinnin yhteydessä, kuten `roomId` propsi, et voi siirtää sitä komponentin ulkopuolelle. Voit kuitenkin siirtää sen luomisen koodin Efektisi sisälle:

```js {7-10,11,14}
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
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

Nyt kun `options` on määritelty Efektisi sisällä, se ei ole enää Efektisi riippuvuus. Sen sijaan, ainoa Efektisi käyttämä reaktiivinen arvo on `roomId`. Koska `roomId` ei ole oli taikka funktio, voit olla varma ettei se ole *tahattomasti* eri. JavaScriptissa, numerot ja merkkijonot verrataan niiden sisällön perusteella:

```js {7-8}
// Ensimmäisen renderöinnin aikana
const roomId1 = 'music';

// Seuraavan renderöinnin aikana
const roomId2 = 'music';

// Nämä kaksi merkkijonoa vastaavat toisiaan!
console.log(Object.is(roomId1, roomId2)); // true
```

Kiitos tämän korjauksen, chat ei enää yhdistä uudelleen jos muutat syöttölaatikkoa:

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

Kuitenkin, se *yhdistää* uudelleen kun vaihdat `roomId` pudotusvalikkosta, kuten odotit.

Tämä toimii myös funktioille:

```js {7-12,14}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() {
      return {
        serverUrl: serverUrl,
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

Voit kirjoittaa omia funktioita ryhmitelläksesi logiikkaa Efektisi sisällä. Niin kauan kuin määrittelet ne Efektisi *sisällä*, ne eivät ole reaktiivisia arvoja, ja näin ollen ne eivät tarvitse olla Efektisi riippuvuuksia.

#### Lue primitiiviset arvot oliosta {/*read-primitive-values-from-objects*/}

Joskus saatat saada objektin propseista:

```js {1,5,8}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ Kaikki riippuvuudet määritelty
  // ...
```

Riskinä tässä on että vanhempi komponentti luo olion renderöinnin aikana:

```js {3-6}
<ChatRoom
  roomId={roomId}
  options={{
    serverUrl: serverUrl,
    roomId: roomId
  }}
/>
```

Tämä aiheuttaisi Efektisi yhdistävän uudelleen joka kerta kun vanhempi komponentti renderöi uudelleen. Korjataksesi tämän, lue informaatio oliosta *Efektin ulkopuolella*, ja vältä olion ja funktion riippuvuuksia:

```js {4,7-8,12}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ Kaikki riippuvuudet määritelty
  // ...
```

Logiikasta tulee toistuvaa (luet arvoja objektista Efektin ulkopuolella, ja sitten luot objektin samoilla arvoilla Efektin sisällä). Mutta se tekee hyvin eksplisiittiseksi minkä informaation Efektisi *oikeasti* riippuu. Jos objekti luodaan uudelleen tahattomasti vanhemman komponentin toimesta, chat ei yhdistä uudelleen. Kuitenkin, jos `options.roomId` tai `options.serverUrl` ovat todella erilaisia, chat yhdistää uudelleen.

#### Laske primitiiviset arvot funktioissa {/*calculate-primitive-values-from-functions*/}

Sama tapa voi toimia myös funktioille. Esimerkiksi, oletetaan että vanhempi komponentti välittää funktion:

```js {3-8}
<ChatRoom
  roomId={roomId}
  getOptions={() => {
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }}
/>
```

Välttääksesi tekemästä siitä riippuvuuden (ja aiheuttamasta uudelleen yhdistämistä renderöinneissä), kutsu sitä Efektin ulkopuolella. Tämä antaa sinulle `roomId` ja `serverUrl` arvot, jotka eivät ole objekteja, ja joita voit lukea Efektisi sisältä:

```js {1,4}
function ChatRoom({ getOptions }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = getOptions();
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ Kaikki riippuvuudet määritelty
  // ...
```

Tämä toimii ainoastaan [puhtaille](/learn/keeping-components-pure) funktioille, koska ne ovat turvallisia kutsua renderöinnin aikana. Jos fuktiosi on tapahtumankäsittelijä, mutta et halua sen muutosten synkronoivan Efektisi, [kääri se Efektitapahtumaan.](#do-you-want-to-read-a-value-without-reacting-to-its-changes)

<Recap>

- Riippuvuuksien tulisi aina vastata koodia.
- Kun et ole tyytyväinen riippuvuuksiisi, mitä sinun tulee muokata on koodi.
- Linterin hiljentäminen johtaa hyvin hämmentäviin bugeihin, ja sinun tulisi aina välttää sitä.
- Poistaaksesi riippuvuuden, sinun täytyy "todistaa" linterille, että se ei ole tarpeellinen.
- Jos jokin koodi tulisi suorittaa vastauksena tiettyyn vuorovaikutukseen, siirrä koodi tapahtumankäsittelijään.
- Jos Efektisi eri osat tulisi suorittaa eri syistä, jaa se useaksi Efektiksi.
- Jos haluat päivittää jotain tilaa aikaisemman tilan perusteella, välitä päivitysfunktio.
- Jos haluat lukea viimeisimmän arvon "reagoimatta" siihen, luo Efektitapahtuma Efektistäsi.
- JavaScriptissä oliot ja funktiot ovat erilaisia jos ne on luotu eri aikoina.
- Pyri välttämään oliota ja funktioita riippuvuuksina. Siirrä ne komponentin ulkopuolelle tai Efektin sisälle.

</Recap>

<Challenges>

#### Korjaa nollautuva laskuri {/*fix-a-resetting-interval*/}

Tämä Efekti asettaa laskurin joka laskee joka sekunti. Huomaat jotain outoa tapahtuvan: näyttää siltä että laskuri tuhotaan ja luodaan uudelleen joka kerta kun se laskee. Korjaa koodi niin että laskuri ei tuhoudu jatkuvasti.

<Hint>

Näyttää siltä, että Efektin koodi riippuu `count` tilamuuttujasta. Onko jotain tapa olla tarvitsematta tätä riippuvuutta? Pitäisi olla tapa päivittää `count` tilamuuttujaa sen edellisen arvon perusteella ilman että lisätään riippuvuutta siihen arvoon.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Creating an interval');
    const id = setInterval(() => {
      console.log('⏰ Interval tick');
      setCount(count + 1);
    }, 1000);
    return () => {
      console.log('❌ Clearing an interval');
      clearInterval(id);
    };
  }, [count]);

  return <h1>Counter: {count}</h1>
}
```

</Sandpack>

<Solution>

Haluat päivittää `count` tilamuuttujaa arvoon `count + 1` Efektin sisältä. Tämä kuitenkin tekee Efektistäsi riippuvaisen `count` tilamuuttujasta, joka muuttuu joka tikillä, ja tämän takia laskurisi luodaan uudelleen joka tikillä.

Ratkaistaksesi tämän, käytä [päivitysfunktiota](/reference/react/useState#updating-state-based-on-the-previous-state) ja kirjoita `setCount(c => c + 1)` sen sijaan että kirjoittaisit `setCount(count + 1)`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Creating an interval');
    const id = setInterval(() => {
      console.log('⏰ Interval tick');
      setCount(c => c + 1);
    }, 1000);
    return () => {
      console.log('❌ Clearing an interval');
      clearInterval(id);
    };
  }, []);

  return <h1>Counter: {count}</h1>
}
```

</Sandpack>

<<<<<<< HEAD
Sen sijaan että lukisit `count` tilamuuttujan Efektissä, välitä `c => c + 1` ohje ("kasvata tätä lukua!") Reactille. React soveltaa sitä seuraavalla renderöinnillä. Ja koska et enää tarvitse lukea `count` arvoa Efektissäsi, voit pitää Efektisi riippuvuudet tyhjinä (`[]`). Tämä estää Efektisi luomasta uudelleen laskuria joka tikillä.
=======
Instead of reading `count` inside the Effect, you pass a `c => c + 1` instruction ("increment this number!") to React. React will apply it on the next render. And since you don't need to read the value of `count` inside your Effect anymore, you can keep your Effect's dependencies empty (`[]`). This prevents your Effect from re-creating the interval on every tick.
>>>>>>> 50d6991ca6652f4bc4c985cf0c0e593864f2cc91

</Solution>

#### Korjaa uudelleen käynnistyvä animaatio {/*fix-a-retriggering-animation*/}

Tässä esimerkissä, kun painat "Show", tervetuloviesti haalistuu näkyviin. Animaatio kestää sekunnin. Kun painat "Remove", tervetuloviesti katoaa välittömästi. Logiikka haalistumisanimaatiolle on toteutettu `animation.js` tiedostossa JavaScriptin [animaatiosilmukkana.](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) Sinun ei tarvitse muuttaa tätä logiikkaa. Voit käsitellä sitä kolmannen osapuolen kirjastona. Efektisi luo `FadeInAnimation` instanssin DOM noodille, ja kutsuu sitten `start(duration)` tai `stop()` kontrolloidakseen animaatiota. `duration` kontrolloidaan liukusäätimellä. Säädä liukusäädintä ja katso miten animaatio muuttuu.

Tämä koodi toimii jo, mutta haluat muuttaa jotain. Tällä hetkellä, kun liikutat liukusäädintä joka kontrolloi `duration` tilamuuttujaa, se uudelleenkäynnistää animaation. Muuta käytöstä niin että Efekti ei "reagoi" `duration` tilamuuttujaan. Kun painat "Show", Efekti käyttää nykyistä `duration` arvoa liukusäätimellä. Kuitenkin, liukusäätimen liikuttaminen itsessään ei saisi uudelleenkäynnistää animaatiota.

<Hint>

Onko Efektissäsi rivi koodia jonka ei tulisi olla reaktiivista? Miten voit siirtää ei-reaktiivisen koodin Efektin ulkopuolelle?

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
import { useState, useEffect, useRef } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome({ duration }) {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [duration]);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Welcome
    </h1>
  );
}

export default function App() {
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Fade in duration: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
    </>
  );
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    if (this.duration === 0) {
      // Jump to end immediately
      this.onProgress(1);
    } else {
      this.onProgress(0);
      // Start animating
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
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
```

</Sandpack>

<Solution>

Efektisi täytyy lukea viimeisin `duration` arvo, mutta et halua sen "reagoivan" `duration` tilamuuttujan muutoksiin. Käytät `duration` arvoa animaation käynnistämiseen, mutta animaation käynnistäminen ei ole reaktiivista. Siirrä ei-reaktiivinen koodirivi Efektitapahtumaan, ja kutsu sitä funktiota Efektistäsi.

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
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

function Welcome({ duration }) {
  const ref = useRef(null);

  const onAppear = useEffectEvent(animation => {
    animation.start(duration);
  });

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    onAppear(animation);
    return () => {
      animation.stop();
    };
  }, []);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Welcome
    </h1>
  );
}

export default function App() {
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Fade in duration: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
    </>
  );
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
    if (progress < 1) {
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
```

</Sandpack>

Effect Events like `onAppear` are not reactive, so you can read `duration` inside without retriggering the animation.

</Solution>

#### Korjaa uudelleen yhdistyvä chat {/*fix-a-reconnecting-chat*/}

Tässä esimerkissä, joka kerta kun painat "Toggle theme", chat yhdistää uudelleen. Miksi näin käy? Korjaa ongelma siten, jotta chat yhdistää uudelleen vain kun muokkaat Server URL:ää tai valitset eri chat-huoneen.

Käsittele `chat.js` tiedostoa kuin kolmannen osapuolen kirjastoa: voit konsultoida sitä tarkistaaksesi sen API:n, mutta älä muokkaa sitä.

<Hint>

On useita tapoja ratkaista tämä, mutta lopulta haluat välttää olion käyttämistä riippuvuutena.

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <ChatRoom options={options} />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return <h1>Welcome to the {options.roomId} room!</h1>;
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

<Solution>

Efektisi ajetaan uudelleen koska se riippuu `options` oliosta. Olioita voi luoda vahingossa, ja niitä tulisi välttää Efektien riippuvuuksina aina kun mahdollista.

Vähiten häiritsevä tapa korjata on lukea `roomId` ja `serverUrl` suoraan Efektin ulkopuolelta, ja tehdä Efektistä riippuvainen näistä primitiivisistä arvoista (jotka eivät voi muuttua tahattomasti). Efektin sisällä, luo olio ja välitä se `createConnection` funktiolle:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <ChatRoom options={options} />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Welcome to the {options.roomId} room!</h1>;
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

Olisi vielä parempi korvata `options` olio-propsi tarkemmilla `roomId` ja `serverUrl` propseilla:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
        serverUrl={serverUrl}
      />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId, serverUrl }) {
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Welcome to the {roomId} room!</h1>;
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

Pysyminen primitiivisissä propseissa aina kun mahdollista tekee komponenttien optimoinnista helpompaa.

</Solution>

#### Korjaa uudelleen yhdistyvä chat, uudestaan {/*fix-a-reconnecting-chat-again*/}

Tämä esimerkki yhdistää chatin joko salatusti tai ilman salausta. Kokeile vaihtaa valintaruutua ja huomaa erilaiset viestit konsolissa, kun salaus on päällä ja pois päältä. Kokeile vaihtaa huonetta. Sitten kokeile vaihtaa teemaa. Kun olet yhdistetty chat-huoneeseen, saat uusia viestejä muutaman sekunnin välein. Varmista, että niiden väri vastaa valitsemaasi teemaa.

Tässä esimerkissä, chat yhdistää uudelleen joka kerta kun yrität vaihtaa teemaa. Korjaa tämä. Korjauksen jälkeen, teeman vaihtaminen ei saayhdistää chatia, mutta salauksen asetusten vaihtaminen tai huoneen vaihtaminen saa yhdistää.

Älä muuta yhtään koodia `chat.js` tiedostossa. Muuten voit muuttaa mitä tahansa koodia, kunhan se johtaa samaan toimintaan. Esimerkiksi, saatat löytää hyödylliseksi muuttaa mitä propseja välitetään alaspäin.

<Hint>

Välität kahta eri funktiota: `onMessage` ja `createConnection`. Molemmat luodaan alusta joka kerta kun `App` renderöidään uudelleen. Ne ovat uusia arvoja joka kerta, minkä takia ne laukaisevat uudelleen Effektisi.

Yksi näistä funktioista on tapahtumankäsittelijä. Tiedätkö tapoja kutsua tapahtumankäsittelijää Efektinä ilman että "reagoit" tapahtumankäsittelijän uusiin arvoihin? Se olisi hyödyllistä!

Toinen näistä funktioista on olemassa vain välittääkseen tilaa tuodulle API-metodille. Onko tämä funktio todella tarpeellinen? Mikä on olennainen tieto, joka välitetään alaspäin? Saatat joutua siirtämään joitain tuontia `App.js` tiedostosta `ChatRoom.js` tiedostoon.

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

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';
import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
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
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
        createConnection={() => {
          const options = {
            serverUrl: 'https://localhost:1234',
            roomId: roomId
          };
          if (isEncrypted) {
            return createEncryptedConnection(options);
          } else {
            return createUnencryptedConnection(options);
          }
        }}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function ChatRoom({ roomId, createConnection, onMessage }) {
  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [createConnection, onMessage]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
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
      console.log('✅ 🔐 Connecting to "' + roomId + '" room... (encrypted)');
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
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
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

export function createUnencryptedConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
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
      console.log('✅ Connecting to "' + roomId + '" room (unencrypted)...');
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
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
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
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

On useita tapoja ratkaista tämä, mutta tässä on yksi mahdollinen ratkaisu.

Alkuperäisessä esimerkissä, teeman vaihtaminen aiheutti erilaisten `onMessage` ja `createConnection` funktioiden luomisen ja välittämisen alaspäin. Koska Effect riippui näistä funktioista, chat yhdisti uudelleen aina kun teeman vaihtoi.

Ongelman korjaamiseksi `onMessage` piti kääriä Efektitapahtumaan:

```js {1,2,6}
export default function ChatRoom({ roomId, createConnection, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    // ...
```

Toisin kuin `onMessage` propsi, `onReceiveMessage` Efektitapahtuma ei ole reaktiivinen. Tämän vuoksi se ei tarvitse riippuvuutta Efektistä. Tämän seurauksena muutokset `onMessage` eivät aiheuta chatin uudelleen yhdistämistä.

Et voi tehdä samaa `createConnection` funktion kanssa, koska sen *tulisi* olla reaktiivinen. *Haluat* Efektin käynnistyvän uudelleen jos käyttäjä vaihtaa salatun ja salaamattoman yhteyden välillä, tai jos käyttäjä vaihtaa nykyistä huonetta. Kuitenkin, koska `createConnection` on funktio, et voi tarkistaa onko sen lukema tieto *todella* muuttunut vai ei. Ratkaistaksesi tämän, sen sijaan että välittäisit `createConnection` alaspäin `App` komponentista, välitä raa'at `roomId` ja `isEncrypted` arvot:

```js {2-3}
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
```

Nyt voit siirtää `createConnection` funktion Efektin *sisälle* sen sijaan, että välittäisit sen alaspäin `App` komponentista:

```js {1-4,6,10-20}
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }
    // ...
```

Näiden kahden muutosten jälkeen, Efektisi ei enää riipu mistään muusta funktio-arvosta:

```js {1,8,10,21}
export default function ChatRoom({ roomId, isEncrypted, onMessage }) { // Reactive values
  const onReceiveMessage = useEffectEvent(onMessage); // Ei reaktiivinen

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId // Reading a reactive value
      };
      if (isEncrypted) { // Reading a reactive value
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]); // ✅ Kaikki riippuvuudet määritelty
```

Lopputuloksena, chat yhdistää uudelleen vain kun jotain merkityksellistä (`roomId` tai `isEncrypted`) muuttuu:

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

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
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
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ 🔐 Connecting to "' + roomId + '" room... (encrypted)');
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
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
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

export function createUnencryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ Connecting to "' + roomId + '" room (unencrypted)...');
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
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
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
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

</Solution>

</Challenges>
