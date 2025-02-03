---
title: createContext
---

<Intro>

`createContext` rajapinnan avulla voit luoda [kontekstin](/learn/passing-data-deeply-with-context), jota komponentit voivat tarjota tai lukea.

```js
const SomeContext = createContext(defaultValue)
```

</Intro>

<InlineToc />

---

## Viite {/*reference*/}

### `createContext(defaultValue)` {/*createcontext*/}

Kutsu `createContext` -funktiota komponenttien ulkopuolella luodaksesi kontekstin.

```js
import { createContext } from 'react';

const ThemeContext = createContext('light');
```

[Katso lisää esimerkkejä alapuolelta.](#käyttö)

#### Parametrit {/*parameters*/}

* `defaultValue`: Arvo, jonka haluat kontekstilla olevan, kun puun yläpuolella olevista komponenteista ei löydy vastaavaa kontekstin tarjoajaa. Jos sinulla ei ole mitään merkityksellistä oletusarvoa, määritä `null`. Oletusarvo on tarkoitettu "viimeisenä keinona" vara-arvona. Se on staattinen eikä muutu ajan myötä.

#### Palautukset {/*returns*/}

`createContext` palauttaa kontekstiolion.

**Kontekstiolio itsessään ei sisällä mitään tietoa.** Se edustaa _minkä_ kontekstin muita komponentteja lukee tai tarjoaa. Tyypillisesti käytät [`SomeContext.Provider`](#provider) ylemmissä komponenteissa määrittääksesi kontekstin arvon ja kutsut [`useContext(SomeContext)`](/reference/react/useContext) -komponenttia alempana lukeaksesi sen. Kontekstioliossa on muutama ominaisuus:

* `SomeContext.Provider` avulla voit tarjota kontekstin arvon komponenteille.
* `SomeContext.Consumer` on vaihtoehtoinen ja harvoin käytetty tapa lukea kontekstin arvo.

---

### `SomeContext.Provider` {/*provider*/}

Kääri komponenttisi kontekstin tarjoajaan määrittääksesi tämän kontekstin arvon kaikille sisäpuolella oleville komponenteille:

```js
function App() {
  const [theme, setTheme] = useState('light');
  // ...
  return (
    <ThemeContext.Provider value={theme}>
      <Page />
    </ThemeContext.Provider>
  );
}
```

#### Propsitit {/*provider-props*/}

* `value`: Arvo, jonka haluat välittää kaikille tämän tarjoajan sisällä oleville kontekstin lukeville komponenteille, riippumatta siitä, kuinka syvällä ne ovat. Kontekstin arvo voi olla mitä tahansa tyyppiä. Komponentti, joka kutsuu [`useContext(SomeContext)`](/reference/react/useContext) -Hookkia tarjoajan sisällä, saa `value`:n vastaavasta kontekstin tarjoajasta, joka on sen yläpuolella.

---

### `SomeContext.Consumer` {/*consumer*/}

Ennen kuin `useContext` oli olemassa, oli vanhempi tapa lukea konteksti:

```js
function Button() {
  // 🟡 Vanha tapa (ei suositella)
  return (
    <ThemeContext.Consumer>
      {theme => (
        <button className={theme} />
      )}
    </ThemeContext.Consumer>
  );
}
```

<<<<<<< HEAD
Vaikka tämä vanhempi tapa silti toimii, **uuden koodin tulisi lukea konteksti [`useContext()`](/reference/react/useContext) -hookilla:**
=======
Although this older way still works, **newly written code should read context with [`useContext()`](/reference/react/useContext) instead:**
>>>>>>> 6fc98fffdaad3b84e6093d1eb8def8f2cedeee16

```js
function Button() {
  // ✅ Suositeltu tapa
  const theme = useContext(ThemeContext);
  return <button className={theme} />;
}
```

#### Propsitit {/*consumer-props*/}

* `children`: Funktio. React kutsuu funktiota, johon välität nykyisen kontekstin arvon, joka on määritetty samalla algoritmilla kuin [`useContext()`](/reference/react/useContext) tekee, ja renderöi tuloksen, jonka palautat tästä funktiosta. React myös uudelleen suorittaa tämän funktion ja päivittää käyttöliittymän aina kun konteksti ylemmistä komponenteista muuttuu.

---

## Käyttö {/*usage*/}

### Kontekstin luominen {/*creating-context*/}

Contekstin avulla komponentit voivat [välittää tietoa syvälle](/learn/passing-data-deeply-with-context) ilman, että ne välittävät eksplisiittisesti propseja.

Kutsu `createContext` -funktiota komponenttien ulkopuolella luodaksesi yhden tai useamman kontekstin.

```js [[1, 3, "ThemeContext"], [1, 4, "AuthContext"], [3, 3, "'light'"], [3, 4, "null"]]
import { createContext } from 'react';

const ThemeContext = createContext('light');
const AuthContext = createContext(null);
```

`createContext` palauttaa <CodeStep step={1}>kontekstiolion</CodeStep>.
Komponentit voivat lukea kontekstin välittämällä sen [`useContext()`](/reference/react/useContext) -hookille:

```js [[1, 2, "ThemeContext"], [1, 7, "AuthContext"]]
function Button() {
  const theme = useContext(ThemeContext);
  // ...
}

function Profile() {
  const currentUser = useContext(AuthContext);
  // ...
}
```

Oletuksena arvot, jotka ne saavat, ovat <CodeStep step={3}>oletusarvoja</CodeStep>, jotka olet määrittänyt luodessasi kontekstit. Kuitenkin, itsessään tämä ei ole hyödyllistä, koska oletusarvot eivät koskaan muutu.

Kontekstit ovat hyödyllisiä, koska voit **tarjota muita, dynaamisia arvoja komponenteistasi:**

```js {8-9,11-12}
function App() {
  const [theme, setTheme] = useState('dark');
  const [currentUser, setCurrentUser] = useState({ name: 'Taylor' });

  // ...

  return (
    <ThemeContext.Provider value={theme}>
      <AuthContext.Provider value={currentUser}>
        <Page />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
```

Nyt `Page` komponentti ja kaikki sen sisällä olevat komponentit, riippumatta siitä kuinka syvällä, "näkevät" välitetyt kontekstin arvot. Jos välitetyt kontekstin arvot muuttuvat, React uudelleen renderöi myös kontekstin lukevat komponentit.

[Lue lisää kontekstin lukemisesta sekä tarjoamisesta ja katso esimerkkejä.](/reference/react/useContext)

---

### Kontekstin tuominen ja vieminen tiedostosta {/*importing-and-exporting-context-from-a-file*/}

Usein, eri tiedostoissa olevat komponentit tarvitsevat pääsyn samaan kontekstiin. Tämän vuoksi on yleistä määrittää kontekstit erillisessä tiedostossa. Voit sitten käyttää [`export` -lauseketta](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) tehdäksesi kontekstin saataville muille tiedostoille:

```js {4-5}
// Contexts.js
import { createContext } from 'react';

export const ThemeContext = createContext('light');
export const AuthContext = createContext(null);
```

Muissa tiedostoissa määritellyt komponentit voivat sitten käyttää [`import`](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/import) -lauseketta lukeakseen tai tarjotakseen tämän kontekstin:

```js {2}
// Button.js
import { ThemeContext } from './Contexts.js';

function Button() {
  const theme = useContext(ThemeContext);
  // ...
}
```

```js {2}
// App.js
import { ThemeContext, AuthContext } from './Contexts.js';

function App() {
  // ...
  return (
    <ThemeContext.Provider value={theme}>
      <AuthContext.Provider value={currentUser}>
        <Page />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
```

Tämä toimii samalla tavalla kuin [komponenttien tuominen ja vieminen.](/learn/importing-and-exporting-components)

---

## Vianmääritys {/*troubleshooting*/}

### En löydä tapaa muuttaa kontekstin arvoa {/*i-cant-find-a-way-to-change-the-context-value*/}


Seuraavanlainen koodi määrittää *oletusarvon* kontekstin arvolle:

```js
const ThemeContext = createContext('light');
```

Tämä arvo ei koskaan muutu. React käyttää tätä arvoa vain varmuusarvona, jos se ei löydä vastaavaa tarjoajaa yläpuolelta.

Jotta konteksti muuttuisi ajan myötä, [lisää tila ja kääri komponentit kontekstin tarjoajaan.](/reference/react/useContext#updating-data-passed-via-context)

