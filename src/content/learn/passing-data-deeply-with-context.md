---
title: Tiedon välittäminen syvälle kontekstilla
---

<Intro>

Useiten tiedon välittäminen tapahtuu pääkomponentilta alakomponentille propsien avulla. Propsien välittäminen voi kuitenkin tulla monimutkaiseksi ja hankalaksi, jos sinun täytyy välittää propseja useiden komponenttien läpi tai jos sovelluksessasi on useita komponentteja, jotka tarvitsevat samaa tietoa. *Konteksti* (engl. Context) antaa pääkomponentin tarjota mille tahansa sen alla olevan puun komponentille, vaikka ne olisivatkin syvällä puussa, ilman että tieto välitetään propsien kautta.

</Intro>

<YouWillLearn>

- Mitä "propsien poraus" on 
- Miten korvata toistuva propsien välittäminen kontekstilla
- Yleisiä käyttötapauksia kontekstille
- Yleisiä vaihtoehtoja kontekstille

</YouWillLearn>

## Ongelma propseja välittäessä {/*the-problem-with-passing-props*/}

[Propsien välittäminen](/learn/passing-props-to-a-component) on hyvä tapa välittää tietoa UI puun läpi komponenteille, jotka sitä tarvitsevat.

Propsien välittäminen voi kuitenkin muodostua pitkäksi ja epäkäteväksi, jos sinun täytyy välittää propseja syvälle puussa tai jos useat komponentit tarvitsevat samaa propsia. Lähin yhteinen komponentti saattaa olla kaukana komponentista, joka tarvitsee tietoa, ja [tilan nostaminen ylös](/learn/sharing-state-between-components) voi johtaa tilanteeseen, jota kutsutaan joskus "propsien poraukseksi" (engl. prop drilling).

<DiagramGroup>

<Diagram name="passing_data_lifting_state" height={160} width={608} captionPosition="top" alt="Kaavio kolmesta komponentista. Ylin komponentti sisältää violetin värisen pallon, joka edustaa arvoa. Arvo virtaa alakomponentteihin, jotka ovat molemmat violetin värisiä.">

Tilan nostaminen ylös

</Diagram>
<Diagram name="passing_data_prop_drilling" height={430} width={608} captionPosition="top" alt="Kaavio kymmenestä solmusta koostuvasta puusta, jossa jokaisella solmulla on kaksi tai vähemmän lasta. Juurisolmu sisältää violetin värisen pallon, joka edustaa arvoa. Arvo virtaa alakomponentteihin, kunkin niistä välittäen sen eteenpäin, mutta ei sisältäen sitä. Vasemmanpuoleinen lapsi välittää arvon kahden lapsen kautta, jotka ovat molemmat violetin värisiä. Oikeanpuoleinen alakomponentti välittää arvon yhdelle sen kahdesta lapsesta - oikealle lapselle, joka on violetin värisenä. Tämä lapsi välittää arvon yhdelle lapselleen, joka välittää sen kahden lapsen kautta, jotka ovat molemmat violetin värisiä.">

Propsien poraus

</Diagram>

</DiagramGroup>


Eikö olisikin hienoa, jos olisi tapa "teleportata" tietoa puun komponentteihin, jotka sitä tarvitsevat, ilman että tieto välitetään propsien kautta? Reactin kontekstitoiminto on sellainen tapa!

## Context: vaihtoehto propsien välittämiseen {/*context-an-alternative-to-passing-props*/}

Konteksti antaa pääkomponentin tarjota mille tahansa sen alla olevan puun komponentille. Kontekstille on monia käyttökohteita. Tässä on yksi esimerkki. Harkitse tätä `Heading` komponenttia, joka hyväksyy `level` propsin sen kooksi:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Heading level={2}>Heading</Heading>
      <Heading level={3}>Sub-heading</Heading>
      <Heading level={4}>Sub-sub-heading</Heading>
      <Heading level={5}>Sub-sub-sub-heading</Heading>
      <Heading level={6}>Sub-sub-sub-sub-heading</Heading>
    </Section>
  );
}
```

```js Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Sanotaan, että haluat useiden otsikoiden olevan saman kokoisia samassa `Section` komponentissa:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Section>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Section>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Section>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Tällä hetkellä välität `level` propsin jokaiselle `<Heading>` komponentille erikseen:

