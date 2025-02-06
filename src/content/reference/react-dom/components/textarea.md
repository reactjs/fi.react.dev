---
title: "<textarea>"
---

<Intro>

[Selaimen sisäänrakennettu `<textarea>`-komponentti](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) mahdollistaa monirivisen tekstisyötteen renderöimisen.

```js
<textarea />
```

</Intro>

<InlineToc />

---

## Viite {/*reference*/}

### `<textarea>` {/*textarea*/}

Näyttääksesi tekstikentän, renderöi [selaimen sisäänrakennettu `<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea)-komponentti.

```js
<textarea name="postContent" />
```

[Näe lisää esimerkkejä alla.](#usage)

#### Propsit {/*props*/}

`<textarea>` tukee kaikkia [yleisten elementtien propseja.](/reference/react-dom/components/common#props)

Voit tehdä [tekstikentästä kontrolloidun](#controlling-a-text-area-with-a-state-variable) välittämällä `value` propsin:

* `value`: Merkkijono. Kontrolloi tekstikentän tekstiä..

Kun välität `value`-arvon, sinun täytyy myös välittää `onChange`-käsittelijä, joka päivittää välitetyn arvon.

Jos `<textarea>` on kontrolloimaton, voit välittää `defaultValue`-propsin sen sijaan:

* `defaultValue`: Merkkijono. Määrittelee [oletusarvon](#providing-an-initial-value-for-a-text-area) tekstikentälle.

Nämä `<textarea>`-propsit ovat relevantteja sekä kontrolloimattomille että kontrolloiduille tekstikentille:

* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#autocomplete): Joko `'on'` tai `'off'`. Määrittelee automaattisen täydentämisen käyttäytymistä.
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#autofocus): Totuusarvo. Jos `true`, React kohdistaa elementtiin mountatessa.
* `children`: `<textarea>` ei hyväksy lapsia. Oletusarvon asettamiseksi, käytä `defaultValue`.
* [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#cols): Numero. Määrittää oletusleveyden keskimääräisinä merkkileveyksinä. Oletuksena arvoltaan `20`.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#disabled): Totuusarvo. Jos `true`, kenttä ei ole interaktiivinen ja näkyy himmennettynä.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#form): Merkkijono. Määrittää `<form>` lomakkeen `id` :n johon tämä kenttä kuuluu. Jos jätetty pois, se on lähin ylätason lomake.
* [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#maxlength): Numero. Määrittää tekstin enimmäispituuden.
* [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#minlength): Numero. Määrittää tekstin vähimmäispituuden.
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): Merkkijono. Määrittää nimen tälle kentälle, joka [lähetetään lomakkeessa.](#reading-the-textarea-value-when-submitting-a-form)
* `onChange`: [`Event` käsittelijäfunktio](/reference/react-dom/components/common#event-handler). Vaaditaan [kontrolloituihin tekstikenttiin.](#controlling-a-text-area-with-a-state-variable) Suoritetaan heti kun käyttäjä muuttaa kentän arvoa (esimerkiksi, suoritetaan jokaisella näppäinpainalluksella). Käyttäytyy kuten selaimen [`input` tapahtuma.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)
* `onChangeCapture`: Versio `onChange`:sta, joka suoritetaan [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): [`Event` käsittelijäfunktio](/reference/react-dom/components/common#event-handler). Suoritetaan heti kun käyttäjä muuttaa kentän arvoa. Historiallisista syistä, Reactissa on idiomaattista käyttää tämän tilalla `onChange`, joka toimii samanlaisesti.
* `onInputCapture`: Versio `onInput`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): [`Event` käsittelijäfunktio](/reference/react-dom/components/common#event-handler). Suoritetaan jos syöte ei läpäise validointia lomaketta lähetettäessä. Toisin kuin selaimen sisäänrakennettu `invalid`-tapahtuma, Reactin `onInvalid`-tapahtuma kuplii.
* `onInvalidCapture`: Versio `onInvalid`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/select_event): [`Event` käsittelijäfunktio](/reference/react-dom/components/common#event-handler). Suoritetaan kun valinta `<textarea>`:n sisällä muuttuu. React laajentaa `onSelect`-tapahtuman myös tyhjälle valinnalle ja muokkauksille (jotka voivat vaikuttaa valintaan).
* `onSelectCapture`: Versio `onSelect`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#placeholder): Merkkijono. Näytetään himmennetyllä värillä kun kenttä on tyhjä.
* [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#readonly): Totuusarvo. Jos `true`, kenttä ei ole käyttäjän muokattavissa.
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#required): Totuusarvo. Jos `true`, arvon on oltava lomaketta lähettäessä.
* [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#rows): Numero. Määrittää oletuskorkeuden keskimääräisinä merkkikorkeuksina. Oletuksena arvoltaan `2`.
* [`wrap`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#wrap): Joko `'hard'`, `'soft'`, tai `'off'`. Määrittää miten tekstin tulisi rivittyä lomaketta lähettäessä.

#### Rajoitukset {/*caveats*/}

- Lapsien välittäminen kuten `<textarea>something</textarea>` ei ole sallittua. [Käytä `defaultValue`-arvoa alustukselle.](#providing-an-initial-value-for-a-text-area)
- Jos kenttä vastaanottaa merkkijonon `value`-propsissa, se [käsitellään kontrolloituna.](#controlling-a-text-area-with-a-state-variable)
- Kenttä ei voi olla sekä kontrolloitu että kontrolloimaton samaan aikaan.
- Kenttä ei voi vaihtaa kontrolloidusta kontrolloimattomaksi elinkaarensa aikana.
- Jokainen kontrolloitu tekstikenttä tarvitsee `onChange`-käsittelijän, joka päivittää sen arvon synkronisesti.

---

## Käyttö {/*usage*/}

### Tekstikentän näyttäminen {/*displaying-a-text-area*/}

Renderöi `<textarea>` näyttääksesi tekstikentän. Voit määritellä sen oletuskoon [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#rows) ja [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#cols) attribuuteilla, mutta oletuksena käyttäjä voi muuttaa sen kokoa. Voit estää muuttamisen, voit määritellä `resize: none` CSS:ssä.

<Sandpack>

```js
export default function NewPost() {
  return (
    <label>
      Kirjoita julkaisusi:
      <textarea name="postContent" rows={4} cols={40} />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

---

### Otsikon tarjoaminen tekstikentälle {/*providing-a-label-for-a-text-area*/}

Tyypillisesti, asetat jokaisen `<textarea>`-komponentin [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label)-komponentin sisään. Tämä kertoo selaimelle, että tämä otsikko on yhdistetty tähän tekstikenttään. Kun käyttäjä klikkaa otsikkoa, selain kohdistaa tekstikenttään. Tämä on myös tärkeää saavutettavuuden kannalta: ruudunlukija lukee otsikon ääneen, kun käyttäjä kohdistaa tekstikenttään.

Jos et voi sijoittaa `<textarea>`-komponenttia `<label>`-komponentin sisään, yhdistä ne välittämällä sama ID `<textarea id>`:lle ja [`<label htmlFor>`:lle.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) Välttääksesi konflikteja yhden komponentin instanssien välillä, generoi tällainen ID [`useId`-hookilla.](/reference/react/useId)

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const postTextAreaId = useId();
  return (
    <>
      <label htmlFor={postTextAreaId}>
        Write your post:
      </label>
      <textarea
        id={postTextAreaId}
        name="postContent"
        rows={4}
        cols={40}
      />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### Oletusarvon tarjoaminen tekstikentälle {/*providing-an-initial-value-for-a-text-area*/}

Voit vaihtoehtoisesti määritellä oletusarvon tekstikentälle. Välitä se `defaultValue`-merkkijonona.

<Sandpack>

```js
export default function EditPost() {
  return (
    <label>
      Muokkaa julkaisuasi:
      <textarea
        name="postContent"
        defaultValue="Tykkäsin pyöräilystä eilen!"
        rows={4}
        cols={40}
      />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

<Pitfall>

Toisin kuin HTML:ssä, oletustekstin välittäminen `<textarea>Some content</textarea>` ei ole tuettu.

</Pitfall>

---

### Tekstikentän arvon lukeminen lomaketta lähettäessä {/*reading-the-text-area-value-when-submitting-a-form*/}

Lisää [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) tekstikentän ympärille, jossa on [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) sisällä. Se kutsuu `<form onSubmit>`-käsittelijää. Oletuksena, selain lähettää lomakkeen datan nykyiseen URL:iin ja päivittää sivun. Voit ohittaa tämän käyttäytymisen kutsumalla `e.preventDefault()`. Lue lomakkeen data [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) avulla.
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

    // Tai voit käsitellä sitä tavallisena oliona:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Julkaisun otsikko: <input name="postTitle" defaultValue="Pyöräily" />
      </label>
      <label>
        Muokkaa julkaisua:
        <textarea
          name="postContent"
          defaultValue="Tykkäsin pyöräilystä eilen!"
          rows={4}
          cols={40}
        />
      </label>
      <hr />
      <button type="reset">Nollaa muokkaukset</button>
      <button type="submit">Tallenna julkaisu</button>
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

Anna `<textarea>`:lle `name`, esimerkiksi `<textarea name="postContent" />`. `name`-arvoa käytetään avaimena lomakkeen datassa, esimerkiksi `{ postContent: "Julkaisusi" }`.

</Note>

<Pitfall>

Oletuksena, *mikä tahansa*  `<form>`:n sisällä oleva `<button>` lähettää sen. Tämä voi olla yllättävää! Jos sinulla on oma `Button` React-komponentti, harkitse [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button) palauttamista `<button>`:n sijaan. Sitten, ollaksesi eksplisiittinen, käytä `<button type="submit">` painikkeisiin, joiden *on* tarkoitus lähettää lomake.

</Pitfall>

---

### Tekstikentän ohjaaminen tilamuuttujalla {/*controlling-a-text-area-with-a-state-variable*/}

Tekstikenttä kuten `<textarea />` on *kontrolloimaton*. Vaikka [välittäisit oletusarvon](#providing-an-initial-value-for-a-text-area) kuten `<textarea defaultValue="Alkuteksti" />`, JSX määrittelee vain oletusarvon, ei arvoa juuri nyt.

**Renderöidäksesi _kontrolloidun_ tekstikentän, välitä `value`-prop sille.** React pakottaa tekstikentän aina sisältämään välittämäsi `value`-arvon. Tyypillisesti, ohjaat tekstikenttää määrittämällä [tilamuuttujan:](/reference/react/useState)

```js {2,6,7}
function NewPost() {
  const [postContent, setPostContent] = useState(''); // Määrittele tilamuuttuja...
  // ...
  return (
    <textarea
      value={postContent} // ...pakota kentän arvo vastaamaan tilamuuttujaa...
      onChange={e => setPostContent(e.target.value)} // ... ja päivitä tilamuuttuja muutoksissa!
    />
  );
}
```

Tämä on hyödyllistä, jos haluat renderöidä uudelleen osan käyttöliittymästä jokaisella näppäinpainalluksella.

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Hei,_ **Markdown**!');
  return (
    <>
      <label>
        Syötä markdown koodia:
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        />
      </label>
      <hr />
      <MarkdownPreview markdown={postContent} />
    </>
  );
}
```

```js src/MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  const renderedHTML = md.render(markdown);
  return <div dangerouslySetInnerHTML={{__html: renderedHTML}} />;
}
```

```json package.json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
textarea { display: block; margin-top: 5px; margin-bottom: 10px; }
```

</Sandpack>

<Pitfall>

**Jos välität `value`:n ilman `onChange` propsia, tekstikenttään ei voi kirjoittaa.** Kun kontrolloit tekstikenttää välittämällä sille `value`:n, *pakotat* sen aina sisältämään välittämäsi arvon. Joten jos välität tilamuuttujan `value`:ksi mutta unohdat päivittää tilamuuttujaa synkronisesti `onChange`-tapahtumakäsittelijässä, React palauttaa tekstikentän jokaisen näppäinpainalluksen jälkeen takaisin `value`:ksi, jonka välitit.

</Pitfall>

---

## Vianmääritys {/*troubleshooting*/}

### Tekstikenttäni ei päivity kun kirjoitan siihen {/*my-text-area-doesnt-update-when-i-type-into-it*/}

Jos renderöit tekstikentän `value`:lla mutta ilman `onChange`:a, näet virheen konsolissa:

```js
// 🔴 Bugi: kontrolloitu tekstikenttä ilman onChange käsittelijää
<textarea value={something} />
```

<ConsoleBlock level="error">

You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.

</ConsoleBlock>

Kuten virheviesti ehdottaa, jos haluat vain [määrittää *alkuarvon*,](#providing-an-initial-value-for-a-text-area) välitä `defaultValue` sen sijaan:

```js
// ✅ Hyvä: kontrolloimaton tekstikenttä oletusarvolla
<textarea defaultValue={something} />
```

If you want [to control this text area with a state variable,](#controlling-a-text-area-with-a-state-variable) specify an `onChange` handler:

Jos haluat [ohjata tätä tekstikenttää tilamuuttujalla,](#controlling-a-text-area-with-a-state-variable) määrittele `onChange`-käsittelijä:

```js
// ✅ Hyvä: kontrolloitu tekstikenttö onChange:lla
<textarea value={something} onChange={e => setSomething(e.target.value)} />
```

Jos arvo on tarkoituksella vain-luku -tilassa, lisää `readOnly`-propsi virheen poistamiseksi:

```js
// ✅ Hyvä: vain-luku tilassa oleva kontrolloitu tekstikenttä ilman muutoksenkäsittelijää
<textarea value={something} readOnly={true} />
```

---

### Tekstikentän kursori hyppää alkuun jokaisen näppäinpainalluksen yhteydessä {/*my-text-area-caret-jumps-to-the-beginning-on-every-keystroke*/}

Jos [kontrolloit tekstikenttää,](#controlling-a-text-area-with-a-state-variable) sinun täytyy päivittää sen tilamuuttuja tekstikentän arvolla DOM:sta `onChange`:ssa.

Et voi päivittää sitä joksikin muuksi kuin `e.target.value`:

```js
function handleChange(e) {
  // 🔴 Bugi: kentän päivittäminen joksikin muuksi kuin e.target.value
  setFirstName(e.target.value.toUpperCase());
}
```

Et voi päivittää sitä asynkronisesti:

```js
function handleChange(e) {
  // 🔴 Bugi: kentän päivittäminen asynkronisesti
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

Korjataksesi koodin, päivitä se synkronisesti `e.target.value`:lla:

```js
function handleChange(e) {
  // ✅ Kontrolloidun kentän päivittäminen e.target.value:lla synkronisesti
  setFirstName(e.target.value);
}
```

Jos tämä ei korjaa ongelmaa, on mahdollista, että tekstikenttä poistetaan ja lisätään takaisin DOM:iin jokaisen näppäinpainalluksen yhteydessä. Tämä voi tapahtua jos vahingossa [nollaat tilan](/learn/preserving-and-resetting-state) jokaisen uudelleenrenderöinnin yhteydessä. Esimerkiksi, tämä voi tapahtua jos tekstikenttä tai jokin sen vanhemmista saa aina erilaisen `key`-attribuutin, tai jos upotat komponenttimäärittelyjä (joka ei ole sallittua Reactissa ja aiheuttaa "sisäisen" komponentin uudelleenmounttauksen jokaisella renderöinnillä).

---

### Saan virheen: "A component is changing an uncontrolled input to be controlled" {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}


Jos tarjoat `value`:n komponentille, sen täytyy pysyä merkkijonona koko elinkaarensa ajan.

Et voi välittää `value={undefined}` ensin ja myöhemmin välittää `value="some string"` koska React ei tiedä haluatko komponentin olevan kontrolloimaton vai kontrolloitu. Kontrolloidun komponentin tulisi aina saada merkkijonona `value`, ei `null` tai `undefined`.

Jos `value` tulee API:sta tai tilamuuttujasta, se voi olla alustettu `null` tai `undefined`. Tässä tapauksessa, joko aseta se tyhjäksi merkkijonoksi (`''`) aluksi, tai välitä `value={someValue ?? ''}` varmistaaksesi, että `value` on merkkijono.
