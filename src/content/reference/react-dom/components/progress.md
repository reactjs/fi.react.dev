---
title: "<progress>"
---

<Intro>

[Selaimen sisäänrakennettu `<progress>`-komponentti](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress) mahdollistaa edistymisindikaattorin renderöinnin.

```js
<progress value={0.5} />
```

</Intro>

<InlineToc />

---

## Viite {/*reference*/}

### `<progress>` {/*progress*/}

Näyttääksesi edistymisindikaattorin, renderöi [selaimen sisäänrakennettu `<progress>`-komponentti](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress).

```js
<progress value={0.5} />
```

[Näe lisää esimerkkejä alla.](#usage)

#### Propsit {/*props*/}

`<progress>` tukee kaikkia [yleisien elementin propseja.](/reference/react-dom/components/common#props)

Lisäksi, `<progress>` tukee näitä propseja:

* [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress#max): Numero. Määrittelee `value`:n enimmäismäärän. Oletuksena `1`.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress#value): Numero `0` ja `max`:n väliltä, tai `null` for määrittämättömään edistymiseen. Määrittelee miten paljon on tehty.

---

## Käyttö {/*usage*/}

### Edistymisindikaattorin ohjaaminen {/*controlling-a-progress-indicator*/}

Näyttääksesi edistymisindikaattorin, renderöi `<progress>`-komponentti. Voit antaa numeron `value` väliltä `0` ja `max`-arvon, jonka määrität. Jos et anna `max`-arvoa, oletetaan sen olevan `1` oletuksena.

Jos operaatio ei ole käynnissä, anna `value={null}` asettaaksesi edistymisindikaattorin määrittelemättömään tilaan.

<Sandpack>

```js
export default function App() {
  return (
    <>
      <progress value={0} />
      <progress value={0.5} />
      <progress value={0.7} />
      <progress value={75} max={100} />
      <progress value={1} />
      <progress value={null} />
    </>
  );
}
```

```css
progress { display: block; }
```

</Sandpack>
