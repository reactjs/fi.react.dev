---
title: 'Arvoihin viittaaminen Refillä'
---

<Intro>

Kun haluat komponentin "muistavan" jotain tietoa, mutta et halua tiedon [triggeröivän uudelleenrenderöintiä](/learn/render-and-commit), voit käyttää *refiä*.

</Intro>

<YouWillLearn>

- Miten lisätä ref komponenttiisi
- Miten päivittää refin arvo
- Miten refit eroavat tilasta
- Miten käyttää refiä turvallisesti

</YouWillLearn>

## Refin lisääminen komponenttiisi {/*adding-a-ref-to-your-component*/}

Voit lisätä refin komponenttiisi importaamalla `useRef` Hookin Reactista:

```js
import { useRef } from 'react';
```

Komponenttisi sisällä kutsu `useRef` hookkia ja välitä oletusarvo, jota haluat viitata ainoana argumenttina. Esimerkiksi, tässä on ref arvolla `0`:

```js
const ref = useRef(0);
```

`useRef` palauttaa seuraavanlaisen olion:

```js
{ 
  current: 0 // Arvo, jonka välitit useRef funktiolle
}
```

<Illustration src="/images/docs/illustrations/i_ref.png" alt="Nuoli jossa on 'current' kirjoitettuna, joka on sijoitettu taskuun jossa on 'ref' kirjoitettuna." />

Pääset käsiksi nykyiseen refin arvoon `ref.current` ominaisuuden kautta. Tämä arvo on tarkoituksella muokattavissa, eli voit sekä lukea että kirjoittaa siihen. Se on kuin salainen tasku komponentissasi, jota React ei seuraa. (Tämä on se mikä tekee refistä "pelastusluukun" Reactin yksisuuntaisesta datavirtauksesta--josta alla lisää!)

Täss, painike kasvattaa `ref.current` arvoa joka kerta kun sitä painetaan:

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

Ref osoittaa numeroon, mutta, kuten [tila](/learn/state-a-components-memory), voit viitata mihin tahansa: merkkijonoon, olioon tai jopa funktioon. Tilaan verrattuna, ref on tavallinen JavaScript-olio, jolla on `current`-ominaisuus, jota voit lukea ja muokata.

Huomaa, että **komponentti ei renderöidy uudelleen joka kerta kun arvo kasvaa.** Kuten tila, refit säilyvät Reactin uudelleenrenderöintien välillä. Kuitenkin, tilan asettaminen uudelleenrenderöi komponentin. Refin päivittäminen ei!

## Esimerkki: sekuntikellon rakentaminen {/*example-building-a-stopwatch*/}

Voit yhdistää refin ja tilan samaan komponenttiin. Esimerkiksi, tehdään sekuntikello, jonka käyttäjä voi käynnistää tai pysäyttää nappia painamalla. Jotta voidaan näyttää kuinka paljon aikaa on kulunut siitä kun käyttäjä on painanut "Start" nappia, sinun täytyy pitää kirjaa siitä milloin käyttäjä painoi "Start" nappia ja mitä nykyinen aika on. **Tätä tietoa käytetään renderöinnissä, joten pidä se tilassa:**

```js
const [startTime, setStartTime] = useState(null);
const [now, setNow] = useState(null);
```

