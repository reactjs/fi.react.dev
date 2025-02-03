---
title: <Fragment> (<>...</>)
---

<Intro>

`<Fragment>`, useiten käytetty `<></>` syntaksin kautta, antaa sinun ryhmitellä elementtejä ilman wrapper-elementtiä.

```js
<>
  <OneChild />
  <AnotherChild />
</>
```

</Intro>

<InlineToc />

---

## Viite {/*reference*/}

### `<Fragment>` {/*fragment*/}

Kääri elementtejä `<Fragment>`:n sisään ryhmitelläksesi ne yhteen tilanteissa, joissa tarvitset yhden elementin. Elementtien ryhmittely `Fragment`:n sisään ei vaikuta lopulliseen DOM:iin; se on sama kuin elementtejä ei oltaisi ryhmitelty. Tyhjä JSX-tagi `<></>` on lyhenne `<Fragment></Fragment>`:sta useimmissa tapauksissa.

#### Propsit {/*props*/}

- **valinnainen** `key`: Fragmentit jotka on määritelty `<Fragment>` syntaksilla voivat sisältää [avaimia.](/learn/rendering-lists#keeping-list-items-in-order-with-key)

#### Rajoitukset {/*caveats*/}

- Jos haluat välittää `key`:n Fragmentille, et voi käyttää `<></>` syntaksia. Sinun täytyy tuoda `Fragment` `'react'`-kirjastosta ja renderöidä `<Fragment key={yourKey}>...</Fragment>`.

- React ei [nollaa tilaa](/learn/preserving-and-resetting-state) kun siirryt renderöimästä `<><Child /></>`:n `[<Child />]`:iin tai takaisin, tai kun siirryt renderöimästä `<><Child /></>`:n `<Child />`:iin ja takaisin. Tämä toimii vain yhden tason syvyyteen asti: esimerkiksi siirtyminen `<><><Child /></></>` `<Child />` nollaa tilan. Katso tarkat semantiikat [täältä.](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)

---

## Käyttö {/*usage*/}

### Useiden elementtien palauttaminen {/*returning-multiple-elements*/}

Käytä `Fragment`:ia, tai sitä vastaavaa `<></>` syntaksia, ryhmitelläksesi useita elementtejä yhteen. Voit käyttää sitä laittamaan useita elementtejä mihin tahansa paikkaan, johon yksi elementti voi mennä. Esimerkiksi komponentti voi palauttaa vain yhden elementin, mutta käyttämällä Fragmenttia voit ryhmitellä useita elementtejä yhteen ja palauttaa ne ryhmänä:

```js {3,6}
function Post() {
  return (
    <>
      <PostTitle />
      <PostBody />
    </>
  );
}
```

Fragmentit ovat hyödyllisiä koska elementtien ryhmittely Fragmentin sisään ei vaikuta layouttiin tai tyyleihin, toisin kuin jos käärisit elementit toiseen DOM-elementtiin. Jos tarkastelet tätä esimerkkiä selaimen työkaluilla, näet että kaikki `<h1>` ja `<article>` DOM-nodet näkyvät sisaruksina ilman wrapper-elementtejä niiden ympärillä:

<Sandpack>

```js
export default function Blog() {
  return (
    <>
      <Post title="Päivitys" body="Siitä on hetki kun viimeksi julkaisin..." />
      <Post title="Uusi blogini" body="Aloitan uuden blogin!" />
    </>
  )
}

function Post({ title, body }) {
  return (
    <>
      <PostTitle title={title} />
      <PostBody body={body} />
    </>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>

<DeepDive>

#### Miten kirjoittaa Fragment ilman erityissyntaksia? {/*how-to-write-a-fragment-without-the-special-syntax*/}

Tämä esimerkki vastaa `Fragment`:in tuomista Reactista:

```js {1,5,8}
import { Fragment } from 'react';

function Post() {
  return (
    <Fragment>
      <PostTitle />
      <PostBody />
    </Fragment>
  );
}
```

Useimmiten et tule tarvitsemaan tätä ellei sinun tarvitse [välittää `key` Fragmentille.](#rendering-a-list-of-fragments)

</DeepDive>

---
### Useiden elementtien määrittäminen muuttujaan {/*assigning-multiple-elements-to-a-variable*/}

Kuten mitä tahansa muita elementtejä, voit määrittää Fragmentin elementtejä muuttujiin, välittää niitä propseina, jne:

```js
function CloseDialog() {
  const buttons = (
    <>
      <OKButton />
      <CancelButton />
    </>
  );
  return (
    <AlertDialog buttons={buttons}>
      Oletko varma, että haluat poistua tältä sivulta?
    </AlertDialog>
  );
}
```

---
### Tekstin ryhmittäminen elementteihin {/*grouping-elements-with-text*/}

Voit käyttää `Fragment`:ia ryhmitelläksesi tekstin yhteen komponenttien kanssa:

```js
function DateRangePicker({ start, end }) {
  return (
    <>
      Aloituspäivä:
      <DatePicker date={start} />
      Lopetuspäivä:
      <DatePicker date={end} />
    </>
  );
}
```

---

### Fragment-listan renderöiminen {/*rendering-a-list-of-fragments*/}

Tässä on tilanne, jossa sinun täytyy kirjoittaa `Fragment` eksplisiittisesti sen sijaan, että käyttäisit `<></>` syntaksia. Kun [renderöit useita elementtejä silmukassa](/learn/rendering-lists), sinun täytyy määrittää `key` jokaiselle elementille. Jos elementit silmukan sisällä ovat Fragmentteja, sinun täytyy käyttää normaalia JSX-elementti -syntaksia, jotta voit välittää `key` attribuutin:

```js {3,6}
function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}
```

Voit tarkastella DOM:ia varmistaaksesi, että Fragmentin lapsilla ei ole wrapper-elementtejä:

<Sandpack>

```js
import { Fragment } from 'react';

const posts = [
  { id: 1, title: 'Päivitys', body: "Siitä on hetki kun viimeksi julkaisin..." },
  { id: 2, title: 'Uusi blogini', body: 'Aloitan uuden blogin!' }
];

export default function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>