```js
<Section>
  <Heading level={3}>About</Heading>
  <Heading level={3}>Photos</Heading>
  <Heading level={3}>Videos</Heading>
</Section>
```

Olisi hienoa, jos voisit välittää `level` propsin `<Section>` komponentille ja poistaa sen `<Heading>` komponentista. Tällöin voisit pakottaa kaikki otsikot samassa `<Section>` komponentissa olemaan saman kokoisia:

```js
<Section level={3}>
  <Heading>About</Heading>
  <Heading>Photos</Heading>
  <Heading>Videos</Heading>
</Section>
```

Mutta miten `<Heading>` komponentti voi tietää sen lähimmän `<Section>` komponentin tason? **Tämä vaatisi jonkin tapaa, jolla lapsi voisi "kysyä" jotain dataa puun yläpuolella.**

Et voi tehdä sitä vain propsien avulla. Tässä on, missä konteksti tulee mukaan. Tehdään se kolmessa vaiheessa:

1. **Luo** konteksti. (Voit kutsua sitä `LevelContext`:ksi, koska se on otsiko tasoa varten.)
2. **Käytä** kontekstia komponentista, joka tarvitsee datan. (`Heading` käyttää `LevelContext`:a.)
3. **Tarjoa** konteksti komponentista, joka määrittää datan. (`Section` tarjoaa `LevelContext`:n.)

Konteksti antaa pääkomponentin - jopa kaukaisen - tarjota joitain tietoja koko puun sisällä.

<DiagramGroup>

<Diagram name="passing_data_context_close" height={160} width={608} captionPosition="top" alt="Kaavio kolmesta komponentista. Pääkomponentti sisältää kuplan, joka edustaa oranssilla korostettua arvoa, joka projisoi alas kahden lapsen, jotka ovat molemmat korostettu oranssilla.">

Kontekstin käyttö lähellä olevissa lapsikomponenteissa

</Diagram>

<Diagram name="passing_data_context_far" height={430} width={608} captionPosition="top" alt="Kaavio kymmenestä solmusta koostuvasta puusta, jokaisella solmulla on kaksi tai vähemmän lasta. Juurisolmu sisältää kuplan, joka edustaa oranssilla korostettua arvoa, joka projisoi alas suoraan neljään lehteen ja yhteen välikomponenttiin puussa, jotka ovat kaikki korostettu oranssilla. Muita välikomponentteja ei ole korostettu.">

Kontekstin käyttö kaukaisissa lapsikomponenteissa

</Diagram>

</DiagramGroup>

### 1. Vaihe: Luo context {/*step-1-create-the-context*/}

Ensiksi, sinun täytyy luoda konteksti. Sinun täytyy **exporta se tiedostosta** jotta komponentit voivat käyttää sitä:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Section>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Section>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Section>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js LevelContext.js active
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Ainoa argumentti `createContext`:lle on sen _oletusarvo_. Tässä, `1` viittaa suurimpaan otsikon tasoon, mutta voit antaa minkä tahansa tyyppisen arvon (jopa olion). Näet oletusarvon merkityksen seuraavassa vaiheessa.

### 2. Vaihe: Käytä contextia {/*step-2-use-the-context*/}

Importtaa kontekstisi ja `useContext` Hook Reactista:

```js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';
```

Tällä hetkellä, `Heading` komponentti lukee `level`:n propseista:

```js
export default function Heading({ level, children }) {
  // ...
}
```

Sen sijaan, poista `level` propsi ja lue arvo `LevelContext` kontekstista, jonka juuri importoitit:

```js {2}
export default function Heading({ children }) {
  const level = useContext(LevelContext);
  // ...
}
```

`useContext` on hookki. Juuri kuten `useState` sekä `useReducer`, voit kutsua hookkia vain React-komponentin ylimmällä tasolla. **`useContext` kertoo Reactille, että `Heading` -komponentti haluaa lukea `LevelContext` -kontekstin.**

Nyt kun `Heading` -komponentti ei enää sisällä `level` -propsia, `level` -propsia ei tarvitse enää välittää `Heading` -komponentille JSX:ssä:

```js
<Section>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
</Section>
```

Päivitä JSX, jotta se on `Section`, joka sen saa:

```jsx
<Section level={4}>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
</Section>
```

