---
title: 'Opas: Ristinolla'
---

<Intro>

Tulet rakentamaan pienen ristinolla-pelin tässä oppaassa. Tämä opas ei oleta aikaisempaa React-osaamista. Tekniikat, joita opit oppaan aikana ovat perustavanlaatuisia mille tahansa React-sovellukselle ja niiden ymmärtäminen antaa sinulle syvällisen ymmärryksen Reactista.

</Intro>

<Note>

Tämä opas on tarkoitettu henkilöille, jotka suosivat **oppimaan tekemällä** ja haluavat nopeasti kokeilla tehdä jotain konkreettista. Jos suosit oppimista jokaisen käsitteen vaiheittain, aloita [Käyttöliittymän kuvaaminen](/learn/describing-the-ui) sivulta.

</Note>

Tämä opas on jaettu useaan osaan:

- [Oppaan asennusvaihe](#setup-for-the-tutorial) antaa sinulle *lähtökohdan** oppaan seuraamiseen.
- [Yleiskatsaus](#overview) opettaa sinulle Reactin **perusteet**: komponentit, propsit, ja tilan.
- [Pelin viimeistely](#completing-the-game) opettaa sinulle **yleisimmät tekniikat** React kehityksessä.
- [Aikamatkustuksen lisääminen](#adding-time-travel) opettaa sinulle **syvällisen ymmärryksen** Reactin uniikkeihin vahvuuksiin.

### Mitä olet rakentamassa? {/*what-are-you-building*/}

Tässä oppaassa tulet rakentamaan interaktiivisen ristinolla-pelin Reactilla.

Näet alla miltä se tulee lopulta näyttämään kun saat sen valmiiksi:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Voittaja: ' + winner;
  } else {
    status = 'Seuraava pelaajaa: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Siirry liikkeeseen #' + move;
    } else {
      description = 'Siirry pelin alkuun';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Jos et saa selvää koodista vielä taikka koodin syntaksi ei ole tuttua, älä huoli! Tämän oppaan tavoite on auttaa sinua ymmärtämään Reactia ja sen syntaksia.

Suosittelemme, että kokeilet peliä ennen kuin jatkat oppaan kanssa. Yksi pelin ominaisuuksista on, että pelilaudan oikealla puolella on numeroitu lista. Tämä lista näyttää pelin kaikki siirrot ja päivittyy pelin edetessä.

Kun olet pelannut peliä, jatka oppaan kanssa. Tulet aloittamaan yksinkertaisemmasta pohjasta. Seuraava askel on asentaa ympäristö, jotta voit aloittaa pelin rakentamisen.

## Oppaan asennusvaihe {/*setup-for-the-tutorial*/}

Alla olevassa koodieditorissa, paina **Forkkaa* oikeassa yläreunassa avataksesi editorin uuteen välilehteen käyttäen CodeSandboxia. CodeSandbox antaa sinun kirjoittaa koodia selaimessasi ja esikatsella miten käyttäjäsi näkevät luomasi sovelluksen. Uuden välilehden tulisi näyttää tyhjä ruutu ja tämän oppaan aloituskoodi.

<Sandpack>

```js src/App.js
export default function Square() {
  return <button className="square">X</button>;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

<Note>

You can also follow this tutorial using your local development environment. To do this, you need to:

<<<<<<< HEAD
Voit myös seurata tätä opasta paikallisessa kehitysympäristössä. Tämä vaatii:
=======
1. Install [Node.js](https://nodejs.org/en/)
1. In the CodeSandbox tab you opened earlier, press the top-left corner button to open the menu, and then choose **Download Sandbox** in that menu to download an archive of the files locally
1. Unzip the archive, then open a terminal and `cd` to the directory you unzipped
1. Install the dependencies with `npm install`
1. Run `npm start` to start a local server and follow the prompts to view the code running in a browser
>>>>>>> b214f78433756914ec32526dda48e76176dbf4fc

1. Asenna [Node.js](https://nodejs.org/en/)
1. Aikaisemmin avatussa CodeSandbox -välilehdessä, paina vasemmassa yläreunassa olevaa painiketta ja valitse **File > Export to ZIP** ladataksesi arkiston tiedostoista.
1. Pura arkisto, ja avaa sitten terminaali ja siirry `cd`:llä purettuun hakemistoon
1. Asenna riippuvuudet `npm install` komennolla
1. Suorita `npm start` käynnistääksesi paikallisen palvelimen ja seuraa kehotuksia nähdäksesi koodin selaimessa

Jos jäät jumiin, älä anna tämän estää! Seuraa opasta verkossa ja kokeile paikallista asennusta myöhemmin uudelleen.

</Note>

## Yleiskatsaus {/*overview*/}

Nyt kun olet valmis, annetaan yleiskatsaus Reactista!

### Aloituskoodin tarkastelu {/*inspecting-the-starter-code*/}

CodeSandboxissa näet kolme eri osiota:

![CodeSandbox aloituskoodilla](../images/tutorial/react-starter-code-codesandbox.png)

1. _Files_ osio, jossa on listaus tiedostoista kuten `App.js`, `index.js`, `styles.css` ja hakemisto nimeltään `public`
1. _Koodieditori_, jossa näet valitun tiedoston lähdekoodin
1. _Selain_, jossa näet miltä kirjoittamasi koodi näyttää

`App.js` tiedoston tulisi olla valittuna _Files_ osiossa. Tiedoston sisältö _koodieditorissa_ tulisi olla seuraava:

```jsx
export default function Square() {
  return <button className="square">X</button>;
}
```

_Selaimen_ tulisi näyttää neliö, jossa on X:

![Neliö, jossa on X](../images/tutorial/x-filled-square.png)

Katsotaan nyt aloituskoodin tiedostoja.

#### `App.js` {/*appjs*/}

Koodi `App.js` tiedostossa luo _komponentin_. Reactissa komponentti on pala uudelleenkäytettävää koodia, joka edustaa palan käyttöliittymää. Komponentteja käytetään renderöimään, hallitsemaan ja päivittämään sovelluksesi UI elementtejä. Katsotaan komponenttia rivi riviltä nähdäksemme mitä tapahtuu:

```js {1}
export default function Square() {
  return <button className="square">X</button>;
}
```

Ensimmäinen rivi määrittelee funktion nimeltään `Square`. `export` -JavaScript avainsana tekee funktion saavutettavaksi tämän tiedoston ulkopuolelle. `default` avainsana kertoo muille tiedostoille, että tämä on pääfunktio tiedostossasi.

```js {2}
export default function Square() {
  return <button className="square">X</button>;
}
```

Seuraava koodirivi palauttaa painonapin. `return` -JavaScript avainsanan tarkoittaa, mitä ikinä sen jälkeen tulee, palautetaan se arvo funktion kutsujalle. `<button>` on *JSX elementti*. JSX elementti on yhdistelmä JavaScript koodia ja HTML tageja, jotka kuvaavat mitä haluaisit näyttää. `className="square"` on painikkeen ominaisuus taikka *propsi*, joka ekertoo CSS:lle miten painike tulisi tyylittää. `X` on teksti, joka näytetään painikkeen sisällä, ja `</button>` sulkee JSX elementin osoittaen, että mitään seuraavaa sisältöä ei tulisi sijoittaa painikkeen sisälle.

#### `styles.css` {/*stylescss*/}

Paina tiedostosta nimeltään `styles.css` CodeSandboxin _Files_ osiossa. Tämä tiedosto määrittelee React sovelluksesi tyylin. Ensimmäiset kaksi _CSS selektoria_ (`*` ja `body`) määrittävät suuren osan sovelluksestasi tyyleistä, kun taas `.square` selektori määrittää minkä tahansa komponentin tyylin, jossa `className` ominaisuus on asetettu `square` arvoon. Koodissasi tämä vastaa painiketta `Square` komponentissa `App.js` tiedostossa.

#### `index.js` {/*indexjs*/}

Paina tiedostosta nimeltään `index.js` CodeSandboxin _Files_ osiossa. Et tule muokkaamaan tätä tiedostoa oppaan aikana, mutta se on silta `App.js` tiedostossa luomasi komponentin ja selaimen välillä.

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';
```

<<<<<<< HEAD
Rivit 1-5 tuovat kaikki tarvittavat palaset yhteen:
=======
Lines 1-5 bring all the necessary pieces together: 
>>>>>>> b214f78433756914ec32526dda48e76176dbf4fc

* React
* Reactin kirjasto, jolla se juttelee selaimen kanssa (React DOM)
* komponenttiesi tyylit
* luomasi komponentti `App.js` tiedostossa.

Loput tiedostosta tuo kaikki palaset yhteen ja palauttaa lopputuotteen `index.html` tiedostoon `public` hakemistossa.

### Pelilaudan rakentaminen {/*building-the-board*/}

Palataan takaisin `App.js` tiedostoon. Tämä on missä tulet viettämään lopun oppaan ajasta.

Nykyisillään pelilauta on vain yksi neliö, mutta tarvitset yhdeksän! Voit yrittää vain kopioida ja liittää neliösi tehdäksesi kaksi neliötä näin:

```js {2}
export default function Square() {
  return <button className="square">X</button><button className="square">X</button>;
}
```

Saat tämän virheen:

<ConsoleBlock level="error">

/src/App.js: Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX Fragment `<>...</>`?

</ConsoleBlock>

<<<<<<< HEAD
React komponenttien täytyy palauttaa yksi JSX elementti, ei useampia vierekkäisiä JSX elementtejä kun kaksi painonappia. Korjataksesi tämän käytä *fragmenttejä* (`<>` ja `</>`) käärimään useampia vierekkäisiä JSX elementtejä näin:
=======
React components need to return a single JSX element and not multiple adjacent JSX elements like two buttons. To fix this you can use *Fragments* (`<>` and `</>`) to wrap multiple adjacent JSX elements like this:
>>>>>>> b214f78433756914ec32526dda48e76176dbf4fc

```js {3-6}
export default function Square() {
  return (
    <>
      <button className="square">X</button>
      <button className="square">X</button>
    </>
  );
}
```

Nyt näet:

![kaksi x:llä täytettyä neliötä](../images/tutorial/two-x-filled-squares.png)

Hyvä! Nyt sinun tulee kopioida ja littää muutaman kerran saadaksesi yhdeksän neliötä ja sitten....

![yhdeksän x:llä täyettyä neliötä rivissä](../images/tutorial/nine-x-filled-squares.png)

Voi ei! Neliöt ovat kaikki yhdessä rivissä eikä ruudukossa kuten tarvitset sen pelilaudalla. Korjataksesi tämän sinun tulee ryhmitellä neliöt riveihin `div` elementeillä ja lisätä muutama CSS luokka. Samalla kun teet tämän, annat jokaiselle neliölle numeron varmistaaksesi, että tiedät missä jokainen neliö näytetään.

`App.js` tiedostossa, päivitä `Square` komponentti näyttämään tältä:

```js {3-19}
export default function Square() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
}
```

`styles.css` tiedostossa määritelty CSS tyylittää divit `className`:n `board-row` arvolla. Nyt kun olet ryhmitellyt komponenttisi riveihin tyylitetyillä `div` elementeillä, sinulla on ristinolla-pelilauta:

![ristinolla-pelilauta numeroitu yhdestä yhdeksään](../images/tutorial/number-filled-board.png)

Mutta nyt sinulla on ongelma. Komponenttisi `Square` ei enää ole neliö. Korjataksesi tämän, muuta nimi `Square` komponentille `Board`:iksi:

```js {1}
export default function Board() {
  //...
}
```

Tässä kohtaa, koodisi tuli näyttää tämänkaltaiselta:

<Sandpack>

```js
export default function Board() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

<Note>

Pst... Tuossa on aika paljon kirjoitettavaa! On ihan ok kopioida ja liittää koodia tältä sivulta. Jos kuitenkin haluat haastetta, suosittelemme kopioida vain koodia, jonka olet kirjoittanut ainakin kerran itse.

</Note>

### Datan välittäminen propseilla {/*passing-data-through-props*/}

Seuraavaksi haluat muuttaa neliön arvon tyhjästä X:ksi kun käyttäjä painaa neliötä. Tällä hetkellä sinun täytyisi kopioida ja liittää koodi, joka päivittää neliön yhdeksän kertaa (kerran jokaiselle neliölle)! Sen sijaan, että kopioisit ja liittäisit, Reactin komponenttiarkkitehtuuri antaa sinun luoda uudelleenkäytettävän komponentin välttääksesi sotkuisen, toistuvan koodin.

Ensiksi, kopioit rivin, joka määrittelee ensimmäisen neliösi (`<button className="square">1</button>`) `Board` komponentistasi uuteen `Square` komponenttiin:

```js {1-3}
function Square() {
  return <button className="square">1</button>;
}

export default function Board() {
  // ...
}
```

Sitten päivität `Board` komponentin renderöimään sen `Square` komponentin käyttäen JSX syntaksia:

```js {5-19}
// ...
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

Huomaa miten toisin kuin selainten `div`:it, omat komponenttisi `Board` ja `Square` täytyy alkaa isolla kirjaimella.

Katsotaanpa:

![pelilauta täytetty ykkösillä](../images/tutorial/board-filled-with-ones.png)

Voi ei! Menetit numeroidut neliöt, jotka sinulla oli aiemmin. Nyt jokaisessa neliössä lukee "1". Korjataksesi tämän, käytä *propseja* välittääksesi arvon, jonka jokaisen neliön tulisi saada vanhemmalta komponentilta (`Board`) sen alakomponentille (`Square`).

Päivitä `Square` komponentti lukemaan `value` propsi, jonka välität `Board` komponentilta:

```js {1}
function Square({ value }) {
  return <button className="square">1</button>;
}
```

`function Square({ value })` kertoo, että `Square` komponentille voidaan välittää `value` niminen propsi.

Nyt haluat näyttää `value` arvon `1`:n sijaan jokaisessa neliössä. Kokeile tehdä se näin:

```js {2}
function Square({ value }) {
  return <button className="square">value</button>;
}
```

Oho, tämä ei ollut mitä halusit:

![pelilauta täytetty value tekstillä](../images/tutorial/board-filled-with-value.png)

Halusit renderöidä JavaScript muuttujan nimeltään `value` komponentistasi, et sanan "value". Päästäksesi "takaisin JavaScriptiin" JSX:stä, tarvitset aaltosulkeet. Lisää aaltosulkeet `value`:n ympärille JSX:ssä näin:

```js {2}
function Square({ value }) {
  return <button className="square">{value}</button>;
}
```

Toistaiseksi, sinun tulisi nähdä tyhjä pelilauta:

![tyhjä pelilauta](../images/tutorial/empty-board.png)

Näin tapahtuu, koska `Board` komponentti ei ole välittänyt `value` propseja jokaiselle `Square` komponentille, jonka se renderöi. Korjataksesi tämän, lisää `value` propsi jokaiselle `Square` komponentille, jonka `Board` komponentti renderöi:

```js {5-7,10-12,15-17}
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
}
```

Nyt sinun tulisi nähdä numeroitu ruudukko taas:

![ristinolla-pelilauta täytetty yhdestä yhdeksään](../images/tutorial/number-filled-board.png)

Päivitetyn koodisi tulisi näyttää tämänkaltaiselta:

<Sandpack>

```js src/App.js
function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### Interaktiivisen komponentin luominen {/*making-an-interactive-component*/}

Täytetään `Square` komponentti `X`:llä kun klikkaat sitä. Määritä funktio nimeltään `handleClick` `Square` komponentin sisällä. Sitten, lisää `onClick` prosi painonapin JSX elementtiin, joka palautetaan `Square` komponentista:

```js {2-4,9}
function Square({ value }) {
  function handleClick() {
    console.log('clicked!');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
```

Jos painat neliöstä nyt, sinun tulisi nähdä loki, jossa lukee `"clicked!"` _Console_ välilehdellä _Browser_ osiossa CodeSandboxissa. Painamalla neliötä useammin kuin kerran, lokiin tulee uusi rivi, jossa lukee `"clicked!"`. Toistuvat lokit samalla viestillä eivät luo uusia rivejä lokiin. Sen sijaan, näet kasvavan laskurin ensimmäisen `"clicked!"` lokin vieressä.

<Note>

Jos seuraat tätä opasta paikallisessa kehitysympäristössä, sinun tulee avata selaimen konsoli. Esimerkiksi, jos käytät Chrome selainta, voit avata konsolin näppäinyhdistelmällä **Shift + Ctrl + J** (Windows/Linux) tai **Option + ⌘ + J** (macOS).

</Note>

Seuraavaksi, haluat Square komponentin "muistavat", että sitä painettiin, ja täyttää sen "X" merkillä. Komponentit käyttävät *tilaa* muistaakseen asioita.

React tarjoaa erityisen funktion nimeltään `useState`, jota voit kutsua komponentistasi, jotta se "muistaa" asioita. Tallennetaan `Square` komponentin nykyinen arvo tilaan ja muutetaan sitä, kun `Square` painetaan.

Importtaa `useState` tiedoston ylläosassa. Poista `value` propsi `Square` komponentista. Sen sijaan, lisää uusi rivi `Square` komponentin alkuun, joka kutsuu `useState`:a. Anna sen palauttaa tilamuuttuja nimeltään `value`:

```js {1,3,4}
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    //...
```

`value` pitää sisällään arvon ja `setValue` on funktio, jota voidaan käyttää muuttamaan arvoa. `null`, joka välitetään `useState`:lle, käytetään alkuperäisenä arvona tälle tilamuuttujalle, joten `value` on aluksi `null`.

Koska `Square` komponentti ei enää hyväksy propseja, poistat `value` propin kaikista yhdeksästä `Square` komponentista, jotka `Board` komponentti luo:

```js {6-8,11-13,16-18}
// ...
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

Nyt muutat `Square`:n näyttämään "X":n kun sitä painetaan. Korvaa `console.log("clicked!");` tapahtumankäsittelijä `setValue('X');`:lla. Nyt `Square` komponenttisi näyttää tältä:

```js {5}
function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
```

Kutsumalla `set` funktiota `onClick` käsittelijästä, kerrot Reactille renderöidä `Square`:n uudelleen aina kun sen `<button>`:ia painetaan. Päivityksen jälkeen, `Square`n `value` on `'X'`, joten näet "X":n pelilaudalla. Paina mitä tahansa neliötä, ja "X":n tulisi näkyä:

![x merkkien lisääminen pelilaudalle](../images/tutorial/tictac-adding-x-s.gif)

Jokaisella Squarella on sen oma tila: `value` joka on tallennettu jokaisessa Squaressa on täysin riippumaton muista. Kun kutsut `set` funktiota komponentissa, React päivittää automaattisesti myös alakomponentit.

Kun olet tehnyt yllä olevat muutokset, koodisi tulisi näyttää tältä:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### React kehitystyökalut {/*react-developer-tools*/}

React kehitystyökalujen avulla voit tarkastella React komponenttiesi propseja ja tilaa. React DevTools välilehti löytyy _browser_ osion alapuolelta CodeSandboxissa:

![React DevTools CodeSandboxissa](../images/tutorial/codesandbox-devtools.png)

Tarkastellaksesi tiettyä komponenttia ruudulla, käytä nappia React DevToolsin vasemmassa yläkulmassa:

![Komponentin valinta sivulla React DevToolsissa](../images/tutorial/devtools-select.gif)

<Note>

Paikallisessa kehityksessä, React DevTools on saatavilla [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/), ja [Edge](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil) selainlaajennuksena. Asenna se, ja *Components* välilehti ilmestyy selaimen kehitystyökaluihin sivuille, jotka käyttävät Reactia.

</Note>

## Pelin viimeistely {/*completing-the-game*/}

Tähän mennessä, sinulla on kaikki peruspalikat ristinolla-peliisi. Saadaksesi täydellisen pelin, sinun täytyy nyt vuorotella "X":n ja "O":n laittamista pelilaudalle, ja sinun täytyy keksiä tapa määrittää voittaja.

### Tilan nostaminen ylös {/*lifting-state-up*/}

Tällä hetkellä, jokainen `Square` komponentti ylläpitää osaa pelin tilasta. Voittaaksesi ristinolla-pelin, `Board` komponentin täytyy jotenkin tietää jokaisen yhdeksän `Square` komponentin tila.

Miten lähestyisit tätä? Aluksi, kuten saatat arvata, `Board`:n täytyy "kysyä" jokaiselta `Square`:lta sen tila. Vaikka tämä lähestymistapa on teknisesti mahdollista Reactissa, emme suosittele sitä, koska koodista tulee vaikeaa ymmärtää, altistaen se bugeille, ja vaikea refaktoroida. Sen sijaan, paras lähestymistapa on tallentaa pelin tila ylemmässä `Board` komponentissa jokaisen `Square` komponentin sijaan. `Board` komponentti voi kertoa jokaiselle `Square` komponentille mitä näyttää välittämällä propseja, kuten teit kun välitit numeron jokaiselle `Square` komponentille.

**Kerätäksesi dataa useammista alakomponenteista, tai saadaksesi kahden alakomponentin kommunikoimaan toistensa kanssa, määritä jaettu tila niitä ylemmässä komponentissa. Ylempi komponentti voi välittää tilan takaisin alakomponenteilleen propseina. Tämä pitää alakomponentit synkronoituina toistensa ja yläkomponentin kanssa.**

Tilan nostaminen yläkomponenttiin on yleistä kun React komponentteja refaktoroidaan.

Otetaan tilaisuus kokeilla tätä. Muokkaa `Board` komponenttia siten, että se määrittelee tilamuuttujan nimeltään `squares`, joka oletuksena on taulukko, jossa on yhdeksän `null` arvoa vastaten yhdeksää neliötä:

```js {3}
// ...
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    // ...
  );
}
```

`Array(9).fill(null)` luo taulukon yhdeksällä kohdalla ja asettaa jokaisen niistä `null` arvoon. `useState()` kutsu sen ympärillä määrittelee `squares` tilamuuttujan, jonka arvo on aluksi asetettu tuohon taulukkoon. Jokainen taulukon kohta vastaa neliön arvoa. Kun täytät pelilaudan myöhemmin, `squares` taulukko näyttää tältä:

```jsx
['O', null, 'X', 'X', 'X', 'O', 'O', null, null]
```

Nyt `Board` komponenttisi täytyy välittää `value` propsi jokaiselle `Square` komponentille, jonka se renderöi:

```js {6-8,11-13,16-18}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} />
        <Square value={squares[1]} />
        <Square value={squares[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} />
        <Square value={squares[4]} />
        <Square value={squares[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} />
        <Square value={squares[7]} />
        <Square value={squares[8]} />
      </div>
    </>
  );
}
```

Seuraavakasi, muokkaa `Square` komponentti vastaanottamaan `value` propsi Board komponentilta. Tämä vaatii `Square` komponentin oman tilamuuttujan `value` ja painonapin `onClick` propsin poistamisen:

```js {1,2}
function Square({value}) {
  return <button className="square">{value}</button>;
}
```

Tässä kohtaa sinun tulisi nähdä tyhjä ristinolla-pelilauta:

![tyhjä pelilauta](../images/tutorial/empty-board.png)

Ja koodisi tulisi näyttää tältä:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} />
        <Square value={squares[1]} />
        <Square value={squares[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} />
        <Square value={squares[4]} />
        <Square value={squares[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} />
        <Square value={squares[7]} />
        <Square value={squares[8]} />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Jokainen Square saa nyt `value` propsin, joka on joko `'X'`, `'O'`, tai `null` tyhjille neliöille.

Seuraavaksi, sinun täytyy muuttaa mitä tapahtuu kun `Square`:a klikataan. `Board` komponentti nyt ylläpitää mitkä neliöt ovat täytettyjä. Sinun täytyy luoda tapa `Square`:lle päivittää `Board`:n tila. Koska tila on yksityistä komponentille, joka sen määrittelee, et voi päivittää `Board`:n tilaa suoraan `Square`:sta.

Sen sijaan, välität funktion `Board` komponentista `Square` komponentille, ja kutsut sitä `Square`:sta kun neliötä painetaan. Aloitat funktiosta, jota `Square` komponentti kutsuu kun sitä painetaan. Kutsut sitä `onSquareClick`:ssa:

```js {3}
function Square({ value }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

Seuraavaksi, lisäät `onSquareClick` funktion `Square` komponentin propseihin:

```js {1}
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

Nyt yhdistät `onSquareClick` propsin `Board` komponentin funktioon, jonka nimeät `handleClick`. Yhdistääksesi `onSquareClick` `handleClick`:iin, välität funktion `onSquareClick` propsin ensimmäiselle `Square` komponentille:

```js {7}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={handleClick} />
        //...
  );
}
```

Lopuksi, määrittelet `handleClick` funktion Board komponentin sisällä päivittämään `squares` taulukon ylläpitämään pelilaudan tilaa:

```js {4-8}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick() {
    const nextSquares = squares.slice();
    nextSquares[0] = "X";
    setSquares(nextSquares);
  }

  return (
    // ...
  )
}
```

`handleClick` funktio luo kopion `squares` taulukosta (`nextSquares`) JavaScriptin `slice()` taulukkometodilla. Sitten, `handleClick` päivittää `nextSquares` taulukon lisäämällä `X`:n ensimmäiseen (`[0]` indeksi) neliöön.

Kutsumalla `setSquares` funktiota kerrot Reactille, että komponentin tila on muuttunut. Tämä käynnistää renderöinnin komponenteille, jotka käyttävät `squares` tilaa (`Board`) sekä sen alakomponenteille (`Square` komponentit, jotka muodostavat pelilaudan).

<Note>

<<<<<<< HEAD
JavaScript tukee [closureja](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures), mikä tarkoittaa, että sisäinen funktio (esim. `handleClick`) pääsee käsiksi muuttujiin ja funktioihin, jotka on määritelty ulomman funktion sisällä (esim. `Board`). `handleClick` funktio voi lukea `squares` tilaa ja kutsua `setSquares` metodia, koska ne molemmat on määritelty `Board` funktion sisällä.
=======
JavaScript supports [closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) which means an inner function (e.g. `handleClick`) has access to variables and functions defined in an outer function (e.g. `Board`). The `handleClick` function can read the `squares` state and call the `setSquares` method because they are both defined inside of the `Board` function.
>>>>>>> b214f78433756914ec32526dda48e76176dbf4fc

</Note>

Nyt voit lisätä X:ät pelilaudalle... mutta vain ylävasempaan neliöön. `handleClick` funktiosi on kovakoodattu päivittämään ylävasemman neliön indeksiä (`0`). Päivitetään `handleClick` funktio päivittämään mitä tahansa neliötä. Lisää argumentti `i` `handleClick` funktioon, joka ottaa neliön indeksin, jota päivittää:

```js {4,6}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = "X";
    setSquares(nextSquares);
  }

  return (
    // ...
  )
}
```

Seuraavaksi, sinun täytyy välittää `i` `handleClick`:lle. Voit yrittää asettaa `onSquareClick` propin neliölle suoraan JSX:ssä `handleClick(0)` näin, mutta se ei toimi:

```jsx
<Square value={squares[0]} onSquareClick={handleClick(0)} />
```

Syy miksi tämä ei toimi on, `handleClick(0)` kustu on osa pelilaudan renderöintiä. Koska `handleClick(0)` muuttaa pelilaudan tilaa kutsumalla `setSquares`:ia, koko pelilauta renderöidään uudelleen. Mutta tämä ajaa `handleClick(0)` uudelleen, mikä johtaa loputtomaan silmukkaan:

<ConsoleBlock level="error">

Too many re-renders. React limits the number of renders to prevent an infinite loop.

</ConsoleBlock>

Miksi tämä ongelma ei tapahtunut aiemmin?

Kun välitit `onSquareClick={handleClick}`, välitit `handleClick` funktion propseina. Et kutsunut sitä! Mutta nyt kutsut sitä heti--huomaa sulkeet `handleClick(0)`--ja siksi se ajetaan liian aikaisin. Et *halua* kutsua `handleClick` ennen kuin käyttäjä klikkaa!

Voisit korjata tämän tekemällä funktion kuten `handleFirstSquareClick`, joka kutsuu `handleClick(0)`, funktion kuten `handleSecondSquareClick`, joka kutsuu `handleClick(1)`, ja niin edelleen. Välittäisit (et kutsuisi) näitä funktioita propseina kuten `onSquareClick={handleFirstSquareClick}`. Tämä korjaisi loputtoman silmukan.

Yhdeksän eri funktion määritteleminen ja nimeäminen on liian raskasta. Sen sijaan tehdään näin:

```js {6}
export default function Board() {
  // ...
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        // ...
  );
}
```

Huomaa uusi `() =>` syntaksi. Tässä, `() => handleClick(0)` on *nuolifunktio*, joka on lyhyempi tapa määritellä funktioita. Kun neliötä painetaan, koodi `=>` "nuolen" jälkeen ajetaan, kutsuen `handleClick(0)`.

Nyt sinun tulee päivittää muut kahdeksan neliötä kutsumaan `handleClick` nuolifunktioista, jotka välität. Varmista, että argumentti jokaiselle `handleClick` kutsulle vastaa oikean neliön indeksiä:

```js {6-8,11-13,16-18}
export default function Board() {
  // ...
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
};
```

Nyt voit taas lisätä X:ät mihin tahansa neliöön pelilaudalla painamalla niitä:

![pelilaudan täyttäminen x:llä](../images/tutorial/tictac-adding-x-s.gif)

Mutta tällä kertaa tilanhallinta on `Board` komponentin vastuulla!

Tämä on mitä koodisi tulisi näyttää:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = 'X';
    setSquares(nextSquares);
  }

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Nyt kun tilanhallintasi on `Board` komponentissa, yläkomponentti `Board` välittää propseja alakomponenteille `Square` komponenteille, jotta ne voidaan näyttää oikein. Kun neliötä painetaan, alakomponentti `Square` kysyy yläkomponentti `Board`:lta tilan päivittämistä pelilaudalla. Kun `Board`:n tila muuttuu, sekä `Board` komponentti että jokainen `Square` renderöidään uudelleen automaattisesti. Pitämällä kaikkien neliöiden tila `Board` komponentissa, se pystyy määrittämään voittajan tulevaisuudessa.

Käydään läpi mitä tapahtuu kun käyttäjä painaa ylävasenta neliötä pelilaudalla lisätäkseen siihen `X`:n:

1. Ylävasemman neliön klikkaaminen suorittaa funktion, jonka `button` sai `onClick` propsina `Square` komponentilta. `Square` komponentti sai funktion `onSquareClick` propsina `Board` komponentilta. `Board` komponentti määritteli funktion suoraan JSX:ssä. Se kutsuu `handleClick` funktiota argumentilla `0`.
1. `handleClick` käyttää argumenttia (`0`) päivittääkseen `squares` taulukon ensimmäisen elementin `null` arvosta `X` arvoon.
1. `squares` tila `Board` komponentissa päivitettiin, joten `Board` ja kaikki sen alakomponentit renderöitiin uudelleen. Tämä aiheuttaa `Square` komponentin `value` propin muuttumisen indeksillä `0` `null` arvosta `X` arvoon.

Lopussa käyttäjä näkee, että ylävasen neliö on muuttunut tyhjästä `X`:ksi sen painamisen jälkeen.

<Note>

DOM `<button>` elementin `onClick` attribuutilla on erityinen merkitys Reactissa, koska se on sisäänrakennettu komponentti. Mukautetuille komponenteille kuten `Square`, nimeäminen on sinusta kiinni. Voit antaa minkä tahansa nimen `Square` komponentin `onSquareClick` propsille tai `Board` komponentin `handleClick` funktiolle, ja koodi toimisi samalla tavalla. Reactissa, yleinen tapa on käyttää `onSomething` nimiä propseille, jotka edustavat tapahtumia ja `handleSomething` funktioille, jotka käsittelevät näitä tapahtumia.

</Note>

### Miksi muuttumattomuus on tärkeää {/*why-immutability-is-important*/}

Huomaa miten `handleClick`:ssa kutsut `.slice()` luodaksesi kopion `squares` taulukosta sen sijaan, että muuttaisit olemassaolevaa taulukkoa. Selittääksemme miksi, meidän täytyy keskustella muuttumattomuudesta ja miksi muuttumattomuus on tärkeää oppia.

On kaksi yleistä tapaa muuttaa dataa. Ensimmäinen tapa on *mutatoida* dataa muuttamalla suoraan datan arvoja. Toinen tapa on korvata data uudella kopiolla, jossa on halutut muutokset. Tässä on miltä se näyttäisi, jos mutatoisit `squares` taulukkoa:

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
squares[0] = 'X';
// Nyt`squares` on arvoltaan ["X", null, null, null, null, null, null, null, null];
```

Ja tässä on miltä se näyttäisi jos muuttaisit dataa mutatoimatta `squares` taulukkoa:

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
const nextSquares = ['X', null, null, null, null, null, null, null, null];
// Nyt `squares` on muttumaton, mutta `nextSquares`:n ensimmäinen solu on 'X' `null`:n sijaan
```

Lopputulos on sama, mutta mutatoimatta (muuttamatta alla olevaa dataa) suoraan, saat useita etuja.

Muuttumattomuus tekee monimutkaisten ominaisuuksien toteuttamisesta paljon helpompaa. Myöhemmin tässä oppaassa, toteutat "aikamatkustuksen" ominaisuuden, joka antaa sinun tarkastella pelin historiaa ja "hypätä takaisin" menneisiin siirtoihin. Tämä toiminnallisuus ei ole pelien erityispiirre--kyky peruuttaa ja palauttaa tiettyjä toimintoja on yleinen vaatimus sovelluksille. Suoran datan mutaation välttäminen antaa sinun pitää edelliset versiot datasta ehjänä, ja käyttää niitä myöhemmin.

On myös toinen etu muuttumattomuudessa. Oletuksena, kaikki lapsikomponentit renderöidään automaattisesti uudelleen, kun yläkomponentin tila muuttuu. Tämä sisältää jopa lapsikomponentit, jotka eivät olleet vaikuttuneita muutoksesta. Vaikka renderöinti ei ole itsessään huomattavaa käyttäjälle (sinun ei pitäisi aktiivisesti yrittää välttää sitä!), saatat haluta ohittaa renderöinnin puun osalta, joka ei selvästi ollut vaikuttunut siitä suorituskyky syistä. Muuttumattomuus tekee hyvin halvaksi komponenteille verrata onko niiden data muuttunut vai ei. Voit oppia lisää siitä, miten React valitsee milloin renderöidä komponentti uudelleen [`memo` API referenssistä](/reference/react/memo).

### Vuorojen ottaminen {/*taking-turns*/}

Nyt on aika korjata suuri vika tässä ristinolla-pelissä: "0":a ei voi merkitä pelilaudalle.

Asetat ensimmäisen siirron oletuksena "X":ksi. Pidetään kirjaa tästä lisäämällä toinen tilamuuttuja `Board` komponenttiin:

```js {2}
function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  // ...
}
```

Joka kerta kun pelaaja siirtää, `xIsNext` (totuusarvo) käännetään määrittämään kumpi pelaaja siirtää seuraavaksi ja pelin tila tallennetaan. Päivität `Board` komponentin `handleClick` funktion kääntämään `xIsNext` arvon:

```js {7,8,9,10,11,13}
export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    //...
  );
}
```

Nyt kun klikkaat eri neliöitä, ne vaihtelevat `X` ja `0` välillä, kuten niiden pitäisi!

Mutta hetkonen, tässä on ongelma. Kokeile klikata samaa neliötä useamman kerran:

![0 ylikirjoittaa X:n](../images/tutorial/o-replaces-x.gif)

`X` ylikirjoitetaan `0`:lla! Vaikka tämä lisäisikin mielenkiint0isen käänteen peliin, pysytään alkuperäisissä säännöissä toistaiseksi.

Kun merkitset neliön `X`:llä tai `0`:lla, et ensin tarkista onko neliöllä jo `X` tai `0` arvoa. Voit korjata tämän *palaamalla aikaisin*. Tarkistat onko neliöllä jo `X` tai `0` arvo. Jos neliö on jo täytetty, `return` `handleClick` funktiossa aikaisin--ennen kuin se yrittää päivittää pelilaudan tilaa.

```js {2,3,4}
function handleClick(i) {
  if (squares[i]) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

Nyt voit lisätä vain `X` tai `0` tyhjille neliöille! Tässä on mitä koodisi tulisi näyttää tässä vaiheessa:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    if (squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### Voittajan päättäminen {/*declaring-a-winner*/}

Nyt kun pelaajat voivat ottaa vuoroja, haluat näyttää kun peli on voitettu ja ei ole enää vuoroja tehtävänä. Tämän tekemiseksi lisäät apufunktion nimeltä `calculateWinner`, joka ottaa yhdeksän neliön taulukon, tarkistaa onko voittaja ja palauttaa `'X'`, `'O'`, tai `null` tarvittaessa. Älä huoli liikaa `calculateWinner` funktiosta; se ei ole Reactiin erityinen:

```js src/App.js
export default function Board() {
  //...
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

<Note>

Ei ole väliä määritteletkö `calculateWinner` ennen vai jälkeen `Board`:n. Laitetaan se loppuun, jotta sinun ei tarvitse selata sen ohi joka kerta kun muokkaat komponenttejasi.

</Note>

Kutsut `calculateWinner(squares)` `Board` komponentin `handleClick` funktiossa tarkistaaksesi onko pelaaja voittanut. Voit suorittaa tämän tarkistuksen samaan aikaan kun tarkistat onko käyttäjä klikannut neliötä, jossa on jo `X` tai `O`. Haluamme palata aikaisin molemmissa tapauksissa:

```js {2}
function handleClick(i) {
  if (squares[i] || calculateWinner(squares)) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

Antaaksesi pelaajiesi tietää milloin peli on ohi, voit näyttää tekstin kuten "Voittaja: X" tai "Voittaja: 0". Tämän tekemiseksi lisäät `status` osion `Board` komponenttiin. Status näyttää voittajan, jos peli on ohi ja jos peli on kesken, näytät kumman pelaajan vuoro on seuraavaksi:

```js {3-9,13}
export default function Board() {
  // ...
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Voittaja: " + winner;
  } else {
    status = "Seuraava pelaajaa: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        // ...
  )
}
```

Onneksi olkoon! Sinulla on nyt toimi ristinolla-peli. Ja olet juuri oppinut Reactin perusteet. Joten *sinä* olet oikea voittaja tässä. Tässä on miltä koodisi tulisi näyttää:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Voittaja: ' + winner;
  } else {
    status = 'Seuraava pelaajaa: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

## Aikamatkustuksen lisääminen {/*adding-time-travel*/}

Lopullisena harjoituksena, tehdään mahdolliseksi "aikamatkustus ajassa taaksepäin" edellisiin siirtoihin pelissä.

### Pelin siirtojen tallentaminen {/*storing-a-history-of-moves*/}

Jos mutatoit `squares` taulukkoa, aikamatkustuksen toteuttaminen olisi hyvin vaikeaa.

Kuitenkin, jos käytit `slice()`:a luodaksesi uuden kopion `squares` taulukosta jokaisen siirron jälkeen, ja käsitellä sitä muuttumattomana. Tämä antaa sinun tallentaa jokaisen edellisen version `squares` taulukosta, ja navigoida niiden välillä, jotka ovat jo tapahtuneet.

Tallennat aikaisemmat `squares` taulukot toiseen taulukoon nimeltään `history`, jonka toteutat uutena tilamuuttujana. `history` taulukko edustaa kaikkia pelilaudan tiloja, ensimmäisestä viimeiseen siirtoon, ja sillä on tämän kaltainen muoto:

```jsx
[
  // Ennen ensimmäistä liikettä
  [null, null, null, null, null, null, null, null, null],
  // Ensimmäisen liikkeen jälkeen
  [null, null, null, null, 'X', null, null, null, null],
  // Toisen liikkeen jälkeen
  [null, null, null, null, 'X', null, null, null, 'O'],
  // ...
]
```

### Tilan nostaminen ylös, uudestaan {/*lifting-state-up-again*/}

Tulet kirjoittamaan uuden ylätason komponentin nimeltään `Game` näyttämään listan aiemmista liikkeistä. Tähän tulee `history` tila, joka sisältää koko pelin historian.

`history` tilan asettaminen `Game` komponenttiin antaa sinun poistaa `squares` tilan sen `Board` alakomponentista. Aivan kuten "nostit tilan ylös" `Square` komponentista `Board` komponenttiin, nostat sen nyt `Board` komponentista ylätason `Game` komponenttiin. Tämä antaa `Game` komponentille täyden kontrollin `Board`:n datan yli ja antaa sen ohjata `Board` komponenttia renderöimään edelliset vuorot `history`:sta.

Ensiksi, lisää `Game` komponentti `export default`:lla. Aseta se renderöimään `Board` komponentti ja joitain merkintäkoodia:

```js {1,5-16}
function Board() {
  // ...
}

export default function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
      <div className="game-info">
        <ol>{/*TODO*/}</ol>
      </div>
    </div>
  );
}
```

Huomaa, että olet poistamassa `export default` avainsanat ennen `function Board() {` määrittelyä ja lisäämässä ne ennen `function Game() {` määrittelyä. Tämä kertoo `index.js` tiedostolle käyttää `Game` komponenttia ylätason komponenttina sen sijaan, että käyttäisit `Board` komponenttia. Lisä `div`:t, jotka `Game` komponentti palauttaa, tekevät tilaa pelin tiedoille, jotka lisäät pelilaudalle myöhemmin.

Lisää tila `Game` komponenttiin seuraamaan kumpi pelaaja on seuraavaksi ja pelin siirtojen historia:

```js {2-3}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // ...
```

Huomaa miten `[Array(9).fill(null)]` on taulukko, jossa on yksi alkio, joka on taulukko, jossa on 9 `null`:a.

Renderöidäksesi neliöt nykyiselle siirrolle, luet viimeisen `squares` taulukon `history`:sta. Et tarvitse `useState`:a tähän--sinulla on jo tarpeeksi tietoa laskeaksesi se renderöinnin aikana:

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];
  // ...
```

Seuraavaksi, luo `handlePlay` funktio `Game` komponenttiin, jota kutsutaan `Board` komponentin toimesta päivittämään peliä. Välitä `xIsNext`, `currentSquares` ja `handlePlay` propseina `Board` komponentille:

```js {6-8,13}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    // TODO
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        //...
  )
}
```

Tehdään `Board` komponentista täysin propseilla kontrolloitava. Muuta `Board` komponentti ottamaan kolme propia: `xIsNext`, `squares`, ja uusi `onPlay` funktio, jota `Board` voi kutsua päivitetyn taulukon kanssa, kun pelaaja tekee siirron. Poista seuraavaksi kaksi ensimmäistä riviä `Board` funktiosta, jotka kutsuvat `useState`:a:

```js {1}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    //...
  }
  // ...
}
```

Nyt korvaa `setSquares` ja `setXIsNext` kutsut `handleClick`:ssa `Board` komponentissa yhdellä kutsulla uuteen `onPlay` funktioon, jotta `Game` komponentti voi päivittää `Board`:n, kun käyttäjä klikkaa neliötä:

```js {12}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }
  //...
}
```

`Board` komponentti on täysin kontrolloitu propseilla, jotka sille välitetään `Game` komponentista. Sinun täytyy toteuttaa `handlePlay` funktio `Game` komponenttiin saadaksesi pelin toimimaan uudestaan.

Mitä `handlePlay`:n tulisi tehdä kun sitä kutsutaan? Muista, että `Board` kutsui `setSquares`:ia päivitetyllä taulukolla. Nyt se välittää päivitetyn `squares` taulukon `onPlay`:lle.

`handlePlay` funktion täytyy päivittää `Game`:n tila käynnistääkseen renderöinnin, mutta sinulla ei ole enää `setSquares` funktiota, jota voit kutsua--käytät nyt `history` tilamuuttujaa tallentaaksesi tämän tiedon. Haluat päivittää `history`:n lisäämällä päivitetyn `squares` taulukon uutena historiaan. Haluat myös kääntää `xIsNext`:n, aivan kuten `Board` teki ennen:

```js {4-5}
export default function Game() {
  //...
  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }
  //...
}
```

Tässä, `[...history, nextSquares]` luo uuden taulukon, joka sisältää kaikki `history`:n alkiot, seurattuna `nextSquares`:lla. (Voit lukea `...history` [*spread syntaksin*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) "luettele kaikki `history` taulukon alkiot".)

Esimerkiksi, jos `history` on `[[null,null,null], ["X",null,null]]` ja `nextSquares` on `["X",null,"0"]`, niin uusi `[...history, nextSquares]` taulukko on `[[null,null,null], ["X",null,null], ["X",null,"0"]]`.

Tässä kohtaa, olet siirtänyt tilan `Game` komponenttiin, ja käyttöliittymä tulisi toimia täysin, aivan kuten ennen refaktorointia. Tässä on miltä koodisi tulisi näyttää tässä vaiheessa:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Voittaja: ' + winner;
  } else {
    status = 'Seuraava pelaajaa: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{/*TODO*/}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### Aikaisempien liikkeiden näyttäminen {/*showing-the-past-moves*/}

Kerta olet nauhoittamassa ristinolla-pelin historiaa, voit nyt näyttää listan aikaisemmista siirroista pelaajalle.

React-elementit kuten `<button>` ovat tavallisia JavaScript olioita; voit välittää niitä ympäri sovellustasi. Renderöidäksesi useita kohteita Reactissa, voit käyttää React elementtien taulukkoa.

Sinulla on jo `history` taukukko siirroista tilassa, joten nyt sinun täytyy muuttaa se React elementtien taulukoksi. JavaScriptissä, muuttaaksesi yhden taulukon toiseksi, voit käyttää [taulukon `map` metodia:](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

```jsx
[1, 2, 3].map((x) => x * 2) // [2, 4, 6]
```

Haluat käyttää `map` metodia muuntaaksesi `history` siirroista React elementtien taulukoksi, jotka edustavat painikkeita näytöllä, ja näyttääksesi listan painikkeista "hyppäämään" aikaisempiin siirtoihin. Käytetään `map` metodia `history`:n yli `Game` komponentissa:

```js {11-13,15-27,35}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Siirry liikkeeseen #' + move;
    } else {
      description = 'Siirry pelin alkuun';
    }
    return (
      <li>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
```

<<<<<<< HEAD
Voit nähdä miltä koodisi tulisi näyttää alla. Huomaa, että sinun tulisi nähdä virhe kehittäjätyökalujen konsolissa, joka sanoo: ``Warning: Each child in an array or iterator should have a unique "key" prop. Check the render method of `Game`.`` Korjaat tämän virheen seuraavassa osiossa.
=======
You can see what your code should look like below. Note that you should see an error in the developer tools console that says: 

<ConsoleBlock level="warning">
Warning: Each child in an array or iterator should have a unique "key" prop. Check the render method of &#96;Game&#96;.
</ConsoleBlock>
  
You'll fix this error in the next section.
>>>>>>> b214f78433756914ec32526dda48e76176dbf4fc

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Voittaja: ' + winner;
  } else {
    status = 'Seuraava pelaajaa: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Siirry liikkeeseen #' + move;
    } else {
      description = 'Siirry pelin alkuun';
    }
    return (
      <li>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}

.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Kun iteroidaan `history` taulukon läpi funktiossa, jonka välitit `map`:lle, `squares` argumentti käy läpi jokaisen `history` alkion, ja `move` argumentti käy läpi jokaisen taulukon indeksin: `0`, `1`, `2`, …. (Useimmissa tapauksissa, tarvitsisit itse taulukon alkiot, mutta renderöidäksesi listan siirroista, tarvitset vain indeksit.)

Jokaiselle liikkeelle ristinolla-pelin historiassa, luot listan kohteen `<li>`, joka sisältää painikkeen `<button>`. Painikkeella on `onClick` käsittelijä, joka kutsuu funktiota nimeltä `jumpTo` (jota et ole vielä toteuttanut).

Toistaiseksi, sinun tulisi nähdä lista liikeistä, jotka tapahtuivat pelissä ja virhe kehittäjätyökalujen konsolissa. Keskustellaan mitä "key" virhe tarkoittaa.

### Avaimen valinta {/*picking-a-key*/}

Kun renderöit listan, React tallentaa tietoa jokaisesta renderöidystä listan alkiosta. Kun päivität listaa, React tarvitsee määrittää mitä on muuttunut. Saatat olla lisännyt, poistanut, järjestänyt uudelleen, tai päivittänyt listan alkiot.

Kuvittele siirtyväsi tästä

```html
<li>Alexa: 7 tasks left</li>
<li>Ben: 5 tasks left</li>
```

tähän

```html
<li>Ben: 9 tasks left</li>
<li>Claudia: 8 tasks left</li>
<li>Alexa: 5 tasks left</li>
```

Lukujen päivittämisen lisäksi, ihminen lukisi tämän todennäköisesti niin, että vaihdoit Alexan ja Benin järjestystä ja lisäsit Claudian Alexan ja Benin väliin. Kuitenkin, React on tietokoneohjelma eikä voi tietää mitä tarkoitit, joten sinun täytyy määrittää _key_ ominaisuus jokaiselle listan alkiolle erottaaksesi jokaisen listan alkion sen sisaruksista. Jos datasi olisi tietokannasta, Alexan, Benin ja Claudian tietokannan ID:tä voitaisiin käyttää avaimina.

```js {1}
<li key={user.id}>
  {user.name}: {user.taskCount} tasks left
</li>
```

Kun lista renderöidään uudelleen, React ottaa jokaisen listan alkion avaimen ja etsii edellisen listan alkiot vastaavalla avaimella. Jos nykyisellä listalla on avain, jota ei ollut aiemmin, React luo komponentin. Jos nykyisellä listalla ei ole avainta, joka oli edellisellä listalla, React tuhoaa edellisen komponentin. Jos kaksi avainta vastaavat, vastaava komponentti siirretään.

Avaimet kertovat reactille jokaisen komponentin identiteetistä, joka antaa Reactille mahdollisuuden ylläpitää tilaa uudelleenrenderöintien välillä. Jos komponentin avain muuttuu, komponentti tuhotaan ja luodaan uudelleen uudella tilalla.

`key` on erityinen ja varattu ominaisuus Reactissa. Kun elementti luodaan, React ottaa `key` ominaisuuden ja tallentaa avaimen suoraan palautettuun elementtiin. Vaikka `key` näyttäisi välitetyltä propseina, React käyttää automaattisesti `key`:tä päättääkseen mitä komponentteja päivittää. Komponentilla ei ole tapaa kysyä minkä `key`:n sen vanhempi on määrittänyt.

**On erittäin suositeltavaa, että asetat oikeat avaimet aina kun rakennat dynaamisia listoja.** Jos sinulla ei ole sopivaa avainta, saatat haluta harkita datan uudelleenjärjestämistä, jotta sinulla olisi.

Jos avainta ei ole määritelty, React raportoi virheen ja käyttää taulukon indeksiä avaimena oletuksena. Taulukon indeksin käyttäminen avaimena on ongelmallista, kun yritetään järjestää listan kohteita uudelleen tai lisätä/poistaa listan kohteita. `key={i}` avaimen välittäminen hiljentää virheen, mutta sillä on samat ongelmat kuin taulukon indekseillä ja sitä ei suositella useimmissa tapauksissa.

Avainten ei tarvitse olla globaalisti uniikkeja. Riittää, että ne ovat uniikkeja komponenttien ja niiden sisarusten välillä.

### Aikamatkustuksen toteutus {/*implementing-time-travel*/}

Ristinolla-pelin historiassa, jokaisella aikaisemmalla siirrolla on uniikki ID: se on siirron järjestysnumero. Siirtoja ei koskaan järjestetä uudelleen, poisteta tai lisätä keskelle, joten on turvallista käyttää siirron indeksiä avaimena.

`Game` funktiossa, voit lisätä avaimen `<li key={move}>`, ja jos lataat pelin uudelleen, Reactin "key" virheen tulisi kadota:

```js {4}
const moves = history.map((squares, move) => {
  //...
  return (
    <li key={move}>
      <button onClick={() => jumpTo(move)}>{description}</button>
    </li>
  );
});
```

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Voittaja: ' + winner;
  } else {
    status = 'Seuraava pelaajaa: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Siirry liikkeeseen #' + move;
    } else {
      description = 'Siirry pelin alkuun';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}

.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Before you can implement `jumpTo`, you need the `Game` component to keep track of which step the user is currently viewing. To do this, define a new state variable called `currentMove`, defaulting to `0`:

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[history.length - 1];
  //...
}
```

Seuraavaksi, päivitä `jumpTo` funktio `Game`:n sisällä päivittämään `currentMove`. Asetat myös `xIsNext` arvoon `true`, jos numero, jota olet muuttamassa `currentMove`:ksi on parillinen.

```js {4-5}
export default function Game() {
  // ...
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }
  //...
}
```

Teet nyt kaksi muutosta `Game` komponentin `handlePlay` funktioon, joka kutsutaan kun klikkaat ruutua.

- Jos "palaat ajassa taaksepäin" ja teet uuden siirron siitä pisteestä, haluat pitää historian vain siihen pisteeseen asti. Sen sijaan, että lisäisit `nextSquares` kaikkien kohteiden (`...` spread-syntaksi) jälkeen `history`:ssa, lisäät sen kaikkien kohteiden jälkeen `history.slice(0, currentMove + 1)` jotta pidät vain sen osan vanhasta historiasta.
- Joka kerta kun siirto tehdään, sinun täytyy päivittää `currentMove` osoittamaan viimeisimpään historiaan.

```js {2-4}
function handlePlay(nextSquares) {
  const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
  setHistory(nextHistory);
  setCurrentMove(nextHistory.length - 1);
  setXIsNext(!xIsNext);
}
```

Lopuksi, muutat `Game` komponenttia renderöimään valitun siirron, sen sijaan että renderöisit aina viimeisimmän siirron:

```js {5}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  // ...
}
```

Jos klikkaat mitä tahansa siirtoa pelin historiassa, ristinolla-pelin taulukko tulisi päivittyä näyttämään miltä taulukko näytti sen siirron jälkeen.

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Voittaja: ' + winner;
  } else {
    status = 'Seuraava pelaajaa: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Siirry liikkeeseen #' + move;
    } else {
      description = 'Siirry pelin alkuun';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### Loppusiivous {/*final-cleanup*/}

Jos katsot koodia tarkasti, saatat huomata, että `xIsNext === true` kun `currentMove` on parillinen ja `xIsNext === false` kun `currentMove` on pariton. Toisin sanoen, jos tiedät `currentMove` arvon, voit aina selvittää mitä `xIsNext` arvon tulisi olla.

Ei ole mitään syytä säilyttää molempia näitä tilassa. Itse asiassa, yritä aina välttää turhaa tilaa. Yksinkertaistamalla mitä säilytät tilassa vähentää bugeja ja tekee koodistasi helpommin ymmärrettävää. Muuta `Game` niin, että se ei säilytä `xIsNext` erillisenä tilamuuttujana ja sen sijaan selvittää sen `currentMove`:n perusteella:

```js {4,11,15}
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  // ...
}
```

Et enää tarvitse `xIsNext` tilan määrittelyä tai kutsuja `setXIsNext`. Nyt, ei ole mahdollisuutta, että `xIsNext` pääsee epäsynkroniin `currentMove`:n kanssa, vaikka tekisit virheen koodatessasi komponentteja.

### Lopetus {/*wrapping-up*/}

Onneksi olkoon! Olet luonut ristinolla-pelin, joka:

- Antaa sinun pelata ristinollaa,
- Ilmoittaa kun pelaaja on voittanut peli,
- Tallentaa pelin historian pelin edetessä,
- Antaa pelaajan palata takaisin pelin historiassa ja katsoa edellisiä versioita pelin taulukosta.

Hyvää työtä! Toivottavasti tunnet nyt, että sinulla on hyvä käsitys siitä miten React toimii. 

Katso lopullinen tulos täältä:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Voittaja: ' + winner;
  } else {
    status = 'Seuraava pelaajaa: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Siirry liikkeeseen #' + move;
    } else {
      description = 'Siirry pelin alkuun';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Jos sinulla on ylimääräistä aikaa tai haluat harjoitella uusia React taitojasi, tässä on joitain ideoita parannuksista, joita voisit tehdä ristinolla-peliin, listattuna vaikeusjärjestyksessä:

1. Nykyiselle siirrolle, näytä "Olet siirrossa #..." sen sijaan, että näyttäisit painikkeen.
1. Kirjoita `Board` käyttämään kahta silmukkaa tehdäksesi ruudukon sen sijaan, että kovakoodaisit ne.
1. Lisää painike, joka antaa sinun järjestää siirrot joko nousevaan tai laskevaan järjestykseen.
1. Kun joku voittaa, korosta kolme ruutua, jotka aiheuttivat voiton (ja kun kukaan ei voita, näytä viesti tuloksesta olevan tasapeli).
1. Näytä jokaisen siirron sijainti muodossa (rivi, sarake) siirtohistorian listassa.

<<<<<<< HEAD
Tämän oppaan aikana, olet käsitellyt Reactin käsitteitä, mukaan lukien elementit, komponentit, propsit ja tila. Nyt kun olet nähnyt miten nämä käsitteet toimivat peliä rakentaessa, katso [Ajattelu Reactissa](/learn/thinking-in-react) nähdäksesi miten samat Reactin käsitteet toimivat kun rakennat sovelluksen käyttöliittymää.
=======
Throughout this tutorial, you've touched on React concepts including elements, components, props, and state. Now that you've seen how these concepts work when building a game, check out [Thinking in React](/learn/thinking-in-react) to see how the same React concepts work when building an app's UI.
>>>>>>> b214f78433756914ec32526dda48e76176dbf4fc
