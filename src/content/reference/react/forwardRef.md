---
title: forwardRef
---

<Intro>

`forwardRef` rajapinnan avulla komponentti voi tarjota DOM noodin pääkomponenetille [ref](/learn/manipulating-the-dom-with-refs):llä.

```js
const SomeComponent = forwardRef(render)
```

</Intro>

<InlineToc />

---

## Viite {/*reference*/}

### `forwardRef(render)` {/*forwardref*/}

Kutsu `forwardRef()` -funktiota, jotta komponenttisi voi vastaanottaa ref:n ja välittää sen lapsikomponentille:

```js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  // ...
});
```

[Katso lisää esimerkkejä alla.](#usage)

#### Parametrit {/*parameters*/}

* `render`: Komponenttisi renderöintifunktio. React kutsuu tätä funktiota komponentin pääkomponentilta saamilla propseilla ja `ref`:lla. JSX, jonka palautat, on komponenttisi ulostulo.

#### Palautukset {/*returns*/}

`forwardRef` palauttaa React-komponentin, jonka voit renderöidä JSX:llä. Toisin kuin React-komponentit, jotka on määritelty tavallisina funktioina, `forwardRef`:n palauttama komponentti voi myös vastaanottaa `ref` propin.

#### Huomiot {/*caveats*/}

<<<<<<< HEAD
* Strict Modessa, React **kutsuu renderöintifunktiotasi kahdesti** auttaakseen sinua löytämään tahattomia epäpuhtauksia. Tämä on vain kehitystilassa tapahtuva käyttäytyminen, eikä vaikuta tuotantoon. Jos renderöintifunktiosi on puhdas (kuten sen pitäisi olla), tämä ei vaikuta komponenttisi logiikkaan. Toinen kutsuista jätetään huomiotta.
=======
* In Strict Mode, React will **call your render function twice** in order to [help you find accidental impurities.](/reference/react/useState#my-initializer-or-updater-function-runs-twice) This is development-only behavior and does not affect production. If your render function is pure (as it should be), this should not affect the logic of your component. The result from one of the calls will be ignored.
>>>>>>> 7bdbab144e09d4edf793ff5128080eb1dba79be4


---

### `render` funktio {/*render-function*/}

`forwardRef` hyväksyy renderöintifunktion argumenttina. React kutsuu tätä funktiota `props` ja `ref` -argumenteilla:

```js
const MyInput = forwardRef(function MyInput(props, ref) {
  return (
    <label>
      {props.label}
      <input ref={ref} />
    </label>
  );
});
```

#### Parametrit {/*render-parameters*/}

* `props`: Propsit, jotka pääkomponentti on välittänyt.

* `ref`: `ref` attribuutti, jonka pääkomponentti on välittänyt. `ref` voi olla joko objekti tai funktio. Jos pääkomponentti ei ole välittänyt ref:iä, se on `null`. Sinun tulisi joko välittää saamasi `ref` toiselle komponentille tai välittää se [`useImperativeHandle`:lle.](/reference/react/useImperativeHandle)

#### Palautukset {/*render-returns*/}

`forwardRef` palauttaa React komponentin, jonka voit renderöidä JSX:llä. Toisin kuin React komponentit, jotka on määritelty tavallisina funktioina, `forwardRef`:n palauttama komponentti voi myös vastaanottaa `ref` propin.

---

## Käyttö {/*usage*/}

### DOM noodin välittäminen pääkomponentille {/*exposing-a-dom-node-to-the-parent-component*/}

Oletuksena jokaisen komponentin DOM noodit ovat yksityisiä. Joskus on kuitenkin hyödyllistä välittää DOM noodi pääkomponentille, esimerkiksi mahdollistaaksesi siihen kohdentamisen. Ottaaksesi tämän käyttöön, kääri komponenttisi `forwardRef()` -funktioon:

```js {3,11}
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} />
    </label>
  );
});
```

Saat <CodeStep step={1}>ref</CodeStep> -argumentin toisena argumenttina propsien jälkeen. Välitä se DOM noodiin, jonka haluat julkaista:

```js {8} [[1, 3, "ref"], [1, 8, "ref", 30]]
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});
```

Tämän avulla pääkomponentti `Form` voi käyttää `MyInput` komponentin julkaisemaa <CodeStep step={2}>`<input>` DOM noodia</CodeStep>:

```js [[1, 2, "ref"], [1, 10, "ref", 41], [2, 5, "ref.current"]]
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

`Form` komponentti [välittää ref:n](/reference/react/useRef#manipulating-the-dom-with-a-ref) `MyInput`:lle. `MyInput` komponentti *välittää* sen ref:n `<input>` selaimen tagille. Tämän seurauksena `Form` komponentti voi käyttää `<input>` DOM noodia ja kutsua [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) siihen.

Pidä mielessä, että ref:n julkaiseminen komponenttisi sisällä olevaan DOM noodin tekee sen vaikeammaksi muuttaa komponenttisi sisäistä rakennetta myöhemmin. Yleensä julkaiset DOM noodin ref:n uudelleen käytettävistä matalan tason komponenteista, kuten painikkeista tai tekstisyötteistä, mutta et tee sitä sovellustason komponenteille, kuten avatarille tai kommentille.

<Recipes titleText="Examples of forwarding a ref">

#### Syöttökenttään kohdistaminen {/*focusing-a-text-input*/}

Painiketta painaminen kohdistaa syöttökenttään. `Form` komponentti määrittelee ref:n ja välittää sen `MyInput` komponentille. `MyInput` komponentti välittää sen ref:n selaimen `<input>` tagille. Tämän avulla `Form` komponentti voi kohdistaa `<input>`:in.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

<Solution />

#### Videon toistaminen ja tauottaminen {/*playing-and-pausing-a-video*/}

Painikkeen painaminen kutsuu `<video>` DOM noodin [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) ja [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) metodeja. `App` komponentti määrittää ref:n ja välittää sen `MyVideoPlayer` komponentille. `MyVideoPlayer` komponentti välittää tuon ref:n selaimen `<video>` tagille. Tämän avulla `App` komponentti voi toistaa ja tauottaa `<video>`:n.

<Sandpack>

```js
import { useRef } from 'react';
import MyVideoPlayer from './MyVideoPlayer.js';

export default function App() {
  const ref = useRef(null);
  return (
    <>
      <button onClick={() => ref.current.play()}>
        Toista
      </button>
      <button onClick={() => ref.current.pause()}>
        Tauota
      </button>
      <br />
      <MyVideoPlayer
        ref={ref}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        type="video/mp4"
        width="250"
      />
    </>
  );
}
```

```js src/MyVideoPlayer.js
import { forwardRef } from 'react';

const VideoPlayer = forwardRef(function VideoPlayer({ src, type, width }, ref) {
  return (
    <video width={width} ref={ref}>
      <source
        src={src}
        type={type}
      />
    </video>
  );
});

export default VideoPlayer;
```

```css
button { margin-bottom: 10px; margin-right: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Refin välittäminen useiden komponenttien läpi {/*forwarding-a-ref-through-multiple-components*/}

Sen sijaan, että välittäisit `ref`:n DOM noodille, voit välittää sen omalle komponentillesi kuten `MyInput`:

```js {1,5}
const FormField = forwardRef(function FormField(props, ref) {
  // ...
  return (
    <>
      <MyInput ref={ref} />
      ...
    </>
  );
});
```

Jos tämä `MyInput` komponentti välittää ref:n `<input>`:lle, ref `FormField`:lle antaa sinulle tuon `<input>`:in:

```js {2,5,10}
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

`Form` komponentti määrittää refin ja välittää sen `FormField`:lle. `FormField` komponentti välittää tuon ref:n `MyInput`:lle, joka välittää sen selaimen `<input>` DOM noodille. Tämän avulla `Form` komponentti voi käsitellä tuota DOM noodia.


<Sandpack>

```js
import { useRef } from 'react';
import FormField from './FormField.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/FormField.js
import { forwardRef, useState } from 'react';
import MyInput from './MyInput.js';

const FormField = forwardRef(function FormField({ label, isRequired }, ref) {
  const [value, setValue] = useState('');
  return (
    <>
      <MyInput
        ref={ref}
        label={label}
        value={value}
        onChange={e => setValue(e.target.value)} 
      />
      {(isRequired && value === '') &&
        <i>Required</i>
      }
    </>
  );
});

export default FormField;
```


```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input, button {
  margin: 5px;
}
```

</Sandpack>

---

### Imperatiivisen käsittelijän julkaiseminen DOM noden sijaan {/*exposing-an-imperative-handle-instead-of-a-dom-node*/}

Sen sijaan, että julkistaisit koko DOM noodin, voit julkistaa räätälöidyn olion, jota kutsutaan *imperatiiviseksi käsittelijäksi*, jolla on suppeampi joukko metodeja. Tämän toteuttamiseksi, sinun täytyy määrittää erillinen ref, joka pitää sisällään DOM noodin:

```js {2,6}
const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  // ...

  return <input {...props} ref={inputRef} />;
});
```

Välitä vastaanottamasi `ref` [`useImperativeHandle`:lle](/reference/react/useImperativeHandle) ja määritä arvo, jonka haluat julkistaa `ref`:lle:

```js {6-15}
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});
```

Jos jokin komponentti saa refin `MyInput`:lle, saa se vain `{ focus, scrollIntoView }` olion koko DOM noodin sijaan. Tämän avulla voit rajoittaa DOM noodista julkistettavan informaation minimiin.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // Tämä ei toimi, koska DOM noodi ei ole julkistettu:
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput placeholder="Enter your name" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

[Lue lisää imperatiivisista käsittelijöistä.](/reference/react/useImperativeHandle)

<Pitfall>

**Älä käytä ref:iä liikaa.** Sinun tulisi käyttää ref:iä vain *imperatiivisiin* toimintoihin, joita et voi ilmaista propseina: esimerkiksi nodeen vierittäminen, noden kohdistaminen, animaation käynnistäminen, tekstin valitseminen jne.

**Jos voit ilmaista jotain propseina, sinun ei tulisi käyttää ref:iä.** Esimerkiksi sen sijaan, että julkistaisit `Modal` komponentista *imperatiivisen käsittelijän* kuten `{ open, close }`, on parempi ottaa `isOpen` propsi kuten `<Modal isOpen={isOpen} />`. [Efektit](/learn/synchronizing-with-effects) voivat auttaa sinua julkistamaan imperatiivisia toimintoja propseina.

</Pitfall>

---

## Vianmääritys {/*troubleshooting*/}

### Komponenttini on kääritty `forwardRef`:iin, mutta `ref` siihen on aina `null` {/*my-component-is-wrapped-in-forwardref-but-the-ref-to-it-is-always-null*/}

Usein tämä tarkoittaa, että unohdit käyttää `ref`:iä, jonka sait.

Esimerkiksi, tämä komponentti ei tee mitään sen `ref`:llä:

```js {1}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input />
    </label>
  );
});
```

Korjataksesi tämän, välitä `ref` DOM noodille tai toiselle komponentille, joka voi vastaanottaa ref:n:

```js {1,5}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input ref={ref} />
    </label>
  );
});
```

`ref` `MyInput`:lle voi olla myös `null`, jos osa logiikasta on ehdollista:

```js {1,5}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      {showInput && <input ref={ref} />}
    </label>
  );
});
```

Jos `showInput` on `false`, ref:iä ei välitetä millekään nodille, ja ref `MyInput`:lle pysyy tyhjänä. Tämä on erityisen helppo jättää huomaamatta, jos ehto on piilotettu toisen komponentin sisälle, kuten `Panel` tässä esimerkissä:

```js {5,7}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      <Panel isExpanded={showInput}>
        <input ref={ref} />
      </Panel>
    </label>
  );
});
```
