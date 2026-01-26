---
title: <Fragment> (<>...</>)
---

<Intro>

<<<<<<< HEAD
`<Fragment>`, useiten käytetty `<></>` syntaksin kautta, antaa sinun ryhmitellä elementtejä ilman wrapper-elementtiä.
=======
`<Fragment>`, often used via `<>...</>` syntax, lets you group elements without a wrapper node. 

<Canary> Fragments can also accept refs, which enable interacting with underlying DOM nodes without adding wrapper elements. See reference and usage below.</Canary>
>>>>>>> a1ddcf51a08cc161182b90a24b409ba11289f73e

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

<<<<<<< HEAD
- **valinnainen** `key`: Fragmentit jotka on määritelty `<Fragment>` syntaksilla voivat sisältää [avaimia.](/learn/rendering-lists#keeping-list-items-in-order-with-key)
=======
- **optional** `key`: Fragments declared with the explicit `<Fragment>` syntax may have [keys.](/learn/rendering-lists#keeping-list-items-in-order-with-key)
- <CanaryBadge />  **optional** `ref`: A ref object (e.g. from [`useRef`](/reference/react/useRef)) or [callback function](/reference/react-dom/components/common#ref-callback). React provides a `FragmentInstance` as the ref value that implements methods for interacting with the DOM nodes wrapped by the Fragment.

### <CanaryBadge /> FragmentInstance {/*fragmentinstance*/}

When you pass a ref to a fragment, React provides a `FragmentInstance` object with methods for interacting with the DOM nodes wrapped by the fragment:

**Event handling methods:**
- `addEventListener(type, listener, options?)`: Adds an event listener to all first-level DOM children of the Fragment.
- `removeEventListener(type, listener, options?)`: Removes an event listener from all first-level DOM children of the Fragment.
- `dispatchEvent(event)`: Dispatches an event to a virtual child of the Fragment to call any added listeners and can bubble to the DOM parent.

**Layout methods:**
- `compareDocumentPosition(otherNode)`: Compares the document position of the Fragment with another node.
  - If the Fragment has children, the native `compareDocumentPosition` value is returned. 
  - Empty Fragments will attempt to compare positioning within the React tree and include `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC`.
  - Elements that have a different relationship in the React tree and DOM tree due to portaling or other insertions are `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC`.
- `getClientRects()`: Returns a flat array of `DOMRect` objects representing the bounding rectangles of all children.
- `getRootNode()`: Returns the root node containing the Fragment's parent DOM node.

**Focus management methods:**
- `focus(options?)`: Focuses the first focusable DOM node in the Fragment. Focus is attempted on nested children depth-first.
- `focusLast(options?)`: Focuses the last focusable DOM node in the Fragment. Focus is attempted on nested children depth-first.
- `blur()`: Removes focus if `document.activeElement` is within the Fragment.

**Observer methods:**
- `observeUsing(observer)`: Starts observing the Fragment's DOM children with an IntersectionObserver or ResizeObserver.
- `unobserveUsing(observer)`: Stops observing the Fragment's DOM children with the specified observer.
>>>>>>> a1ddcf51a08cc161182b90a24b409ba11289f73e

#### Rajoitukset {/*caveats*/}

- Jos haluat välittää `key`:n Fragmentille, et voi käyttää `<></>` syntaksia. Sinun täytyy tuoda `Fragment` `'react'`-kirjastosta ja renderöidä `<Fragment key={yourKey}>...</Fragment>`.

- React ei [nollaa tilaa](/learn/preserving-and-resetting-state) kun siirryt renderöimästä `<><Child /></>`:n `[<Child />]`:iin tai takaisin, tai kun siirryt renderöimästä `<><Child /></>`:n `<Child />`:iin ja takaisin. Tämä toimii vain yhden tason syvyyteen asti: esimerkiksi siirtyminen `<><><Child /></></>` `<Child />` nollaa tilan. Katso tarkat semantiikat [täältä.](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)

- <CanaryBadge /> If you want to pass `ref` to a Fragment, you can't use the `<>...</>` syntax. You have to explicitly import `Fragment` from `'react'` and render `<Fragment ref={yourRef}>...</Fragment>`.

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

---

### <CanaryBadge /> Using Fragment refs for DOM interaction {/*using-fragment-refs-for-dom-interaction*/}

Fragment refs allow you to interact with the DOM nodes wrapped by a Fragment without adding extra wrapper elements. This is useful for event handling, visibility tracking, focus management, and replacing deprecated patterns like `ReactDOM.findDOMNode()`.

```js
import { Fragment } from 'react';

function ClickableFragment({ children, onClick }) {
  return (
    <Fragment ref={fragmentInstance => {
      fragmentInstance.addEventListener('click', handleClick);
      return () => fragmentInstance.removeEventListener('click', handleClick);
    }}>
      {children}
    </Fragment>
  );
}
```
---

### <CanaryBadge /> Tracking visibility with Fragment refs {/*tracking-visibility-with-fragment-refs*/}

Fragment refs are useful for visibility tracking and intersection observation. This enables you to monitor when content becomes visible without requiring the child Components to expose refs:

```js {19,21,31-34}
import { Fragment, useRef, useLayoutEffect } from 'react';

function VisibilityObserverFragment({ threshold = 0.5, onVisibilityChange, children }) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        onVisibilityChange(entries.some(entry => entry.isIntersecting))
      },
      { threshold }
    );
    
    fragmentRef.current.observeUsing(observer);
    return () => fragmentRef.current.unobserveUsing(observer);
  }, [threshold, onVisibilityChange]);

  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}

function MyComponent() {
  const handleVisibilityChange = (isVisible) => {
    console.log('Component is', isVisible ? 'visible' : 'hidden');
  };

  return (
    <VisibilityObserverFragment onVisibilityChange={handleVisibilityChange}>
      <SomeThirdPartyComponent />
      <AnotherComponent />
    </VisibilityObserverFragment>
  );
}
```

This pattern is an alternative to Effect-based visibility logging, which is an anti-pattern in most cases. Relying on Effects alone does not guarantee that the rendered Component is observable by the user.

---

### <CanaryBadge /> Focus management with Fragment refs {/*focus-management-with-fragment-refs*/}

Fragment refs provide focus management methods that work across all DOM nodes within the Fragment:

```js
import { Fragment, useRef } from 'react';

function FocusFragment({ children }) {
  return (
    <Fragment ref={(fragmentInstance) => fragmentInstance?.focus()}>
      {children}
    </Fragment>
  );
}
```

The `focus()` method focuses the first focusable element within the Fragment, while `focusLast()` focuses the last focusable element.
