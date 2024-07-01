---
title: Käyttöliittymän kuvaus
---

<Intro>

React on JavaScript kirjasto käyttöliittymien (UI) renderöintiin. Käyttöliittymät rakennetaan pienistä osista kuten painikkeista, tekstistä ja kuvista. Reactilla voit yhdistää näytä uudelleen käytettäviksi, sisäkkäisiksi _komponenteiksi_. Verkkosivuista puhelinsovelluksiin, kaikki näytöllä voidaan hajottaa komponenteiksi. Tässä luvussa opit luomaan, mukauttamaan, sekä ehdollisesti näyttämään React komponentteja.

</Intro>

<YouWillLearn isChapter={true}>

<<<<<<< HEAD
- [Miten kirjoitat ensimmäisen komponenttisi](/learn/your-first-component)
- [Miten ja milloin luot monikomponenttisia tiedostoja](/learn/importing-and-exporting-components)
- [Miten lisäät merkintäkoodia JavaScriptiin JSX hyödyntäen](/learn/writing-markup-with-jsx)
- [Miten käyttää aaltosulkeita JSX:n kanssa JavaScript toiminnallisuuksien hyödyntämiseksi komponenteissa](/learn/javascript-in-jsx-with-curly-braces)
- [Miten mukauttaa komponentteja propeilla](/learn/passing-props-to-a-component)
- [Miten renderöidä ehdollisesti komponentteja](/learn/conditional-rendering)
- [Miten renderöidä useita komponentteja samanaikaisesti](/learn/rendering-lists)
- [Miten välttää bugeja pitämällä komponentit puhtaina](/learn/keeping-components-pure)
=======
* [How to write your first React component](/learn/your-first-component)
* [When and how to create multi-component files](/learn/importing-and-exporting-components)
* [How to add markup to JavaScript with JSX](/learn/writing-markup-with-jsx)
* [How to use curly braces with JSX to access JavaScript functionality from your components](/learn/javascript-in-jsx-with-curly-braces)
* [How to configure components with props](/learn/passing-props-to-a-component)
* [How to conditionally render components](/learn/conditional-rendering)
* [How to render multiple components at a time](/learn/rendering-lists)
* [How to avoid confusing bugs by keeping components pure](/learn/keeping-components-pure)
* [Why understanding your UI as trees is useful](/learn/understanding-your-ui-as-a-tree)
>>>>>>> 53fbed3f676013508fb9cce22a3fc8664b1dc5a1

</YouWillLearn>

## Ensimmäinen komponenttisi {/*your-first-component*/}

React sovellukset rakennetaan eristetyistä käyttöliittymäpalasista, joita kutsutaan *komponenteiksi*. React komponentti on JavaScript funktio, johon voit ripotella merkintäkoodia. Komponentit voivat olla pieniä kuten painikkeita, tai suuria kuten kokonaisia sivuja. Tässä on `Gallery` komponentti, joka renderöi kolme `Profile` komponenttia:

<Sandpack>

```js
function Profile() {
  return <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />;
}

export default function Gallery() {
  return (
    <section>
      <h1>Mahtavia tutkijoita</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img {
  margin: 0 10px 10px 0;
  height: 90px;
}
```

</Sandpack>

<LearnMore path="/learn/your-first-component">

Lue **[Ensimmäinen komponenttisi](/learn/your-first-component)** oppiaksesi miten määritellä ja käyttää React komponentteja.

</LearnMore>

## Komponettien tuonti ja vienti {/*importing-and-exporting-components*/}

Voit määritellä monia komponentteja yhdessä tiedostossa, mutta navigointi isojen tiedostojen sisällä saattaa muuttua hankalaksi. Tämän ratkaisemiseksi, voit _exportata_ eli viedä komponentin sen omaan tiedostoon ja sitten _importata_ eli tuoda sen komponentin toisesta tiedostosta:

<Sandpack>

```js src/App.js hidden
import Gallery from './Gallery.js';

export default function App() {
  return <Gallery />;
}
```

```js src/Gallery.js active
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js src/Profile.js
export default function Profile() {
  return <img src="https://i.imgur.com/QIrZWGIs.jpg" alt="Alan L. Hart" />;
}
```