Muistutuksena, tämä on se merkintäkoodi, jota yritit saada toimimaan:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Title</Heading>
      <Section level={2}>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section level={3}>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section level={4}>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Huomaa, että tämä esimerkki ei vielä toimi! Kaikki otsikot ovat saman kokoisia, koska **vaikka käytät kontekstia, et ole vielä tarjonnut sitä.** React ei tiedä, mistä sen saa!

Jos et tarjoa kontekstia, React käyttää oletusarvoa, jonka määritit edellisessä vaiheessa. Tässä esimerkissä määritit `1`:n argumenttina `createContext`:lle, joten `useContext(LevelContext)` palauttaa `1`, asettaen kaikki otsikot `<h1>`:ksi. Korjataan tämä ongelma antamalla jokaisen `Section` -komponentin tarjota oma kontekstinsa.

### 3. Vaihe: Tarjoa context {/*step-3-provide-the-context*/}

`Section` -komponentti renderöi lapsensa:

```js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

**Kääri se kontekstitarjoajaan**, jotta voit tarjota `LevelContext` -kontekstin niille:

```js {1,6,8}
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext.Provider value={level}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

Tämä kertoo Reactille: "jos jokin komponentti tämän `<Section>` -komponentin sisällä kysyy `LevelContext`:iä, anna heille tämä `level`." Komponentti käyttää lähintä `<LevelContext.Provider>` -komponenttia UI-puussa sen yläpuolella.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Title</Heading>
      <Section level={2}>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section level={3}>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section level={4}>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js Section.js
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext.Provider value={level}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Tämä on sama tulos kuin alkuperäisessä koodissa, mutta sinun ei tarvinnut antaa `level` -propsia jokaiselle `Heading` -komponentille! Sen sijaan se "päättelee" otsikkotason kysymällä lähimmältä `Section` -komponentilta yläpuolella:

1. Välität `level` -propsin `<Section>` -komponentille.
2. `Section` käärii lapsensa `<LevelContext.Provider value={level}>`:n sisään.
3. `Heading` kysyy lähimmän `LevelContext`:n arvon `useContext(LevelContext)` funktiolla.

## Contextin käyttäminen ja tarjoaminen samasta komponentista {/*using-and-providing-context-from-the-same-component*/}

Tällä hetkellä sinun on vielä määritettävä jokaisen osion `level` manuaalisesti:

```js
export default function Page() {
  return (
    <Section level={1}>
      ...
      <Section level={2}>
        ...
        <Section level={3}>
          ...
```

Koska konteksti antaa sinun lukea tietoja komponentista yläpuolelta, jokainen `Section` voisi lukea `level` -arvon yläpuolelta olevasta `Section` -komponentista ja välittää `level + 1` alaspäin automaattisesti. Tässä on tapa tehdä se:

```js Section.js {5,8}
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

Tällä muutoksella sinun ei tarvitse välittää `level` -propsia *kummallekaan* `<Section>` -komponentille tai `<Heading>` -komponentille:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Title</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Nyt sekä `Heading` että `Section` lukevat `LevelContext`:n selvittääkseen kuinka "syvällä" ne ovat. Ja `Section` käärii lapsensa `LevelContext`:n sisään määrittääkseen, että mikä tahansa sen sisällä on "syvemmällä" tasolla.

<Note>

Tämä esimerkki käyttää otsikkotasojen määrittämistä koska se näyttää visuaalisesti kuinka sisäkkäiset komponentit voivat ohittaa kontekstin. Mutta konteksti on hyödyllinen monille muillekin käyttötarkoituksille. Voit käyttää sitä välittämään tietoa, jota koko alipuu tarvitsee: nykyinen väriteema, tällä hetkellä kirjautunut käyttäjä, jne.

</Note>


## Konteksti välittyy välissä olevien komponenttien läpi {/*context-passes-through-intermediate-components*/}

Voit lisätä niin monta komponenttia kuin haluat kontekstin tarjoavan komponentin ja sen käyttävän komponentin välille. Tämä sisältää sekä sisäänrakennetut komponentit kuten `<div>` että itse luomiasi komponentteja.

Tässä esimerkissä, sama `Post` -komponentti (jolla on katkoviiva) renderöidään kahdella eri tasolla. Huomaa, että `<Heading>` -komponentti sen sisällä saa tasonsa automaattisesti lähimmästä `<Section>` -komponentista:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function ProfilePage() {
  return (
    <Section>
      <Heading>My Profile</Heading>
      <Post
        title="Hello traveller!"
        body="Read about my adventures."
      />
      <AllPosts />
    </Section>
  );
}

function AllPosts() {
  return (
    <Section>
      <Heading>Posts</Heading>
      <RecentPosts />
    </Section>
  );
}

function RecentPosts() {
  return (
    <Section>
      <Heading>Recent Posts</Heading>
      <Post
        title="Flavors of Lisbon"
        body="...those pastéis de nata!"
      />
      <Post
        title="Buenos Aires in the rhythm of tango"
        body="I loved it!"
      />
    </Section>
  );
}

function Post({ title, body }) {
  return (
    <Section isFancy={true}>
      <Heading>
        {title}
      </Heading>
      <p><i>{body}</i></p>
    </Section>
  );
}
```

