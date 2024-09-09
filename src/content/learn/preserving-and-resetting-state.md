---
title: Tilan säilyttäminen ja nollaus
---

<Intro>

Tila on eristetty komponenttien välillä. React pitää kirjaa siitä, mikä tila kuuluu mihinkin komponenttiin sen perusteella, mikä on niiden paikka käyttöliittymäpuussa. Voit hallita, milloin tila säilytetään ja milloin se nollataan uudelleen renderöintiä varten.

</Intro>

<YouWillLearn>

<<<<<<< HEAD
* Miten React "näkee" komponentin rakenteen
* Milloin React päättää säilyttää tai nollata tilan
* Miten pakottaa React nollaamaan komponentin tila
* Miten avaimet ja tyypit vaikuttavat tilan säilyttämiseen

</YouWillLearn>

## Käyttöliittymäpuu {/*the-ui-tree*/}

Selaimet käyttävät monia puumalleja käyttöliittymän mallintamiseen. [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction) edustaa HTML-elementtejä, [CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model) tekee saman CSS:lle. On olemassa jopa [saavutettavuuspuu](https://developer.mozilla.org/docs/Glossary/Accessibility_tree)!

React käyttää myös puurakenteita käyttöliittymäsi hallintaan ja mallintamiseen. React rakentaa **UI puita** JSX koodistasi. Sitten React DOM päivittää selaimen DOM elementit vastaamaan tuota UI puuta. (React Native kääntää nämä puut näkymiksi, jotka voidaan näyttää puhelinalustoilla.)

<DiagramGroup>

<Diagram name="preserving_state_dom_tree" height={193} width={864} alt="Kaavio, jossa on kolme vaakasuoraan sijoitettua osaa. Ensimmäisessä osassa on kolme pystysuoraan pinottua suorakulmiota, joissa on merkinnät 'Komponentti A', 'Komponentti B' ja 'Komponentti C'. Seuraavaan osioon siirtyy nuoli, jonka yläpuolella on React-logo ja jossa on merkintä 'React'. Keskimmäisessä osassa on komponenttien puu, jonka juuressa on merkintä 'A' ja kahdessa alakomponentissa merkinnät 'B' ja 'C'. Seuraavaan osioon siirrytään jälleen nuolella, jonka yläosassa on React-logo ja jossa on merkintä 'React'. Kolmas ja viimeinen osio on selaimen rautalankamalli, joka sisältää kahdeksan solmun puun, josta on korostettu vain osajoukko (joka osoittaa keskimmäisen osion alipuun).">

Komponenteista React luo käyttöliittymäpuun, jota React DOM käyttää renderöidäkseen DOM:n 

</Diagram>

</DiagramGroup>

## Tila on sidottu sijaintiin puussa {/*state-is-tied-to-a-position-in-the-tree*/}

Kun annat komponentille tilan, saatat ajatella, että tila "asuu" komponentin sisällä. Mutta tila oikeasti pidetään Reactin sisällä. React yhdistää jokaisen hallussa olevan tilatiedon oikeaan komponenttiin sen mukaan, missä kohtaa käyttöliittymäpuuta kyseinen komponentti sijaitsee.

Tässä esimerkissä on vain yksi `<Counter />` JSX tagi, mutta se on renderöity kahdessa eri kohdassa:
=======
* When React chooses to preserve or reset the state
* How to force React to reset component's state
* How keys and types affect whether the state is preserved

</YouWillLearn>

## State is tied to a position in the render tree {/*state-is-tied-to-a-position-in-the-tree*/}

React builds [render trees](learn/understanding-your-ui-as-a-tree#the-render-tree) for the component structure in your UI.

When you give a component state, you might think the state "lives" inside the component. But the state is actually held inside React. React associates each piece of state it's holding with the correct component by where that component sits in the render tree.

Here, there is only one `<Counter />` JSX tag, but it's rendered at two different positions:
>>>>>>> 9aa2e3668da290f92f8997a25f28bd3f58b2a26d

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const counter = <Counter />;
  return (
    <div>
      {counter}
      {counter}
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Miltä tämä näyttäisi puuna:

<DiagramGroup>

<Diagram name="preserving_state_tree" height={248} width={395} alt="Kaavio React-komponenttien puusta. Juurinoodilla on merkintä 'div', ja sillä on kaksi lasta. Kummankin alakomponentin nimi on 'Counter', ja molemmat sisältävät tilan 'count', jonka arvo on 0.">

React puu

</Diagram>

</DiagramGroup>

**Nämä ovat kaksi erillistä laskuria, koska ne on renderöity niiden omissa sijainneissa puussa.** Sinun ei tarvitse muistaa näitä sijainteja käyttääksesi Reactia, mutta voi olla hyödyllistä ymmärtää miksi se toimii.

Reactissa, kukin komponentti ruudulla omaa eristetyn tilan. Esimerkiksi, jos renderöiti kaksi `Counter` komponenttia vierekkäin, molemmilla on niiden omat, itsenäiset, `score` ja `hover` tilat.

Kokeile klikata molempia laskureita ja huomaat, etteivät ne vaikuta toisiinsa:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  return (
    <div>
      <Counter />
      <Counter />
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Kuten voit nähdä, kun toista laskuria päivitetään, vain sen komponentin tila päivittyy:


<DiagramGroup>

<Diagram name="preserving_state_increment" height={248} width={441} alt="Kaavio React-komponenttien puusta. Juurinoodilla on merkintä 'div', ja sillä on kaksi lasta. Vasemmanpuoleinen komponentti on merkitty 'Counter', ja se sisältää tilan 'count', jonka arvo on 0. Oikeanpuoleinen komponentti on merkitty 'Counter' ja sisältää tilan 'count', jonka arvo on 1. Oikean lapsen tila on korostettu keltaisella merkiksi siitä, että sen arvo on päivittynyt.">

Tilan päivittäminen

</Diagram>

</DiagramGroup>

<<<<<<< HEAD
React pitää tilan muistissa niin kauan kuin renderlit samaa komponenttia samassa sijainnissa. Tämän nähdäksesi, korota molempia laskureita ja sitten poista toinen komponentti poistamalla valinta "Render the second counter" valintaruudusta, ja sitten lisää se takaisin valitsemalla se uudelleen:
=======

React will keep the state around for as long as you render the same component at the same position in the tree. To see this, increment both counters, then remove the second component by unchecking "Render the second counter" checkbox, and then add it back by ticking it again:
>>>>>>> 9aa2e3668da290f92f8997a25f28bd3f58b2a26d

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [showB, setShowB] = useState(true);
  return (
    <div>
      <Counter />
      {showB && <Counter />} 
      <label>
        <input
          type="checkbox"
          checked={showB}
          onChange={e => {
            setShowB(e.target.checked)
          }}
        />
        Render the second counter
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Huomaa, kun lopetat toisen laskurin renderöimisen, sen tila katoaa täysin. Tämä tapahtuu koska kun React poistaa komponentin, se poistaa sen tilan.

<DiagramGroup>

<Diagram name="preserving_state_remove_component" height={253} width={422} alt="Kaavio React-komponenttien puusta. Juurinoodilla on merkintä 'div', ja sillä on kaksi alakomponenttia. Vasemmanpuoleinen komponentti on merkitty 'Counter', ja se sisältää tilan 'count', jonka arvo on 0. Oikeanpuoleinen komponentti puuttuu, ja sen tilalla on keltainen poof -kuva, joka korostaa puusta poistettavaa komponenttia.">

Komponentin poistaminen

</Diagram>

</DiagramGroup>

Kun valitset "Render the second counter", toinen `Counter` ja sen tula alustetaan tyjästä (`score = 0`) ja lisätään DOM:iin.

<DiagramGroup>

<Diagram name="preserving_state_add_component" height={258} width={500} alt="Kaavio React-komponenttien puusta. Juurinoodilla on merkintä 'div', ja sillä on kaksi alakomponenttia. Vasemmanpuoleinen komponentti on merkitty 'Counter', ja se sisältää tilan 'count', jonka arvo on 0. Oikea komponentti on merkitty 'Counter' ja sisältää tilan 'count', jonka arvo on 0. Koko oikea solmu on korostettu keltaisella, mikä osoittaa, että se on juuri lisätty puuhun.">

Komponentin lisääminen

</Diagram>

</DiagramGroup>

**React säilyttää komponentin tilan niin kauan kuin se on renderöity sen sijainnissa käyttöliittymäpuussa.** Jos se poistetaan tai toinen komponentti renderöidään sen sijaintiin, React hävittää sen tilan.

## Sama komponentti samassa sijainnissa säilyttää tilan {/*same-component-at-the-same-position-preserves-state*/}

Tässä esimerkissä on kaksi eri `<Counter />` tagia:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <Counter isFancy={true} /> 
      ) : (
        <Counter isFancy={false} /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Kun valitset tai tyhjäät valintaruudun, laskurin tila ei poistu. Riippuen onko `isFancy` `true` vai `false`, `<Counter />` on aina ensimmäinen `App` komponentin palauttaman `div`:n lapsi:

<DiagramGroup>

<Diagram name="preserving_state_same_component" height={461} width={600} alt="Kaavio, jossa on kaksi osiota, jotka on erotettu toisistaan nuolella. Kumpikin osio sisältää komponenttien asettelun, jonka pääosassa on merkintä 'App' ja tila, jossa on merkintä isFancy. Tällä komponentilla on yksi lapsi, jonka nimi on 'div', mikä johtaa isFancyn sisältävään propsi-kuplaan (violetilla korostettuna), joka siirtyy ainoalle alakomponentille. Alakomponentin nimi on 'Counter' ja se sisältää tilan, jonka nimi on 'count' ja arvo 3 molemmissa kaavioissa. Kaavion vasemmassa osassa mitään ei ole korostettu ja isFancy-vanhemman tilan arvo on false. Kaavion oikeanpuoleisessa osassa isFancy-vanhempien tilan arvo on muuttunut arvoon true, ja se on korostettu keltaisella, samoin kuin alapuolella oleva propsi-kupla, jonka isFancy-arvo on myös muuttunut arvoon true.">

`App` komponentin tilan päivittäminen ei nollaa `Counter`:ia, koska `Counter` pysyy samassa sijainnissa

</Diagram>

</DiagramGroup>


Se on sama komponentti samassa sijainnissa, joten Reactin näkökulmasta se on sama laskuri.

<Pitfall>

Muista, että Reactin kannalta tärkeintä on sen **sijainti käyttöliittymäpuussa, ei JSX merkinnässä** Tällä komponentilla on kaksi `return` lausetta eri `<Counter />` JSX tageilla sekä `if` lauseiden sisällä että ulkopuolella:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  if (isFancy) {
    return (
      <div>
        <Counter isFancy={true} />
        <label>
          <input
            type="checkbox"
            checked={isFancy}
            onChange={e => {
              setIsFancy(e.target.checked)
            }}
          />
          Use fancy styling
        </label>
      </div>
    );
  }
  return (
    <div>
      <Counter isFancy={false} />
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Saatat olettaa tilan nollautuvan kun valitset valintaruudun, mutta se ei nollaudu! Tämä tapahtuu, koska **molemmat `<Counter />` tageista renderöidään samaan sijaintiin**. React ei tiedä mihin sijoitat ehtolauseet funktiossasi. Ainoa mitä se "näkee" on puun, jonka palautat.

Molemmissa tapauksissa, `App` komponentti palauttaa `<div>`:n jossa on `<Counter />` ensimmäisenä lapsena. Tämän takia React katsoo niiden olevan _samat_ `<Counter />` komponentit. Voit ajatella, että niillä on sama "osoite": juuren ensimmäisen lapsen ensimmäinen lapsi. Näin React sovittaa ne yhteen edellisen ja seuraavan renderöinnin välillä riippumatta siitä, miten logiikkasi rakentuu.

</Pitfall>

## Eri komponentit samassa sijainnissa nollaavat tilan {/*different-components-at-the-same-position-reset-state*/}

Tässä esimerkissä valintaruudun valitseminen korvaa `<Counter>`:n `<p>` tagilla:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <div>
      {isPaused ? (
        <p>See you later!</p> 
      ) : (
        <Counter /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isPaused}
          onChange={e => {
            setIsPaused(e.target.checked)
          }}
        />
        Take a break
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Tässä vaihdat _eri_ komponenttityyppejä samassa sijainnissa. Aluksi `<div>`:n ensimmäinen lapsi oli `Counter`. Mutta kun vaihdat `<p>`:ksi, React poistaa `Counter`n UI puusta ja tuhoaa sen tilan.

<DiagramGroup>

<Diagram name="preserving_state_diff_pt1" height={290} width={753} alt="Kaavio, jossa on kolme osaa, joiden välissä on nuoli, joka yhdistää kunkin osan. Ensimmäinen osio sisältää React-komponentin, jonka nimi on 'div' ja jonka yksi lapsi on 'Counter' ja joka sisältää tilan nimeltään 'count' arvolla 3. Keskimmäisessä osiossa on sama 'div'-vanhempi, mutta lapsikomponentti on nyt poistettu, mikä on merkitty keltaisella 'poof'-kuvalla. Kolmannessa osiossa on jälleen sama 'div'-vanhempi, mutta nyt sillä on uusi lapsi, jonka nimi on 'p' ja joka on korostettu keltaisella.">

Kun `Counter` vaihtuu `p`:ksi, `Counter` poistetaan ja `p` lisätään

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_pt2" height={290} width={753} alt="Kaavio, jossa on kolme osaa, joiden välissä on nuoli, joka yhdistää kunkin osan. Ensimmäinen osio sisältää React-komponentin, jonka nimi on 'p'. Keskimmäisessä osiossa on sama 'div'-vanhempi, mutta lapsikomponentti on nyt poistettu, mikä on merkitty keltaisella 'poof'-kuvalla. Kolmannessa osiossa on jälleen sama 'div'-vanhempaa, mutta nyt siinä on uusi lapsikomponentti nimeltä 'Counter', joka sisältää tilan nimeltä 'count', jonka arvo on 0 ja joka on korostettu keltaisella.">

Vaihdettaessa takaisin, `p` poistetaan ja `Counter` lisätään

</Diagram>

</DiagramGroup>

Huomaathan, **kun renderöit eri komponentin samassa sijainnissa, se nollaa sen koko alipuun tilan.** Nähdäksesi, miten tämä toimii, lisää laskuri ja valitse sitten valintaruutu:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <div>
          <Counter isFancy={true} /> 
        </div>
      ) : (
        <section>
          <Counter isFancy={false} />
        </section>
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Laskurin tila nollautuu kun valintaruutu valitaan. Vaikka renderöit `Counter`:n, ensimmäinen `<div>`:n lapsi muuttuu `<div>`:stä `<section>`:ksi. Kun `div`:n lapsi poistettiin DOM:sta, sen koko alipuu (mukaan lukien `Counter` ja sen tila) tuhottiin.

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt1" height={350} width={794} alt="Kaavio, jossa on kolme osaa, joiden välissä on nuoli, joka yhdistää kunkin osan. Ensimmäinen osio sisältää React-komponentin nimeltä 'div', jolla on yksi lapsi nimeltä 'section', jolla on yksi lapsi nimeltä 'Counter', joka sisältää tilan nimeltä 'count', jonka arvo on 3. Keskimmäisessä osiossa on sama 'div'-vanhempi, mutta lapsikomponentit on nyt poistettu, mikä näkyy keltaisella 'poof'-kuvalla. Kolmannessa osiossa on jälleen sama 'div'-vanhempaa, mutta nyt sillä on uusi lapsi 'div', joka on merkitty keltaisella ja jolla on myös uusi lapsi 'Counter', joka sisältää tilan 'count', jonka arvo on 0. Kaikki on merkitty keltaisella.">

Kun `section` muuttuu `div`:ksi, `section` poistetaan ja uusi `div` lisätään

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt2" height={350} width={794} alt="Kaavio, jossa on kolme osaa, joiden välissä on nuoli, joka yhdistää kunkin osan. Ensimmäinen osio sisältää React-komponentin nimeltä 'div', jolla on yksi lapsi nimeltä 'div', jolla on yksi lapsi nimeltä 'Counter', joka sisältää tilan nimeltä 'count', jonka arvo on 0. Keskimmäisessä osiossa on sama 'div'-vanhempi, mutta lapsikomponentit on nyt poistettu, mikä osoitetaan keltaisella 'poof'-kuvalla. Kolmannella osiolla on jälleen sama 'div'-vanhempaa, mutta nyt sillä on uusi lapsi nimeltään 'section', joka on korostettu keltaisella ja jolla on myös uusi lapsi nimeltään 'Counter', joka sisältää tilan nimeltään 'count', jonka arvo on 0. Kaikki on korostettu keltaisella.">

Vaihdettaessa takaisin, `div` poistetaan ja uusi `section` lisätään

</Diagram>

</DiagramGroup>

Nyrkkisääntönä, **jos haluat säilyttää tilan renderöintien välillä, puun rakenteen on oltava "sama"** renderöinnistä toiseen. Jos rakenteet ovat erilaiset, tila tuhotaan, sillä React tuhoaa tilan, kun se poistaa komponentin puusta.

<Pitfall>

Tämän takia sinun ei tulisi määritellä komponenttien sisällä komponentteja.

Tässä, `MyTextField`-komponenttia määritellään `MyComponent`-komponentin *sisällä*:

<Sandpack>

```js
import { useState } from 'react';

export default function MyComponent() {
  const [counter, setCounter] = useState(0);

  function MyTextField() {
    const [text, setText] = useState('');

    return (
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
    );
  }

  return (
    <>
      <MyTextField />
      <button onClick={() => {
        setCounter(counter + 1)
      }}>Clicked {counter} times</button>
    </>
  );
}
```

</Sandpack>

Joka kerta kun klikkaat painikkeesta, syötteen tila häviää! Tämä johtuu siitä, että *eri* `MyTextField`-funktio luodaan joka renderöinnille `MyComponent`:sta. Renderöit *eri* komponentin samassa sijainnissa, joten React nollaa kaiken tilan alapuolella. Tämä johtaa virheisiin ja suorituskykyongelmiin. Välttääksesi tämän ongelman, **määrittele komponenttien funktiot aina ylemmällä tasolla, äläkä sisällytä niiden määrittelyjä.**

</Pitfall>

## Tilan nollaaminen samassa sijainnissa {/*resetting-state-at-the-same-position*/}

Oletuksena React säilyttää komponentin tilan, kun se pysyy samassa sijainnissa. Yleensä tämä on juuri sitä, mitä haluat, joten se on järkevää oletusarvoa. Mutta joskus haluat nollata komponentin tilan. Harkitse tätä sovellusta, joka antaa kahdelle pelaajalle mahdollisuuden pitää kirjaa heidän pisteistään jokaisella vuorollaan:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter person="Tommi" />
      ) : (
        <Counter person="Sara" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Seuraava pelaaja!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}n pisteet: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Lisää yksi
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Tällä hetkellä, kun vaihdat pelaajaa, tila säilyy. Kaksi `Counter`-komponenttia näkyy samassa sijainnissa, joten React näkee ne *samana* `Counter`-komponenttina, jonka `person`-prop on muuttunut.

Mutta tässä sovelluksessa niiden tulisi olla eri laskureita. Ne saattavat näkyä samassa kohdassa käyttöliittymää, mutta toinen laskuri on Tommin ja toinen laskuri Saran.

On kaksi tapaa nollata tila kun vaihdetaan niiden välillä:

1. Renderöi komponentit eri sijainneissa
2. Anna kullekin komponentille eksplisiittinen identiteetty `key` propilla


### 1. Vaihtoehto: Komponentin renderöiminen eri sijainneissa {/*option-1-rendering-a-component-in-different-positions*/}

Jos haluat, että nämä kaksi `Counter`-komponenttia ovat erillisiä, voit renderöidä ne eri sijainneissa:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA &&
        <Counter person="Tommi" />
      }
      {!isPlayerA &&
        <Counter person="Sara" />
      }
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Seuraava pelaaja!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}n pisteet: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Lisää yksi
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

* Aluksi, `isPlayerA` on arvoltaan `true`. Joten ensimmäinen sijainti sisältää `Counter` tilan ja toinen on tyhjä.
* Kun klikkaat "Seuraava pelaaja" painiketta, ensimmäinen sijainti tyhjenee ja seuraava sisältää `Counter`:n.

<DiagramGroup>

<Diagram name="preserving_state_diff_position_p1" height={375} width={504} alt="Kaavio, jossa on React-komponenttien puu. Vanhemman komponentin nimi on 'Scoreboard' ja sen tilakupla on isPlayerA, jonka arvo on 'true'. Ainoa vasemmalle sijoitettu lapsi on nimeltään Counter, jonka tilakuplassa on merkintä 'count' ja arvo 0. Lapsi on korostettu keltaisella, mikä osoittaa, että se on lisätty.">

Alkuperäinen tila

</Diagram>

<Diagram name="preserving_state_diff_position_p2" height={375} width={504} alt="Kaavio, jossa on React-komponenttien puu. Vanhemman komponentin nimi on 'Scoreboard' ja sen tilakupla on isPlayerA, jonka arvo on 'false'. Tilakupla on korostettu keltaisella, mikä osoittaa, että se on muuttunut. Vasemmanpuoleinen lapsi on korvattu keltaisella 'poof'-kuvalla, joka osoittaa, että se on poistettu, ja oikealla on uusi lapsi, joka on korostettu keltaisella, mikä osoittaa, että se on lisätty. Uuden lapsen nimi on 'Counter' ja se sisältää tilakuplan 'count', jonka arvo on 0.">

Painetaan "Seuraava pelaaja"

</Diagram>

<Diagram name="preserving_state_diff_position_p3" height={375} width={504} alt="Kaavio, jossa on React-komponenttien puu. Vanhemman komponentin nimi on 'Scoreboard' ja sen tilakupla on isPlayerA, jonka arvo on 'true'. Tilakupla on korostettu keltaisella, mikä osoittaa, että se on muuttunut. Vasemmalla on uusi lapsi, joka on korostettu keltaisella, mikä osoittaa, että se on lisätty. Uuden lapsen nimi on 'Counter', ja siinä on tilakupla 'count', jonka arvo on 0. Oikeanpuoleinen lapsi on korvattu keltaisella 'poof'-kuvalla, joka osoittaa, että se on poistettu.">

Painetaan "Seuraava pelaaja" uudelleen

</Diagram>

</DiagramGroup>

Kunkin `Counter`:n tila tuhotaan joka kerta kun se poistetaan DOM:sta. Tämän takia ne nollautuvat joka kerta kun painat painiketta.

Tämä ratkaisu on kätevä, kun sinulla on vain muutamia riippumattomia komponentteja, jotka renderöidään samassa paikassa. Tässä esimerkissä sinulla on vain kaksi, joten ei ole hankalaa renderöidä molemmat erikseen JSX:ssä.

### 2. Vaihtoehto: Tilan nollaaminen avaimella {/*option-2-resetting-state-with-a-key*/}

On myös toinen, yleisempi tapa, jolla voit nollata komponentin tilan.

Olet saattanut nähdä `key` propseja kun [renderöitiin listoja.](/learn/rendering-lists#keeping-list-items-in-order-with-key) Avaimet eivät ole vain listoille! Voit käyttää avaimia saadaksesi Reactin tunnistamaan erot komponenttien välillä. Oletuksena, React käyttää järjestystä ("ensimmäinen laskuri", "toinen laskuri") erottaakseen komponentit toisistaan. Mutta avaimilla voit kertoa Reactille, että tämä ei ole vain *ensimmäinen* laskuri ,tai *toinen* laskuri, vaan tarkemmin--esimerkiksi *Tommin* laskuri. Näin React tietää *Tommin* laskurin joka kerta kun näkee sen puussa!

Tässä esimerkissä, kaksi `<Counter />`:a eivät jaa tilaa vaikka ne näyttävät samassa paikassa JSX:ssä:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter key="Taylor" person="Taylor" />
      ) : (
        <Counter key="Sarah" person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Tila säily vaikka Tommin ja Saran välillä vaihdetaan. Tämä tapahtuu **koska annoit niille eri `key`:t.**

```js
{isPlayerA ? (
  <Counter key="Taylor" person="Taylor" />
) : (
  <Counter key="Sarah" person="Sarah" />
)}
```

Sen sijaan että komponentin sijainti tulisi järjestyksestä pääkomponentissa, `key`:n määrittäminen kertoo Reactille, että `key` itsessään on osa sijaintia. Tämän takia vaikka renderöit ne samassa sijainnissa JSX:ssä, Reactin perspektiivistä nämä ovat kaksi eri laskuria. Seurauksena, ne eivät koskaan jaa tilaa. Joka kerta kun laskuri näkyy ruudulla, sen tila on luotu. Joka kerta kun poistetaan, sen tila tuhotaan. Näiden välillä vaihtelu nollaa ja tuhoaa niiden tilan uudelleen ja uudelleen.

<Note>

Muista, että avaimet eivät ole globaalisti uniikkeja. Ne määrittelevät sijainnin *komponentin sisällä*.

</Note>

### Lomakkeen nollaaminen avaimella {/*resetting-a-form-with-a-key*/}

Tilan nollaaminen on erittäin hyödyllistä kun käsitellään lomakkeita.

Tässä chat-sovelluksessa, `<Chat>` komponentti sisältää tilan tekstisyötteelle:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
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

Kokeile syöttää jotain kenttään ja painaa "Alice" tai "Bob" valitaksesi eri vastaanottajan. Huomaat, että syöte säilyy, koska `<Chat>` renderöidään samassa sijainnissa puussa.

**Monissa sovelluksisa, tämä saattaa olla haluttu ominaisuus, mutta ei chat-sovelluksessa!** Et halua käyttäjän lähettävän kirjoitettua viestiä väärälle henkilölle vanhingollisen klikkauksen seurauksena. Korjataksesi tämän, lisää `key`:

```js
<Chat key={to.id} contact={to} />
```

Tämä varmistaa, että kun valitset eri vastaanottajan, `Chat` komponentti tullaan luomaan alusta, mukaan lukien tila puussa sen alla. React tulee myös luomaan uudelleen DOM elementit niiden uudelleenkäytön sijaan.

Nyt vaihtaminen vastaanottajien välillä tyhjää tekstisyötteen:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.id} contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
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

<DeepDive>

#### Tilan säilyttäminen poistetuille komponenteille {/*preserving-state-for-removed-components*/}

Oikeassa chat-sovelluksessa, haluaisit varmaankin palauttaa syötteen kun käyttäjä valitsee edellisen vastaanottajan uudestaan. On useita tapoja pitää tila "hengissä" komponentille, joka ei ole enää näkyvissä:

- Voit renderöidä _kaikki_ chatit yhden sijaan, ja piilottaa loput CSS:llä. Keskusteluja ei tultaisi poistamaan puusta, joten niiden paikallinen tila säilyisi. Tämä tapa toimii yksinkertaisille käyttöliittymille, mutta se voi koitua erittäin hitaaksi, jos piilotetut puut ovat suuria ja sisältävät paljon DOM nodeja.
- Voit [nostaa tilan ylös](/learn/sharing-state-between-components) ja pitää viestiluonnokset jokaiselle vastaanottajalle pääkomponentissa. Tällä tavalla, kun lapsikomponentti poistetaan, se ei haittaa, sillä pääkomponentti pitää yllä tärkeät tiedot. Tämä on yleisin ratkaisu.
- Saatat myös käyttää eri lähdettä Reactin tilan lisäksi. Esimerkiksi, saatat haluta viestiluonnoksen säilyvän vaikka käyttäjä vahingossa sulkisi sivun. Tämän tehdäksesi, voisit asettaa `Chat` komponentin alustamaan tilan lukemalla [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage):a ja tallentamaan myös luonnokset sinne.

Riippumatta siitä minkä strategian valitset, chatti _Alicen kanssa_ on havainnollisesti eri kuin _Bobin kanssa_, joten on järkevää antaa `<Chat>` komponentille `key` propsi, joka pohjautuu nykyiseen vastaanottajaan.

</DeepDive>

<Recap>

- React pitää tilan niin pitkään kuin sama komponentti on renderöity samassa sijainnissa.
- Tilaa ei pidetä JSX tageissa. Se liittyy puun sijaintiin, johon laitat JSX:n.
- Voit pakottaa alipuun nollaamaan tilansa antamalla sille toisen avaimen.
- Älä sijoita komponenttimäärityksiä toistensa sisään, tai nollaat tilan vahingossa.

</Recap>



<Challenges>

#### Korjaa katoava syöttöteksti {/*fix-disappearing-input-text*/}

Tämä esimerkki näyttää vistin kun painat painiketta. Kuitenkin painikkeen painaminen vahingossa nollaa syötteen. Miksi näin tapahtuu? Korjaa se, jotta painikkeen painaminen ei nollaa tekstisyötettä.

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Hint: Your favorite city?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      </div>
    );
  }
  return (
    <div>
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Show hint</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

Ongelma on siinä, että `Form` renderöidään useissa eri sijainneissa. Jos-haarassa se on `<div>`:n toinen lapsi, mutta ehtolauseen `else` haarassa se on ensimmäinen. Tästä syystä komponentin tyyppi kummassakin sijainnissa muuttuu. Ensimmäinen sijainti muuttuu `p`:n ja `Form`:n välillä, kun taas toisessa `Form`:n ja `button`:in välillä. React nollaa tilan joka kerta, kun komponentin tyyppi muuttuu.

Helpoin ratkaisu on yhdistää haarat siten, että `Form` renderöidään aina samassa sijainnissa:

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  return (
    <div>
      {showHint &&
        <p><i>Hint: Your favorite city?</i></p>
      }
      <Form />
      {showHint ? (
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      ) : (
        <button onClick={() => {
          setShowHint(true);
        }}>Show hint</button>
      )}
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>


Teknisesti ottaen, voisit myös lisätä `null` ennen `<Form />` ehtolauseen `else` haaraan vastatakseen ehtolauseen ensimmäisen haaran rakennetta:

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Hint: Your favorite city?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      </div>
    );
  }
  return (
    <div>
      {null}
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Show hint</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

Tällä tavalla, `Form` on aina toinen lapsi, joten se pysyy samassa sijainnissa ja säilyttää tilansa. Tämä tapa ei ole kuitenkaan niin itsestään selvää ja lisää mahdollisuuden riskille, että joku muu poistaa `null` maininnan.

</Solution>

#### Vaihda kaksi lomakekenttää {/*swap-two-form-fields*/}

Tähän lomakkeeseen voit syöttää etu- ja sukunimen. Siinä on myös valintaruutu, jonka perusteella päätellään kumpi kenttä tulee ensin. Kun valitset valintaruudun, "Last name" näkyy ennen "First name" kenttää.

Se melkein toimii, mutta siinä on bugi. Jos täytät "First name" syötteeseen ja valitset valintaruudun, teksti pysyy ensimmäisessä tekstisyötteessä (joka on nyt "Last name"). Korjaa se siten, että tekstisyöte *myös* liikkuu kun vaihdat niiden sijaintia.

<Hint>

Näyttää siltä, että näille kentille sijainti pääkomponentin sisällä ei riitä. Onko jokin tapa kertoa Reactille miten uudelleen renderöintien välillä tila voidaan nollata?

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Reverse order
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field label="Last name" /> 
        <Field label="First name" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field label="First name" /> 
        <Field label="Last name" />
        {checkbox}
      </>
    );    
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

Anna molemmille `<Field>` komponenteille `key` kummassakin `if` ja `else` haaroissa. Tämä kertoo Reactille miten nollata tila kummallekkin `<Field>` komponentille vaikka niiden sijainti pääkomponentissa muuttuisi:

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Reverse order
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field key="lastName" label="Last name" /> 
        <Field key="firstName" label="First name" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field key="firstName" label="First name" /> 
        <Field key="lastName" label="Last name" />
        {checkbox}
      </>
    );    
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

</Solution>

#### Nollaa yhteystietolomake {/*reset-a-detail-form*/}

Tämä on muokattava yhteystietolista. Voit muokata valitun henkilön tietoja ja sitten painaa "Tallenna" päivittääksesi sen tai "Reset" palauttaaksesi muutoksesi.

Kun valitset eri yhteystiedon (esimerkiksi, Alice), tila päivittyy, mutta lomake näyttää silti edellisen yhteystiedon tiedot. Korjaa se siten, että lomake nollautuu kun valittu yhteystieto muuttuu.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

Anna `key={selectedId}` propsi `EditContact` komponentille. Tällä tavalla vaihtaminen yhteystietojen välillä nollaa lomakkeen:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        key={selectedId}
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### Nollaa kuva kun se lataa {/*clear-an-image-while-its-loading*/}

Kun painat "Next", selain alkaa lataamaan seuraavaa kuvaa. Kuitenkin, koska se näytetään samassa `<img>`-elementissä, oletuksena näet edellisen kuvan ennen kuin seuraava latautuu. Tämä voi olla epätoivottavaa, jos on tärkeää, että teksti aina vastaa kuvaa. Muuta sitä niin, että heti kun painat "Next", edellinen kuva poistuu välittömästi.

<Hint>

Onko tapaa kertoa Reactille että se pitäisi luoda DOM uudelleen sen sijaan että se käyttäisi sitä uudelleen?

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h3>
        Image {index + 1} of {images.length}
      </h3>
      <img src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://i.imgur.com/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://i.imgur.com/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://i.imgur.com/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://i.imgur.com/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://i.imgur.com/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://i.imgur.com/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://i.imgur.com/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

<Solution>

Voit antaa `<img>` tagille `key` propsin. Kun `key` muuttuu, React luo `<img>` DOM:n uudelleen. Tämä aiheuttaa lyhyen välähdyksen kun jokainen kuva latautuu, joten et halua tehdä tätä jokaiselle kuvalle sovelluksessasi. Mutta se on järkevää jos haluat varmistaa että kuva aina vastaa tekstiä.

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h3>
        Image {index + 1} of {images.length}
      </h3>
      <img key={image.src} src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://i.imgur.com/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://i.imgur.com/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://i.imgur.com/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://i.imgur.com/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://i.imgur.com/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://i.imgur.com/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://i.imgur.com/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

</Solution>

#### Korjaa väärin sijoitettu tila listassa {/*fix-misplaced-state-in-the-list*/}

Tässä listassa, jokaisella `Contact`:lla on tila joka määrittää onko "Show email" painettu sille. Paina "Show email" Alice:lle ja sitten valitse "Näytä käänteisessä järjestyksessä". Huomaat että _Taylor:n_ sähköposti on nyt laajennettu, mutta Alice:n--joka on siirtynyt alimmaiseksi--on suljettu.

Korjaa tila niin että laajennettu tila on yhdistetty jokaiseen yhteystietoon, riippumatta valitusta järjestyksestä.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          value={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Show in reverse order
      </label>
      <ul>
        {displayedContacts.map((contact, i) =>
          <li key={i}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```

```js src/Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Hide' : 'Show'} email
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

Esimerkin ongelma johtui siitä että tässä esimerkissä käytettiin indeksiä `key`:nä:

```js
{displayedContacts.map((contact, i) =>
  <li key={i}>
```

Haluat kuitenkin, että tila on yhdistetty _jokaiseen yksittäiseen yhteystietoon_.

Yhteystiedon ID:n käyttäminen `key`:nä korjaa ongelman:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          value={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Show in reverse order
      </label>
      <ul>
        {displayedContacts.map(contact =>
          <li key={contact.id}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```

```js src/Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Hide' : 'Show'} email
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

Tila on yhdistetty puun sijaintiin. `key` antaa sinun määrittää nimetyn sijainnin sijasta riippumatta järjestyksestä.

</Solution>

</Challenges>
