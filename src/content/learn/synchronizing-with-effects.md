---
title: Synkronointi Effecteilla
---

<Intro>

Joidenkin komponenttien täytyy synkronoida ulkoisten järjestelmien kanssa. Esimerkiksi saatat haluta hallita ei-React-komponenttia perustuen Reactin tilaan, asettaa palvelinyhteyden tai lähettää analytiikkalokeja, kun komponentti näkyy näytöllä. *Effectit* mahdollistavat koodin suorittamisen renderöinnin jälkeen, jotta voit synkronoida komponentin jonkin ulkoisen järjestelmän kanssa Reactin ulkopuolella.

</Intro>

<YouWillLearn>

- Mitä Effectit ovat
- Miten Effectit eroavat tapahtumista
- Miten määrittelet Effecti komponentissasi
- Miten ohitat Effectin tarpeettoman suorittamisen
- Miksi Effectit suoritetetaan kahdesti kehitysympäristössä ja miten sen voi korjata

</YouWillLearn>

## Mitä Effectit ovat ja miten ne eroavat tapahtumista? {/*what-are-effects-and-how-are-they-different-from-events*/}

Ennen kuin siirrytään Effecteihin, tutustutaan kahdenlaiseen logiikkaan React-komponenteissa:

- **Renderöintikoodi** (esitellään [Käyttöliittymän kuvauksessa](/learn/describing-the-ui)) elää komponentin yläpuolella. Tässä on paikka missä otat propsit ja tilan, muunnet niitä ja palautat JSX:ää, jonka haluat nähdä näytöllä. [Renderöintikoodin on oltava puhdasta.](/learn/keeping-components-pure) Kuten matemaattinen kaava, sen tulisi vain _laskea_ tulos, mutta ei tehdä mitään muuta.

- **Tapahtumakäsittelijät** (esitellään [Interaktiivisuuden lisäämisessä](/learn/adding-interactivity)) ovat komponenttien sisäisiä funktioita, jotka *tekevät* asioita sen sijaan, että vain laskisivat asioita. Tapahtumakäsittelijä saattavat päivittää syöttökenttää, lähettää HTTP POST -pyyntöjä ostaakseen tuoteen tai ohjata käyttäjän toiselle näytölle. Tapahtumakäsittelijät sisältävät ["sivuvaikutuksia"](https://en.wikipedia.org/wiki/Side_effect_(computer_science)) (ne muuttavat ohjelman tilaa) ja aiheutuvat tietystä käyttäjän toiminnasta (esimerkiksi painikkeen napsauttamisesta tai kirjoittamisesta).

Joskus tämä ei riitä. Harkitse `ChatRoom` -komponenttia, jonka täytyy yhdistää keskustelupalvelimeen, kun se näkyy näytöllä. Palvelimeen yhdistäminen ei ole puhdas laskenta (se on sivuvaikutus), joten se ei voi tapahtua renderöinnin aikana. Kuitenkaan ei ole yhtä tiettyä tapahtumaa, kuten napsautusta, joka aiheuttaisi `ChatRoom` -komponentin näkymisen.

***Effectien* avulla voit määritellä sivuvaikutukset, jotka johtuvat renderöinnistä itsestään, eikä tietystä tapahtumasta.** Viestin lähettäminen keskustelussa on *tapahtuma*, koska se aiheutuu suoraan käyttäjän napsauttamasta tiettyä painiketta. Kuitenkin palvelimen yhdistäminen on *effect*, koska se on tehtävä riippumatta siitä, mikä vuorovaikutus aiheutti komponentin näkyvyyden. Effectit suoritetaan [renderöintiprosessin](/learn/render-and-commit) lopussa näytön päivityksen jälkeen. Tässä on hyvä aika synkronoida React-komponentit jonkin ulkoisen järjestelmän kanssa (kuten verkon tai kolmannen osapuolen kirjaston).

<Note>

Tässä ja myöhemmin tekstissä, "Effect":llä viittaamme Reactin määritelmään, eli sivuvaikutukseen, joka aiheutuu renderöinnistä. Viittaaksemme laajempaan ohjelmointikäsitteeseen, sanomme "sivuvaikutus".

</Note>


## Et välttämättä tarvitse Effectia {/*you-might-not-need-an-effect*/}

**Älä kiiruhda lisäämään Effecteja komponentteihisi.** Pidä mielessä, että Effectit ovat tyypillisesti tapa "astua ulos" React-koodistasi ja synkronoida jonkin *ulkoisen* järjestelmän kanssa. Tämä sisältää selaimen API:t, kolmannen osapuolen pienoisohjelmat, verkon jne. Jos Effectisi vain muuttaa tilaa perustuen toiseen tilaan, [voit ehkä jättää Effectin pois.](/learn/you-might-not-need-an-effect)

## Miten kirjoitat Effectin {/*how-to-write-an-effect*/}

Kirjoittaaksesi Effectin, seuraa näitä kolmea vaihetta:

1. **Määrittele Effect.** Oletuksena, Effectisi suoritetaan jokaisen renderöinnin jälkeen.
2. **Määrittele Effectin riippuvuudet.** Useimmat Effectit pitäisi suorittaa vain *tarvittaessa* sen sijaan, että ne suoritettaisiin jokaisen renderöinnin jälkeen. Esimerkiksi fade-in -animaatio pitäisi käynnistyä vain, kun komponentti ilmestyy. Keskusteluhuoneeseen yhdistäminen ja sen katkaisu pitäisi tapahtua vain, kun komponentti ilmestyy ja häviää tai kun keskusteluhuone muuttuu. Opit hallitsemaan tätä määrittämällä *riippuvuudet.*
3. **Lisää puhdistus, jos tarpeen.** Joidenkin Effectien täytyy määrittää, miten ne pysäytetään, peruutetaan, tai puhdistavat mitä ne ovat tehneet. Esimerkiksi "yhdistys" tarvitsee "katkaisun", "tila" tarvitsee "peruuta tilaus" ja "hae" tarvitsee joko "peruuta" tai "jätä huomiotta". Opit tekemään tämän palauttamalla *puhdistusfunktion*.

Katsotaan näitä vaiheita yksityiskohtaisesti.

### 1. Vaihe: Määrittele Effect {/*step-1-declare-an-effect*/}

Määritelläksesi Effectin komponentissasi, tuo [`useEffect` Hook](/reference/react/useEffect) Reactista:

```js
import { useEffect } from 'react';
```

Sitten kutsu sitä komponentin yläpuolella ja laita koodia Effectin sisään:

```js {2-4}
function MyComponent() {
  useEffect(() => {
    // Koodi täällä suoritetaan *jokaisen* renderöinnin jälkeen
  });
  return <div />;
}
```

Joka kerta kun komponenttisi renderöityy, React päivittää ruudun *ja sitten* suorittaa koodin `useEffect`:n sisällä. Toisin sanoen, **`useEffect` "viivästää" koodin suorittamista, kunnes renderöinti on näkyvissä ruudulla.**

Katsotaan miten voit käyttää Effectia synkronoidaksesi ulkoisen järjestelmän kanssa. Harkitse `<VideoPlayer>` React komponenttia. Olisi mukavaa kontrolloida, onko video toistossa vai pysäytettynä, välittämällä `isPlaying` propsin sille:

```js
<VideoPlayer isPlaying={isPlaying} />;
```

Sinun mukautettu `VideoPlayer` komponentti renderöi selaimen sisäänrakennetun [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) tagin:

```js
function VideoPlayer({ src, isPlaying }) {
  // TODO: tee jotain isPlaying:lla
  return <video src={src} />;
}
```

Kuitenkaan selaimen `<video>` tagissa ei ole `isPlaying` proppia. Ainoa tapa ohjata sitä on manuaalisesti kutsua [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) ja [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) metodeja DOM elementillä. **Sinun täytyy synkronoida `isPlaying` propin arvo, joka kertoo, pitäisikö video _nyt_ toistaa, imperatiivisilla kutsuilla kuten `play()` ja `pause()`.**

Meidän täytyy ensiksi hakea [ref](/learn/manipulating-the-dom-with-refs) `<video>`:n DOM noodiin.

Saattaa olla houkuttelevaa kutsua `play()` tai `pause()` metodeja renderöinnin aikana, mutta se ei ole oikein:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  if (isPlaying) {
    ref.current.play();  // Tämän kutsuminen renderöinnin aikana ei ole sallittua.
  } else {
    ref.current.pause(); // Tämä myöskin kaatuu.
  }

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

Syy miksi tämä koodi ei ole oikein on, että se koittaa tehdä jotain DOM noodilla kesken renderöinnin. Reactissa [renderöinnin tulisi olla puhdas laskelma](/learn/keeping-components-pure) JSX:stä ja sen ei tulisi sisältää sivuvaikutuksia kuten DOM:n muuttamista.

Lisäksi, kun `VideoPlayer` kutsutaan ensimmäistä kertaa, sen DOM ei vielä ole olemassa! Ei ole vielä DOM noodia josta kutsua `play()` tai `pause()` koska React ei tiedä mitä DOM:ia luoda ennen kuin palautat JSX:n.

Ratkaisu tässä on **kääriä sivuvaikutus `useEffectilla` ja siirtää se pois renderöintilaskusta:**

```js {6,12}
import { useEffect, useRef } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}
```

Käärimällä DOM päivitys Effectiin, annat Reactin päivittää ensin ruudun. Sitten Effectisi suoritetaan.

Kun `VideoPlayer` komponenttisi renderöityy (joko ensimmäistä kertaa tai jos se renderöityy uudelleen), tapahtuu muutamia asioita. Ensimmäiseksi React päivittää ruudun, varmistaen että `<video>` tagi on DOM:issa oikeilla propseilla. Sitten React suorittaa Effectisi. Lopuksi, Effectisi kutsuu `play()` tai `pause()` riippuen `isPlaying` propin arvosta.

Paina Play/Pause useita kertoja ja katso miten videoplayer pysyy synkronoituna `isPlaying` arvon kanssa:

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
  });

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

