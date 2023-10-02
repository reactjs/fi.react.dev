---
title: "<select>"
---

<Intro>

[Selaimen sisäänrakennettu `<select>`-komponentti](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select) mahdollistaa valintalistan renderöimisen vaihtoehtoineen.

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

### `<select>` {/*select*/}

Näyttääksesi valintalistan, renderöi [selaimen sisäänrakennettu `<select>`-komponentti](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select).

```js
<select>
  <option value="someOption">Jokin vaihtoehto</option>
  <option value="otherOption">Toinen vaihtoehto</option>
</select>
```

[Näe lisää esimerkkejä alla.](#usage)

#### Propsit {/*props*/}

`<select>` tukee kaikkia [yleisten elementtien propseja.](/reference/react-dom/components/common#props)

Voit [tehdä valintalistan kontrolloiduksi](#controlling-a-select-box-with-a-state-variable) antamalla `value`-propsin:

* `value`: Merkkijono (tai merkkijonojen taulukko [`multiple={true}`](#enabling-multiple-selection)). Ohjaa, mikä vaihtoehto on valittuna. Jokainen merkkijonon arvo vastaa jonkin `<option>`-komponentin `value`-arvoa, joka on upotettu `<select>`-komponenttiin.

Kun välität `value`:n, sinun täytyy myös välittää `onChange`-käsittelijäfunktio, joka päivittää välitetyn arvon.

Jos `<select>` on kontrolloimaton, voit antaa `defaultValue`-propsin:

* `defaultValue`: Merkkijono (tai merkkijonojen taulukko [`multiple={true}`](#enabling-multiple-selection)). Määrittelee [aluksi valitun vaihtoehdon.](#providing-an-initially-selected-option)

Nämä `<select>`-propsit ovat olennaisia sekä kontrolloimattomille että kontrolloiduille valintalistoille:

* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#autocomplete): Merkkijono. Määrittää yhden mahdollisista [automaattisen täydennyksen käyttäytymistavoista.](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values)
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#autofocus): Totuusarvo. Jos `true`, React kohdistaa elementtiin mountatessa.
* `children`: `<select>` hyväksyy [`<option>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option), [`<optgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup), ja [`<datalist>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist) komponentit lapsina. Voit myös välittää omia komponentteja kunhan ne lopulta renderöivät jonkun sallituista komponenteista. Jos välität omia komponentteja, jotka lopulta renderöivät `<option>` tageja, jokaisen `<option>`:n täytyy omata `value`.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#disabled): Totuusarvo. Jos `true`, valintalista ei ole interaktiivinen ja näkyy himmennettynä.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#form): Merkkijono. Määrittää `<form>` lomakkeen `id` :n johon tämä kenttä kuuluu. Jos jätetty pois, se on lähin ylätason lomake.
* [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#multiple): Totuusarvo. Jos `true`, selain mahdollistaa [monen vaihtoehdon valinnan.](#enabling-multiple-selection)
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#name): Merkkijono. Määrittää nimen tälle kentälle, joka [lähetetään lomakkeessa.](#reading-the-select-box-value-when-submitting-a-form)
* `onChange`: [`Event` käsittelijäfunktio](/reference/react-dom/components/common#event-handler). Vaaditaan [kontrolloituihin valintalistoihin.](#controlling-a-select-box-with-a-state-variable) Suoritetaan heti kun käyttäjä valitsee toisen vaihtoehdon. Käyttäytyy kuten selaimen [`input` tapahtuma.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)
* `onChangeCapture`: Versio `onChange`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): [`Event` käsittelijäfunktio](/reference/react-dom/components/common#event-handler). Suoritetaan heti kun käyttäjä muuttaa kentän arvoa. Historiallisista syistä, Reactissa on idiomaattista käyttää tämän tilalla `onChange`, joka toimii samanlaisesti.
* `onInputCapture`: Versio `onInput`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): [`Event` käsittelijäfunktio](/reference/react-dom/components/common#event-handler). Suoritetaan jos syöte ei läpäise validointia lomaketta lähetettäessä. Toisin kuin selaimen sisäänrakennettu `invalid`-tapahtuma, Reactin `onInvalid`-tapahtuma kuplii.
* `onInvalidCapture`: Versio `onInvalid`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#required): Totuusarvo. Jos `true`, arvon on oltava lomaketta lähettäessä.
* [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#size): Numero. `multiple={true}` valintalistoille, määrittelee halutun määrän aluksi näkyvillä olevia kohteita.

#### Rajoitukset {/*caveats*/}

- Toisin kuin HTML:ssä, `<option>`-komponentin `selected`-attribuutti ei ole tuettu. Sen sijaan, käytä [`<select defaultValue>`](#providing-an-initially-selected-option) kontrolloimattomille valintalistoille ja [`<select value>`](#controlling-a-select-box-with-a-state-variable) kontrolloiduille valintalistoille.
- Jos valintalista vastaanottaa `value`-propsin, se [käsitellään kontrolloituna.](#controlling-a-select-box-with-a-state-variable)
- Valintalista ei voi olla sekä kontrolloitu että kontrolloimaton samaan aikaan.
- Valintalista ei voi vaihtaa kontrolloidusta kontrolloimattomaan elinkaarensa aikana.
- Jokainen kontrolloitu valintalista tarvitsee `onChange`-käsittelijäfunktion, joka päivittää arvon synkronisesti.

---

## Käyttö {/*usage*/}

### Valintalistan näyttäminen vaihtoehdoilla {/*displaying-a-select-box-with-options*/}

Renderöi `<select>`-komponentti, jossa on sisällä lista `<option>`-komponentteja näyttääksesi valintalistan. Anna jokaiselle `<option>`-komponentille `value`, joka edustaa dataa, joka lähetetään lomakkeen mukana.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Valitse hedelmä:
      <select name="selectedFruit">
        <option value="apple">Omena</option>
        <option value="banana">Banaani</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>  

---

### Otsikon tarjoaminen valintalistalle {/*providing-a-label-for-a-select-box*/}

Tyypillisesti, laitat jokaisen `<select>`-komponentin [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) tagin sisälle. Tämä kertoo selaimelle, että tämä otsikko on yhdistetty tähän valintalistaan. Kun käyttäjä klikkaa otsikkoa, selain kohdistaa automaattisesti valintalistan. Tämä on myös olennaista saavutettavuuden kannalta: ruudunlukija ilmoittaa otsikon kuvauksen kun käyttäjä kohdistaa valintalistan.

If you can't nest `<select>` into a `<label>`, associate them by passing the same ID to `<select id>` and [`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) To avoid conflicts between multiple instances of one component, generate such an ID with [`useId`.](/reference/react/useId)

Jos et voi sijoittaaa `<select>`-komponenttia `<label>`-komponentin sisään, yhdistä ne antamalla sama ID `<select id>`:lle ja [`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) Välttääksesi konflikteja useiden saman komponentin instanssien välillä, generoi tällainen ID [`useId`-komponentilla.](/reference/react/useId)

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const vegetableSelectId = useId();
  return (
    <>
      <label>
        Valitse hedelmä:
        <select name="selectedFruit">
          <option value="apple">Omena</option>
          <option value="banana">Banaani</option>
          <option value="orange">Appelsiini</option>
        </select>
      </label>
      <hr />
      <label htmlFor={vegetableSelectId}>
        Valitse vihannes:
      </label>
      <select id={vegetableSelectId} name="selectedVegetable">
        <option value="cucumber">Kurkku</option>
        <option value="corn">Maissi</option>
        <option value="tomato">Tomaatti</option>
      </select>
    </>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>


---

### Aluksi valitun valinnan tarjoaminen {/*providing-an-initially-selected-option*/}

Oletuksena, selain valitsee ensimmäisen `<option>`-komponentin listasta. Valitaksesi eri vaihtoehdon oletuksena, välitä sen `<option>`-komponentin `value`-arvo `<select>`-komponentille `defaultValue`-propsina.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Valitse hedelmä:
      <select name="selectedFruit" defaultValue="orange">
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

<Pitfall>

Toisin kuin HTML:ssä, `<option>`-komponentin `selected`-attribuutti ei ole tuettu.

</Pitfall>

---

### Usean valinnan mahdollistaminen {/*enabling-multiple-selection*/}

Välitä `multiple={true}` `<select>`-komponentille, jotta käyttäjä voi valita useita vaihtoehtoja. Tässä tapauksessa, jos määrität myös `defaultValue`-propsin valitaksesi aluksi valitut vaihtoehdot, sen täytyy olla taulukko.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Valitse muutama hedelmä:
      <select
        name="selectedFruit"
        defaultValue={['orange', 'banana']}
        multiple={true}
      >
        <option value="apple">Omena</option>
        <option value="banana">Banaani</option>
        <option value="orange">Appelsiini</option>
      </select>
    </label>
  );
}
```

```css
select { display: block; margin-top: 10px; width: 200px; }
```

</Sandpack>

---

### Valintalistan arvon lukeminen lomakkeen lähetyksessä {/*reading-the-select-box-value-when-submitting-a-form*/}

Lisää [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) valintalistan ympärille, jossa on [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) sisällä. Se kutsuu `<form onSubmit>`-käsittelijäfunktiota. Oletuksena, selain lähettää lomakkeen datan nykyiseen URL:iin ja päivittää sivun. Voit ohittaa tämän käyttäytymisen kutsumalla `e.preventDefault()`. Lue lomakkeen data [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) avulla.
<Sandpack>

```js
export default function EditPost() {
  function handleSubmit(e) {
    // Estä selainta lataamasta sivua uudelleen
    e.preventDefault();
    // Lue lomakkeen data
    const form = e.target;
    const formData = new FormData(form);
    // Voit välittää formData:n suoraan fetchin bodylle:
    fetch('/some-api', { method: form.method, body: formData });
    // Voit generoida siitä URL:n, kuten selain tekee oletuksena:
    console.log(new URLSearchParams(formData).toString());
    // Voit käsitellä sitä tavallisena oliona.
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson); // (!) Tämä ei sisällä usean valinnan arvoja
    // Tai voit saada nimi-arvo parien taulukon.
    console.log([...formData.entries()]);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Valitse lempihedelmäsi:
        <select name="selectedFruit" defaultValue="orange">
          <option value="apple">Omena</option>
          <option value="banana">Banaani</option>
          <option value="orange">Appelsiini</option>
        </select>
      </label>
      <label>
        Valitse kaikki lempivihanneksesi:
        <select
          name="selectedVegetables"
          multiple={true}
          defaultValue={['corn', 'tomato']}
        >
          <option value="cucumber">Kurkku</option>
          <option value="corn">Maissi</option>
          <option value="tomato">Tomaatti</option>
        </select>
      </label>
      <hr />
      <button type="reset">Nollaa</button>
      <button type="submit">Lähetä</button>
    </form>
  );
}
```

```css
label, select { display: block; }
label { margin-bottom: 20px; }
```

</Sandpack>

<Note>

Anna `<select>`:lle `name`, esimerkiksi `<select name="selectedFruit" />`. Määrittelemäsi `name` käytetään avaimena lomakkeen datassa, esimerkiksi `{ selectedFruit: "orange" }`.

Jos käytät `<select multiple={true}>`, [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) jota luet lomakkeesta sisältää jokaisen valitun arvon erillisenä nimi-arvo parina. Katso tarkasti konsolin lokeja yllä olevassa esimerkissä.

</Note>

<Pitfall>

Oletuksena, *mikä tahansa*  `<form>`:n sisällä oleva `<button>` lähettää sen. Tämä voi olla yllättävää! Jos sinulla on oma `Button` React-komponentti, harkitse [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button) palauttamista `<button>`:n sijaan. Sitten, ollaksesi eksplisiittinen, käytä `<button type="submit">` painikkeisiin, joiden *on* tarkoitus lähettää lomake.

</Pitfall>

---

### Valintalistan ohjaaminen tilamuuttujalla {/*controlling-a-select-box-with-a-state-variable*/}

Valintalista kuten `<select />` on *kontrolloimaton*. Vaikka [välittäisit aluksi valitun arvon](#providing-an-initially-selected-option) kuten `<select defaultValue="orange" />`, JSX:si määrittelee vain aluksi valitun arvon, ei arvoa juuri nyt.

**Renderöidäksesi _kontrolloidun_ valintalistan, välitä sille `value`-propsi.** React pakottaa valintalistan aina sisältämään välittämäsi `value`-arvon. Tyypillisesti, ohjaat valintalistaa määrittämällä [tilamuuttujan:](/reference/react/useState)

```js {2,6,7}
function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange'); // Määritä tilamuuttuja...
  // ...
  return (
    <select
      value={selectedFruit} // ...pakota valintalistan arvo vastaamaan tilamuuttujaa...
      onChange={e => setSelectedFruit(e.target.value)} // ... ja päivitä tilamuuttuja muutoksissa!
    >
      <option value="apple">Omena</option>
      <option value="banana">Banaani</option>
      <option value="orange">Appelsiini</option>
    </select>
  );
}
```

Tämä on hyödyllistä, jos haluat renderöidä uudelleen osan käyttöliittymästä jokaisen valinnan jälkeen.

<Sandpack>

```js
import { useState } from 'react';

export default function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange');
  const [selectedVegs, setSelectedVegs] = useState(['corn', 'tomato']);
  return (
    <>
      <label>
        Valitse hedelmä:
        <select
          value={selectedFruit}
          onChange={e => setSelectedFruit(e.target.value)}
        >
          <option value="apple">Omena</option>
          <option value="banana">Banaani</option>
          <option value="orange">Appelsiini</option>
        </select>
      </label>
      <hr />
      <label>
        Valitse kaikki lempivihanneksesi:
        <select
          multiple={true}
          value={selectedVegs}
          onChange={e => {
            const options = [...e.target.selectedOptions];
            const values = options.map(option => option.value);
            setSelectedVegs(values);
          }}
        >
          <option value="cucumber">Kurkku</option>
          <option value="corn">Maissi</option>
          <option value="tomato">Tomaatti</option>
        </select>
      </label>
      <hr />
      <p>Lempihedelmäsi: {selectedFruit}</p>
      <p>Lempivihanneksesi: {selectedVegs.join(', ')}</p>
    </>
  );
}
```

```css
select { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Pitfall>

**Jos välität `value`:n ilman `onChange`:a, vaihtoehdon valitseminen on mahdotonta.** Kun ohjaat valintalistaa välittämällä sille `value`:n, *pakotat* sen aina sisältämään välittämäsi arvon. Joten jos välität tilamuuttujan `value`:na mutta unohdat päivittää tilamuuttujaa synkronisesti `onChange`-käsittelijäfunktion aikana, React palauttaa valintalistan jokaisen näppäinpainalluksen jälkeen takaisin `value`:n, jonka määritit.

Toisin kuin HTML:ssä, `<option>`-komponentin `selected`-attribuutti ei ole tuettu.

</Pitfall>