Kun käyttäjä painaa "Start", käytät [`setInterval`](https://developer.mozilla.org/docs/Web/API/setInterval) funktiota päivittääksesi ajan joka 10 millisekuntin välien:

<Sandpack>

```js
import { useState } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);

  function handleStart() {
    // Aloita laskeminen.
    setStartTime(Date.now());
    setNow(Date.now());

    setInterval(() => {
      // Päivitä tämänhetkinen aika joka 10ms välein.
      setNow(Date.now());
    }, 10);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Start
      </button>
    </>
  );
}
```

</Sandpack>

Kun "Stop" nappia painetaan, sinun täytyy peruuttaa olemassa oleva ajastin, jotta se lopettaa `now` tilamuuttujan päivittämisen. Voit tehdä tämän kutsumalla [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval) funktiota, mutta sinun täytyy antaa sille ajastimen ID, joka palautettiin aiemmin `setInterval` kutsun kautta kun käyttäjä painoi "Start". Sinun täytyy pitää ajastimen ID jossain. **Koska ajastimen ID:tä ei käytetä renderöinnissä, voit pitää sen refissä:**

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Start
      </button>
      <button onClick={handleStop}>
        Stop
      </button>
    </>
  );
}
```

</Sandpack>

Kun tietoa käytetään renderöinnissä, pidä se tilassa. Kun tietoa tarvitaan vain tapahtumankäsittelijöissä ja sen muuttaminen ei vaadi uudelleenrenderöintiä, refin käyttäminen voi olla tehokkaampaa.

## Refin ja tilan erot {/*differences-between-refs-and-state*/}

Ehkäpä ajattelet, että refit vaikuttavat vähemmän "tiukilta" kuin tila—voit muokata niitä tilan asettamisfunktion käyttämisen sijaan. Mutta useimmissa tapauksissa haluat käyttää tilaa. Refit ovat "pelastusluukku", jota et tarvitse usein. Tässä on miten tila ja refit vastaavat toisiaan:

| ref                                                                                           | tila                                                                                                                          |
| --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `useRef(initialValue)` palauttaa `{ current: initialValue }`                                  | `useState(initialValue)` palauttaa tilamuuttujan nykyisen arvon ja tilan asetusfunktion ( `[value, setValue]`)                |
| Ei triggeröi uudelleenrenderöintiä kun muutat sitä.                                           | Triggeröi uudelleenrenderöinnin kun muutat sitä.                                                                              |
| Mutatoitavissa—voit muokata ja päivittää `current`:n arvoa renderöintiprosessin ulkopuolella. | Ei-mutatoitavissa—sinun täytyy käyttää tilan asetusfunktiota muokataksesi tilamuuttujaa jonottaaksesi uudelleenrenderöinti.   |
| Sinuun ei tulisi lukea (tai kirjoittaa) `current` arvoa kesken renderöinnin. | Voit lukea tilaa koska tahansa. Kuitenkin, jokaisella renderöinnillä on oma [tilakuvansa](/learn/state-as-a-snapshot) tilasta, joka ei muutu.  |

Tässä on laskuri-painike, joka on toteutettu tilalla:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You clicked {count} times
    </button>
  );
}
```

</Sandpack>

Koska `count` arvo näytetään, on järkevää käyttää tilaa arvon tallentamiseen. Kun laskurin arvo asetetaan `setCount()` funktiolla, React renderöi komponentin uudelleen ja ruutu päivittyy vastaamaan uutta arvoa.

