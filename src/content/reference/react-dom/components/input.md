---
title: "<input>"
---

<Intro>

[Selaimen sisäänrakennettu `<input>`-komponentti](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) mahdollistaa erilaisten lomakkeiden syöttökenttien renderöinnin.

```js
<input />
```

</Intro>

<InlineToc />

---

## Viite {/*reference*/}

### `<input>` {/*input*/}

Näyttääksesi syöttökentän, renderöi [selaimen sisäänrakennettu `<input>`-komponentti.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)

```js
<input name="myInput" />
```

[Näe lisää esimerkkejä alla.](#usage)

#### Propsit {/*props*/}

`<input>` tukee kaikkia [yleisten elementtien propseja.](/reference/react-dom/components/common#props)

<<<<<<< HEAD
Voit [tehdä syöttökentästä kontrolloidun](#controlling-an-input-with-a-state-variable) antamalla yhden näistä propseista:
=======
<Canary>

React's extensions to the `formAction` prop are currently only available in React's Canary and experimental channels. In stable releases of React, `formAction` works only as a [built-in browser HTML component](/reference/react-dom/components#all-html-components). Learn more about [React's release channels here](/community/versioning-policy#all-release-channels).

</Canary>

[`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): A string or function. Overrides the parent `<form action>` for `type="submit"` and `type="image"`. When a URL is passed to `action` the form will behave like a standard HTML form. When a function is passed to `formAction` the function will handle the form submission. See [`<form action>`](/reference/react-dom/components/form#props).

You can [make an input controlled](#controlling-an-input-with-a-state-variable) by passing one of these props:
>>>>>>> 9967ded394d85af74e0ecdbf00feeb7921a28142

* [`checked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#checked): Totuusarvo. Valintaruudun tai radiopainikkeen kohdalla, kontrolloi onko se valittu.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#value): Merkkijono. Tekstikentän kohdalla, kontrolloi sen tekstiä. (Radiopainikkeen kohdalla, määrittää sen lomakedatan.)

Kun käytät `<input>`-komponenttia kontrolloidun syöttökentän kanssa, sinun täytyy myös antaa `onChange`-käsittelijäfunktio, joka päivittää `value`-arvon.

Nämä `<input>`-propit ovat olennaisia vain kontrolloimattomille syöttökentille:

* [`defaultChecked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultChecked): Totuusarvo. Määrittää [alkuarvon](#providing-an-initial-value-for-an-input) `type="checkbox"` ja `type="radio"`-syöttökentille.
* [`defaultValue`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultValue): Merkkijono. Määrittää [alkuarvon](#providing-an-initial-value-for-an-input) tekstisyöttökentälle.

Nämä `<input>`-propsit ovat olennaisia sekä kontrolloimattomille että kontrolloiduille syöttökentille:

* [`accept`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#accept): Merkkijono. Määrittää mitä tiedostotyyppejä hyväksytään `type="file"`-kentällä.
* [`alt`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#alt): Merkkijono. Määrittää vaihtoehtoisen kuvatekstin `type="image"`-kentälle.
* [`capture`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#capture): Merkkijono. Määrittää median (mikrofoni, video, tai kamera) joka tallennetaan `type="file"`-kentällä.
* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autocomplete): Merkkijono. Määrittää yhden mahdollisista [autocomplete-käyttäytymisistä.](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values)
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autofocus): Totuusarvo. Jos `true`, React kohdistaa elementtiin mountatessa.
* [`dirname`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#dirname): Merkkijono. Määrittää elementin suunnan lomakkeen kentän nimen.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#disabled): Totuusarvo. Jos `true`, syöttökenttä ei ole interaktiivinen ja näkyy himmennettynä.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#form): Merkkijono. Määrittää `<form>` lomakkeen `id` :n johon tämä kenttä kuuluu. Jos jätetty pois, se on lähin ylätason lomake.
* [`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): Merkkijono. Ylikirjoittaa ylätason `<form action>`-arvon `type="submit"` ja `type="image"`-kentille.
* [`formEnctype`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formenctype): Merkkijono. Ylikirjoittaa ylätason `<form enctype>`-arvon `type="submit"` ja `type="image"`-kentille.
* [`formMethod`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formmethod): Merkkijono. Ylikirjoittaa ylätason `<form method>`-arvon `type="submit"` ja `type="image"`-kentille.
* [`formNoValidate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formnovalidate): Merkkijono. Ylikirjoittaa ylätason `<form noValidate>`-arvon `type="submit"` ja `type="image"`-kentille.
* [`formTarget`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formtarget): Merkkijono. Ylikirjoittaa ylätason `<form target>`-arvon `type="submit"` ja `type="image"`-kentille.
* [`height`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#height): Merkkijono. Määrittää kuvan korkeuden `type="image"`-kentälle.
* [`list`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#list): Merkkijono. Määrittää `<datalist>`-elementin `id`:n, jossa on autocomplete-vaihtoehdot.
* [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#max): Numero. Määrittää numeeristen ja päivämääräkenttien maksimiarvon.
* [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#maxlength): Numero. Määrittää tekstin ja muiden syöttökenttien maksimipituuden.
* [`min`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#min): Numero. Määrittää numeeristen ja päivämääräkenttien minimiarvon.
* [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#minlength): Numero. Määrittää tekstin ja muiden syöttökenttien minimipituuden.
* [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#multiple): Totuusarvo. Määrittää onko useita arvoja sallittu `type="file"` ja `type="email"`-kentille.
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): Merkkijono. Määrittää nimen tälle kentälle, joka [lähetetään lomakkeessa.](#reading-the-input-values-when-submitting-a-form)
* `onChange`: [`Event` käsittelijäfunktio](/reference/react-dom/components/common#event-handler). Vaaditaan [kontrolloituihin kenttiin.](#controlling-an-input-with-a-state-variable) Suoritetaan heti kun käyttäjä muuttaa kentän arvoa (esimerkiksi, suoritetaan jokaisella näppäinpainalluksella). Käyttäytyy kuten selaimen [`input` tapahtuma.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)
* `onChangeCapture`: Versio `onChange`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): [`Event` käsittelijäfunktio](/reference/react-dom/components/common#event-handler). Suoritetaan heti kun käyttäjä muuttaa kentän arvoa. Historiallisista syistä, Reactissa on idiomaattista käyttää tämän tilalla `onChange`, joka toimii samanlaisesti.
* `onInputCapture`: Versio `onInput`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): [`Event` käsittelijäfunktio](/reference/react-dom/components/common#event-handler). Suoritetaan jos syöttökenttä epäonnistuu lomakkeen lähetyksessä. Toisin kuin selaimen sisäänrakennettu `invalid`-tapahtuma, Reactin `onInvalid`-tapahtuma kuplii.
* `onInvalidCapture`: Versio `onInvalid`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): [`Event` käsittelijäfunktio](/reference/react-dom/components/common#event-handler). Suoritetaan kun valinta `<input>`-elementissä muuttuu. React laajentaa `onSelect`-tapahtuman myös tyhjälle valinnalle ja muokkauksille (jotka voivat vaikuttaa valintaan).
* `onSelectCapture`: Versio `onSelect`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`pattern`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#pattern): Merkkijono. Määrittää mallin, joka `value`:n täytyy täyttää.
* [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#placeholder): Merkkijono. Näytetään himmennettynä kun syöttökentän arvo on tyhjä.
* [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#readonly): Totuusarvo. Jos `true`, syöttökenttä ei ole muokattavissa käyttäjän toimesta.
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#required): Totuusarvo. Jos `true`, arvo täytyy antaa lomakkeen lähetyksessä.
* [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#size): Numero. Samanlainen kuin leveyden määrittäminen, mutta yksikkö riippuu kontrollista.
* [`src`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#src): Merkkijono. Määrittää kuvan lähteen `type="image"`-kentälle.
* [`step`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#step): Positiivinen numero tai `'any'`-merkkijono. Määrittää etäisyyden kelvollisten arvojen välillä.
* [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#type): Merkkijono. Yksi [syöttökenttien tyypeistä.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)
* [`width`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#width):  Merkkijono. Määrittää kuvan leveyden `type="image"`-kentälle.

#### Rajoitukset {/*caveats*/}

- Valintaruudut tarvitsevat `checked` (tai `defaultChecked`), ei `value` (tai `defaultValue`).
- Jos tekstisyöttökenttä saa merkkijono `value`-propin, se [käsitellään kontrolloituna.](#controlling-an-input-with-a-state-variable)
- Jos valintaruutu tai radiopainike saa boolean `checked`-propin, se [käsitellään kontrolloituna.](#controlling-an-input-with-a-state-variable)
- Syöttökenttä ei voi olla sekä kontrolloitu että kontrolloimaton samaan aikaan.
- Syöttökenttä ei voi vaihtaa kontrolloidusta kontrolloimattomaksi elinkaarensa aikana.
- Jokainen kontrolloitu syöttökenttä tarvitsee `onChange`-käsittelijäfunktion, joka päivittää sen arvon synkronisesti.

---

## Käyttö {/*usage*/}

### Eri tyyppisten syöttökenttien näyttäminen {/*displaying-inputs-of-different-types*/}

Näyttääksesi syöttökentän, renderöi `<input>`-komponentti. Oletuksena, se on tekstisyöttökenttä. Voit antaa `type="checkbox"` valintaruudulle, `type="radio"` radiopainikkeelle, [tai yhden muista syöttökenttien tyypeistä.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Tekstisyöte: <input name="myInput" />
      </label>
      <hr />
      <label>
        Valintaruutu: <input type="checkbox" name="myCheckbox" />
      </label>
      <hr />
      <p>
        Monivalinta:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Valinta 1
        </label>
        <label>
          <input type="radio" name="myRadio" value="option2" />
          Valinta 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Valinta 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### Syöttökentän otsikko {/*providing-a-label-for-an-input*/}

Tyypillisesti, laitat jokaisen `<input>`-komponentin sisälle [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label)-tagin. Tämä kertoo selaimelle, että tämä otsikko on yhdistetty tähän syöttökenttään. Kun käyttäjä klikkaa otsikkoa, selain kohdistaa automaattisesti syöttökenttään. Tämä on myös olennaista saavutettavuuden kannalta: ruudunlukija ilmoittaa otsikon käyttäjälle, kun tämä kohdistaa siihen liittyvään syöttökenttään.

Jos et voi sisällyttää `<input>`-komponenttia `<label>`-komponenttiin, yhdistä ne antamalla sama ID `<input id>`-komponentille ja [`<label htmlFor>`-komponentille.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) Välttääksesi konflikteja useiden yhden komponentin instanssien välillä, generoi tällainen ID [`useId`-komponentilla.](/reference/react/useId)

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const ageInputId = useId();
  return (
    <>
      <label>
        Etunimi:
        <input name="firstName" />
      </label>
      <hr />
      <label htmlFor={ageInputId}>Ikä:</label>
      <input id={ageInputId} name="age" type="number" />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### Oletusarvon tarjoaminen syöttökentälle {/*providing-an-initial-value-for-an-input*/}

Voit vaihtoehtoisesti määrittää alkuarvon mille tahansa syöttökentälle. Anna se `defaultValue`-merkkijonona tekstisyöttökentille. Valintaruudut ja radiopainikkeet määrittävät alkuarvon `defaultChecked`-totuusarvona.

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Text input: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input
            type="radio"
            name="myRadio"
            value="option2"
            defaultChecked={true} 
          />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### Syöttökentän arvon lukeminen lomakkeen lähetyksessä {/*reading-the-input-values-when-submitting-a-form*/}

Lisää [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) syöttökenttien ympärille. Lisää myös `<button type="submit">`-komponentti sen sisään. Se kutsuu `<form onSubmit>`-käsittelijäfunktiota. Oletuksena, selain lähettää lomakedatan nykyiselle URL:lle ja päivittää sivun. Voit ohittaa tämän käyttämällä `e.preventDefault()`. Lue lomakedata [`new FormData(e.target)`:lla.](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
<Sandpack>

```js
export default function MyForm() {
  function handleSubmit(e) {
    // Estä selainta lataamasta sivua uudelleen
    e.preventDefault();

    // Lue lomakedata
    const form = e.target;
    const formData = new FormData(form);

    // Voit välittää formData:n suoraan fetchin bodylle:
    fetch('/some-api', { method: form.method, body: formData });

    // Tai voit käsitellä sitä tavallisena objektina:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Tekstisyöte: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Valintaruutu: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Monivalinta:
        <label><input type="radio" name="myRadio" value="option1" /> Vaihtoehto 1</label>
        <label><input type="radio" name="myRadio" value="option2" defaultChecked={true} /> Vaihtoehto 2</label>
        <label><input type="radio" name="myRadio" value="option3" /> Vaihtoehto 3</label>
      </p>
      <hr />
      <button type="reset">Nollaa lomake</button>
      <button type="submit">Lähetä lomake</button>
    </form>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

<Note>

Anna jokaiselle `<input>`:lle `name`, esimerkiksi `<input name="firstName" defaultValue="Taylor" />`. `name`-arvoa käytetään avaimena lomakedatassa, esimerkiksi `{ firstName: "Taylor" }`.

</Note>

<Pitfall>

Oletuksena *mikä tahansa* `<button>` `<form>`:n sisällä lähettää sen. Tämä voi olla yllättävää! Jos sinulla on oma `Button` React-komponentti, harkitse `<button type="button">`-komponentin palauttamista sen sijaan. Sitten, ollaksesi eksplisiittinen, käytä `<button type="submit">`-komponenttia napeille joiden *on* tarkoitus lähettää lomake.

</Pitfall>

---

### Syöttökentän ohjaaminen tilamuuttujalla {/*controlling-an-input-with-a-state-variable*/}

Syöttökenttä kuten `<input />` on *kontrolloimaton.* Vaikka [antaisit alkuarvon](#providing-an-initial-value-for-an-input) kuten `<input defaultValue="Alkuteksti" />`, JSX:si määrittää vain alkuarvon. Se ei kontrolloi mitä arvoa sen pitäisi olla juuri nyt.

**Renderöidäksesi _kontrolloidun_ syöttökentän, anna sille `value`-prop.** React pakottaa syöttökentän aina olemaan `value` jonka annoit. Yleensä, teet tämän määrittämällä [tilamuuttujan:](/reference/react/useState)

```js {2,6,7}
function Form() {
  const [firstName, setFirstName] = useState(''); // Määritä tilamuuttuja...
  // ...
  return (
    <input
      value={firstName} // ...pakota kentän arvo vastaamaan tilamuuttujaa...
      onChange={e => setFirstName(e.target.value)} // ... ja päivitä tilamuuttuja jokaisella muutoksella!
    />
  );
}
```

Kontrolloitu syöttökenttä on järkevä jos tarvitset tilamuuttujaa muutenkin--esimerkiksi, renderöidäksesi uudelleen käyttöliittymäsi jokaisella muutoksella:

```js {2,9}
function Form() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <label>
        Etunimi:
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </label>
      {firstName !== '' && <p>Nimesi on {firstName}.</p>}
      ...
```

On myös hyödyllistä jos haluat tarjota useita tapoja muuttaa syöttökentän tilaa (esimerkiksi, klikkaamalla nappia):

```js {3-4,10-11,14}
function Form() {
  // ...
  const [age, setAge] = useState('');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        Ikä:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          Lisää 10 vuotta
        </button>
```

`value` jonka välität kontrolloiduille komponenteille ei saa olla `undefined` tai `null`. Jos tarvitset tyhjän alkuarvon (esimerkiksi, `firstName`-kentän alla), alusta tilamuuttujasi tyhjällä merkkijonolla (`''`).

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState('20');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        Etunimi:
        <input
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Ikä:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          Lisää 10 vuotta
        </button>
      </label>
      {firstName !== '' &&
        <p>Nimesi on {firstName}.</p>
      }
      {ageAsNumber > 0 &&
        <p>Ikäsi on {ageAsNumber}.</p>
      }
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
p { font-weight: bold; }
```

</Sandpack>

<Pitfall>

**Jos välität `value`-arvon ilman `onChange`:a, syöttökenttään ei voi kirjoittaa.** Kun kontrolloit syöttökenttää välittämällä sille `value`-arvon, *pakotat* sen aina olemaan arvon jonka välitit. Joten jos välität tilamuuttujan `value`:n mutta unohdat päivittää tilamuuttujaa synkronisesti `onChange`-tapahtumakäsittelijässä, React palauttaa syöttökentän jokaisen näppäinpainalluksen jälkeen takaisin `value`:n arvoon jonka määritit.

</Pitfall>

---

### Renderöinnin optimoiminen joka näppäinpainalluksella {/*optimizing-re-rendering-on-every-keystroke*/}

Kun käytät kontrolloitua syöttökenttää, asetat tilamuuttujan jokaisella näppäinpainalluksella. Jos komponentti joka sisältää tilamuuttujan uudelleen renderöi suuren puun, tästä saattaa tulla hidasta. On muutamia tapoja joilla voit optimoida uudelleen renderöimisen suorityskykyä.

Esimerkiksi, oletetaan että aloitat lomakkeella joka uudelleen renderöi kaiken sisällön jokaisella näppäinpainalluksella:

```js {5-8}
function App() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <form>
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </form>
      <PageContent />
    </>
  );
}
```

Sillä `<PageContent />` ei nojaa syöttökentän tilaan, voit siirtää syöttökentän tilan omaan komponenttiinsa:

```js {4,10-17}
function App() {
  return (
    <>
      <SignupForm />
      <PageContent />
    </>
  );
}

function SignupForm() {
  const [firstName, setFirstName] = useState('');
  return (
    <form>
      <input value={firstName} onChange={e => setFirstName(e.target.value)} />
    </form>
  );
}
```

Tämä parantaa suorituskykyä merkittävästi koska nyt vain `SignupForm` uudelleen renderöi jokaisella näppäinpainalluksella.

Jos ei ole tapaa välttää uudelleen renderöintiä (esimerkiksi, jos `PageContent` riippuu hakukentän arvosta), [`useDeferredValue`](/reference/react/useDeferredValue#deferring-re-rendering-for-a-part-of-the-ui) antaa sinun pitää kontrolloidun syöttökentän reagoivana jopa suuren uudelleen renderöinnin keskellä.

---

## Vianmääritys {/*troubleshooting*/}

### Tekstikenttäni ei päivity kun kirjoitan siihen {/*my-text-input-doesnt-update-when-i-type-into-it*/}

Jos renderöit syöttökentän `value`-arvolla mutta ilman `onChange`:a, näet virheen konsolissa:

```js
// 🔴 Bugi: kontrolloitu tekstisyöttökenttä ilman onChange-käsittelijää
<input value={something} />
```

<ConsoleBlock level="error">

You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.

</ConsoleBlock>

Kuten virheviesti ehdottaa, jos halusit vain [määrittää *alkuarvon*,](#providing-an-initial-value-for-an-input) välitä `defaultValue` sen sijaan:

```js
// ✅ Hyvä: kontrolloimaton syöttökenttä alkuarvolla
<input defaultValue={something} />
```

Jos haluat [kontrolloida tätä syöttökenttää tilamuuttujalla,](#controlling-an-input-with-a-state-variable) määritä `onChange`-käsittelijä:

```js
// ✅ Hyvä: kontrolloitu syöttökenttä onChange-käsittelijällä
<input value={something} onChange={e => setSomething(e.target.value)} />
```

Jos arvo on tarkoituksella vain luettava, lisää `readOnly`-prop.

```js
// ✅ Hyvä: vain luku -syöttökenttä ilman onChange-käsittelijää
<input value={something} readOnly={true} />
```

---

### Valintaruutuni ei päivity kun painan siitä {/*my-checkbox-doesnt-update-when-i-click-on-it*/}

Jos renderöit valintaruudun `checked`-arvolla mutta ilman `onChange`:a, näet virheen konsolissa:

```js
// 🔴 Bugi: kontrolloitu valintaruutu ilman onChange-käsittelijää
<input type="checkbox" checked={something} />
```

<ConsoleBlock level="error">

You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.

</ConsoleBlock>

Kuten virheviesti ehdottaa, jos halusit vain [määrittää *alkuarvon*,](#providing-an-initial-value-for-an-input) välitä `defaultChecked` sen sijaan:

```js
// ✅ Hyvä: kontrolloimaton valintaruutu alkuarvolla
<input type="checkbox" defaultChecked={something} />
```

Jos haluat [kontrolloida tätä valintaruutua tilamuuttujalla,](#controlling-an-input-with-a-state-variable) määritä `onChange`-käsittelijä:

```js
// ✅ Hyvä: kontrolloitu valintaruutu onChange-käsittelijällä
<input type="checkbox" checked={something} onChange={e => setSomething(e.target.checked)} />
```

<Pitfall>

Sinun tulee lukea `e.target.checked` eikä `e.target.value` valintaruuduille.

</Pitfall>

Jos valintaruutu on tarkoituksella vain luettava, lisää `readOnly`-prop virheen poistamiseksi:

```js
// ✅ Hyvä: vain luku -valintaruutu ilman onChange-käsittelijää
<input type="checkbox" checked={something} readOnly={true} />
```

---

### Syötön kursori hyppää alkuun jokaisen näppäinpainalluksen yhteydessä {/*my-input-caret-jumps-to-the-beginning-on-every-keystroke*/}

Jos [kontrolloit syöttökenttää,](#controlling-an-input-with-a-state-variable) sinun täytyy päivittää sen tilamuuttuja syöttökentän arvoksi DOM:sta `onChange`:n aikana.

Et voi päivittää sitä joksikin muuksi kuin `e.target.value` (tai `e.target.checked` valintaruuduille):

```js
function handleChange(e) {
  // 🔴 Bugi: kentän päivittäminen joksikin muuksi kuin e.target.value
  setFirstName(e.target.value.toUpperCase());
}
```

Et voi myöskään päivittää sitä asynkronisesti:

```js
function handleChange(e) {
  // 🔴 Bugi: kentän päivittäminen asynkronisesti
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

Korjataksesi koodisi, päivitä se synkronisesti `e.target.value`:lla:

```js
function handleChange(e) {
  // ✅ Kontrolloidun kentän päivittäminen e.target.value:lla synkronisesti
  setFirstName(e.target.value);
}
```

Jos tämä ei korjaa ongelmaa, on mahdollista että syöttökenttä poistetaan ja lisätään takaisin DOM:iin jokaisella näppäinpainalluksella. Tämä voi tapahtua jos olet vahingossa [nollannut tilan](/learn/preserving-and-resetting-state) jokaisella uudelleen renderöinnillä, esimerkiksi jos syöttökenttä tai jokin sen vanhemmista saa aina erilaisen `key`-attribuutin, tai jos upotat komponenttifunktioiden määrittelyjä (jota ei tueta ja aiheuttaa "sisemmän" komponentin aina olevan eri puu).

---

### Saan virheen: "A component is changing an uncontrolled input to be controlled" {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}


Jos tarjoat `value`:n komponentille, sen täytyy pysyä merkkijonona koko elinkaarensa ajan.

Et voi välittää `value={undefined}` ensin ja myöhemmin välittää `value="some string"` koska React ei tiedä haluatko komponentin olevan kontrolloimaton vai kontrolloitu. Kontrolloidun komponentin tulisi aina saada merkkijonona `value`, ei `null` tai `undefined`.

Jos `value` tulee API:sta tai tilamuuttujasta, se voi olla alustettu `null` tai `undefined`. Tässä tapauksessa, joko aseta se tyhjäksi merkkijonoksi (`''`) aluksi, tai välitä `value={someValue ?? ''}` varmistaaksesi, että `value` on merkkijono.

Vastaavasti, jos välität `checked` propsin valintaruudulle, varmista että se on aina totuusarvo.