Tässä esimerkissä "ulkoinen järjestelmä" jonka kanssa synkronoit Reactin tilan oli selaimen media API. Voit käyttää samanlaista lähestymistapaa kääriäksesi legacy ei-React koodin (kuten jQuery pluginit) deklaratiivisiin React komponentteihin.

Huomaa, että videoplayerin ohjaaminen on paljon monimutkaisempaa käytännössä. `play()` kutsu voi epäonnistua, käyttäjä voi toistaa tai pysäyttää videon käyttämällä selaimen sisäänrakennettuja ohjauselementtejä, jne. Tämä esimerkki on hyvin yksinkertaistettu ja puutteellinen.

<Pitfall>

Oletuksena Effectit suoritetaan *jokaisen* renderöinnin jälkeen. Tämä on syy miksi seuraavanlainen koodi **tuottaa loputtoman silmukan:**

```js
const [count, setCount] = useState(0);
useEffect(() => {
  setCount(count + 1);
});
```

Effectit suoritetaan renderöinnin *johdosta*. Tilan asettaminen *aiheuttaa* renderöinnin. Tilan asettaminen välittömästi Effectissä on kuin pistäisi jatkojohdon kiinni itseensä. Effect suoritetaan, se asettaa tilan, joka aiheuttaa uudelleen renderöinnin, joka aiheuttaa Effectin suorittamisen, joka asettaa tilan uudelleen, joka aiheuttaa uudelleen renderöinnin, ja niin edelleen.

Effectien tulisi yleensä synkronoida komponenttisi *ulkopuolisen* järjestelmän kanssa. Jos ei ole ulkopuolista järjestelmää ja haluat vain muuttaa tilaa perustuen toiseen tilaan, [voit ehkä jättää Effectin pois.](/learn/you-might-not-need-an-effect)

</Pitfall>

### 2. Vaihe: Määrittele Effectin riippuvuudet {/*step-2-specify-the-effect-dependencies*/}

Oletuksena Effectit toistetaan *jokaisen* renderöinnin jälkeen. Usein tämä **ei ole mitä haluat:**

- Joskus, se on hidas. Synkronointi ulkoisen järjestelmän kanssa ei aina ole nopeaa, joten haluat ehkä ohittaa sen, ellei sitä ole tarpeen. Esimerkiksi, et halua yhdistää chat palvelimeen jokaisen näppäinpainalluksen jälkeen.
- Joksus, se on väärin. Esimerkiksi, et halua käynnistää komponentin fade-in animaatiota jokaisen näppäinpainalluksen jälkeen. Animaation pitäisi toistua pelkästään kerran kun komponentti ilmestyy ensimmäisellä kerralla.

Havainnollistaaksemme ongelmaa, tässä on edellinen esimerkki muutamalla `console.log` kutsulla ja tekstikentällä, joka päivittää vanhemman komponentin tilaa. Huomaa miten kirjoittaminen aiheuttaa Effectin uudelleen suorittamisen:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
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
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Voit kertoa Reactin **ohittamaan tarpeettoman Effectin uudelleen suorittamisen** määrittelemällä *riippuvuus* taulukon toisena argumenttina `useEffect` kutsulle. Aloita lisäämällä tyhjä `[]` taulukko ylläolevaan esimerkkiin riville 14:

```js {3}
  useEffect(() => {
    // ...
  }, []);
```

Sinun tulisi nähdä virhe, jossa lukee `React Hook useEffect has a missing dependency: 'isPlaying'`:

```js
  useEffect(() => {
    // ...
  }, []);
```

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  }, []); // Tämä aiheuttaa virheen

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
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
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Ongelma on, että effectin sisällä oleva koodi *riippuu* `isPlaying` propsin arvosta päättääkseen mitä tehdä, mutta tätä riippuvuutta ei ole määritelty. Korjataksesi tämän ongelman, lisää `isPlaying` riippuvuustaulukkoon:


```js {2,7}
  useEffect(() => {
    if (isPlaying) { // Sitä käytetään tässä...
      // ...
    } else {
      // ...
    }
  }, [isPlaying]); // ...joten se täytyy määritellä täällä!
```

