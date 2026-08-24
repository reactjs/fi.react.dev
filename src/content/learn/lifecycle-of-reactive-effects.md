---
title: 'Reaktiivisten Efektien elinkaari'
---

<Intro>

Efekteilla on eri elinkaari komponenteista. Komponentit voivat mountata, päivittyä, tai un-mountata. Efekti voi tehdä vain kaksi asiaa: aloittaa synkronoimaan jotain, ja myöhemmin lopettaa synkronointi. Tämä sykli voi tapahtua useita kertoja, jos Efekti riippuu propseista ja tilasta, jotka muuttuvat ajan myötä. React tarjoaa linter-säännön, joka tarkistaa, että olet määrittänyt Efektin riippuvuudet oikein. Tämä pitää Efektisi synkronoituna viimeisimpiin propseihin ja statukseen.

</Intro>

<YouWillLearn>

- Miten Efektin elinkaari eroaa komponentin elinkaaresta
- Miten ajatella jokaista yksittäistä Efektia erillään
- Milloin Efektisi täytyy synkronoida uudelleen ja miksi
- Miten Effektisi riippuvuudet määritellään
- Mitä tarkoittaa kun arvo on reaktiivinen
- Mitä tyhjä riippuvuuslista tarkoittaa
- Miten React tarkistaa rippuuksien oikeudellisuuden linterin avulla
- Mitä tehdä kun olet eri mieltä linterin kanssa

</YouWillLearn>

## Efektin elinkaari {/*the-lifecycle-of-an-effect*/}

Jokainen React komponentti käy läpi saman elinkaaren:

- Komponentti _mounttaa_ kun se lisätään näytölle.
- Komponentti _päivittyy_ kun se saa uudet propsit tai tilan, yleensä vuorovaikutuksen seurauksena. 
- Komponentti _unmounttaa_ kun se poistetaan näytöltä.

**Tämä on hyvä tapa ajatella komponentteja, mutta _ei_ Efektejä.** Sen sijaan, yritä ajatella jokaista Efektiä erillään komponentin elinkaaresta. Efekti kuvaa miten [ulkoinen järjestelmä synkronoidaan](/learn/synchronizing-with-effects) nykyisten propsien ja tilan kanssa. Kun koodisi muuttuu, synkronointi täytyy tapahtua useammin tai harvemmin.

Kuvallistaaksemme tämän pointin, harkitse tätä Efektia, joka yhdistää komponenttisi chat-palvelimeen:

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
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

Efektisi runko määrittää miten **syknronointi aloitetaan:**

```js {2-3}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

Efektisi palauttama siivousfunktio määrittelee miten **synkronointi lopetetaan:**

```js {5}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

Intuitiivisesti, saatat ajatella Reactin **aloittavan synkronoinnin** kun komponenttisi mountataan ja **lopettavan synkronoinnin** kun komponenttisi unmountataan. Tämä ei kuitenkaan ole tilanne! Joksus, saattaa olla tarpeellista **aloittaa ja lopettaa synkronointi useita kertoja** kun komponentti pysyy mountattuna.

Katsotaan _miksi_ tämä on tarpeellista, _milloin_ se tapahtuu_, ja _miten_ voit hallita sen toimintaa.

<Note>

Jotkin Efektit eivät suorita siivousfunktiota ollenkaan. [Useimmiten,](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) haluat palauttaa siivousfunktion--mutta jos et, React käyttäytyy kuin olisit palauttanut tyhjän siivousfunktion.

</Note>

### Miksi synkronointi voi tapahtua useammin kuin kerran {/*why-synchronization-may-need-to-happen-more-than-once*/}

Kuvittele, tämä `ChatRoom` komponetti saa `roomId` propin, jonka käyttäjä valitsee pudotusvalikosta. Oletetaan, että aluksi käyttäjä valitsee `"general"` huoneen `roomId`:ksi. Sovelluksesi näyttää `"general"` chat-huoneen:

```js {3}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId /* "general" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

Kun UI on näytetty, React suorittaa Efektisi **aloittaakseen synkronoinnin.** Se yhdistää `"general"` huoneeseen:

```js {3,4}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Yhdistää "general" huoneeseen
    connection.connect();
    return () => {
      connection.disconnect(); // Katkaisee yhteyden "general" huoneeseen
    };
  }, [roomId]);
  // ...