```js Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children, isFancy }) {
  const level = useContext(LevelContext);
  return (
    <section className={
      'section ' +
      (isFancy ? 'fancy' : '')
    }>
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}

.fancy {
  border: 4px dashed pink;
}
```

</Sandpack>

Et tehnyt mitään erityistä, jotta tämä toimisi. `Section` määrittelee kontekstin sen sisällä olevalle puulle, jotta voit sijoittaa `<Heading>` komponentin mihin tahansa, ja se omaa silti oikean koon. Kokeile yllä olevassa hiekkalaatikossa!

**Kontekstin avulla voit kirjoittaa komponentteja jotka "mukautuvat ympäristöönsä" ja näyttäytyvät eri tavalla riippuen siitä _missä_ (tai, toisin kuvailtuna, _missä kontekstissa_) niitä renderöidään.**

Miten konteksti toimii saattaa muistuttaa sinua [CSS ominaisuuksien periytymisestä.](https://developer.mozilla.org/en-US/docs/Web/CSS/inheritance) CSS:ssä, voit määritellä `color: blue` `<div>`:lle, ja mikä tahansa DOM noodi sen sisällä, ei väliä miten syvällä, perii tämän värin ellei jokin toinen DOM noodi välissä ylikirjoita sitä `color: green`:llä. Samoin, Reactissa, ainoa tapa ylikirjoittaa jokin konteksti joka tulee ylhäältä on kääriä lapset kontekstitarjoajan kanssa eri arvolla.

CSS:ssä eri ominaisuudet kuten `color` ja `background-color` eivät ylikirjoita toisiaan. Voit asettaa kaikkien `<div>`:en `color`:t punaiseksi ilman että se vaikuttaa `background-color`:iin. Samoin, **eri React kontekstit eivät ylikirjoita toisiaan.** Jokainen konteksti, jonka luot `createContext()`:lla on täysin erillinen muista, ja se yhdistää komponentteja jotka käyttävät ja tarjoavat *tätä tiettyä* kontekstia. Yksi komponentti voi käyttää tai tarjota monia eri konteksteja ongelmitta.

## Ennen kuin käytät contextia {/*before-you-use-context*/}

Kontekstia on erittäin houkuttelevaa käyttää! Tämä kuitenkin tarkoittaa myös sitä, että sitä on liian helppoa ylikäyttää. **Vain siksi, että sinun täytyy välittää joitain propseja useita tasoja syvälle, ei tarkoita että sinun pitäisi laittaa tieto kontekstiin.**

Tässä on muutama vaihtoehto, jotka sinun pitäisi harkita ennen kuin käytät kontekstia:

1. **Aloita [välittämällä propsit.](/learn/passing-props-to-a-component)** Jos komponenttisi eivät ole triviaaleja, ei ole harvinaista että sinun pitää välittää kymmeniä propseja useita tasoja syvälle. Se saattaa tuntua työläältä, mutta se tekee selväksi, mitkä komponentit käyttävät mitäkin dataa! Henkilö joka ylläpitää koodiasi on kiitollinen, että olet tehnyt datan virtauksen selkeäksi propseilla.
2. **Erota komponentit ja [välitä JSX `children`:nä](/learn/passing-props-to-a-component#passing-jsx-as-children) niille.** Jos välität jotain dataa useiden komponenttien läpi, jotka eivät käytä tätä dataa (ja vain välittävät sen vain eteenpäin), tämä usein tarkoittaa että olet unohtanut erottaa joitain komponentteja matkan varrella. Esimerkiksi, ehkä välität data-propseja kuten `posts` visuaalisille komponenteille jotka eivät käytä niitä suoraan, kuten `<Layout posts={posts} />`. Sen sijaan, muokkaa `Layout` ottamaan `children` propsina ja renderöi `<Layout><Posts posts={posts} /></Layout>`. Tämä vähentää tasojen määrää dataa välittävien komponenttien ja dataa käyttävien komponenttien välillä.

Jos nämä eivät toimi, harkitse kontekstia.

## Contextin käyttökohteita {/*use-cases-for-context*/}

* **Teemat:** Jos sovelluksesi antaa käyttäjän vaihtaa sen ulkoasua (esim. tumma tila), voit laittaa kontekstitarjoajan ylätasolle, ja käyttää sitä komponenteissa joiden täytyy muuttaa ulkoasuaan.
* **Tämänhetkinen tili:** Monet komponentit saattavat tarvita tietää tämän hetkinen sisäänkirjautunut käyttäjä. Sen laittaminen kontekstiin tekee sen lukemisesta helppoa mistä tahansa puun tasosta. Joissain sovelluksissa voit myös toimia useiden tilien kanssa samanaikaisesti (esim. jättää kommentin eri käyttäjänä). Tällöin voi olla kätevää kääriä osa käyttöliittymästä sisäkkäiseen tarjoajaan eri tiliarvolla.
* **Reititys:** Useimmat reititysratkaisut käyttävät kontekstia sisäisesti pitääkseen kirjaa nykyisestä reitistä. Tämä on se tapa jolla jokainen linkki "tietää" onko se aktiivinen vai ei. Jos rakennat oman reititysratkaisusi, saatat haluta tehdä samoin.
* **Tilan hallinta:** Kun sovelluksesi kasvaa, saatat joutua pitämään paljon tilaa ylhäällä puussa. Monet kaukaiset komponentit alhaalla saattavat haluta muuttaa sitä. Yleensä [käytetään reduktoria yhdessä kontekstin kanssa](/learn/scaling-up-with-reducer-and-context) hallitaksesi monimutkaista tilaa ja välittääksesi sen eteenpäin komponenteille, jotka ovat kaukana toisistaan.

Konteksti ei ole rajoitettu staattisiin arvoihin. Jos välität eri arvon seuraavalla renderöinnillä, React päivittää kaikki komponentit jotka lukevat sitä alapuolelta! Tämä on syy miksi kontekstia käytetään usein yhdistettynä tilaan.

Yleisesti, jos jokin tieto on tarpeen kaukaisissa komponenteissa puussa, se on hyvä merkki siitä että konteksti auttaa sinua.

<Recap>

* Kontekstin avulla komponentti voi tarjota tietoa koko puun alapuolelle.
* Välittääksesi konteksti:
  1. Luo ja exporttaa se koodilla `export const MyContext = createContext(defaultValue)`.
  2. Välitä se `useContext(MyContext)` hookille luettavaksi minkä tahansa lapsikomponentin sisällä, riippumatta siitä kuinka syvälle se on.
  3. Kääri lapsikomponentit `<MyContext.Provider value={...}>`-komponenttiin tarjotaksesi sen yläpuolelta.
* Konteksti välittyy välissä olevien komponenttien läpi.
* Konteksti antaa sinun kirjoittaa komponentteja jotka "sovittuvat ympäristöönsä".
* Ennen kuin käytät kontekstia, yritä välittää propseja tai välitä JSX `children`:nä.

</Recap>

<Challenges>

#### Korvaa propsien välittäminen contextilla {/*replace-prop-drilling-with-context*/}

Tässä esimerkissä, valintaruudun tilan vaihtaminen muuttaa `imageSize` propsia joka välitetään kaikille `<PlaceImage>`-komponenteille. Valintaruudun tila pidetään ylätason `App`-komponentissa, mutta jokainen `<PlaceImage>`-komponentti tarvitsee sen tiedon.

Tällä hetkellä, `App` välittää `imageSize` propin `List`:lle, joka välittää sen jokaiselle `Place`:lle, joka välittää sen `PlaceImage`:lle. Poista `imageSize` propsi, ja välitä se suoraan `App`-komponentista `PlaceImage`:lle.

Voit määritellä kontekstin `Context.js`-tiedostossa.

<Sandpack>

```js App.js
import { useState } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Use large images
      </label>
      <hr />
      <List imageSize={imageSize} />
    </>
  )
}

function List({ imageSize }) {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place
        place={place}
        imageSize={imageSize}
      />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place, imageSize }) {
  return (
    <>
      <PlaceImage
        place={place}
        imageSize={imageSize}
      />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place, imageSize }) {
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js Context.js

```

```js data.js
export const places = [{
  id: 0,
  name: 'Bo-Kaap in Cape Town, South Africa',
  description: 'The tradition of choosing bright colors for houses began in the late 20th century.',
  imageId: 'K9HVAGH'
}, {
  id: 1, 
  name: 'Rainbow Village in Taichung, Taiwan',
  description: 'To save the houses from demolition, Huang Yung-Fu, a local resident, painted all 1,200 of them in 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'Macromural de Pachuca, Mexico',
  description: 'One of the largest murals in the world covering homes in a hillside neighborhood.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'Selarón Staircase in Rio de Janeiro, Brazil',
  description: 'This landmark was created by Jorge Selarón, a Chilean-born artist, as a "tribute to the Brazilian people."',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'Burano, Italy',
  description: 'The houses are painted following a specific color system dating back to 16th century.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'Chefchaouen, Marocco',
  description: 'There are a few theories on why the houses are painted blue, including that the color repells mosquitos or that it symbolizes sky and heaven.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village in Busan, South Korea',
  description: 'In 2009, the village was converted into a cultural hub by painting the houses and featuring exhibitions and art installations.',
  imageId: 'ZfQOOzf'
}];
```

```js utils.js
export function getImageUrl(place) {
  return (
    'https://i.imgur.com/' +
    place.imageId +
    'l.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
```

</Sandpack>

<Solution>

Poista `imageSize` propsi kaikilta komponenteilta.

Luo ja exporttaa `ImageSizeContext` `Context.js`:stä. Sitten ympäröi List `<ImageSizeContext.Provider value={imageSize}>`-komponentilla, jotta arvo välittyy alaspäin, ja käytä `useContext(ImageSizeContext)`:a lukeaksesi sen `PlaceImage`:ssa:

<Sandpack>

```js App.js
import { useState, useContext } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';
import { ImageSizeContext } from './Context.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <ImageSizeContext.Provider
      value={imageSize}
    >
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Use large images
      </label>
      <hr />
      <List />
    </ImageSizeContext.Provider>
  )
}

function List() {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place place={place} />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place }) {
  return (
    <>
      <PlaceImage place={place} />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place }) {
  const imageSize = useContext(ImageSizeContext);
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js Context.js
import { createContext } from 'react';

export const ImageSizeContext = createContext(500);
```

```js data.js
export const places = [{
  id: 0,
  name: 'Bo-Kaap in Cape Town, South Africa',
  description: 'The tradition of choosing bright colors for houses began in the late 20th century.',
  imageId: 'K9HVAGH'
}, {
  id: 1, 
  name: 'Rainbow Village in Taichung, Taiwan',
  description: 'To save the houses from demolition, Huang Yung-Fu, a local resident, painted all 1,200 of them in 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'Macromural de Pachuca, Mexico',
  description: 'One of the largest murals in the world covering homes in a hillside neighborhood.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'Selarón Staircase in Rio de Janeiro, Brazil',
  description: 'This landmark was created by Jorge Selarón, a Chilean-born artist, as a "tribute to the Brazilian people".',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'Burano, Italy',
  description: 'The houses are painted following a specific color system dating back to 16th century.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'Chefchaouen, Marocco',
  description: 'There are a few theories on why the houses are painted blue, including that the color repells mosquitos or that it symbolizes sky and heaven.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village in Busan, South Korea',
  description: 'In 2009, the village was converted into a cultural hub by painting the houses and featuring exhibitions and art installations.',
  imageId: 'ZfQOOzf'
}];
```

```js utils.js
export function getImageUrl(place) {
  return (
    'https://i.imgur.com/' +
    place.imageId +
    'l.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
```

</Sandpack>

Huomaa miten keskellä olevien komponenttien ei tarvitse enää välittää `imageSize`:a.

</Solution>

</Challenges>