Jos yrität toteuttaa tämän refillä, React ei koskaan renderöi komponenttia uudelleen, joten et koskaan näe laskurin arvon muuttuvan! Katso miten tämän painikkeen klikkaaminen **ei päivitä sen tekstiä**:

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let countRef = useRef(0);

  function handleClick() {
    // Tämä ei uudeleenrenderöi komponenttia!
    countRef.current = countRef.current + 1;
  }

  return (
    <button onClick={handleClick}>
      You clicked {countRef.current} times
    </button>
  );
}
```

</Sandpack>

Tämä on syy miksi refin `current` arvon lukeminen renderöinnin aikana johtaa epäluotettavaan koodiin. Jos tarvitset tätä, käytä tilaa sen sijaan.

<DeepDive>

#### Miten useRef toimii? {/*how-does-use-ref-work-inside*/}

Vaikka sekä `useState` että `useRef` on tarjottu Reactin puolesta, periaatteessa `useRef` voitaisiin toteuttaa `useState`:n päälle. Voit kuvitella, että Reactin sisällä `useRef` on toteutettu näin:

```js
// Reactin sisällä
function useRef(initialValue) {
  const [ref, unused] = useState({ current: initialValue });
  return ref;
}
```

Ensimmäisen renderöinnin aikana, `useRef` palauttaa `{ current: initialValue }`. Tämä olio tallennetaan Reactin puolelle, joten seuraavalla renderöinnillä sama olio palautetaan. Huomaa, että tilan asetusfunktiota ei käytetä tässä esimerkissä. Se on tarpeeton, koska `useRef`:n tarvitsee aina palauttaa sama olio!

React tarjoaa sisäänrakennetun version `useRef`:sta koska se on tarpeeksi yleinen. Mutta voit ajatella sitä tavallisena tilamuuttujana ilman asetusfunktiota. Jos olet tutustunut olio-ohjelmointiin, refit voivat muistuttaa sinua instanssimuuttujista, mutta `this.something` sijaan kirjoitat `somethingRef.current`.

</DeepDive>

## Milloin käyttää refiä {/*when-to-use-refs*/}

Tyypillisesti, käytät refiä kun komponenttisi täytyy "astua Reactin ulkopuolelle" ja kommunikoida ulkoisten rajapintojen kanssa—usein selaimen API:n, joka ei vaikuta komponentin ulkonäköön. Tässä on muutamia näitä harvinaisia tilanteita:

- Tallentaakseen [ajastimen ID:t](https://developer.mozilla.org/docs/Web/API/setTimeout)
- Tallentaakseen ja muokatakseen [DOM elementtejä](https://developer.mozilla.org/docs/Web/API/Element), joita käsittelemme [seuraavalla sivulla](/learn/manipulating-the-dom-with-refs)
- Tallentaakseen muita oliota, jotka eivät ole tarpeellisia JSX:n laskemiseen.

Jos komponenttisi tarvitsee tallentaa arvoa, mutta se ei vaikuta renderöinnin logiikkaan, valitse ref.

## Parhaat käytännöt refille {/*best-practices-for-refs*/}

Following these principles will make your components more predictable:
Näitä periaatteita noudattaen komponenteistasi tulee ennakoitavampia:

- **Käsittele refejä kuten pelastusluukkua.** Refit ovat hyödyllisiä kun työskentelet ulkoisten järjestelmien tai selaimen API:n kanssa. Jos suuri osa sovelluksesi logiikasta ja datavirtauksesta riippuu refeistä, saatat haluta miettiä lähestymistapaasi uudelleen.
- **Älä lue tai kirjoita `ref.current`:iin kesken renderöinnin.** Jos jotain tietoa tarvitaan kesken renderöinnin, käytä [tilaa](/learn/state-a-components-memory) sen sijaan. Koska React ei tiedä milloin `ref.current` muuttuu, jopa sen lukeminen renderöinnin aikana tekee komponenttisi käyttäytymisestä vaikeasti ennakoitavaa. (Ainoa poikkeus tähän on koodi kuten `if(!ref.current) ref.current = new Thing()` joka asettaa refin vain kerran ensimäisellä renderöinnillä.)

Reactin tilan rajoitukset eivät päde refiin. Esimerkiksi tila toimii [tilannekuvana jokaiselle renderöinnille](/learn/state-as-a-snapshot) ja [se ei päivity synkronisesti.](/learn/queueing-a-series-of-state-updates) Mutta kun muokkaat refin nykyistä arvoa, se muuttuu välittömästi:

```js
ref.current = 5;
console.log(ref.current); // 5
```

Tämä johtuu siitä, että **ref on tavallinen JavaScript olio**, joten se käyttäytyy samoin.

Sinun ei myöskään tarvitse huolehtia [mutaatioiden välttämistä](/learn/updating-objects-in-state), kun työskentelet refin kanssa. Jos olio, jota muutat ei ole käytössä renderöinnissä, React ei välitä mitä teet refin tai sen sisällön kanssa.

## Ref ja DOM {/*refs-and-the-dom*/}

Voit osoittaa refin mihin tahansa arvoon. Kuitenkin yleisin käyttökohde refille on DOM elementin käsittely. Esimerkiksi, tämä on kätevää jos haluat focusoida syöttölaatikon ohjelmakoodissa. Kun annat refin `ref`-attribuuttiin JSX:ssä, kuten `<div ref={myRef}>`, React asettaa vastaavan DOM elementin `myRef.current`:iin. Voit lukea lisää tästä [Manipulating the DOM with Refs.](/learn/manipulating-the-dom-with-refs)

<Recap>

- Refit ovat pelastusluukku arvojen pitämiseen, jotka eivät ole käytössä renderöinnissä. Et tarvitse niitä usein.
- Ref on perus JavaScript-olio, jolla on yksi ominaisuus nimeltään `current`, jonka voit lukea tai asettaa.
- Voit pyytää Reactia antamaan sinulle refin kutsumalla `useRef` Hookia.
- Kuten tila, refit antavat sinun säilyttää tietoa komponentin uudelleenrenderöinnin välillä.
- Toisin kuin tila, refin `current`-arvon asettaminen ei aiheuta uudelleenrenderöintiä.
- Älä lue tai kirjota `ref.current`-arvoa renderöinnin aikana. Tämä tekee komponentistasi vaikeasti ennustettavan.

</Recap>



<Challenges>

#### Korjaa rikkinäinen chat-kenttä {/*fix-a-broken-chat-input*/}

Kirjoita viesti ja paina "Send" painiketta. Huomaat, että viesti ilmestyy kolmen sekunnin viiveellä. Tämän ajan aikana näet "Undo" painikkeen. Paina sitä. Tämä "Undo" painike on tarkoitettu pysäyttämään "Sent!" viesti näkyvistä. Se tekee tämän kutsumalla [`clearTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout) funktiota timeout ID:llä, joka tallennettiin `handleSend` funktion aikana. Kuitenkin, vaikka "Undo" painiketta painettaisiin, "Sent!" viesti ilmestyy silti. Etsi miksi se ei toimi, ja korjaa se.