```

Tähän asti kaikki hyvin.

Myöhemmin, käyttäjä valitsee eri huoneen pudotusvalikosta (esim. `"travel"`). Ensin, React päivittää UI:n:

```js {1}
function ChatRoom({ roomId /* "travel" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

Ajattele mitä tulisi tapahtua seuraavaksi. Käyttäjä näkee, että `"travel"` on valittu chat-huoneeksi UI:ssa. Kuitenkin, Efekti joka viimeksi suoritettiin on yhä yhdistetty `"general"` huoneeseen. **`roomId` propsi on muuttunut, joten mitä Efektisi teki silloin (yhdisti `"general"` huoneeseen) ei enää vastaa UI:ta.**

Tässä vaiheessa, haluat Reactin tekevän kaksi asiaa:

1. Lopettaa synkronoinnin vanhan `roomId` kanssa (katkaisee yhteyden `"general"` huoneeseen)
2. Aloittaa synkronoinnin uuden `roomId` kanssa (yhdistää `"travel"` huoneeseen)

**Onneksi, olet jo opettanut Reactille miten teet molemmat näistä asioista!** Efektisi runko määrittää miten aloitat synkronoinnin, ja siivousfunktio määrittää miten lopetat synkronoinnin. Kaikki mitä Reactin täytyy tehdä nyt on kutsua niitä oikeassa järjestyksessä ja oikeilla propseilla ja tilalla. Katsotaan mitä oikein tapahtuu.

### Miten React uudelleen synkronisoi Efektisi {/*how-react-re-synchronizes-your-effect*/}

Muista, että `ChatRoom` komponenttisi on saanut uuden arvon sen `roomId` propsiksi. Se olu aluksi `"general"`, ja se on nyt `"travel"`. Reactin täytyy synkronoida Efektisi uudelleen yhdistääkseen sinut eri huoneeseen.

**Lopettaaksesi synkronoinnin,** React kutsuu siivousfunktiota, jonka Efektisi palautti yhdistettyään `"general"` huoneeseen. Koska `roomId` oli `"general"`, siivousfunktio katkaisee yhteyden `"general"` huoneeseen:


```js {6}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Yhdistää "general" huoneeseen
    connection.connect();
    return () => {
      connection.disconnect(); // Katkaisee yhteyden "general" huoneeseen
    };
    // ...
```

React sitten kutsuu Efektiasi, jonka olet tarjonnut tämän renderöinnin aikana. Tällä kertaa, `roomId` on `"travel"` joten se **aloittaa synkronoinnin** `"travel"` chat-huoneeseen (kunnes sen siivousfunktio kutsutaan):

```js {3,4}
function ChatRoom({ roomId /* "travel" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Yhdistää "travel" huoneeseen
    connection.connect();
    // ...
```

Kiitos tämän, olet nyt yhdistetty samaan huoneeseen, jonka käyttäjä valitsi UI:ssa. Katastrofi vältetty!

Joka kerta kun komponenttisi renderöityy uudelleen eri `roomId`:llä, Efektisi täytyy synkronoida uudelleen. Esimerkiksi, sanotaan että käyttäjä muuttaa `roomId`:n arvosta `"travel"` arvoon `"music"`. Reactin täytyy taas **lopettaa synkronointi** Efektisi kanssa kutsumalla sen siivousfunktiota (katkaisemalla yhteys `"travel"` huoneeseen). Sitten se taas **aloittaa synkronoinnin** suorittamalla Efektisi rungon uudella `roomId` propsilla (yhdistämällä sinut `"music"` huoneeseen).

Lopuksi, kun käyttäjä menee eri ruutuun, `ChatRoom` unmounttaa. Sitten ei ole tarvetta pysyä ollenkaan yhteydessä. React **lopettaa synkronoinnin** Efektisi kanssa viimeisen kerran ja katkaisee yhteyden `"music"` huoneeseen.

### Ajattelu Efektin perspektiivistä {/*thinking-from-the-effects-perspective*/}

Käydään läpi kaikki mitä tapahtui `ChatRoom` komponentin perspektiivissä:

1. `ChatRoom` mounttasi `roomId` arvolla `"general"`
1. `ChatRoom` päivittyi `roomId` arvolla `"travel"`
1. `ChatRoom` päivittyi `roomId` arvolla `"music"`
1. `ChatRoom` unmounttasi

Jokaisen kohdan aikana komponentin elinkaaressa, Efektisi teki eri asioita:

1. Efektisi yhdisti `"general"` huoneeseen
1. Efektisi katkaisi yhteyden `"general"` huoneesta ja yhdisti `"travel"` huoneeseen
1. Efektisi katkaisi yhteyden `"travel"` huoneesta ja yhdisti `"music"` huoneeseen
1. Efektisi katkaisi yhteyden `"music"` huoneesta

Ajatellaan mitä tapahtui Efektin perspektiivistä:

```js
  useEffect(() => {
    // Efektisi yhdisti huoneeseen, joka määriteltiin roomId:lla...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      // ...kunnes yhteys katkaistiin
      connection.disconnect();
    };
  }, [roomId]);
```

Tämän koodin rakenne saattaa inspiroida sinua näkemään mitä tapahtui sekvenssinä ei-päällekkäisistä aikajaksoista:

1. Efektisi yhdisti `"general"` huoneeseen (kunnes yhteys katkaistiin)
1. Efektisi yhdisti `"travel"` huoneeseen (kunnes yhteys katkaistiin)
1. Efektisi yhdisti `"music"` huoneeseen (kunnes yhteys katkaistiin)

Aiemmin, ajattelit komponentin perspektiivistä. Kun katsot sitä komponentin perspektiivistä, oli houkuttelevaa ajatella Efektejä "callbackeina" tai "elinkaari-tapahtumina", jotka tapahtuvat tiettyyn aikaan kuten "renderöinnin jälkeen" tai "ennen unmounttaamista". Tämä ajattelutapa monimutkaistuu nopeasti, joten on parempi välttää sitä.

**Sen sijaan, keskity aina yksittäiseen alku/loppu sykliin kerralla. Sillä ei tulisi olla merkitystä mounttaako, päivittyykö, vai unmounttaako komponentti. Sinun täytyy vain kuvailla miten aloitat synkronoinnin ja miten lopetat sen. Jos teet sen hyvin, Efektisi on kestävä aloittamiselle ja lopettamiselle niin monta kertaa kuin tarpeellista.**

Tämä saattaa muistuttaa sinua siitä, miten et ajattele mounttaako vai päivittyykö komponentti kun kirjoitat renderöintilogiikkaa, joka luo JSX:ää. Kuvailet mitä pitäisi olla näytöllä, ja React [selvittää loput.](/learn/reacting-to-input-with-state)

### Miten React vahvistaa, että Efektisi voi synkronoitua uudelleen {/*how-react-verifies-that-your-effect-can-re-synchronize*/}

Tässä on esimerkki, jota voit kokeilla. Paina "Open chat" mountataksesi `ChatRoom` komponentin:

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
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
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

Huomaa, että kun komponentti mounttaa ensimmäisen kerran, näet kolme lokia:

1. `✅ Connecting to "general" room at https://localhost:1234...` *(vain-kehitysvaiheessa)*
1. `❌ Disconnected from "general" room at https://localhost:1234.` *(vain-kehitysvaiheessa)*
1. `✅ Connecting to "general" room at https://localhost:1234...`

Ensimmäiset kaksi ovat vain kehityksessä. Kehityksessä, React uudelleen mounttaa jokaisen komponentin kerran.

**React vahvistaa, että Efektisi voi synkronoitua uudelleen pakottamalla sen tekemään se välittömästi kehityksessä.** Tämä saattaa muistuttaa sinua oven avaamisesta ja sulkemisesta ylimääräisen kerran tarkistaaksesi, että lukko toimii. React aloittaa ja lopettaa Efektisi yhden ylimääräisen kerran kehityksessä tarkistaakseen, että [olet toteuttanut siivousfunktion hyvin.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

Pääsyy miksi Efektisi synkronoi uudelleen käytännössä on jos jokin data, jota se käyttää on muuttunut. Yllä olevassa hiekkalaatikossa, vaihda valittua chat-huonetta. Huomaa miten Efektisi synkronoituu uudelleen `roomId` muuttuessa.

Kuitenkin, on myös epätavallisempia tapauksia, joissa uudelleen synkronointi on tarpeellista. Esimerkiksi, kokeile muokata `serverUrl`:ää hiekkalaatikossa yllä kun chat on auki. Huomaa miten Efektisi synkronoituu uudelleen vastauksena koodin muokkaukseen. Tulevaisuudessa, React saattaa lisätä lisää ominaisuuksia, jotka nojaavat uudelleen synkronointiin.

### Miten React tietää, että sen täytyy synkronoida Efekti uudelleen {/*how-react-knows-that-it-needs-to-re-synchronize-the-effect*/}

Saatat miettiä miten React tiesi, että Efektisi täytyi synkronoida uudelleen `roomId`:n muuttuessa. Se johtuu siitä, että *kerroit Reactille* koodin riippuvan `roomId`:sta sisällyttämällä sen [riippuvuuslistaan:](/learn/synchronizing-with-effects#step-2-specify-the-effect-dependencies)

```js {1,3,8}
function ChatRoom({ roomId }) { // roomId propsi saattaa muuttua ajan kanssa
  useEffect(() => {
<<<<<<< HEAD
    const connection = createConnection(serverUrl, roomId); // Tämä Efekti lukee roomId:n
=======
    const connection = createConnection(serverUrl, roomId); // This Effect reads roomId
>>>>>>> 12d692da47e77cdc558b928fcfbaf4e71c6d0cec
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]); // Joten kerrot Reactille, että tämä Efekti "riippuu" roomId:sta
  // ...
```

Tässä miten tämä toimii:

1. Tiesit `roomId`:n olevan propsi, joka tarkoittaa, että se voi muuttua ajan kanssa.
2. Tiesit, että Efektisi lukee `roomId`:n (joten sen logiikka riippuu arvosta, joka saattaa muuttua myöhemmin).
3. Tämä on miksi määritit sen Efektisi riippuvuudeksi (jotta se synkronoituu uudelleen kun `roomId` muuttuu).

Joka kerta kun komponenttisi renderöityy uudelleen, React katsoo riippuvuuslistaa, jonka olet määrittänyt. Jos mikään arvoista taulukossa on eri kuin arvo samassa kohdassa, jonka annoit edellisellä renderöinnillä, React synkronoi Efektisi uudelleen.

Esimerkiksi, jos välitit arvon `["general"]` ensimmäisen renderöinnin aikana, ja myöhemmin välitit `["travel"]` seuraavan renderöinnin aikana, React vertaa `"general"` ja `"travel"` arvoja. Nämä ovat eri arvoja (vertailtu [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) avulla), joten React synkronoi Efektisi uudelleen. Toisaalta, jos komponenttisi uudelleen renderöityy mutta `roomId` ei ole muuttunut, Efektisi pysyy yhdistettynä samaan huoneeseen.

### Kukin Efekti edustaa erillistä synkronointiprosessia {/*each-effect-represents-a-separate-synchronization-process*/}

Vältä lisäämästä aiheesta poikkeavaa logiikkaa Efektiisi vain koska tämä logiikka täytyy suorittaa samaan aikaan kuin Efekti, jonka olet jo kirjoittanut. Esimerkiksi, oletetaan että haluat lähettää analytiikka tapahtuman kun käyttäjä vierailee huoneessa. Sinulla on jo Efekti, joka riippuu `roomId`:sta, joten saatat tuntea houkutuksen lisätä analytiikka-kutsu sinne:

```js {3}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

Mutta kuvittele, että myöhemmin lisäät toisen riippuvuuden tähän Efektiin, joka täytyy alustaa yhteys uudelleen. Jos tämä Efekti synkronoituu uudelleen, se kutsuu myös `logVisit(roomId)` samaan huoneeseen, jota et tarkoittanut. Vierailun kirjaaminen **on erillinen prosessi** yhdistämisestä. Kirjoita ne kahdeksi erilliseksi Efektiksi:

```js {2-4}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
  }, [roomId]);

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    // ...
  }, [roomId]);
  // ...
}
```

**Jokaisen Efektin koodissasi tulisi edustaa erillistä ja riippumatonta synkronointiprosessia.**

Yllä olevassa esimerkissä, yhden Efektin poistaminen ei hajota toisen Efektin logiikkaa. Tämä on hyvä indikaatio siitä, että ne synkronoivat eri asioita, joten oli järkevää jakaa ne kahteen erilliseen Efektiin. Toisaalta, jos jaat yhtenäisen logiikan eri Efekteihin, koodi saattaa näyttää "puhtaammalta" mutta tulee [vaikeammaksi ylläpitää.](/learn/you-might-not-need-an-effect#chains-of-computations) Tämän takia sinun tulisi ajatella ovatko prosessit samat vai erilliset, eivät sitä näyttääkö koodi puhtaammalta.

## Efektit "reagoivat" reaktiivisiin arvoihin {/*effects-react-to-reactive-values*/}

Efektisi lukee kaksi muuttujaa (`serverUrl` ja `roomId`), mutta määritit vain `roomId`:n riippuvuudeksi:

```js {5,10}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
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

