---
title: "<option>"
---

<Intro>

[Selaimen sisäänrakennettu `<option>`-komponentti](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option) mahdollistaa vaihtoehdon renderöimisen [`<select>`](/reference/react-dom/components/select)-listaan.

```js
<select>
  <option value="someOption">Jokin vaihtoehto</option>
  <option value="otherOption">Toinen vaihtoehto</option>
</select>
```

</Intro>

<InlineToc />

---

## Viite {/*reference*/}

### `<option>` {/*option*/}

[Selaimen sisäänrakennettu `<option>`-komponentti](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option) mahdollistaa vaihtoehdon renderöimisen [`<select>`](/reference/react-dom/components/select)-listaan.

```js
<select>
  <option value="someOption">Jokin vaihtoehto</option>
  <option value="otherOption">Toinen vaihtoehto</option>
</select>
```

[Näe lisää esimerkkejä alla.](#usage)

#### Propsit {/*props*/}

`<option>` tukee kaikkia [yleisten elementtien propseja.](/reference/react-dom/components/common#props)

Lisäksi, `<option>` tukee näitä propseja:

* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#disabled): Totuusarvo. Jos `true`, valinta ei ole valittavissa ja näkyy himmennettynä.
* [`label`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#label): Merkkijono. Määrittelee valinnan tarkoituksen. Jos ei määritelty, käytetään tekstiä valinnan sisällä.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#value): Arvo, jota käytetään [kun ylätason `<select>` lähetetään lomakkeessa](/reference/react-dom/components/select#reading-the-select-box-value-when-submitting-a-form) jos tämä vaihtoehto on valittuna.

#### Rajoitukset {/*caveats*/}

* React ei tue `<option>`-komponentin `selected`-attribuuttia. Sen sijaan, anna tämän vaihtoehdon `value`-arvo ylätason [`<select defaultValue>`](/reference/react-dom/components/select#providing-an-initially-selected-option)-komponentille, jos haluat luoda kontrolloimattoman valintalistan, tai [`<select value>`](/reference/react-dom/components/select#controlling-a-select-box-with-a-state-variable)-komponentille, jos haluat luoda kontrolloidun valintalista.

---

## Käyttö {/*usage*/}

### Valintalistan näyttäminen vaihtoehdoilla {/*displaying-a-select-box-with-options*/}

Renderöi `<select>`-komponentti, jossa on sisällä lista `<option>`-komponentteja näyttääksesi valintalistan. Anna jokaiselle `<option>`-komponentille `value`-arvo, joka edustaa dataa, joka lähetetään lomakkeen mukana.

[Lue lisää valintalistan näyttämisestä `<select>`-komponentilla, jossa on lista `<option>`-komponentteja.](/reference/react-dom/components/select)

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Valitse hedelmä:
      <select name="selectedFruit">
        <option value="apple">Omena</option>
        <option value="banana">Banaani</option>
        <option value="orange">Appelsiini</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>  