```css
img {
  margin: 0 10px 10px 0;
}
```

</Sandpack>

<LearnMore path="/learn/importing-and-exporting-components">

Lue **[Komponenttien tuonti ja vienti](/learn/importing-and-exporting-components)** oppiaksesi miten komponentteja voidaan jakaa omiin tiedostoihin.

</LearnMore>

## Merkintäkoodin kirjoittaminen JSX:llä {/*writing-markup-with-jsx*/}

Jokainen React komponentti on JavaScript funktio, joka saattaa sisältää jotain merkintäkoodia, jonka React renderöi selaimeen. React komponentit käyttävät syntaksilisäosaa nimeltään JSX edustamaan kyseistä merkintää. JSX näyttää pitkälti samalta kuin HTML, mutta on hieman tiukempaa ja se voi näyttää dynaamista informaatiota.

Jos liitämme olemassa olevaa HTML koodia React komponenttiin, se ei aina välttämättä toimi:

<Sandpack>

```js
export default function TodoList() {
  return (
    // Tämä ei ihan toimi!
    <h1>Hedy Lamarr's Todos</h1>
    <img
      src="https://i.imgur.com/yXOvdOSs.jpg"
      alt="Hedy Lamarr"
      class="photo"
    >
    <ul>
      <li>Invent new traffic lights
      <li>Rehearse a movie scene
      <li>Improve spectrum technology
    </ul>
  );
}
```

```css
img {
  height: 90px;
}
```

</Sandpack>

Jos sinulla on olemassa olevaa HTML koodia, voit korjata sen käyttämällä [muunninta](https://transform.tools/html-to-jsx):

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>Hedy Lamarr's Todos</h1>
      <img
        src="https://i.imgur.com/yXOvdOSs.jpg"
        alt="Hedy Lamarr"
        className="photo"
      />
      <ul>
        <li>Invent new traffic lights</li>
        <li>Rehearse a movie scene</li>
        <li>Improve spectrum technology</li>
      </ul>
    </>
  );
}
```

```css
img {
  height: 90px;
}
```

</Sandpack>

<LearnMore path="/learn/writing-markup-with-jsx">

Lue **[Merkintäkoodin kirjoittaminen JSX:llä](/learn/writing-markup-with-jsx)** oppiaksesi miten kirjoitetaan kelvollista JSX koodia.

</LearnMore>

## JavaScriptia JSX:ssa aaltosulkeilla {/*javascript-in-jsx-with-curly-braces*/}

JSX antaa sinun kirjoittaa HTML-näköistä merkintäkoodia JavaScript tiedoston sisällä, pitäen renderöintilogiikan ja sisällön samassa paikassa. Joskus haluat lisätä vähäsen JavaScript logiikaa tai viitata dynaamiseen propertyyn merkintäkoodin sisällä. Tässä tapauksessa voit käyttää aaltosulkeita JSX koodissasi avataksesi "pienen ikkunan" takaisin JavaScriptiin:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink',
  },
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body {
  padding: 0;
  margin: 0;
}
body > div > div {
  padding: 20px;
}
.avatar {
  border-radius: 50%;
  height: 90px;
}
```

</Sandpack>

<LearnMore path="/learn/javascript-in-jsx-with-curly-braces">

Lue **[JavaScriptia JSX:ssa aaltosulkeilla](/learn/javascript-in-jsx-with-curly-braces)** oppiaksesi miten JavaScript tietoa voidaan käsitellä JSX koodissa.

</LearnMore>

## Proppien välittäminen komponenteille {/*passing-props-to-a-component*/}

React komponentit käyttävät _proppeja_ kommunikoidakseen toisten välillä. Jokainen pääkomponentti voi antaa tietoa sen lapsikomponeteilleen antamalla ne propseina. Propsit saattavat muistuttaa HTML attribuuteista, mutta voit antaa mitä tahansa JavaScript arovoa niiden välillä, esim. oliota, listoja, funktioita ja myös JSX koodia!

<Sandpack>

```js
import {getImageUrl} from './utils.js';

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2',
        }}
      />
    </Card>
  );
}

function Avatar({person, size}) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

function Card({children}) {
  return <div className="card">{children}</div>;
}
```