Miksei `serverUrl` tarvitse olla riippuvuus?

Tämä siksi, koska `serverUrl` ei muutu koskaan uudelleen renderöinnin seurauksena. Se on aina sama riippumatta kuinka monta kertaa komponentti renderöityy ja miksi. Koska `serverUrl` ei koskaan muutu, ei olisi järkevää määrittää sitä riippuvuudeksi. Loppujen lopuksi, riippuvuudet tekevät jotain vain kun ne muuttuvat ajan kanssa!

Toisella kädellä, `roomId` saattaa olla eri uudelleen renderöinnin seurauksena. **Propsit, tila, ja muut arvot, jotka on määritelty komponentin sisällä ovat _reaktiivisia_ koska ne lasketaan renderöinnin aikana ja osallistuvat Reactin datavirtaan.**

Jos `serverUrl` olisi tilamuuttuja, se olisi reaktiivinen. Reaktiiviset arvot täytyy sisällyttää riippuvuuksiin:

```js {2,5,10}
function ChatRoom({ roomId }) { // Propsit muuttuvat ajan kanssa
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // Tila voi muuttua ajan kanssa

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Efektisi lukee propsin ja tilan
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // Joten kerrot Reactille, että tämä Efekti "riippuu" propsista ja tilasta
  // ...
}
```

