---
title: Tilan jakaminen komponenttien välillä
---

<Intro>

Joskus haluat kahden komponentin tilan muuttuvan yhdessä. Tehdäksesi tämän, poista tila molemmista komponenteista ja siirrä se niiden lähimpään pääkomponenttiin ja välitä se komponenteille propsien kautta. Tätä kutsutaan *tilan nostamiseksi ylös*, ja se on yksi yleinen tapa jota tulet tekemään Reactia kirjoittaessasi.

</Intro>

<YouWillLearn>

- Miten jakaa tilaa komponenttien välillä "nostamalla ne ylös"
- Mitä ovat hallitut ja hallitsemattomat komponentit

</YouWillLearn>

## Esimerkkinä tilan nostaminen {/*lifting-state-up-by-example*/}

Tässä esimerkissä, `Accordion` pääkomponentti renderöi kaksi erillistä `Panel` -komponenttia:

* `Accordion`
  - `Panel`
  - `Panel`

Kullakin `Panel` komponentilla on totuusarvo tyyppinen `isActive` tila, joka päättää onko sen sisältö näkyvissä.

Paina Näytä -painiketta molemmista paneeleista:

<Sandpack>

```js
import { useState } from 'react';

function Panel({ title, children }) {
  const [isActive, setIsActive] = useState(false);
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Näytä
        </button>
      )}
    </section>
  );
}

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="About">
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel title="Etymology">
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Huomaa miten yhden paneelin painikkeen painaminen ei vaikuta toiseen paneeliin--ne ovat toisistaan riippumattomia.

<DiagramGroup>

<Diagram name="sharing_state_child" height={367} width={477} alt="Kaavio, joka näyttää puurakennelman kolmesta komponentista, yksi pääkomponentti on nimetty Parent, ja kaksi alakomponenttia on nimetty Panel. Molemmat Panel komponentit sisältävät isActive:n arvolla false.">

Aluksi, kunkin `Panel` komponentin `isActive` tila on `false`, joten molemmat ovat suljettuina.

</Diagram>

<Diagram name="sharing_state_child_clicked" height={367} width={480} alt="Sama kaavio kuin edellinen, mutta ensimmäisen paneelin isActive on korostettu osoittaen klikkausta. Ensimmäisen paneelin isActive arvo on true. Toinen Panel -komponentin sisältää silti arvon false.">

Kummankin `Panel` komponentin painikkeen painaminen päivittää vain sen `Panel` komponentin `isActive` tilan yksinään.

</Diagram>

</DiagramGroup>

**Muutta sanotaa, että haluat muuttaa sen niin, että vain yksi paneeli voi olla avattuna kerrallaan.** Tällä suunnitelmalla, toisen paneelin avaamisen tulisi sulkea ensimmäinen paneeli. Miten toteuttaisit tämän?

Koordinoidaksesi nämä kaksi paneelia, sinun täytyy "nostaa tila ylös" pääkomponenttiin kolmessa eri vaiheessa:

1. **Poista** tila lapsikomponentista.
2. **Välitä** kovakoodattu data yhteisestä pääkomponentista.
3. **Lisää** tila yhteiseen pääkomponenttiin ja välitä se alas tapahtumakäsittelijöiden kanssa.

Tämä antaa `Accordion` komponentin koordinoida molemmat `Panel` komponentit ja pitää vain yhtä auki kerrallaan.

### 1. Vaihe: Poista tila lapsikomponenteista {/*step-1-remove-state-from-the-child-components*/}

Luovutat `Panel` komponentin `isActive` ohjauksen sen pääkomponentille. Tämä tarkoittaa, että pääkomponentti välittää `isActive`:n `Panel` komponentille propsien kautta. Aloita **poistamalla tämä rivi** `Panel` komponentista:

```js
const [isActive, setIsActive] = useState(false);
```

Ja sen sijaan lisää `isActive` `Panel` komponentin propsilistaan:

```js
function Panel({ title, children, isActive }) {
```

Nyt `Panel` komponentin pääkomponentti *ohjaa* `isActive`:a [välittämällä sen alas propsina.](/learn/passing-props-to-a-component) Lisäksi `Panel` komponentilla *ei ole määräysvaltaa* `isActive` tilan arvoon--se on täysin pääkomponentin vastuulla.

### 2. Vaihe: Välitä kovakoodattu data yhteisestä pääkomponentista {/*step-2-pass-hardcoded-data-from-the-common-parent*/}

Tilan nostamiseksi ylös, sinun täytyy etsiä molempien komponenttien lähin jaettu pääkomponetti:

* `Accordion` *(lähin yhteinen komponentti)*
  - `Panel`
  - `Panel`

Tässä esimerkissä se on `Accordion` komponentti. Sillä se sijaitsee molmepien paneelien yläpuolella ja se voi ohjata niiden propseja, siitä tulee "totuuden lähde" sille kumpi paneeli on aktiivinen. Välitä `Accrdion` komponentista kovakoodattu `isActive` (esimerkiksi, `true`) molemmille paneeleille:

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="About" isActive={true}>
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel title="Etymology" isActive={true}>
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({ title, children, isActive }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Show
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Kokeile muokata kovakoodattua `isActive` arvoa `Accordion` komponentissa ja katso mitä ruudulla tapahtuu.

### 3. Vaihe: Lisää tila yhteiseen pääkomponenttiin {/*step-3-add-state-to-the-common-parent*/}

Tilan nostaminen ylös usein muuttaa sen luonnetta, mitä tallennat tilana.

Tässä tapauksessa vain yhden paneelin tulisi olla aktiivinen kerralla. Tämä tarkoittaa, että yhteisen `Accordion` pääkomponentin tulisi pitää kirjaa siitä, *mikä* paneeli on aktiivinen. `boolean` arvon sijaan, se voisi olla numero, joka vastaa aktiivisen `Panel` komponentin indeksiä:

```js
const [activeIndex, setActiveIndex] = useState(0);
```
Kun `activeIndex` on `0`, ensimmäinen paneeli on aktiivinen. Kun `activeIndex` on `1`, toinen paneeli on aktiivinen.


"Show" painikkeen painaminen kummassakin `Panel` komponentissa tulisi muuttaa aktiivista indeksiä `Accordion` komponentissa. `Panel` ei voi asettaa `activeIndex` tilaa suoraan, sillä se on määritelty `Accordion` komponentissa. `Accordion` komponentin täytyy *eksplisiittisesti sallia* `Panel` komponentin muuttaa `activeIndex` tilaa [välittämällä tapahtumakäsittelijä propsina](/learn/responding-to-events#passing-event-handlers-as-props):

```js
<>
  <Panel
    isActive={activeIndex === 0}
    onShow={() => setActiveIndex(0)}
  >
    ...
  </Panel>
  <Panel
    isActive={activeIndex === 1}
    onShow={() => setActiveIndex(1)}
  >
    ...
  </Panel>
</>
```

`Panel` komponentin sisällä oleva `<button>` käyttää nyt `onShow` propsia sen tapahtumakäsittelijänä:

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel
        title="Etymology"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Show
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Tämä viimeistelee tilan nostamisen ylös! Tilan siirtäminen yhteiseen pääkomponenttiin mahdollistaa kahden paneelin koordinoimisen. Aktiivisen indeksin käyttäminen kahden "onko näkyvissä" muutujan sijaan varmistaa, että vain yksi paneeli on aina aktiivinen. Tapahtumakäsittelijän välittäminen alakomponentille mahdollistaa sen, että alakomponentti voi muuttaa pääkomponentin tilaa.

<DiagramGroup>

<Diagram name="sharing_state_parent" height={385} width={487} alt="Kaavio, joka näyttää kolme komponenttia, yhden pääkomponentin nimeltään Accrodion ja kaksi alakomponenttia nimeltään Panel. Accordion sisältää activeIndex-arvon nolla, joka muuttuu ensimmäiselle paneelille välitetyksi isActive-arvoksi true, ja toiselle paneelille välitetyksi isActive-arvoksi false." >

Aluksi, `Accordion` komponentin `activeIndex` on `0`, joten ensimmäinen `Panel` komponentti vastaanottaa `isActive = true`

</Diagram>

<Diagram name="sharing_state_parent_clicked" height={385} width={521} alt="Sama kaavio kuin aiemmin, jossa Accordion pääkomponentin activeIndex on korostettuna osoittaen klikkausta, arvolla yksi. Virtaus kahteen alakomponenttiin on myös korostettu, ja välitetty isActive-arvo on muutettu päinvastaiseksi: false ensimmäiselle paneelille ja true seuraavalle." >

Kun `Accordion` komponentin `activeIndex` tila muuttuu arvoksi `1`, toinen `Panel` komponentti sen sijaan vastaanottaa `isActive = true`

</Diagram>

</DiagramGroup>

<DeepDive>

#### Hallitut ja hallitsemattomat komponentit {/*controlled-and-uncontrolled-components*/}

On yleistä kutsua komponenttia, jotka sisältävät paikallista tilaa, "hallitsemattomiksi". Esimerkiksi, alkuperäinen `Panel` komponentti, joka sisälsi `isActive` tilamuuttujan on hallitsematon, koska sen pääkomponentti ei voi vaikuttaa onko paneeli avoin vai suljettu.

Vastaavasti voidaan sanoa, että komponentti on "ohjattu" kun sen tärkeät tiedot on ohjattavissa propsien kautta komponentin oman tilan sijaan. Tämä antaa pääkomponentin määritellä täysin sen käyttäytymisen. Viimeisin `Panel` komponentti `isActive` propsilla on `Accordion` komponentin ohjaama.

Hallitsemattomat komponentit ovat helpompia käyttää niiden pääkomponenteissa, sillä ne vaativat vähemmän määrittelyä. Ne eivät kuitenkaan ole yhtä joustavia kun haluat koordinoida niitä yhdessä. Hallitut komponentit ovat mahdollisimman joustavia, mutta vaativat pääkomponentin määrittelemään ne täysin propsien kautta.

Käytännössä, "hallitut" ja "hallitsemattomat" eivät ole tarkkoja teknisiä termejä--kullakin komponentilla on sekoitus paikallista tilaa ja propseja. Kuitenkin, tämä on hyödyllinen tapa keskutella siitä miten komponentit ovat suunniteltu ja mitä toimintoja ne tarjoavat.

Kun kirjoitat komponenttia, harkitse mitä tietoa tulisi ohjata propsien kautta, ja minkä tiedon tulisi olla komponentin paikallista tilaa. Mutta voit kuitenkin aina muuttaa mieltäsi ja muuttaa komponenttia myöhemmin.

</DeepDive>

## Yksi totuuden lähde jokaiselle tilalle {/*a-single-source-of-truth-for-each-state*/}

React sovelluksessa, monilla komponenteilla on niiden oma tila. Jotkin tilat saattavat "asua" lähempänä lehtikomponentteja (komponetit puun alaosassa) kuten syöttökentissä. Toiset tilat saattavat "asua" lähempänä sovelluksen juurta. Esimerkiksi, selain-puolen reitityskirjastot ovat usein toteuttettu tallentamalla senhetkinen polku Reactin tilaan ja sen välittäminen alas propseilla!

**Kullekin uniikille tilan palaselle valitset komponentin, joka "omistaa" sen.** Tätä käytäntöä kutsutaan ["yhdeksi totuuden lähteeksi".](https://en.wikipedia.org/wiki/Single_source_of_truth) Se ei tarkoita, että kaikki tilat ovat samassa paikassa--vaan, että _jokaiselle_ tilan palaselle on _tietty_ komponentti, joka pitää tiedon yllä. Sen sijaan, että monistaisit jaetun tilan komponenttien välillä, *nostat tilan ylös* niiden lähimpään jaettuun pääkomponenttiin, ja *välität sen alas* alakomponeteille, jotka sitä tarvitsevat.

Sovelluksesi muuttuu kun työstät sitä. On yleistä, että siirrät tilaa alas tai takaisin ylös kun vielä mietit missä yksittäiset tilan palaset "asuvat". Tämä on sa prosessia!

Nähdäksesi mitä tämä tarkoittaa käytännössä muutamin komponentein, lue [Ajattelu Reactissa.](/learn/thinking-in-react)

<Recap>

* Kun haluat koordinoida kahta komponenttia, siirrä niiden tila yhteiseen pääkomponenttiin.
* Välitä sitten tieto pääkomponentista propseilla.
* Lopuksi, välitä tapahtumakäsittelijät alas, jotta alakomponentit voivat muuttaa pääkomponentin tilaa.
* On hyödyllistä ajatella komponentteja "hallittuina" (ohjataan propseilla) tai "hallitsemattomina" (ohjataan tilalla).

</Recap>

<Challenges>

#### Synkronoidut tulot {/*synced-inputs*/}

Nämä kaksi syöttökenttää ovat toisistaan riippumattomia. Tee niistä synkronoituja: yhden muuttaminen päivittää toisen samalla tekstillä ja päin vastoin.

<Hint>

Sinun täytyy nostaa niiden tila ylös yhteiseen pääkomponenttiin.

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  return (
    <>
      <Input label="First input" />
      <Input label="Second input" />
    </>
  );
}

function Input({ label }) {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <label>
      {label}
      {' '}
      <input
        value={text}
        onChange={handleChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

<Solution>

Siirrä `text` tilamuuttuja ylös yhteiseen pääkomponenttiin `handleChange` tapahtumakäsittelijän kanssa. Sitten välitä ne alas propseina molemmille `Input` komponenteille. Tämä pitää ne synkronoituna.

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <Input
        label="First input"
        value={text}
        onChange={handleChange}
      />
      <Input
        label="Second input"
        value={text}
        onChange={handleChange}
      />
    </>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label>
      {label}
      {' '}
      <input
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

</Solution>

#### Listan suodattaminen {/*filtering-a-list*/}

Tässä esimerkissä `SearchBar`:lla on sen oma `query` tila, joka ohjaa syöttökenttää. Sen `FilterableList` pääkomponentti näyttää `List`:an kohteita, mutta se ei huomioi hakulauseketta.

Käytä `filterItems(foods, query)` funktiota listan suodattamiseksi hakulausekkeen perusteella. Testataksesi muutokset, varmista, että "s":n kirjoittaminen kenttään suodattaa listan kohteisiin "Sushi", "Shish kebab" ja "Dim sum".

Huomaa, että `filterItems` on jo toteutettu ja importattu, joten sinun ei tarvitse kirjoittaa sitä itse!

<Hint>

Sinun täytyy poistaa `query` tila ja `handleChange` tapahtumakäsittelijä `SearchBar` komponentista ja siirtää ne ylös `FilterableList` pääkomponenttiin. Sitten välitä ne alas `SearchBar` komponentille `query` ja `onChange` propseina.

</Hint>

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  return (
    <>
      <SearchBar />
      <hr />
      <List items={foods} />
    </>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <label>
      Search:{' '}
      <input
        value={query}
        onChange={handleChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody>
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi is a traditional Japanese dish of prepared vinegared rice'
}, {
  id: 1,
  name: 'Dal',
  description: 'The most common way of preparing dal is in the form of a soup to which onions, tomatoes and various spices may be added'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi are filled dumplings made by wrapping unleavened dough around a savoury or sweet filling and cooking in boiling water'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Shish kebab is a popular meal of skewered and grilled cubes of meat.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum is a large range of small dishes that Cantonese people traditionally enjoy in restaurants for breakfast and lunch'
}];
```

</Sandpack>

<Solution>

Lift the `query` state up into the `FilterableList` component. Call `filterItems(foods, query)` to get the filtered list and pass it down to the `List`. Now changing the query input is reflected in the list:

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  const [query, setQuery] = useState('');
  const results = filterItems(foods, query);

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <>
      <SearchBar
        query={query}
        onChange={handleChange}
      />
      <hr />
      <List items={results} />
    </>
  );
}

function SearchBar({ query, onChange }) {
  return (
    <label>
      Search:{' '}
      <input
        value={query}
        onChange={onChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody> 
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi is a traditional Japanese dish of prepared vinegared rice'
}, {
  id: 1,
  name: 'Dal',
  description: 'The most common way of preparing dal is in the form of a soup to which onions, tomatoes and various spices may be added'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi are filled dumplings made by wrapping unleavened dough around a savoury or sweet filling and cooking in boiling water'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Shish kebab is a popular meal of skewered and grilled cubes of meat.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum is a large range of small dishes that Cantonese people traditionally enjoy in restaurants for breakfast and lunch'
}];
```

</Sandpack>

</Solution>

</Challenges>