```js src/utils.js
export function getImageUrl(person, size = 's') {
  return 'https://i.imgur.com/' + person.imageId + size + '.jpg';
}
```

```css
.card {
  width: fit-content;
  margin: 5px;
  padding: 5px;
  font-size: 20px;
  text-align: center;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.avatar {
  margin: 20px;
  border-radius: 50%;
}
```

</Sandpack>

<LearnMore path="/learn/passing-props-to-a-component">

Lue **[Proppien välittäminen komponenteille](/learn/passing-props-to-a-component)** oppiaksesi miten proppeja annetaan ja luetaan.

</LearnMore>

## Ehdollinen renderöinti {/*conditional-rendering*/}

Komponenteissasi usein täytyy näyttää tietoa riippuen erilaisista ehdoista. Reactissa voit renderöidä ehdollisesti JSX koodia käyttäen JavaScript syntaksia kuten `if` lausetta, `&&` ja `? :` operaattoreita.

Tässä esimerkissä JavaScript `&&` operaattoria käytetään valintamerkin ehdolliseen renderöintiin:

<Sandpack>

```js
function Item({name, isPacked}) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item isPacked={true} name="Space suit" />
        <Item isPacked={true} name="Helmet with a golden leaf" />
        <Item isPacked={false} name="Photo of Tam" />
      </ul>
    </section>
  );
}
```

</Sandpack>

<LearnMore path="/learn/conditional-rendering">

Lue **[Ehdollinen renderöinti](/learn/conditional-rendering)** oppiaksesi eri tavat renderöidä ehdollisesti.

</LearnMore>

## Listojen renderöinti {/*rendering-lists*/}

Usein haluat näyttää useita samoja komponentteja listasta dataa. Voit käyttää JavaScriptin `filter()` ja `map()` funktioita Reactissa listan suodattamiseksi ja muuttamiseksi uuteen listaan komponenteista.

Jokaiselle listan kohteelle täytyy määrittää `key` propsi. Yleensä voit käyttää tietokannan ID kenttää `key` propin arvona. Näin React muistaa listan jokaisen kohteen järjestyksen mikäli lista muuttuu.

<Sandpack>

<<<<<<< HEAD
```js App.js
import {people} from './data.js';
import {getImageUrl} from './utils.js';
=======
```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';
>>>>>>> 53fbed3f676013508fb9cce22a3fc8664b1dc5a1