Sisällyttämällä `serverUrl` riippuvuudeksi, varmistat että Efekti synkronoituu uudelleen sen muuttuessa.

Kokeile muuttaa valittua chat-huonetta tai muokata server URL:ää tässä hiekkalaatikossa:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
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

Aina kun muutat reaktiivista arvoa kuten `roomId` tai `serverUrl`, Efekti yhdistää uudelleen chat-palvelimeen.

### Mitä tyhjä riippuvuuslista tarkoittaa {/*what-an-effect-with-empty-dependencies-means*/}

Mitä tapahtuu jos siirrät molemmat `serverUrl` ja `roomId` komponentin ulkopuolelle?

```js {1,2}
const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ Kaikki riippuvuudet määritelty
  // ...
}
```

Nyt Efektisi koodi ei käytä *yhtään* reaktiivista arvoa, joten sen riippuvuuslista voi olla tyhjä (`[]`).

Ajattelu komponentin perspektiivista, tyhjä `[]` riippuvuuslista tarkoittaa, että tämä Efekti yhdistää chat-huoneeseen vain kun komponentti mounttaa, ja katkaisee yhteyden vain kun komponentti unmounttaa. (Pidä mielessä, että React silti [synkronoi ylimääräisen kerran](#how-react-verifies-that-your-effect-can-re-synchronize) kehityksessä testatakseen logiikkaasi.)


<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom />}
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

Kuitenkin, jos [ajattelet Efektin perspektiivista,](#thinking-from-the-effects-perspective) sinun ei tarvitse ajatella mountaamista ja unmountaamista ollenkaan. Tärkeää on se, että olet määritellyt mitä Efektisi tarvitsee synkronoinnin aloittamiseen ja lopettamiseen. Tänään, sillä ei ole yhtään reaktiivista riippuvuutta. Mutta jos haluat koskaan käyttäjän muuttavan `roomId`:n tai `serverUrl`:n ajan kanssa (ja ne tulisivat reaktiivisiksi), Efektisi koodi ei muutu. Sinun täytyy vain lisätä ne riippuvuuksiin.

### Kaikki muuttujat komponentin sisällä ovat reaktiivisia {/*all-variables-declared-in-the-component-body-are-reactive*/}

Propsit ja tila eivät ole ainoita reaktiivisia arvoja. Arvot jotka niistä lasket ovat myös reaktiivisia. Jos propsit tai tila muuttuu, komponenttisi tulee renderöitymään uudelleen, ja niistä lasketut arvot myös muuttuvat. Tämän takia kaikki Efektin muuttujat tulisi lisätä Efektin riippuvuuslistalle.

Sanotaan, että käyttäjä voi valita chat-palvelimen pudotusvalikosta, mutta he voivat myös määrittää oletuspalvelimen asetuksissa. Oletetaan, että olet jo laittanut asetukset -tilan [kontekstiin](/learn/scaling-up-with-reducer-and-context), joten luet `settings`:in siitä kontekstista. Nyt lasket `serverUrl`:n valitun palvelimen ja oletuspalvelimen perusteella:

```js {3,5,10}
function ChatRoom({ roomId, selectedServerUrl }) { // roomId on reaktiivinen
  const settings = useContext(SettingsContext); // settings on reaktiivinen
  const serverUrl = selectedServerUrl ?? settings.defaultServerUrl; // serverUrl on reaktiivinen
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Efektisi lukee roomId ja serverUrl
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // Joten sen täytyy synkronoida uudelleen kun jompi kumpi niistä muuttuu!
  // ...
}
```

Tässä esimerkissä, `serverUrl` ei ole propsi tai tilamuuttuja. Se on tavallinen muuttuja, jonka lasket renderöinnin aikana. Mutta se on laskettu renderöinnin aikana, jolloin se voi muuttua uudelleen renderöinnin seurauksena. Tämä on syy miksi se on reaktiivinen.

**Kaikki komponentin sisällä olevat arvot (mukaan lukien propsit, tila, ja muuttujat komponenttisi sisällä) ovat reaktiivisia. Mikä tahansa reaktiivinen arvo voi muuttua uudelleen renderöinnin seurauksena, joten sinun täytyy sisällyttää reaktiiviset arvot Efektin riippuvuuslistalle.**

Toisin sanoen, Efektisi "reagoi" kaikkii arvoihin komponentin sisällä. 

<DeepDive>

#### Voiko globaalit tai mutatoitavat arvot olla riippuvuuksia? {/*can-global-or-mutable-values-be-dependencies*/}

Mutatoitavat arovot (mukaan lukien globaalit muttujat) eivät ole reaktiivisia.

**Mutatoitava arvo kuten [`location.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname) ei voi olla riippuvuus.** Se on mutatoitavissa, joten se voi muuttua koska vain täysin Reactin renderöinnin datavirtauksen ulkopuolella. Sen muuttaminen ei käynnistäisi komponenttisi uudelleenrenderöintiä. Tämän takia, vaikka määrittelisit sen riippuvuuksissasi, React *ei tietäisi* synkronoida Efektiasi uudelleen sen muuttuessa. Tämä myös rikkoo Reactin sääntöjä, koska mutatoitavan datan lukeminen renderöinnin aikana (joka on kun lasket riippuvuuksia) rikkoo [renderöinnin puhtauden.](/learn/keeping-components-pure) Sen sijaan, sinun tulisi lukea ja tilata ulkoisesta mutatoitavasta arvosta [`useSyncExternalStore`:n avulla.](/learn/you-might-not-need-an-effect#subscribing-to-an-external-store)

**Mutatoitava arvo kuten [`ref.current`](/reference/react/useRef#reference) tai siitä luettavat asiat eivät myöskään voi olla riippuvuuksia.** `useRef`:n palauttama ref-objekti voi olla riippuvuus, mutta sen `current`-ominaisuus on tarkoituksella mutatoitava. Sen avulla voit [pitää kirjaa jostain ilman, että se käynnistää uudelleenrenderöinnin.](/learn/referencing-values-with-refs) Mutta koska sen muuttaminen ei käynnistä uudelleenrenderöintiä, se ei ole reaktiivinen arvo, eikä React tiedä synkronoida Efektiasi uudelleen sen muuttuessa.

Kuten tulet oppimaan tällä sivulla, linter tulee myös tarkistamaan näitä ongelmia automaattisesti.

</DeepDive>

### React tarkistaa, että olet määrittänyt jokaisen reaktiivisen arvon riippuvuudeksi {/*react-verifies-that-you-specified-every-reactive-value-as-a-dependency*/}

Jos linterisi on [konfiguroitu Reactille,](/learn/editor-setup#linting) se tarkistaa, että jokainen reaktiivinen arvo, jota Efektisi koodi käyttää on määritelty sen riippuvuudeksi. Esimerkiksi, tämä on linterin virhe koska molemmat `roomId` ja `serverUrl` ovat reaktiivisia:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) { // roomId on reaktiivinen
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl on reaktiivinen

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // <-- Jokin on pielessä täällä!

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
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

Tämä saattaa näyttää React-virheeltä, mutta oikeasti React näyttää bugin koodissasi. Molemmat `roomId` sekä `serverUrl` voivat muuttua ajan kanssa, mutta unohdat synkronoida Efektisi kun ne muuttuvat. Pysyt yhdistettynä alkuperäiseen `roomId` ja `serverUrl` vaikka käyttäjä valitsisi eri arvot käyttöliittymässä. 

Korjataksesi bugin, seuraa linterin ehdotusta määrittääksesi `roomId` ja `serverUrl` Efektisi riippuvuuksiksi:


```js {9}
function ChatRoom({ roomId }) { // roomId on reaktiivinen
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl on reaktiivinen
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]); // ✅ Kaikki riippuvuudet määritelty
  // ...
}
```

Kokeile tätä korjausta hiekkalaatikossa yllä. Varmista, että linterin virhe on poistunut, ja chat yhdistyy kun se on tarpeellista.

<Note>

Jossain tapauksissa, React *tietää*, että arvo ei tule koskaan muuttumaan vaikka se on määritelty komponentin sisällä. Esimerkiksi, [`set`-funktio](/reference/react/useState#setstate) joka palautetaan `useState`:sta ja ref-objekti, joka palautetaan [`useRef`](/reference/react/useRef) ovat *stabiileja*--niiden on taattu olevan muuttumattomia uudelleen renderöinnin seurauksena. Stabiilit arvot eivät ole reaktiivisia, joten voit jättää ne pois listasta. Niiden sisällyttäminen on sallittua: ne eivät muutu, joten sillä ei ole väliä.

</Note>

### Mitä tehdä kun et halua synkronoida uudelleen {/*what-to-do-when-you-dont-want-to-re-synchronize*/}

Edellisessä esimerkissä, olet korjannut linter-virheen listaamalla `roomId` ja `serverUrl` riippuvuuksina.

**Kuitenkin, voisit sen sijaan "todistaa" linterille, että nämä arvot eivät ole reaktiivisia arvoja,** eli että ne *eivät voi* muuttua uudelleen renderöinnin seurauksena. Esimerkiksi, jos `serverUrl` ja `roomId` eivät riipu renderöinnistä ja ovat aina samoja arvoja, voit siirtää ne komponentin ulkopuolelle. Nyt niiden ei tarvitse olla riippuvuuksia:

```js {1,2,11}
const serverUrl = 'https://localhost:1234'; // serverUrl ei ole reaktiivinen
const roomId = 'general'; // roomId ei ole reaktiivinen

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ Kaikki riippuvuudet määritelty
  // ...
}
```

Voit myös siirtää ne *Efektin sisälle.* Niitä ei lasketa renderöinnin aikana, joten ne eivät ole reaktiivisia:

```js {3,4,10}
function ChatRoom() {
  useEffect(() => {
    const serverUrl = 'https://localhost:1234'; // serverUrl ei ole reaktiivinen
    const roomId = 'general'; // roomId ei ole reaktiivinen
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ Kaikki riippuvuudet määritelty
  // ...
}
```

**Efektit ovat reaktiivisia koodinpalasia.** Ne synkronoituvat uudelleen kun arvot, joita niiden sisällä luet muuttuvat. Toisin kuin tapahtumankäsittelijät, jotka suoritetaan vain kerran jokaista interaktiota kohden, Efektit suoritetaan aina kun synkronointi on tarpeellista.

**Et voi "päättää" riippuvuuksiasi.** Riippuvuutesi täytyy sisältää kaikki [reaktiiviset arvot](#all-variables-declared-in-the-component-body-are-reactive), joita luet Efektissa. Linter edellyttää tätä. Joskus tämä saattaa aiheuttaa ongelmia kuten loputtomia silmukoita ja Efektisi liian usein synkronoimisen. Älä korjaa näitä ongelmia hiljentämällä linter! Kokeile sen sijaan seuraavaa:

* **Tarkista, että Efektisi edustaa yksittäistä synkronointiprosessia.** Jos Efektisi ei synkronoi mitään, [se saattaa olla turha.](/learn/you-might-not-need-an-effect) Jos se synkronoi useita yksittäisiä asioita, [jaa se osiin.](#each-effect-represents-a-separate-synchronization-process)

* **Jos haluat lukea propsien tai tilan arvon ilman "reagointia" tai Efektin synkronoimista uudelleen,** voit jakaa Efektisi reaktiiviseen osaan (joka pidetään Efektissä) ja ei-reaktiiviseen osaan (joka erotetaan _Efektin tapahtumaksi_). [Lue lisää tapahtumien erottamisesta Efekteistä.](/learn/separating-events-from-effects)

* **Vältä riippuvuutta olioista ja funktioista.** Jos luot olioita ja funktioita renderöinnin aikana ja luet niitä Efekteissä, ne ovat uusia joka renderöinnillä. Tämä aiheuttaa Efektisi synkronoimisen uudelleen joka kerta. [Lue lisää tarpeettomien riippuvuuksien poistamisesta Efekteistä.](/learn/removing-effect-dependencies)

<Pitfall>

Linter on ystäväsi, mutta sen voimat ovat rajattuja. Linter tietää vain koska riippuvuutesi on *väärin*. Se ei tiedä *parasta tapaa* ratkaista jokaista tilannetta. Jos linter suosittelee riippuvuutta, mutta sen lisääminen aiheuttaa silmukan, se ei tarkoita, että linter tulisi sivuuttaa. Sinun täytyy muuttaa koodia Efektin sisällä (tai ulkopuolella) niin, että arvo ei ole reaktiivinen eikä *tarvitse* olla riippuvuus.

Jos sinulla on olemassaoleva koodipohja, sinulla saattaa olla joitain Efektejä, jotka hiljentävät linterin näin:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Vältä tämän kaltaista linterin hiljentämistä:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

[Seuraavalla](/learn/separating-events-from-effects) [sivulla](/learn/removing-effect-dependencies), opit korjaamaan tämän koodin rikkomatta sääntöjä. Se on aina korjaamisen arvoista!

</Pitfall>

<Recap>

- Komponentit voivat mountata, päivittää, ja unmountata.
- Jokaisella Efektilla on erillinen elinkaari ympäröivästä komponentista.
- Jokainen Efekti kuvaa erillistä synkronointiprosessia, joka voi *alkaa* ja *loppua*.
- Kun kirjoitat ja luet Efekteja, ajattele jokaisen yksittäisen Efektin perspektiivistä (miten aloittaa ja lopettaa synkronointi) sen sijaan, että ajattelisit komponentin perspektiivistä (miten se mounttaa, päivittyy, tai unmounttaa).
- Komponentin sisällä määritellyt arvot ovat "reaktiivisia".
- Reaktiivisten arvojen tulisi synkronoida Efekti uudelleen koska ne voivat muuttua ajan kanssa.
- Linter vahvistaa, että kaikki Efektin sisällä käytetyt reaktiiviset arvot on määritelty riippuvuuksiksi.
- Kaikki linterin virheet ovat todellisia. On aina tapa korjata koodi siten, ettei se riko sääntöjä.

</Recap>

<Challenges>

#### Korjaa yhdistäminen jokaisella näppäinpainalluksella {/*fix-reconnecting-on-every-keystroke*/}

Tässä esimerkissä, `ChatRoom` komponentti yhdistää chat-huoneeseen kun komponentti mounttaa, katkaisee yhteyden kun se unmounttaa, ja yhdistää uudelleen kun valitset eri chat-huoneen. Tämä käyttäytyminen on oikein, joten sinun täytyy pitää se toiminnassa.

Kuitenkin, on ongelma. Aina kun kirjoitat viestilaatikkoon alhaalla, `ChatRoom` *myös* yhdistää chatiin uudelleen. (Voit huomata tämän tyhjentämällä konsolin ja kirjoittamalla viestilaatikkoon.) Korjaa ongelma niin, ettei näin tapahdu.

<Hint>

Sinun täytyy ehkä lisätä riippuvuuslista tälle Efektille. Mitkä riippuvuudet tulisi olla listattuna?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  });

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
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

<Solution>

Tällä Efektilla ei ole riippuvuuslistaa ollenkaan, joten se synkronoituu uudelleen jokaisen renderöinnin jälkeen. Ensiksi, lisää riippuvuuslista. Sitten, varmista, että jokainen reaktiivinen arvo, jota Efekti käyttää on määritelty taulukossa. Esimerkiksi, `roomId` on reaktiivinen (koska se on propsi), joten sen tulisi olla mukana taulukossa. Tämä varmistaa, että kun käyttäjä valitsee eri huoneen, chat yhdistää uudelleen. Toisaalta, `serverUrl` on määritelty komponentin ulkopuolella. Tämän takia sen ei tarvitse olla taulukossa.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
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

</Solution>

#### Vaihda synkronointi päälle ja pois {/*switch-synchronization-on-and-off*/}

Tässä esimerkissä, Efekti tilaa window:n [`pointermove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event) tapahtuman liikuttaakseen vaaleanpunaista pistettä näytöllä. Kokeile liikuttaa hiirtä esikatselualueen päällä (tai kosketa näyttöä jos olet mobiililaitteella), ja katso miten vaaleanpunainen piste seuraa liikettäsi.

Esimerkistä löytyy myös valintaruutu. Valintaruudun valinta muuttaa `canMove` tilamuuttujaa, mutta tätä tilamuuttujaa ei käytetä missään koodissa. Tehtäväsi on muuttaa koodia siten, jotta kun `canMove` on arvoltaan `false` (valintaruutu ei ole valittuna), pisteen tulisi lakata seuraamasta. Kun valitset valintaruudun takaisin päälle (ja asetat `canMove` arvoksi `true`), piste tulisi seurata liikettä jälleen. Toisin sanoen, onko pisteellä lupa liikkua vai ei tulisi pysyä synkronoituna valintaruudun valintaan.

<Hint>

Et voi määritellä Efektia ehdollisesti. Kuitenkin, koodi Efektin sisällä voi käyttää ehtolauseita!

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
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

<Solution>

Yksi ratkaisu on kääriä `setPosition` kutsu `if (canMove) { ... }` ehtolauseeseen:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

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

Vaihtoehtoisesti, voisit kääriä *tapahtumatilauksen* logiikan `if (canMove) { ... }` ehtolauseeseen:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    if (canMove) {
      window.addEventListener('pointermove', handleMove);
      return () => window.removeEventListener('pointermove', handleMove);
    }
  }, [canMove]);

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

