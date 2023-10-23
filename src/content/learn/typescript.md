---
title: TypeScriptin käyttäminen
re: https://github.com/reactjs/react.dev/issues/5960
---

<Intro>

TypeScript on suosittu tapa lisätä tyyppimääritteitä JavaScript koodiin. TypeScript [tukee JSX:ää](/learn/writing-markup-with-jsx) ja voit saada täyden React Web tuen lisäämällä [`@types/react`](https://www.npmjs.com/package/@types/react) ja [`@types/react-dom`](https://www.npmjs.com/package/@types/react-dom) projektiisi.

</Intro>

<YouWillLearn>

* [TypeScript React komponenteissa](/learn/typescript#typescript-with-react-components)
* [Esimerkkejä koodaamisesta hookkien avulla](/learn/typescript#example-hooks)
* [Yleisiä tyyppejä `@types/react` paketista](/learn/typescript/#useful-types)
* [Osaamisen laajentaminen](/learn/typescript/#further-learning)

</YouWillLearn>

## Asennus {/*installation*/}

Kaikki [tuotantokäyttöön tarkoitetut React frameworkit](/learn/start-a-new-react-project#production-grade-react-frameworks) tarjoavat tuen TypeScriptin käyttöön. Seuraa frameworkin omaa asennusohjetta:

- [Next.js](https://nextjs.org/docs/pages/building-your-application/configuring/typescript)
- [Remix](https://remix.run/docs/en/1.19.2/guides/typescript)
- [Gatsby](https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript/)
- [Expo](https://docs.expo.dev/guides/typescript/)

### TypeScriptin lisääminen olemassa olevaan React projektiin {/*adding-typescript-to-an-existing-react-project*/}

Asentaaksesi uusimman version Reactin tyyppimäärittelyistä:

<TerminalBlock>
npm install @types/react @types/react-dom
</TerminalBlock>

Seuraavat compiler-asetukset on oltava asetettuna `tsconfig.json` tiedostossasi:

1. `dom` täytyy olla sisällytettynä [`lib`](https://www.typescriptlang.org/tsconfig/#lib):ssa (Huomaa: Jos `lib` vaihtoehtoa ei ole määritelty, `dom` sisällytetään oletuksena).
2. [`jsx`](https://www.typescriptlang.org/tsconfig/#jsx):n täytyy olla yksi sallituista vaihtoehdoista. `preserve` riittää useimmille sovelluksille.
  If you're publishing a library, consult the [`jsx` documentation](https://www.typescriptlang.org/tsconfig/#jsx) on what value to choose.
  Jos olet julkaisemassa kirjastoa, tutustu [`jsx` dokumentaatioon](https://www.typescriptlang.org/tsconfig/#jsx) mitä arvoa valita.

## TypeScript React komponenteissa {/*typescript-with-react-components*/}

<Note>

Jokainen tiedosto joka sisältää JSX:ää täytyy käyttää `.tsx` tiedostopäätettä. Tämä on TypeScriptin oma tiedostopääte joka kertoo TypeScriptille että tämä tiedosto sisältää JSX:ää.

</Note>

TypeScriptin kirjoittaminen Reactin kanssa on hyvin samanlaista kuin JavaScriptin kirjoittaminen Reactin kanssa. Suurin ero on että voit määritellä tyypit komponentin propseille. Nämä tyypit voidaan käyttää oikeellisuuden tarkistamiseen ja sisäisen dokumentaation tarjoamiseen editoreissa.

[`MyButton` komponentin](/learn#components) ottaminen [Pika-aloitus](/learn) -oppaasta, voimme lisätä tyypin joka kuvaa `title` propin painikkeelle:

<Sandpack>

```tsx App.tsx active
function MyButton({ title }: { title: string }) {
  return (
    <button>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Tervetuloa sovellukseeni</h1>
      <MyButton title="Olen painike" />
    </div>
  );
}
```

```js App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```
</Sandpack>

 <Note>

Nämä hiekkalaatikot tukevat TypeScript koodia, mutta ne eivät aja tyyppitarkistinta. Tämä tarkoittaa että voit muokata TypeScript hiekkalaatikoita oppiaksesi, mutta et saa mitään tyyppivirheitä tai varoituksia. Saadaksesi tyyppitarkistuksen, voit käyttää [TypeScript Playground](https://www.typescriptlang.org/play) tai käyttää enemmän ominaisuuksia sisältävää hiekkalaatikkoa.

</Note>

Tämä sisäinen syntaksi on yksinkertaisin tapa määritellä tyypit komponentille, mutta kun sinulla on muutama kenttä kuvattavana, se voi muuttua hankalaksi. Sen sijaan voit käyttää `interface` tai `type` kuvaamaan komponentin propseja:

<Sandpack>

```tsx App.tsx active
interface MyButtonProps {
  /** Teksti jota näytetään painikkeen sisällä */
  title: string;
  /** Voiko painiketta käyttää */
  disabled: boolean;
}

function MyButton({ title, disabled }: MyButtonProps) {
  return (
    <button disabled={disabled}>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Tervetuloa sovellukseeni</h1>
      <MyButton title="Olen käytöstä poistettu painike" disabled={true}/>
    </div>
  );
}
```

```js App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

Tyyppi joka kuvaa komponentin propseja voi olla yhtä yksinkertainen tai monimutkainen kuin tarvitset, mutta niiden tulisi olla objektityyppi joka on kuvattu joko `type` tai `interface` avulla. Voit oppia kuinka TypeScript kuvaa objekteja [Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html) -oppaasta, mutta saatat olla kiinnostunut käyttämään [Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) kuvaamaan propsia joka voi olla yksi monista eri tyypeistä ja [Creating Types from Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html) -opas monimutkaisempiin käyttötapauksiin.

## Hookki-esimerkkejä {/*example-hooks*/}

Tyyppimäärittelyt `@types/react` paketissa sisältävät tyypit sisäänrakennetuille hookkeille, joten voit käyttää niitä komponenteissasi ilman lisäasetuksia. Ne on rakennettu ottamaan huomioon koodi jonka kirjoitat komponenttiisi, joten saat [pääteltyjä tyyppejä](https://www.typescriptlang.org/docs/handbook/type-inference.html) usein ja sinun ei pitäisi tarvita käsitellä yksityiskohtia tyypittämisestä.

Kuitenkin, voimme katsoa muutamia esimerkkejä kuinka tarjota tyyppejä hookkeille.

### `useState` {/*typing-usestate*/}

[`useState` hookki](/reference/react/useState) käyttää uuddelleen arvoa joka annetaan alustavaksi tilaksi määrittääkseen minkä tyyppinen arvo on kyseessä. Esimerkiksi:

```ts
// Päättele arvoksi "boolean":ksi
const [enabled, setEnabled] = useState(false);
```

Päättelee `enabled` tyypiksi `boolean` ja `setEnabled` on funktio joka hyväksyy joko `boolean` argumentin tai funktion joka palauttaa `boolean` arvon. Jos haluat määrittää tyypin tilalle, voit tehdä sen antamalla tyypin argumentin `useState` kutsulle:

```ts 
// Eksplisiittisesti aseta tyyppi "boolean":ksi
const [enabled, setEnabled] = useState<boolean>(false);
```

Tämä ei ole kovin hyödyllistä tässä tapauksessa, mutta yleinen tapaus jossa haluat määrittää tyypin on kun sinulla on union tyyppi. Esimerkiksi, `status` voi olla yksi monista eri merkkijonoista:

```ts
type Status = "idle" | "loading" | "success" | "error";

const [status, setStatus] = useState<Status>("idle");
```

Tai, kuten suositellaan [Tilarakenteiden periaatteissa](/learn/choosing-the-state-structure#principles-for-structuring-state), voit ryhmitellä liittyvän tilan objektiksi ja kuvailla eri mahdollisuudet objektityypeillä:

```ts
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success', data: any }
  | { status: 'error', error: Error };

const [requestState, setRequestState] = useState<RequestState>({ status: 'idle' });
```

### `useReducer` {/*typing-usereducer*/}

[`useReducer` hookki](/reference/react/useReducer) on monimutkaisempi hookki joka ottaa reduktorifunktion ja alustavan tilan. Tyypit reducer funktiolle päätellään alustavasta tilasta. Voit valinnaisesti antaa tyypin argumentin `useReducer` kutsulle antaaksesi tyypin tilalle, mutta on usein parempi asettaa tyyppi alustavalle tilalle:

<Sandpack>

```tsx App.tsx active
import {useReducer} from 'react';

interface State {
   count: number 
};

type CounterAction =
  | { type: "reset" }
  | { type: "setCount"; value: State["count"] }

const initialState: State = { count: 0 };

function stateReducer(state: State, action: CounterAction): State {
  switch (action.type) {
    case "reset":
      return initialState;
    case "setCount":
      return { ...state, count: action.value };
    default:
      throw new Error("Unknown action");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const addFive = () => dispatch({ type: "setCount", value: state.count + 5 });
  const reset = () => dispatch({ type: "reset" });

  return (
    <div>
      <h1>Tervetuloa laskuriini</h1>

      <p>Laskuri: {state.count}</p>
      <button onClick={addFive}>Lisää 5</button>
      <button onClick={reset}>Nollaa</button>
    </div>
  );
}

```

```js App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>


Käytämme TypeScriptiä muutamassa keskeisessä paikassa:

 - `interface State` kuvaa reduktorin tilan muodon.
 - `type CounterAction` kuvaa eri toimintoja jotka voidaan lähettää reduktorille.
 - `const initialState: State` tarjoaa tyypin alustavalle tilalle, ja myös tyypin jota `useReducer` käyttää oletuksena.
 - `stateReducer(state: State, action: CounterAction): State` asettaa tyypit reduktorifunktion argumenteille ja palautusarvolle.

Eksplisiittisempi vaihtoehto tyypin asettamiseen `initialState`:lle on antaa tyyppi argumentti `useReducer`:lle:

```ts
import { stateReducer, State } from './your-reducer-implementation';

const initialState = { count: 0 };

export default function App() {
  const [state, dispatch] = useReducer<State>(stateReducer, initialState);
}
```

### `useContext` {/*typing-usecontext*/}

[`useContext` hookki](/reference/react/useContext) on tekniikka datan välittämiseen komponenttipuun läpi ilman että tarvitsee välittää propseja komponenttien läpi. Sitä käytetään luomalla tarjoaja komponentti ja usein luomalla hookki arvon käyttöön lapsikomponentissa.

Kontekstin tarjoaman arvon tyyppi päätellään arvosta joka annetaan `createContext` kutsulle:

<Sandpack>

```tsx App.tsx active
import { createContext, useContext, useState } from 'react';

type Theme = "light" | "dark" | "system";
const ThemeContext = createContext<Theme>("system");

const useGetTheme = () => useContext(ThemeContext);

export default function MyApp() {
  const [theme, setTheme] = useState<Theme>('light');

  return (
    <ThemeContext.Provider value={theme}>
      <MyComponent />
    </ThemeContext.Provider>
  )
}

function MyComponent() {
  const theme = useGetTheme();

  return (
    <div>
      <p>Nykyinen teema: {theme}</p>
    </div>
  )
}
```

```js App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

<<<<<<< HEAD
Tämä tekniikka toimii kun sinulla on oletusarvo joka on järkevä - mutta on tapauksia jolloin sitä ei ole, ja näissä tapauksissa `null` voi tuntua järkevältä oletusarvolta. Kuitenkin, jotta tyyppijärjestelmä ymmärtäisi koodisi, sinun täytyy eksplisiittisesti asettaa `ContextShape | null` `createContext`:lle.
=======
This technique works when you have a default value which makes sense - but there are occasionally cases when you do not, and in those cases `null` can feel reasonable as a default value. However, to allow the type-system to understand your code, you need to explicitly set `ContextShape | null` on the `createContext`. 
>>>>>>> a0cacd7d3a89375e5689ccfba0461e293bfe9eeb

Tämä aiheuttaa ongelman jossa sinun täytyy eliminoida `| null` tyyppi kontekstin kuluttajilta. Suosituksemme on että hookki tekee runtime tarkistuksen sen olemassaolosta ja heittää virheen kun sitä ei ole:

```js {5, 16-20}
import { createContext, useContext, useState, useMemo } from 'react';

// Tämä on yksinkertaisempi esimerkki, mutta voit kuvitella monimutkaisemman olion tässä
type ComplexObject = {
  kind: string
};

// Konteksti luodaan `| null` tyypillä, jotta oletusarvo heijastuu tarkasti.
const Context = createContext<ComplexObject | null>(null);

// `| null` tullaan poistamaan tarkistuksen kautta hookissa.
const useGetComplexObject = () => {
  const object = useContext(Context);
  if (!object) { throw new Error("useGetComplexObject must be used within a Provider") }
  return object;
}

export default function MyApp() {
  const object = useMemo(() => ({ kind: "complex" }), []);

  return (
    <Context.Provider value={object}>
      <MyComponent />
    </Context.Provider>
  )
}

function MyComponent() {
  const object = useGetComplexObject();

  return (
    <div>
      <p>Nykyinen olio: {object.kind}</p>
    </div>
  )
}
```

### `useMemo` {/*typing-usememo*/}

[`useMemo`](/reference/react/useMemo) hookki luo/uudelleen käyttää muistettua arvoa funktiokutsusta, ajamalla funktiota uudelleen vain kun riippuvuudet jotka on annettu toisena parametrina muuttuvat. Kutsun tulosta päätellään palautusarvosta funktiossa ensimmäisenä parametrina. Voit olla eksplisiittisempi antamalla tyypin argumentin hookille.

```ts
// visibleTodos:n tyyppi päätellään filterTodos:n palautusarvosta
const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
```


### `useCallback` {/*typing-usecallback*/}

[`useCallback`](/reference/react/useCallback) tarjoaa vakaan viitteen funktioon niin kauan kun riippuvuudet jotka on annettu toisena parametrina pysyvät samana. Kuten `useMemo`, funktion tyyppi päätellään funktiosta palautusarvona ensimmäisenä parametrina, ja voit olla eksplisiittisempi antamalla tyypin argumentin hookille.


```ts
const handleClick = useCallback(() => {
  // ...
}, [todos]);
```

Kun työskentelet TypeScriptin strict-moodissa `useCallback` vaatii lisäämään tyypit parametreille callbackissasi. Tämä johtuu siitä että callbackin tyyppi päätellään funktion palautusarvosta, ja ilman parametreja tyyppiä ei voida ymmärtää täysin.

Riippuen koodityylistäsi, voit käyttää `*EventHandler` funktioita Reactin tyypeistä tarjotaksesi tyypin tapahtumankäsittelijälle samaan aikaan kun määrittelet callbackin:

```ts
import { useState, useCallback } from 'react';

export default function Form() {
  const [value, setValue] = useState("Change me");

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
    setValue(event.currentTarget.value);
  }, [setValue])
  
  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Value: {value}</p>
    </>
  );
}
```

## Hyödyllisiä tyyppejä {/*useful-types*/}

`@types/react` paketissa on melko laaja joukko tyyppejä, on hyvä lukea ne kun tunnet olosi mukavaksi kuinka React ja TypeScript toimivat yhdessä. Voit löytää ne [Reactin kansiossa DefinitelyTypedissä](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts). Käydään läpi muutamia yleisimpiä tyyppejä tässä.

### DOM tapahtumat {/*typing-dom-events*/}

Kun työskentelet DOM tapahtumien kanssa Reactissa, tapahtuman tyyppi voidaan usein päätellä tapahtumankäsittelijästä. Kuitenkin, kun haluat eristää funktion joka annetaan tapahtumankäsittelijälle, sinun täytyy eksplisiittisesti asettaa tapahtuman tyyppi.

<Sandpack>

```tsx App.tsx active
import { useState } from 'react';

export default function Form() {
  const [value, setValue] = useState("Change me");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.currentTarget.value);
  }

  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Arvo: {value}</p>
    </>
  );
}
```

```js App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

On monia eri tapahtumia, joita Reactin tyypit tarjoaa - täydellinen lista löytyy [täältä](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/b580df54c0819ec9df62b0835a315dd48b8594a9/types/react/index.d.ts#L1247C1-L1373) joka perustuu [suosituimpiin tapahtumiin DOM:issa](https://developer.mozilla.org/en-US/docs/Web/Events).

Kun etsit tyyppiä, voit ensin katsoa hover tiedot tapahtumankäsittelijälle jota käytät, joka näyttää tapahtuman tyypin.

Jos sinun täytyy käyttää tapahtumaa jota ei ole tässä listassa, voit käyttää `React.SyntheticEvent` tyyppiä, joka on kaikkien tapahtumien perustyypi.

### Children {/*typing-children*/}

On kaksi yleistä tapaa kuvailla komponentin lapsia. Ensimmäinen on käyttää `React.ReactNode` tyyppiä, joka on unioni kaikista mahdollisista tyypeistä jotka voidaan antaa lapsina JSX:ssä:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactNode;
}
```

Tämä on hyvin laaja määritelmä lapsille. Toinen tapa on käyttää `React.ReactElement` tyyppiä, joka on vain JSX elementtejä eikä JavaScript primitiivejä kuten merkkijonoja tai numeroita:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactElement;
}
```

Huomaa, että et voi käyttää TypeScriptiä kuvaamaan että lapset ovat tietyn tyyppisiä JSX elementtejä, joten et voi käyttää tyyppijärjestelmää kuvaamaan komponenttia joka hyväksyy vain `<li>` lapsia.

Näet esimerkin sekä `React.ReactNode`:sta että `React.ReactElement`:sta tyyppitarkistuksella [tässä TypeScript hiekkalaatikossa](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAJQKYEMDG8BmUIjgIilQ3wChSB6CxYmAOmXRgDkIATJOdNJMGAZzgwAFpxAR+8YADswAVwGkZMJFEzpOjDKw4AFHGEEBvUnDhphwADZsi0gFw0mDWjqQBuUgF9yaCNMlENzgAXjgACjADfkctFnYkfQhDAEpQgD44AB42YAA3dKMo5P46C2tbJGkvLIpcgt9-QLi3AEEwMFCItJDMrPTTbIQ3dKywdIB5aU4kKyQQKpha8drhhIGzLLWODbNs3b3s8YAxKBQAcwXpAThMaGWDvbH0gFloGbmrgQfBzYpd1YjQZbEYARkB6zMwO2SHSAAlZlYIBCdtCRkZpHIrFYahQYQD8UYYFA5EhcfjyGYqHAXnJAsIUHlOOUbHYhMIIHJzsI0Qk4P9SLUBuRqXEXEwAKKfRZcNA8PiCfxWACecAAUgBlAAacFm80W-CU11U6h4TgwUv11yShjgJjMLMqDnN9Dilq+nh8pD8AXgCHdMrCkWisVoAet0R6fXqhWKhjKllZVVxMcavpd4Zg7U6Qaj+2hmdG4zeRF10uu-Aeq0LBfLMEe-V+T2L7zLVu+FBWLdLeq+lc7DYFf39deFVOotMCACNOCh1dq219a+30uC8YWoZsRyuEdjkevR8uvoVMdjyTWt4WiSSydXD4NqZP4AymeZE072ZzuUeZQKheQgA).

### Tyylipropsit {/*typing-style-props*/}

Kun käytät inline-tyylejä Reactissa, voit käyttää `React.CSSProperties` kuvaamaan objektia joka annetaan `style` propille. Tämä tyyppi on unioni kaikista mahdollisista CSS ominaisuuksista, ja on hyvä tapa varmistaa että annat oikeellisia CSS ominaisuuksia `style` propille, ja saadaksesi automaattisen täydennyksen editoriisi.

```ts
interface MyComponentProps {
  style: React.CSSProperties;
}
```

## Osaamisen laajentaminen {/*further-learning*/}

Tämä opas on käsitellyt TypeScriptin käyttöä Reactin kanssa, mutta on paljon enemmän opittavaa.
Yksittäiset API sivut dokumentaatiossa voivat sisältää syvällisempää dokumentaatiota kuinka käyttää niitä TypeScriptin kanssa.

Suosittelemme seuraavia resursseja:

 - [The TypeScript handbook](https://www.typescriptlang.org/docs/handbook/) on virallinen dokumentaatio TypeScriptille, ja kattaa suurimman osan tärkeimmistä ominaisuuksista.

 - [The TypeScript release notes](https://devblogs.microsoft.com/typescript/) kattaa jokaisen uuden ominaisuuden syvällisesti.

 - [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) on yhteisön ylläpitämä lunttilappu TypeScriptin käyttöön Reactin kanssa, kattaa paljon hyödyllisiä reunoja ja tarjoaa enemmän syvyyttä kuin tämä dokumentti.

<<<<<<< HEAD
 - [TypeScript Community Discord](https://discord.com/invite/typescript) on hyvä paikka kysyä kysymyksiä ja saada apua TypeScriptin ja Reactin ongelmiin.
=======
 - [TypeScript Community Discord](https://discord.com/invite/typescript) is a great place to ask questions and get help with TypeScript and React issues.
>>>>>>> a0cacd7d3a89375e5689ccfba0461e293bfe9eeb