export default function List() {
  const listItems = people.map((person) => (
    <li key={person.id}>
      <img src={getImageUrl(person)} alt={person.name} />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        known for {person.accomplishment}
      </p>
    </li>
  ));
  return (
    <article>
      <h1>Scientists</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

<<<<<<< HEAD
```js data.js
export const people = [
  {
    id: 0,
    name: 'Creola Katherine Johnson',
    profession: 'mathematician',
    accomplishment: 'spaceflight calculations',
    imageId: 'MK3eW3A',
  },
  {
    id: 1,
    name: 'Mario José Molina-Pasquel Henríquez',
    profession: 'chemist',
    accomplishment: 'discovery of Arctic ozone hole',
    imageId: 'mynHUSa',
  },
  {
    id: 2,
    name: 'Mohammad Abdus Salam',
    profession: 'physicist',
    accomplishment: 'electromagnetism theory',
    imageId: 'bE7W1ji',
  },
  {
    id: 3,
    name: 'Percy Lavon Julian',
    profession: 'chemist',
    accomplishment:
      'pioneering cortisone drugs, steroids and birth control pills',
    imageId: 'IOjWm71',
  },
  {
    id: 4,
    name: 'Subrahmanyan Chandrasekhar',
    profession: 'astrophysicist',
    accomplishment: 'white dwarf star mass calculations',
    imageId: 'lrWQx8l',
  },
];
=======
```js src/data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
>>>>>>> 53fbed3f676013508fb9cce22a3fc8664b1dc5a1
```

```js src/utils.js
export function getImageUrl(person) {
  return 'https://i.imgur.com/' + person.imageId + 's.jpg';
}
```

```css
ul {
  list-style-type: none;
  padding: 0px 10px;
}
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
}
img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
h1 {
  font-size: 22px;
}
h2 {
  font-size: 20px;
}
```

</Sandpack>

<LearnMore path="/learn/rendering-lists">

Lue **[Listojen renderöinti](/learn/rendering-lists)** oppiaksesi miten renderöidään listoja komponenteista sekä miten valitaan avain.

</LearnMore>

## Komponenttien pitäminen puhtaina {/*keeping-components-pure*/}

Jotkin JavaScript funktiot ovat *puhtaita.* Puhdas funktio on seuraavanlainen:

- **Hoitaa omia asioitaan.** Se ei muuta objekteja tai muuttujia, jotka olivat olemassa ennen sen kutsumista.
- **Same inputs, same output.** Kun annetaan samat syötteet, puhtaan funktion tulisi aina palauttaa sama tulos.

Tiukasti kirjoittamalla vain puhtaita komponentteja, voit välttää kokonaisen kokoelman hämmentäviä bugeja ja ennalta arvaamatonta toimintaa koodipohjan kasvaessa. Tässä on esimerkki epäpuhtaasta komponentista:

<Sandpack>

```js
let guest = 0;

function Cup() {
  // Huono: muuttaa olemassa olevaa muuttujaa!
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

</Sandpack>

Voit tehdä tästä komponentista puhtaan antamalla sille propin olemassa olevan muuttujan muuttamisen sijaan:

<Sandpack>

```js
function Cup({guest}) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/keeping-components-pure">

Lue **[Komponenttien pitäminen puhtaana](/learn/keeping-components-pure)** oppiaksesi miten kirjoitetaan puhtaita, ennalta-arvattavia komponentteja.

</LearnMore>

<<<<<<< HEAD
## Mitä seuraavaksi? {/*whats-next*/}
=======
## Your UI as a tree {/*your-ui-as-a-tree*/}

React uses trees to model the relationships between components and modules. 

A React render tree is a representation of the parent and child relationship between components. 

<Diagram name="generic_render_tree" height={250} width={500} alt="A tree graph with five nodes, with each node representing a component. The root node is located at the top the tree graph and is labelled 'Root Component'. It has two arrows extending down to two nodes labelled 'Component A' and 'Component C'. Each of the arrows is labelled with 'renders'. 'Component A' has a single 'renders' arrow to a node labelled 'Component B'. 'Component C' has a single 'renders' arrow to a node labelled 'Component D'.">

An example React render tree.

</Diagram>

Components near the top of the tree, near the root component, are considered top-level components. Components with no child components are leaf components. This categorization of components is useful for understanding data flow and rendering performance.

Modelling the relationship between JavaScript modules is another useful way to understand your app. We refer to it as a module dependency tree. 

<Diagram name="generic_dependency_tree" height={250} width={500} alt="A tree graph with five nodes. Each node represents a JavaScript module. The top-most node is labelled 'RootModule.js'. It has three arrows extending to the nodes: 'ModuleA.js', 'ModuleB.js', and 'ModuleC.js'. Each arrow is labelled as 'imports'. 'ModuleC.js' node has a single 'imports' arrow that points to a node labelled 'ModuleD.js'.">

An example module dependency tree.

</Diagram>

A dependency tree is often used by build tools to bundle all the relevant JavaScript code for the client to download and render. A large bundle size regresses user experience for React apps. Understanding the module dependency tree is helpful to debug such issues. 

<LearnMore path="/learn/understanding-your-ui-as-a-tree">

Read **[Your UI as a Tree](/learn/understanding-your-ui-as-a-tree)** to learn how to create a render and module dependency trees for a React app and how they're useful mental models for improving user experience and performance.

</LearnMore>


## What's next? {/*whats-next*/}
>>>>>>> 53fbed3f676013508fb9cce22a3fc8664b1dc5a1

Siirry seuraavaksi [Ensimmäinen komponenttisi](/learn/your-first-component) lukeaksesi tämän luvun sivu kerrallaan!

Tai, jos aiheet ovat jo tuttuja, mikset lukisi [Interaktiivisuuden lisääminen](/learn/adding-interactivity) lukua?