Molemmissa näistä tavoista, `canMove` on reaktiivinen muuttuja, jonka luet Efektin sisällä. Tämän takia se täytyy määritellä Efektin riippuvuustaulukossa. Tämä takaa sen, että Efekti synkronoituu uudelleen jokaisen muutoksen jälkeen.

</Solution>

#### Selvitä vanhentuneen arvon bugi {/*investigate-a-stale-value-bug*/}

Tässä esimerkissä, vaaleanpunainen piste tulisi liikkua kun valintaruutu on valittuna, ja lopettaa liikkuminen kun valintaruutu ei ole valittuna. Logiikka tälle on jo toteutettu: `handleMove` tapahtumankäsittelijä tarkistaa `canMove` tilamuuttujan.

Kuitenkin, jostain syystä, `canMove` tilamuuttuja `handleMove`:n sisällä näyttää olevan "vanhentunut": se on aina `true`, vaikka valitsisit pois valintaruudun. Miten tämä on mahdollista? Etsi virhe koodista ja korjaa se.

<Hint>

Jos näet hiljennetyn linter-säännön, poista hiljennys! Sieltä virheet yleensä löytyvät.

</Hint>

<Sandpack>

```js {expectedErrors: {'react-compiler': [16]}}
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

<Solution>

Ongelma alkuperäisessä koodissa oli riippuvuuslinterin hiljentäminen. Jos poistat hiljennyksen, huomaat, että tämä Efekti riippuu `handleMove` funktiosta. Tämä on järkevää: `handleMove` on määritelty komponentin sisällä, joka tekee siitä reaktiivisen arvon. Jokainen reaktiivinen arvo täytyy määritellä riippuvuutena, tai se voi vanhentua ajan kanssa!

Alkuperäisen koodin kirjoittaja on "valehdellut" Reactille kertomalla sille, että Efekti ei riipu (`[]`) yhdestäkään reaktiivisesta arvosta. Tämän takia React ei uudelleen synkronoi Efektia sen jälkeen kun `canMove` on muuttunut (ja `handleMove`:a sen mukana). Koska React ei uudelleen synkronoinut Efektiä, `handleMove` joka on liitetty tapahtumankäsittelijäksi on `handleMove` funktio, joka on luotu ensimmäisen renderöinnin aikana. Ensimmäisen renderöinnin aikana, `canMove` oli `true`, minkä takia `handleMove` ensimmäiseltä renderöinniltä näkee aina tämän arvon.

**Jos et koskaan hiljennä linteria, et koskaan näe ongelmia vanhentuneiden arvojen kanssa.** On useita tapoja ratkaista tämä ongelma, mutta sinun tulisi aina aloittaa poistamalla linterin hiljennys. Sitten muuttaa koodia korjataksesi linter-virheen.

Voit muuttaa Efektin riippuvuudeksi `[handleMove]`, mutta koska se on uudelleen määritelty funktio joka renderöinnillä, voisit yhtä hyvin poistaa riippuvuuslistan kokonaan. Tällöin Efekti *tulee* synkronoitumaan uudelleen jokaisen renderöinnin jälkeen:

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
  });

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

Tämä ratkaisu toimii, mutta se ei ole ihanteellinen. Jos laitat `console.log('Resubscribing')` Efektin sisään, huomaat, että se tilaa uudelleen jokaisen renderöinnin jälkeen. Uudelleen tilaaminen on nopeaa, mutta olisi silti mukavaa välttää sitä niin usein.

Parempi ratkaisu olisi siirtää `handleMove` funktio Efektin *sisään*. Sitten `handleMove` ei olisi reaktiivinen arvo ja siten Efektisi ei riippuisi fuktiosta. Sen sijaan, se riippuu `canMove`sta, jonka koodisi lukee Efektin sisällä. Tämä vastaa haluttua käyttäytymistä, koska Efektisi pysyy nyt synkronoituna `canMove` arvon kanssa:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }

    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

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

Kokeile lisätä `console.log('Resubscribing')` Efektin sisään ja huomaa, että nyt se tilaa uudelleen vain kun valitset valintaruudun (`canMove` muuttuu) tai muokkaat koodia. Tämä tekee siitä paremman kuin edellinen lähestymistapa, joka tilaa aina uudelleen.

Opit yleisemmän lähestymistavan tällaisiin ongelmiin [Tapahtumien erottaminen Efekteista](/learn/separating-events-from-effects) sivulla.

</Solution>

#### Korjaa yhteyden kytkin {/*fix-a-connection-switch*/}

Tässä esimerkissä, chat-palvelu `chat.js` tiedostossa tarjoaa kaksi erilaista APIa: `createEncryptedConnection` ja `createUnencryptedConnection`. Juuri `App` komponentti antaa käyttäjän valita käyttääkö salausta vai ei, ja sitten välittää vastaavan API-metodin `ChatRoom` alakomponentille `createConnection` propsina.

Huomaa miten aluksi, konsoli sanoo, että yhteys ei ole salattu. Kokeile valintaruudun valitsemista: mikään ei tapahdu. Kuitenkin, jos vaihdat valittua huonetta tämän jälkeen, chat yhdistää uudelleen *ja* ottaa salauksen käyttöön (kuten konsoliviesteistä näet). Tämä on bugi. Korjaa bugi niin, että valintaruudun valitseminen aiheuttaa *myös* chatin yhdistämisen uudelleen.

<Hint>

Linterin hiljentäminen on aina epäilyttävää. Voisiko tämä olla bugi?

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js {expectedErrors: {'react-compiler': [8]}} src/ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // Todellinen toteutus yhdistäisi palvelimeen oikeasti
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // Todellinen toteutus yhdistäisi palvelimeen oikeasti
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Jos poistat linterin hiljennyksen, näet linter virheen. Ongelma on siinä, että `createConnection` on propsi, joten se on reaktiivinen arvo. Se voi muuttua ajan kanssa! (Ja tosiaan, sen tulisi--kun käyttäjä valitsee valintaruudun, vanhempi komponentti välittää eri arvon `createConnection` propsille.) Tämän takia sen tulisi olla riippuvuus. Lisää se listaan korjataksesi bugin:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, createConnection]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // Todellinen toteutus yhdistäisi palvelimeen oikeasti
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // Todellinen toteutus yhdistäisi palvelimeen oikeasti
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

On oikein, että `createConnection` on riippuvuus. Kuitenkin, tämä koodi on hieman hauras sillä joku voisi muokata `App` komponenttia välittämään sisäisen funktion arvon tälle propsille. Tässä tapauksessa, sen arvo olisi eri joka kerta kun `App` komponentti renderöityy uudelleen, joten Efekti saattaisi synkronoitua liian usein. Välttääksesi tämän, voit välittää `isEncrypted` propsin sijaan:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted }) {
  useEffect(() => {
    const createConnection = isEncrypted ?
      createEncryptedConnection :
      createUnencryptedConnection;
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // Todellinen toteutus yhdistäisi palvelimeen oikeasti
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // Todellinen toteutus yhdistäisi palvelimeen oikeasti
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

Tässä versiossa, `App` komponentti välittää totuusarvo-propsin funktion sijaan. Efektin sisällä päätät mitä funktiota käyttää. Kerta molemmat `createEncryptedConnection` ja `createUnencryptedConnection` on määritelty komponentin ulkopuolella, ne eivät ole reaktiivisia, eivätkä niiden tarvitse olla riippuvuuksia. Opit tästä lisää [Efektin riippuvuuksien poistamisesta](/learn/removing-effect-dependencies)

</Solution>

#### Täytä pudotusvalikkojen ketju {/*populate-a-chain-of-select-boxes*/}

Tässä esimerkissä on kaksi pudotusvalikkoa. Ensimmäinen pudotusvalikko antaa käyttäjän valita planeetan. Toinen pudotusvalikko antaa käyttäjän valita paikan *sillä planeetalla.* Toinen pudotusvalikko ei vielä toimi. Tehtäväsi on saada se näyttämään paikat valitulla planeetalla.

Katso miten ensimmäinen pudotusvalikko toimii. Se täyttää `planetList` tilan `"/planets"` API kutsun tuloksella. Tällä hetkellä valitun planeetan ID on `planetId` tilamuuttujassa. Sinun täytyy löytää kohta johon lisätä koodia, jotta `placeList` tilamuuttuja täyttyy `"/planets/" + planetId + "/places"` API kutsun tuloksella.

Jos toteutat tämän oikein, planeetan valitsemisen tulisi täyttää paikkojen lista. Planeetan vaihtaminen tulisi vaihtaa paikkojen lista.

<Hint>

Jos sinulla on kaksi synkronisointiprosessia, ne täytyy kirjoittaa kahteen erilliseen Efektiin.

</Hint>

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log('Fetched a list of planets.');
        setPlanetList(result);
        setPlanetId(result[0].id); // Valitse ensimmäinen planeetta
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '???'} on {planetId || '???'} </p>
    </>
  );
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

On kaksi toisistaan riippumatonta synkronointiprosessia:

- Ensimmäinen pudotusvalikko on synkronoitu etäisten planeettojen listaan.
- Toinen pudotusvalikko on synkronoitu etäisten paikkojen listaan nykyisellä `planetId`:llä.

This is why it makes sense to describe them as two separate Effects. Here's an example of how you could do this:

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log('Fetched a list of planets.');
        setPlanetList(result);
        setPlanetId(result[0].id); // Valitse ensimmäinen planeetta
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  useEffect(() => {
    if (planetId === '') {
      // Mitään ei ole valittuna ensimmäisessä pudotusvalikossa vielä
      return;
    }

    let ignore = false;
    fetchData('/planets/' + planetId + '/places').then(result => {
      if (!ignore) {
        console.log('Fetched a list of places on "' + planetId + '".');
        setPlaceList(result);
        setPlaceId(result[0].id); // Valitse ensimmäinen paikka
      }
    });
    return () => {
      ignore = true;
    }
  }, [planetId]);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '???'} on {planetId || '???'} </p>
    </>
  );
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

Tämä koodi on hieman toistuvaa. Kuitenkaan se ei ole hyvä syy yhdistää niitä yhteen Efektiin! Jos teit tämän, sinun täytyisi yhdistää molempien Efektien riippuvuudet yhdeksi listaksi, ja sitten planeetan vaihtaminen hakisikin listan kaikista planeetoista. Efektit eivät ole työkalu koodin uudelleenkäyttöön.

Sen sijaan, välttääksesi toistoa, voit erottaa logiikan omaksi hookiksi kuten `useSelectOptions` alla:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useSelectOptions } from './useSelectOptions.js';

export default function Page() {
  const [
    planetList,
    planetId,
    setPlanetId
  ] = useSelectOptions('/planets');

  const [
    placeList,
    placeId,
    setPlaceId
  ] = useSelectOptions(planetId ? `/planets/${planetId}/places` : null);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList?.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList?.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '...'} on {planetId || '...'} </p>
    </>
  );
}
```

```js src/useSelectOptions.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export function useSelectOptions(url) {
  const [list, setList] = useState(null);
  const [selectedId, setSelectedId] = useState('');
  useEffect(() => {
    if (url === null) {
      return;
    }

    let ignore = false;
    fetchData(url).then(result => {
      if (!ignore) {
        setList(result);
        setSelectedId(result[0].id);
      }
    });
    return () => {
      ignore = true;
    }
  }, [url]);
  return [list, selectedId, setSelectedId];
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

Katso `useSelectOptions.js` välilehti hiekkalaatikosta nähdäksesi miten se toimii. Ihanteellisesti, useimmat Efektit sovelluksessasi tulisi lopulta korvata omilla hookeilla, olivat ne sitten kirjoitettu sinun tai yhteisön toimesta. Omilla hookeilla piilotetaan synkronointilogiikka, joten kutsuva komponentti ei tiedä Efektistä. Kun jatkat sovelluksesi työstämistä, kehität paletin hookkeja joista valita, ja lopulta sinun ei tarvitse kirjoittaa Efektejä komponentteihisi kovin usein.

</Solution>

</Challenges>