Nyt kaikki riippuvuudet on määritelty, joten virheitä ei ole. `[isPlaying]` riippuvuustaulukon määrittäminen kertoo Reactille, että se pitäisi ohittaa Effectin uudelleen suorittaminen jos `isPlaying` on sama kuin se oli edellisellä renderöinnillä. Tämän muutoksen jälkeen, tekstikenttään kirjoittaminen ei aiheuta Effectin uudelleen suorittamista, mutta Play/Pause painikkeen painaminen aiheuttaa:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
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
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Riippuvuustaulukko voi sisältää useita riippuvuuksia. React ohittaa Effectin uudelleen suorittamisen *vain* jos *kaikki* riippuvuudet ovat samat kuin edellisellä renderöinnillä. React vertaa riippuvuuksien arvoja käyttäen [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) vertailua. Katso [`useEffect` API viittaus](/reference/react/useEffect#reference) lisätietoja varten.

**Huomaa, että et voi "valita" riippuvuuksiasi.** Jos määrittelemäsi riippuvuudet eivät vastaa Reactin odottamia riippuvuuksia, saat linter virheen. Tämä auttaa löytämään useita virheitä koodissasi. Jos Effect käyttää jotain arvoa, mutta *et* halua suorittaa Effectiä uudelleen kun se muuttuu, sinun täytyy [*muokata Effectin koodia itse* jotta se ei "tarvitse" tätä riippuvuutta.](/learn/lifecycle-of-reactive-effects#what-to-do-when-you-dont-want-to-re-synchronize)

<Pitfall>

Käyttäytyminen *ilman* riippuvuustaulukkoa ja *tyhjällä* `[]` riippuvuustaulukolla ovat hyvin erilaisia:

```js {3,7,12}
useEffect(() => {
  // Tämä suoritetaan joka kerta kun komponentti renderöidään
});

useEffect(() => {
  // Tämä suoritetaan vain mountattaessa (kun komponentti ilmestyy)
}, []);

useEffect(() => {
  // Tämä suoritetaan mountattaessa *ja myös* jos a tai b ovat
  // muuttuneet viime renderöinnin jälkeen
}, [a, b]);
```

Katsomme seuraavassa vaiheessa tarkemmin mitä "mount" tarkoittaa.

</Pitfall>

<DeepDive>

#### Miksi ref oli jätetty riippuvuustaulukosta pois? {/*why-was-the-ref-omitted-from-the-dependency-array*/}

Tämä Effecti käyttää _sekä_ `ref` että `isPlaying`:ä, mutta vain `isPlaying` on määritelty riippuvuustaulukkoon:

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);
```

Tämä tapahtuu koska `ref` oliolla on *vakaa identiteetti:* React takaa [että saat aina saman olion](/reference/react/useRef#returns) samasta `useRef` kutsusta joka renderöinnillä. Se ei koskaan muutu, joten se ei koskaan itsessään aiheuta Effectin uudelleen suorittamista. Siksi ei ole merkityksellistä onko se määritelty riippuvuustaulukkoon vai ei. Sen sisällyttäminen on myös ok:

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying, ref]);
```

`useState`:n palauttamilla [`set` funktioilla](/reference/react/useState#setstate) on myös vakaa identiteetti, joten näet usein että se jätetään riippuvuustaulukosta pois. Jos linter sallii riippuvuuden jättämisen pois ilman virheitä, se on turvallista tehdä.

Aina-vakaiden riippuvuuksien jättäminen pois toimii vain kun linter voi "nähdä", että olio on vakaa. Esimerkiksi, jos `ref` välitetään yläkomponentilta, sinun täytyy määritellä se riippuvuustaulukkoon. Kuitenkin, tämä on hyvä tehdä koska et voi tietää, että yläkomponentti välittää aina saman refin, tai välittää yhden useista refeistä ehdollisesti. Joten Effectisi _riippuisi_ siitä, mikä ref välitetään.

</DeepDive>

### 3. Vaihe: Lisää puhdistus tarvittaessa {/*step-3-add-cleanup-if-needed*/}

Harkitse hieman erilaista esimerkkiä. Kirjoitat `ChatRoom` komponenttia, jonka tarvitsee yhdistää chat palvelimeen kun se ilmestyy. Sinulle annetaan `createConnection()` API joka palauttaa olion, jossa on `connect()` ja `disconnect()` metodit. Kuinka pidät komponentin yhdistettynä kun se näytetään käyttäjälle?

Aloita kirjoittamalla Effectin logiikka:

```js
useEffect(() => {
  const connection = createConnection();
  connection.connect();
});
```

Olisi hidasta yhdistää chat -palvelimeen joka renderöinnin jälkeen, joten lisäät riippuvuustaulukon:

```js {4}
useEffect(() => {
  const connection = createConnection();
  connection.connect();
}, []);
```

**Effectin sisällä oleva koodi ei käytä yhtäkään propsia tai tilamuuttujaa, joten riippuvuustaulukkosi on `[]` (tyhjä). Tämä kertoo Reactille että suorittaa tämän koodin vain kun komponentti "mounttaa", eli näkyy ensimmäistä kertaa näytöllä.**

Kokeillaan koodin suorittamista:

<Sandpack>

```js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```

```js chat.js
export function createConnection() {
  // Oikea toteutus yhdistäisi todellisuudessa palvelimeen
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

Tämä Effecti suoritetaan vain mountissa, joten voit odottaa että `"✅ Connecting..."` tulostuu kerran konsoliin. **Kuitenkin, jos tarkistat konsolin, `"✅ Connecting..."` tulostuu kaksi kertaa. Miksi se tapahtuu?**

Kuvittele, että `ChatRoom` komponentti on osa isompaa sovellusta, jossa on useita eri näyttöjä. Käyttäjä aloittaa matkansa `ChatRoom` sivulta. Komponentti mounttaa ja kutsuu `connection.connect()`. Sitten kuvittele, että käyttäjä navigoi toiselle näytölle--esimerkiksi asetussivulle. `ChatRoom` komponentti unmounttaa. Lopuksi, käyttäjä painaa Takaisin -nappia ja `ChatRoom` mounttaa uudelleen. Tämä yhdistäisi toiseen kertaan--mutta ensimmäistä yhdistämistä ei koskaan tuhottu! Kun käyttäjä navigoi sovelluksen läpi, yhteydet kasaantuisivat.

Tämän kaltaiset bugit voivat helposti jäädä huomiotta ilman raskasta manuaalista testaamista. Helpottaaksesi näiden löytämistä, React kehitysvaiheessa remounttaa jokaisen komponentin kerran heti mountin jälkeen. **Nähdessäsi `"✅ Connecting..."` tulostuksen kahdesti, huomaat helposti ongelman: koodisi ei sulje yhteyttä kun komponentti unmounttaa.**

Korjataksesi ongelman, palauta *siivousfunktio* Effectistäsi:

```js {4-6}
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []);
```

React kutsuu siivousfunktiotasi joka kerta ennen kuin Effectia suoritetaan uudelleen, ja kerran kun komponentti unmounttaa (poistetaan). Kokeillaan mitä tapahtuu kun siivousfunktio on toteutettu:

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

```js chat.js
export function createConnection() {
  // Oikea toteutus yhdistäisi todellisuudessa palvelimeen
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

Nyt saat kolme tulostusta konsoliin kehitysvaiheessa:

1. `"✅ Connecting..."`
2. `"❌ Disconnected."`
3. `"✅ Connecting..."`

**Tämä on kehitysvaiheen oikea käyttäytyminen.** Remounttaamalla komponenttisi, React varmistaa että navigointi pois ja takaisin ei riko koodiasi. Yhdistäminen ja sitten katkaiseminen on juuri se mitä pitäisi tapahtua! Kun toteutat siivouksen hyvin, käyttäjälle ei pitäisi olla näkyvissä eroa suorittamalla Effectiä kerran vs suorittamalla se, siivoamalla se ja suorittamalla se uudelleen. Ylimääräinen yhdistys/katkaisu pari on olemassa kehitysvaiheessa, koska React tutkii koodiasi virheiden löytämiseksi. Tämä on normaalia ja sinun ei tulisi yrittää saada sitä pois.

**Tuotannossa, näkisit ainoastaan `"✅ Connecting..."` tulostuksen kerran.** Remounttaaminen tapahtuu vain kehitysvaiheessa auttaaksesi sinua löytämään Effectit, joissa on siivousfunktio. Voit kytkeä [Strict Mode:n](/reference/react/Strict-mode) pois päältä, jotta saat kehitysvaiheen toiminnon pois käytöstä, mutta suosittelemme että pidät sen päällä. Tämä auttaa sinua löytämään monia bugeja kuten yllä.

## Miten käsittelet kahdesti toistuvan Effectin kehitysvaiheessa? {/*how-to-handle-the-effect-firing-twice-in-development*/}

React tarkoituksella remounttaa komponenttisi kehitysvaiheessa auttaaksesi sinua löytämään bugeja kuten edellisessä esimerkissä. **Oikea kysymys ei ole "miten suoritan Effectin kerran", vaan "miten korjaan Effectini niin että se toimii remounttauksen jälkeen".**

Useiten vastaus on toteuttaa siivousfunktio. Siivousfunktion pitäisi pysäyttää tai peruuttaa se mitä Effect oli tekemässä. Yleinen sääntö on että käyttäjän ei pitäisi pystyä erottamaan Effectin suorittamista kerran (tuotannossa) ja _setup → cleanup → setup_ sekvenssistä (mitä näet kehitysvaiheessa).

Useimmat Effectit jotka kirjoitat sopivat yhteen alla olevista yleisistä kuvioista.

### Ei-React komponenttien ohjaaminen {/*controlling-non-react-widgets*/}

Joskus tarvitset UI pienoisohjelmia, jotka eivät ole kirjoitettu Reactiin. Esimerkiksi, sanotaan että lisäät kartta-komponentin sivullesi. Sillä on `setZoomLevel()` metodi, ja haluat pitää zoom tason synkronoituna `zoomLevel` tilamuuttujan kanssa React koodissasi. Effectisi näyttäisi tältä:

```js
useEffect(() => {
  const map = mapRef.current;
  map.setZoomLevel(zoomLevel);
}, [zoomLevel]);
```

Huomaa, että tässä tilanteessa siivousta ei tarvita. Kehitysvaiheessa React kutsuu Effectia kahdesti, mutta tässä se ei ole ongelma, koska `setZoomLevel`:n kutsuminen kahdesti samalla arvolla ei tee mitään. Se saattaa olla hieman hitaampaa, mutta tämä ei ole ongelma koska remounttaus tapahtuu kehitysvaiheessa eikä tuotannossa.

Jotkin API:t eivät salli kutsua niitä kahdesti peräkkäin. Esimerkiksi, sisäänrakennetun [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement) elementin [`showModal`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) metodi heittää virheen jos kutsut sitä kahdesti peräkkäin. Toteuta siivousfunktio, joka sulkee dialogin:

```js {4}
useEffect(() => {
  const dialog = dialogRef.current;
  dialog.showModal();
  return () => dialog.close();
}, []);
```

Kehitysvaiheessa Effectisi kutsuu `showModal()` metodia, jonka perään heti `close()`, ja sitten `showModal()` metodia uudelleen. Tämä on käyttäjälle sama kuin jos kutsuisit `showModal()` metodia vain kerran, kuten näet tuotannossa.

### Tapahtumien tilaaminen {/*subscribing-to-events*/}

Jos Effectisi tilaavat jotain, siivousfunktiosi pitäisi purkaa tilaus:

```js {6}
useEffect(() => {
  function handleScroll(e) {
    console.log(window.scrollX, window.scrollY);
  }
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

Kehitysvaiheessa Effectisi kutsuu `addEventListener()` metodia, jonka perään heti `removeEventListener()` metodia, ja sitten `addEventListener()` metodia uudelleen samalla käsittelijällä. Joten aina on vain yksi aktiivinen tilaus kerrallaan. Tämä on käyttäjälle sama kuin jos kutsuisit `addEventListener()` metodia vain kerran, kuten näet tuotannossa.

### Animaatioiden käynnistäminen {/*triggering-animations*/}

Jos Effectisi animoi jotain, siivousfunktiosi pitäisi palauttaa animaatio alkuperäiseen tilaan:

```js {4-6}
useEffect(() => {
  const node = ref.current;
  node.style.opacity = 1; // Käynnistä animaatio
  return () => {
    node.style.opacity = 0; // Palauta oletusarvoon
  };
}, []);
```

Kehitysvaiheessa läpinäkyvyys asetetaan `1`:een, sitten `0`:aan, ja sitten `1`:een uudelleen. Tämä pitäisi olla käyttäjälle sama kuin jos asettaisit sen suoraan `1`:een, joka olisi mitä tapahtuu tuotannossa. Jos käytät kolmannen osapuolen animaatiokirjastoa joka tukee tweenausta (engl. tweening), siivousfunktion pitäisi palauttaa tweenin aikajana alkuperäiseen tilaan.

### Tiedon haku {/*tiedon-haku*/}

Jos Effectisi hakee jotain, siivousfunktiosi pitäisi joko [perua haku](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) tai sivuuttaa sen tulos:

```js {2,6,13-15}
useEffect(() => {
  let ignore = false;

  async function startFetching() {
    const json = await fetchTodos(userId);
    if (!ignore) {
      setTodos(json);
    }
  }

  startFetching();

  return () => {
    ignore = true;
  };
}, [userId]);
```

Et voi "peruuttaa" verkkopyyntöä joka on jo tapahtunut, mutta siivousfunktiosi pitäisi varmistaa että pyyntö joka ei ole enää tarpeellinen ei vaikuta sovellukseesi. Esimerkiksi, jos `userId` muuttuu `'Alice'`:sta `'Bob'`:ksi, siivousfunktio varmistaa että `'Alice'` vastaus jätetään huomiotta vaikka se vastaanotettaisiin `'Bob'`:n vastauksen jälkeen.

**Kehitysvaiheessa, näet kaksi verkkopyyntöä Network välilehdellä.** Tässä ei ole mitään vikaa. Yllä olevan menetelmän mukaan, ensimmäinen Effecti poistetaan välittömästi, joten sen kopio `ignore` muuttujasta asetetaan `true`:ksi. Joten vaikka onkin ylimääräinen pyyntö, se ei vaikuta tilaan kiitos `if (!ignore)` tarkistuksen.

**Tuotannossa tulee tapahtumaan vain yksi pyyntö.** Jos kehitysvaiheessa toinen pyyntö häiritsee sinua, paras tapa on käyttää ratkaisua joka deduplikoi pyynnöt ja asettaa niiden vastaukset välimuistiin komponenttien välillä:

```js
function TodoList() {
  const todos = useSomeDataLibrary(`/api/user/${userId}/todos`);
  // ...
```

Tämä ei vain paranna kehityskokemusta, vaan myös saa sovelluksesi tuntumaan nopeammalta. Esimerkiksi, käyttäjän ei tarvitse odottaa että jotain dataa ladataan uudelleen kun painaa Takaisin -painiketta, koska se on välimuistissa. Voit joko rakentaa tällaisen välimuistin itse tai effecteissa manuaalisen datahaun sijaan käyttää jotain olemassa olevaa vaihtoehtoa. 

<DeepDive>

#### Mitkä ovat hyviä vaihtoehtoja datan hakemiseen effecteissa? {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

`fetch` kutsujen kirjoittaminen Effecteissa on [suosittu tapa hakea dataa](https://www.robinwieruch.de/react-hooks-fetch-data/), erityisesti täysin asiakaspuolen sovelluksissa. Tämä on kuitenkin hyvin manuaalinen tapa ja sillä on merkittäviä haittoja:

- **Effecteja ei ajeta palvelimella.** Tämä tarkoittaa, että palvelimella renderöity HTML sisältää vain lataus -tilan ilman dataa. Asiakkaan tietokoneen pitää ladata koko JavaScript ja renderöidä sovellus, jotta se huomaa, että nyt sen täytyy ladata dataa. Tämä ei ole erityisen tehokasta.
- **Hakeminen Effectissa tekee "verkkovesiputouksien" toteuttamisesta helppoa.** Renderöit ylemmän komponentin, se hakee jotain dataa, renderöit lapsikomponentit, ja sitten ne alkavat hakea omaa dataansa. Jos verkkoyhteys ei ole erityisen nopea, tämä on huomattavasti hitaampaa kuin jos kaikki datat haettaisiin yhtäaikaisesti.
- **Hakeminen suoraan Effecteissa useiten tarkoittaa ettet esilataa tai välimuista dataa.** Esimerkiksi, jos komponentti poistetaan ja sitten liitetään takaisin, se joutuu hakemaan datan uudelleen.
- **Se ei ole kovin ergonomista.** Pohjakoodia on aika paljon kirjoittaessa `fetch` kutsuja tavalla, joka ei kärsi bugeista kuten [kilpailutilanteista.](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)

Tämä lista huonoista puolista ei koske pelkästään Reactia. Se pätee mihin tahansa kirjastoon kun dataa haetaan mountissa. Kuten reitityksessä, datan hakeminen ei ole helppoa tehdä hyvin, joten suosittelemme seuraavia lähestymistapoja:

- **Jos käytät [frameworkia](/learn/start-a-new-react-project#building-with-a-full-featured-framework), käytä sen sisäänrakennettua datan hakemiseen tarkoitettua mekanismia.** Modernit React frameworkit sisältävät tehokkaita datan hakemiseen tarkoitettuja mekanismeja, jotka eivät kärsi yllä mainituista ongelmista.
- **Muussa tapauksessa, harkitse tai rakenna asiakaspuolen välimuisti.** Suosittuja avoimen lähdekoodin ratkaisuja ovat [React Query](https://tanstack.com/query/latest), [useSWR](https://swr.vercel.app/), ja [React Router 6.4+.](https://beta.reactrouter.com/en/main/start/overview) Voit myös rakentaa oman ratkaisusi, jolloin käytät Effecteja alustana mutta lisäät logiikkaa pyyntöjen deduplikointiin, vastausten välimuistitukseen ja verkkovesiputousten välttämiseen (esilataamalla dataa tai nostamalla datan vaatimukset reiteille).

Voit jatkaa datan hakemista suoraan Effecteissa jos nämä lähestymistavat eivät sovi sinulle.

</DeepDive>

### Analytiikan lähettäminen {/*sending-analytics*/}

Harkitse tätä koodia, joka lähettää analytiikkatapahtuman sivun vierailusta:

```js
useEffect(() => {
  logVisit(url); // Lähettää POST pyynnön
}, [url]);
```

Kehitysvaiheessa `logVisit` kutsutaan kahdesti jokaiselle URL:lle, joten saattaa olla houkuttelevaa tämän välttämistä. **Suosittelemme pitämään tämän koodin sellaisenaan.** Kuten aiemmissa esimerkeissä, ei ole *käyttäjän näkökulmasta* havaittavaa eroa siitä, ajetaanko se kerran vai kahdesti. Käytännöllisestä näkökulmasta `logVisit`:n ei tulisi tehdä mitään kehitysvaiheessa, koska et halua, että kehityskoneiden lokit vaikuttavat tuotantotilastoihin. Komponenttisi remounttaa joka kerta kun tallennat sen tiedoston, joten se lähettäisi ylimääräisiä vierailuja kehitysvaiheessa joka tapauksessa.

**Tuotannossa ei ole kaksoiskappaleita vierailulokeista.**

Analytiikkatapahtumien debuggauukseen voit joko julkaista sovelluksen testiympäristöön (joka suoritetaan tuotantotilassa) tai väliaikaisesti poistaa käytöstä [Strict Mode](/reference/react/StrictMode):n ja sen kehitysvaiheessa olevat remounttaus-tarkistukset. Voit myös lähettää analytiikkaa reitityksen tapahtumakäsittelijöistä Effectien sijaan. Entistäkin tarkemman analytiikan lähettämiseen voit käyttää [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API):a, jotka auttavat seuraamaan, mitkä komponentit ovat näkyvissä ja kuinka kauan.

### Ei ole Effect: Sovelluksen alustaminen {/*not-an-effect-initializing-the-application*/}

Jokin logiikka tulisi suorittaa vain kerran kun sovellus käynnistyy. Voit laittaa sen komponentin ulkopuolelle:

```js {2-3}
if (typeof window !== 'undefined') { // Tarkista suoritetaanko selaimessa
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

Tämä takaa, että tällainen logiikka suoritetaan vain kerran selaimen lataamisen jälkeen.

### Ei ole Effect: Tuotteen ostaminen {/*not-an-effect-buying-a-product*/}

Joksus, vaikka kirjoittaisit siivousfunktion, ei ole tapaa estää käyttäjälle näkyviä seurauksia Effectin kahdesti suorittamisesta. Esimerkiksi, joskus Effecti voi lähettää POST pyynnön kuten tuotteen ostamisen:

```js {2-3}
useEffect(() => {
  // 🔴 Väärin: Tämä Effecti suoritetaan kahdesti tuotannossa, paljastaen ongelman koodissa.
  fetch('/api/buy', { method: 'POST' });
}, []);
```

Et halua ostaa tuotetta kahdesti. Kuitenkin, tämä on myös syy miksi et halua laittaa tätä logiikkaa Effectiin. Mitä jos käyttäjä menee toiselle sivulle ja tulee takaisin? Effectisi suoritetaan uudelleen. Et halua ostaa tuotetta koska käyttäjä *vieraili* sivulla; haluat ostaa sen kun käyttäjä *painaa* Osta -nappia.

Ostaminen ei aiheutunut renderöinnin takia. Se aiheutuu tietyn vuorovaikutuksen takia. Se suoritetaan vain kerran koska vuorovaikutus (napsautus) tapahtuu vain kerran. **Poista Effecti ja siirrä `/api/buy` pyyntö Osta -painkkeen tapahtumakäsittelijään:**

```js {2-3}
  function handleClick() {
    // ✅ Ostaminen on tapahtuma, koska se aiheutuu tietyn vuorovaikutuksen seurauksena.
    fetch('/api/buy', { method: 'POST' });
  }
```

**Tämä osoittaa, että jos remounttaus rikkoo sovelluksen logiikkaa, tämä usein paljastaa olemassa olevia virheitä.** Käyttäjän näkökulmasta, sivulla vierailu ei pitäisi olla sen erilaisempaa kuin vierailu, linkin napsautus ja sitten Takaisin -painikkeen napsauttaminen. React varmistaa, että komponenttisi eivät riko tätä periaatetta kehitysvaiheessa remounttaamalla niitä kerran.

## Laitetaan kaikki yhteen {/*putting-it-all-together*/}

Tämä hiekkalaatikko voi auttaa "saamaan tunteen" siitä, miten Effectit toimivat käytännössä.

Tämä esimerkki käyttää [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout) funktiota aikatauluttaakseen konsolilokiin syötetyn tekstin ilmestyvän kolmen sekunnin kuluttua Effectin suorittamisen jälkeen. Siivoamisfunktio peruuttaa odottavan aikakatkaisun. Aloita painamalla "Mount the component":

<Sandpack>

```js
import { useState, useEffect } from 'react';

function Playground() {
  const [text, setText] = useState('a');

  useEffect(() => {
    function onTimeout() {
      console.log('⏰ ' + text);
    }

    console.log('🔵 Schedule "' + text + '" log');
    const timeoutId = setTimeout(onTimeout, 3000);

    return () => {
      console.log('🟡 Cancel "' + text + '" log');
      clearTimeout(timeoutId);
    };
  }, [text]);

  return (
    <>
      <label>
        What to log:{' '}
        <input
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </label>
      <h1>{text}</h1>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Unmount' : 'Mount'} the component
      </button>
      {show && <hr />}
      {show && <Playground />}
    </>
  );
}
```

</Sandpack>

Näet aluksi kolme eri lokia: `Schedule "a" log`, `Cancel "a" log`, ja `Schedule "a" log` uudelleen. Kolme sekuntia myöhemmin lokiin ilmestyy viesti `a`. Kuten opit aiemmin tällä sivulla, ylimääräinen schedule/cancel pari tapahtuu koska **React remounttaa komponentin kerran kehitysvaiheessa varmistaakseen, että olet toteuttanut siivouksen hyvin.**

Nyt muokkaa syöttölaatikon arvoksi `abc`. Jos teet sen tarpeeksi nopeasti, näet `Schedule "ab" log` viestin, jonka jälkeen `Cancel "ab" log` ja `Schedule "abc" log`. **React siivoaa aina edellisen renderöinnin Effectin ennen seuraavan renderöinnin Effectiä.** Tämä on syy miksi vaikka kirjoittaisit syöttölaatikkoon nopeasti, aikakatkaisuja on aina enintään yksi kerrallaan. Muokkaa syöttölaatikkoa muutaman kerran ja katso konsolia saadaksesi käsityksen siitä, miten Effectit siivotaan.

Kirjoita jotain syöttölaatikkoon ja heti perään paina "Unmount the component". **Huomaa kuinka unmounttaus siivoaa viimeisen renderöinnin Effectin.** Tässä esimerkissä se tyhjentää viimeisen aikakatkaisun ennen kuin se ehtii käynnistyä.

Lopuksi, muokkaa yllä olevaa komponenttia ja **kommentoi siivousfunktio**, jotta ajastuksia ei peruuteta. Kokeile kirjoittaa `abcde` nopeasti. Mitä odotat tapahtuvan kolmen sekuntin kuluttua? Tulisiko `console.log(text)` aikakatkaisussa tulostamaan *viimeisimmän* `text`:n ja tuottamaan viisi `abcde` lokia? Kokeile tarkistaaksesi intuitiosi!

Kolmen sekuntin jälkeen lokeissa tulisi näkyä (`a`, `ab`, `abc`, `abcd`, ja `abcde`) viiden `abcde` lokin sijaan. **Kukin Effecti nappaa `text`:n arvon vastaavasta renderöinnistä.** Se ei ole väliä, että `text` tila muuttui: Effecti renderöinnistä `text = 'ab'` näkee aina `'ab'`. Toisin sanottuna, Effectit jokaisesta renderöinnistä ovat toisistaan erillisiä. Jos olet kiinnostunut siitä, miten tämä toimii, voit lukea [closureista](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures).

<DeepDive>

#### Kullakin renderillä on sen omat Effectit {/*each-render-has-its-own-effects*/}

Voit ajatella `useEffect`:ia "liittävän" palan toiminnallisuutta osana renderöinnin tulosta. Harkitse tätä Effectiä:

```js
export default function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to {roomId}!</h1>;
}
```

Katsotaan mitä oikeasti tapahtuu kun käyttäjä liikkuu sovelluksessa.

#### Alustava renderöinti {/*initial-render*/}

Käyttäjä vierailee `<ChatRoom roomId="general" />`. Katsotaan [mielikuvitustilassa](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) `roomId` arvoksi `'general'`:

```js
  // JSX ensimäisellä renderöinnillä (roomId = "general")
  return <h1>Welcome to general!</h1>;
```

**Effecti on *myös* osa renderöinnin tulosta.** Ensimmäisen renderöinnin Effecti muuttuu:

```js
  // Effecti ensimäisellä renderöinnillä (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // Riippuvuudet ensimäisellä renderöinnillä (roomId = "general")
  ['general']
```

React suorittaa tämän Effectin, joka yhdistää `'general'` keskusteluhuoneeseen.

#### Uudelleen renderöinti samoilla riippuvuuksilla {/*re-render-with-same-dependencies*/}

Sanotaan, että `<ChatRoom roomId="general" />` renderöidään uudelleen. JSX tuloste pysyy samana:

```js
  // JSX toisella renderöinnillä (roomId = "general")
  return <h1>Welcome to general!</h1>;
```

React näkee, että renderöinnin tuloste ei ole muuttunut, joten se ei päivitä DOM:ia.

Effecti toiselle renderöinnille näyttää tältä:

```js
  // Effecti toisella renderöinnillä (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // Riippuvuudet toisella renderöinnillä (roomId = "general")
  ['general']
```

React vertaa `['general']`:a toiselta renderöinniltä ensimmäisen renderöinnin `['general']` kanssa. **Koska kaikki riippuvuudet ovat samat, React *jättää huomiotta* toisen renderöinnin Effectin.** Sitä ei koskaan kutsuta.

#### Uudelleen renderöinti eri riippuvuuksilla {/*re-render-with-different-dependencies*/}

Sitten, käyttäjä vierailee `<ChatRoom roomId="travel" />`. Tällä kertaa komponentti palauttaa eri JSX:ää:

```js
  // JSX kolmannella renderöinnillä (roomId = "travel")
  return <h1>Welcome to travel!</h1>;
```

React päivittää DOM:in muuttamalla `"Welcome to general"` lukemaan `"Welcome to travel"`.

Effecti kolmannelle renderöinnille näyttää tältä:

```js
  // Effecti kolmannella renderöinnillä (roomId = "travel")
  () => {
    const connection = createConnection('travel');
    connection.connect();
    return () => connection.disconnect();
  },
  // Riippuvuudet kolmannella renderöinnillä (roomId = "travel")
  ['travel']
```

React vertaa `['travel']`:ia kolmannelta renderöinniltä toiselta renderöinnin `['general']` kanssa. Yksi riippuvuus on erilainen: `Object.is('travel', 'general')` on `false`. Effectiä ei voi jättää huomiotta.

**Ennen kuin React voi ottaa käyttöön kolmannen renderöinnin Effectin, sen täytyy siivota viimeisin Effecti joka _suoritettiin_.** Toisen renderöinnin Effecti ohitettiin, joten Reactin täytyy siivota ensimmäisen renderöinnin Effecti. Jos selaat ylös ensimmäiseen renderöintiin, näet että sen siivous kutsuu `createConnection('general')`:lla luodun yhteyden `disconnect()` metodia. Tämä irroittaa sovelluksen `'general'` keskusteluhuoneesta.

Sen jälkeen React suorittaa kolmannen renderöinnin Effectin. Se yhdistää sovelluksen `'travel'` keskusteluhuoneeseen.

#### Unmount {/*unmount*/}

Lopuksi, sanotaan, että käyttäjä siirtyy pois ja `ChatRoom` komponentti unmounttaa. React suorittaa viimeisen Effectin siivousfunktion. Viimeinen Effecti oli kolmannen renderöinnin. Kolmannen renderöinnin siivousfunktio tuhoaa `createConnection('travel')` yhteyden. Joten sovellus irroittaa itsensä `'travel'` keskusteluhuoneesta.

#### Kehitysvaiheen käyttäytymiset {/*development-only-behaviors*/}

Kun [Strict Mode](/reference/react/StrictMode) on käytössä, React remounttaa jokaisen komponentin kerran mountin jälkeen (tila ja DOM säilytetään). Tämä [helpottaa löytämään Effecteja jotka tarvitsevat siivousfunktiota](#step-3-add-cleanup-if-needed) ja paljastaa bugeja kuten kilpailutilanteita (engl. race conditions). Lisäksi, React remounttaa Effectit joka kerta kun tallennat tiedoston kehitysvaiheessa. Molemmat näistä käyttäytymisistä tapahtuu ainoastaan kehitysvaiheessa.

</DeepDive>

<Recap>

- Toisin kuin tapahtumat, Effectit aiheutuvat renderöinnin seurauksena tietyn vuorovaikutuksen sijaan.
- Effectien avulla voit synkronoida komponentin jonkin ulkoisen järjestelmän kanss (kolmannen osapuolen API:n, verkon, jne.).
- Oletuksena, Effectit suoritetaan jokaisen renderöinnin jälkeen (mukaan lukien ensimmäinen renderöinti).
- React ohittaa Effectin jos kaikki sen riippuvuudet ovat samat kuin viimeisellä renderöinnillä.
- Et voi "valita" riippuvuuksiasi. Ne määräytyvät Effectin sisällä olevan koodin mukaan.
- Tyhjä riippuvuustaulukko (`[]`) vastaa komponentin "mounttaamista", eli sitä kun komponentti lisätään näytölle.
- Kun Strict Mode on käytössä, React mounttaa komponentit kaksi kertaa (vain kehitysvaiheessa!) stressitestataksesi Effecteja.
- Jos Effecti rikkoutuu remountin takia, sinun täytyy toteuttaa siivousfunktio.
- React kutsuu siivousfunktiota ennen kuin Effectiasi suoritetaan seuraavan kerran, ja unmountin yhteydessä.

</Recap>

<Challenges>

#### Kohdenna kenttään mountattaessa {/*focus-a-field-on-mount*/}

Tässä esimerkissä, lomake renderöi `<MyInput />` komponentin.

Käytä inputin [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) metodia, jotta `MyInput` komponentti automaattisesti kohdentuu kun se ilmestyy näytölle. Alhaalla on jo kommentoitu toteutus, mutta se ei toimi täysin. Selvitä miksi se ei toimi ja korjaa se. (Jos olet tutustunut `autoFocus` attribuuttiin, kuvittele, että sitä ei ole olemassa: me toteutamme saman toiminnallisuuden alusta alkaen.)

<Sandpack>

```js MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  // TODO: Tämä ei ihan toimi. Korjaa se.
  // ref.current.focus()    

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your name:
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Make it uppercase
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>


Tarkistaaksesi, että ratkaisusi toimii, paina "Show form" ja tarkista, että kenttä kohdentuu (se muuttuu korostetuksi ja kursori asettuu siihen). Paina "Hide form" ja "Show form" uudelleen. Tarkista, että kenttä on korostettu uudelleen.

`MyInput` pitäisi kohdentua _mounttauksen yhteydessä_ eikä jokaisen renderöinnin jälkeen. Varmistaaksesi, että toiminnallisuus on oikein, paina "Show form":ia ja sitten paina toistuvasti "Make it uppercase" valintaruutua. Valintaruudun klikkaaminen ei pitäisi kohdentaa kenttää yllä.

<Solution>

`ref.current.focus()` kutsuminen renderöinnin aikana on väärin, koska se on *sivuvaikutus*. Sivuvaikutukset pitäisi sijoittaa tapahtumankäsittelijöihin tai määritellä `useEffect`:n avulla. Tässä tapauksessa sivuvaikutus on *aiheutettu* komponentin ilmestymisestä, eikä mistään tietystä vuorovaikutuksesta, joten on järkevää sijoittaa se Effectiin.

Korjataksesi virheen, sijoita `ref.current.focus()` kutsu Effectin määrittelyyn. Sitten, varmistaaksesi, että tämä Effect suoritetaan vain mounttauksen yhteydessä eikä jokaisen renderöinnin jälkeen, lisää siihen tyhjä `[]` riippuvuustaulukko.

<Sandpack>

```js MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your name:
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Make it uppercase
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

</Solution>

#### Kohdenna kenttä ehdollisesti {/*focus-a-field-conditionally*/}

Tämä lomake renderöi kaksi `<MyInput />` -komponenttia.

Paina "Show form" ja huomaa, että toinen kenttä kohdentuu automaattisesti. Tämä johtuu siitä, että molemmat `<MyInput />` -komponentit yrittävät kohdentaa kentän sisällä. Kun kutsut `focus()` -funktiota kahdelle syöttökentälle peräkkäin, viimeinen aina "voittaa".

Sanotaan, että haluat kohdentaa ensimmäisen kentän. Nyt ensimmäinen `<MyInput />` -komponentti saa boolean-arvon `shouldFocus` -propsin arvolla `true`. Muuta logiikkaa siten, että `focus()` -funktiota kutsutaan vain, jos `MyInput` -komponentti saa `shouldFocus` -propsin arvolla `true`.

<Sandpack>

```js MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  // TODO: kutsu focus():a vain jos shouldFocus on tosi.
  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your first name:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Enter your last name:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

Tarkistaaksesi ratkaisun, paina "Show form" ja "Hide form" toistuvasti. Kun lomake tulee näkyviin, vain *ensimmäisen* kentän tulisi kohdistua. Tämä johtuu siitä, että vanhemman komponentin renderöimä ensimmäinen syöttökenttä saa `shouldFocus={true}` ja toinen syöttökenttä saa `shouldFocus={false}` -propsin. Tarkista myös, että molemmat kentät toimivat edelleen ja voit kirjoittaa molempiin.

<Hint>

Et voi määritellä Effectia ehdollisesti, mutta Effect voi sisältää ehtologiikkaa.

</Hint>

<Solution>

Laita ehdollinen logiikka Effectin sisään. Sinun täytyy määrittää `shouldFocus` -propsi riippuvuudeksi, koska käytät sitä Effectin sisällä. (Tämä tarkoittaa sitä, että jos jonkin syöttökentän `shouldFocus` -propsi muuttuu arvosta `false` arvoon `true`, se kohdistuu komponentin mounttaamisen jälkeen.)

<Sandpack>

```js MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    if (shouldFocus) {
      ref.current.focus();
    }
  }, [shouldFocus]);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your first name:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Enter your last name:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

</Solution>

#### Korjaa ajastin joka käynnistyy kahdesti {/*fix-an-interval-that-fires-twice*/}

Tämä `Counter` komponentti näyttää laskurin, jonka pitäisi kasvaa joka sekunti. Mounttauksen yhteydessä se kutsuu [`setInterval`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval):ia. Tämä aiheuttaa `onTick` -funktion suorittamisen joka sekunti. `onTick` -funktio kasvattaa laskuria.

Kuitenkin, sen sijaan, että se kasvaisi kerran sekunnissa, se kasvaa kahdesti. Miksi? Etsi vian syy ja korjaa se.

<Hint>

Pidä mielessä, että `setInterval` palauttaa ajastimen ID:n, jonka voit antaa [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval):lle pysäyttääksesi ajastimen.

</Hint>

<Sandpack>

```js Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    setInterval(onTick, 1000);
  }, []);

  return <h1>{count}</h1>;
}
```

```js App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function Form() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} counter</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

<Solution>

Kun [Strict Mode](/reference/react/StrictMode) on päällä (kuten tällä sivuilla olevissa hiekkalaatikoissa), React remounttaa jokaisen komponentin kerran kehitysvaiheessa. Tämä aiheuttaa ajastimen asettamisen kahdesti, ja tämä on syy siihen, miksi laskuri kasvaa joka sekunti kahdesti.

Kuitenkin, Reactin käyttäytyminen ei ole *syy* bugiin: bugi oli jo olemassa koodissa. Reactin käyttäytymienn tekee bugista huomattavamma. Oikea syy on se, että tämä Effect käynnistää prosessin, mutta ei tarjoa tapaa sen siivoamiseen.

Korjataksesi tämän koodin, tallenna `setInterval`:n palauttama ajastimen ID, ja toteuta siivousfunktio [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval):illa:

<Sandpack>

```js Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    const intervalId = setInterval(onTick, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return <h1>{count}</h1>;
}
```

```js App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} counter</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

Kehitysvaiheessa, React remounttaa komponentin kerran varmistaakseen, että olet toteuttanut siivouksen oikein. Joten siellä on `setInterval` -kutsu, jonka perään heti `clearInterval`, ja `setInterval` uudelleen. Tuotantovaiheessa, siellä on vain yksi `setInterval` -kutsu. Käyttäjälle näkyvä käyttäytyminen molemmissa tapauksissa on sama: laskuri kasvaa kerran sekunnissa.

</Solution>

#### Korjaa haku Effectin sisällä {/*fix-fetching-inside-an-effect*/}

Tämä komponentti näyttää valitun henkilön biografian. Se lataa biografian kutsumalla asynkronista funktiota `fetchBio(person)` mountissa ja aina kun `person` muuttuu. Tämä asynkroninen funktio palauttaa [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise):n, joka muuttuu merkkijonoksi. Kun haku on valmis, se kutsuu `setBio`:a näyttääkseen merkkijonon valintalaatikon alla.

<Sandpack>

```js App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    setBio(null);
    fetchBio(person).then(result => {
      setBio(result);
    });
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}

```

</Sandpack>

Tässä koodissa on bugi. Aloita valitsemalla "Alice". Sitten valitse "Bob" ja heti sen jälkeen, että valitse "Taylor". Jos teet tämän tarpeeksi nopeasti, huomaat bugin: Taylor on valittuna, mutta kappaleen alla sanotaan "This is Bob's bio."

Miksi tämä tapahtuu? Korjaa bugi Effectin sisällä.

<Hint>

Jos Effecti kutsuu jotain asynkronisesti, se tarvitsee siivouksen.

</Hint>

<Solution>

Käynnistääksesi bugin, asioiden on tapahduttava tässä järjestyksessä:

- `'Bob'`:n valita käynnistää `fetchBio('Bob')`
- `'Taylor'`:n valinta käynnistää `fetchBio('Taylor')`
- **`'Taylor'` hakeminen suoriutuu loppuun *ennen* `'Bob'`:n hakua**
- `'Taylor'` renderin Effecti kutsuu `setBio('This is Taylor’s bio')`
- `'Bob'`:n haku suoriutuu loppuun
- `'Bob'` renderin Effecti kutsuu `setBio('This is Bob’s bio')`

Tämä on syy miksi näet Bobin bion vaikka Taylor on valittuna. Tämän kaltaisia bugeja kutsutaan [kilpailutilanteiksi (engl. race condition)](https://en.wikipedia.org/wiki/Race_condition) koska kaksi asynkronista operaatiota "kilpailevat" toistensa kanssa, ja ne saattavat saapua odottamattomassa järjestyksessä.

Korjataksesi tämän kilpailutilanteen, lisää siivousfunktio:

<Sandpack>

```js App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}

```

</Sandpack>

Kunkin renderin Effectilla on sen oma `ignore` muuttuja. Aluksi, `ignore` muuttuja on `false`. Kuitenkin, jos Effecti siivotaan (kuten kun valitset eri henkilön), sen `ignore` muuttuja muuttuu `true`:ksi. Nyt ei ole väliä millä järjestyksellä pyynnöt suoriutuvat. Vain viimeisen henkilön Effectillä on `ignore` muuttuja on asetettu `false`:ksi, joten se kutsuu `setBio(result)`:ia. Menneet Effectit on siivottu, joten `if (!ignore)` tarkistus estää ne kutsumasta `setBio`:

- `'Bob'`:n valita käynnistää `fetchBio('Bob')`
- - `'Taylor'`:n valinta käynnistää `fetchBio('Taylor')` **ja siivoaa edellisen (Bobin) Effectin**
- `'Taylor'` hakeminen suoriutuu loppuun *ennen* `'Bob'`:n hakua
- `'Taylor'` renderin Effecti kutsuu `setBio('This is Taylor’s bio')`
- `'Bob'`:n haku suoriutuu loppuun
- `'Bob'` renderin Effecti kutsuu `setBio('This is Bob’s bio')` **eikä tee mitään koska sen `ignore` muuttuja on asetettu `true`:ksi**

Vanhentuneen API kutsun tuloksen ohittamisen lisäksi, voit myös käyttää [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController):a peruuttaaksesi pyynnöt jotka eivät ole enää tarpeen. Kuitenkin, tämä ei ole tarpeeksi suojataksesi kilpailutilanteita vastaan. Asynkronisia vaiheita voisi olla ketjutettu pyynnön jälkeen lisää, joten luotettavin tapa korjata tällaisia ongelmia on käyttämällä selkeää ehtoa kuten `ignore` muuttujaa.

</Solution>

</Challenges>