<Hint>

Tavalliset muuttujat kuten `let timeoutID` eivät "selviä" uudelleenrenderöinnin välillä, koska jokainen renderöinti ajaa komponenttisi (ja alustaa sen muuttujat) alusta. Pitäisikö sinun pitää timeout ID jossain muualla?

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  let timeoutID = null;

  function handleSend() {
    setIsSending(true);
    timeoutID = setTimeout(() => {
      alert('Sent!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutID);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Undo
        </button>
      }
    </>
  );
}
```

</Sandpack>

<Solution>

Kun komponenttisi uudelleenrenderöidään (kuten tilan asettamisen yhteydessä), kaikki paikalliset muuttujat alustetaan alusta. Tämä on syy siihen, miksi et voi tallentaa timeout ID:tä paikalliseen muuttujaan kuten `timeoutID` ja sitten odottaa toisen tapahtumankäsittelijän "näkevän" sen tulevaisuudessa. Tallenna se refiin, jota React säilyttää renderöintien välillä.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const timeoutRef = useRef(null);

  function handleSend() {
    setIsSending(true);
    timeoutRef.current = setTimeout(() => {
      alert('Sent!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutRef.current);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Undo
        </button>
      }
    </>
  );
}
```

</Sandpack>

</Solution>


#### Korjaa komponentin uudelleenrenderöinti {/*fix-a-component-failing-to-re-render*/}

Tämän painikkeen on tarkoitus vaihtaa "On" ja "Off" välillä. Kuitenkin, se näyttää aina "Off". Mikä tässä koodissa on vikana? Korjaa se.

<Sandpack>

```js
import { useRef } from 'react';

export default function Toggle() {
  const isOnRef = useRef(false);

  return (
    <button onClick={() => {
      isOnRef.current = !isOnRef.current;
    }}>
      {isOnRef.current ? 'On' : 'Off'}
    </button>
  );
}
```

</Sandpack>

<Solution>

Tässä esimerkissä, refin nykyinen arvo käytetään renderöinnin tuloksen laskemiseen: `{isOnRef.current ? 'On' : 'Off'}`. Tämä on merkki siitä, että tämä tieto ei pitäisi olla refissä, ja sen pitäisi olla tilassa. Korjataksesi sen, poista ref ja käytä tilaa sen sijaan:

<Sandpack>

```js
import { useState } from 'react';

export default function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button onClick={() => {
      setIsOn(!isOn);
    }}>
      {isOn ? 'On' : 'Off'}
    </button>
  );
}
```

</Sandpack>

</Solution>

#### Korjaa debounce {/*fix-debouncing*/}

Tässä esimerkissä kaikki painikkeiden klikkaukset ovat ["debounced".](https://redd.one/blog/debounce-vs-throttle) Nähdäksesi mitä tämä tarkoittaa, paina yhtä painikkeista. Huomaa, kuinka viesti ilmestyy sekunnin kuluttua. Jos painat painiketta odottaessasi viestiä, ajanlaskuri nollautuu. Joten jos painat samaa painiketta nopeasti useita kertoja, viestiä ei näy ennen kuin sekunti *jälkeen* kun lopetat painamisen. Debouncing antaa sinun viivästyttää jotain toimintoa, kunnes käyttäjä "lopettaa tekemästä asioita".

Tämä esimerkki toimii, mutta ei ihan niin kuin tarkoitettiin. Painikkeet eivät ole riippumattomia. Nähdäksesi ongelman, paina yhtä painikkeista, ja paina sitten välittömästi toista painiketta. Odota hetki, ja näet molempien painikkeiden viestit. Mutta vain viimeisen painikkeen viesti näkyy. Ensimmäisen painikkeen viesti katoaa.

Miksi painikkeiden klikkaukset vaikuttavat toisiinsa? Etsi ja korjaa ongelma.

<Hint>

Viimeisin timeout ID-muuttuja on jaettu kaikkien `DebouncedButton` -komponenttien välillä. Tämä on syy siihen, miksi yhden painikkeen klikkaaminen nollaa toisen painikkeen ajanlaskurin. Voitko tallentaa erillisen timeout ID:n jokaiselle painikkeelle?

</Hint>

<Sandpack>

```js
import { useState } from 'react';

let timeoutID;

function DebouncedButton({ onClick, children }) {
  return (
    <button onClick={() => {
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Spaceship launched!')}
      >
        Launch the spaceship
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Soup boiled!')}
      >
        Boil the soup
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Lullaby sung!')}
      >
        Sing a lullaby
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

<Solution>

Muuttuja kuten `timeoutID` on jaettu kaikkien komponenttien välillä. Tämä on syy siihen, miksi yhden painikkeen klikkaaminen nollaa toisen painikkeen ajanlaskurin. Korjataksesi tämän, voit pitää timeoutin refissä. Jokainen painike saa oman refinsä, joten ne eivät riko toisiaan. Huomaa, kuinka nopeasti painamalla kaksi painiketta näet molempien viestit.

<Sandpack>

```js
import { useState, useRef } from 'react';

function DebouncedButton({ onClick, children }) {
  const timeoutRef = useRef(null);
  return (
    <button onClick={() => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Spaceship launched!')}
      >
        Launch the spaceship
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Soup boiled!')}
      >
        Boil the soup
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Lullaby sung!')}
      >
        Sing a lullaby
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

</Solution>

#### Lue viimeisin tila {/*read-the-latest-state*/}

In this example, after you press "Send", there is a small delay before the message is shown. Type "hello", press Send, and then quickly edit the input again. Despite your edits, the alert would still show "hello" (which was the value of state [at the time](/learn/state-as-a-snapshot#state-over-time) the button was clicked).

Tässä esimerkissä, kun painat "Lähetä", on pieni viive ennen kuin viesti näkyy. Kirjoita "hei", paina Lähetä ja muokkaa sitten nopeasti syötettä. Vaikka muokkaatkin, ilmoitus näyttää edelleen "hei" (joka oli tilan arvo [kun painiketta painettiin](/learn/state-as-a-snapshot#state-over-time)).

Useiten tämä käyttäytyminen on haluttua sovelluksessa. Kuitenkin on tilanteita, joissa haluat, että jokin asynkroninen koodi lukee *viimeisimmän* tilan. Voitko keksiä tavan, jolla ilmoitus näyttää *nykyisen* syöttölaatikon tekstin, eikä sitä, mitä se oli painiketta painettaessa?

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');

  function handleSend() {
    setTimeout(() => {
      alert('Sending: ' + text);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        onClick={handleSend}>
        Send
      </button>
    </>
  );
}
```

</Sandpack>

<Solution>

Tila toimii [kuten tilannekuva](/learn/state-as-a-snapshot), joten et voi lukea viimeisintä tilaa aikakatkaisusta kuten timeoutista. Voit kuitenkin pitää viimeisimmän syötetyn tekstin refissä. Ref on muuttuva, joten voit lukea `current` -ominaisuuden milloin tahansa. Koska nykyinen teksti käytetään myös renderöinnissä, tässä esimerkissä tarvitset *molemmat* tilamuuttujan (renderöintiä varten) *ja* refin (timeoutin lukemista varten). Sinun täytyy päivittää nykyinen ref-arvo manuaalisesti.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const textRef = useRef(text);

  function handleChange(e) {
    setText(e.target.value);
    textRef.current = e.target.value;
  }

  function handleSend() {
    setTimeout(() => {
      alert('Sending: ' + textRef.current);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={handleChange}
      />
      <button
        onClick={handleSend}>
        Send
      </button>
    </>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
