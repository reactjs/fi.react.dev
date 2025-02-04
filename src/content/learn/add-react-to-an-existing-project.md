---
title: Lisää React olemassa olevaan projektiin
---

<Intro>

Jos haluat lisätä interaktiivisuutta olemassa olevaan projektiin, sinun ei tarvitse kirjoittaa sitä uudelleen Reactilla. Lisää React olemassa olevaan projektiisi ja renderöi interaktiivisia React-komponentteja missä tahansa.

</Intro>

<Note>

**Sinun täytyy asentaa [Node.js](https://nodejs.org/en/) paikallista kehitystä varten.** Vaikka voit [kokeilla Reactia](/learn/installation#try-react) verkossa tai yksinkertaisella HTML-sivulla, realistisesti suurin osa JavaScript-työkaluista, joita haluat käyttää kehityksessä, vaatii Node.js:n.

</Note>

## Reactin käyttäminen olemassa olevan sivuston alireitissä {/*using-react-for-an-entire-subroute-of-your-existing-website*/}

Sanotaan, että sinulla on olemassa oleva verkkosovellus osoitteessa `example.com`, joka on rakennettu toisella palvelinteknologialla (kuten Rails), ja haluat toteuttaa kaikki reitit, jotka alkavat `example.com/some-app/` täysin Reactilla.

Tässä miten suosittelemme sen asentamista:

1. **Rakenna React-osuus sovelluksestasi** käyttäen yhtä [React-pohjaista ohjelmistokehystä](/learn/start-a-new-react-project).
2. **Määrittele `/some-app` *aloituspoluksi*** ohjelmistokehyksesi konfiguroinnissa (tässä miten: [Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath), [Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/)).
3. **Määrittele verkkopalvelimesi tai välityspalvelimesi** siten, jotta kaikki pyynnöt `/some-app/` reittiin käsitellään React sovelluksessasi.

Tämä varmistaa, että React -osa sovelluksestasi voi [hyötyä parhaista käytännöistä](/learn/start-a-new-react-project#can-i-use-react-without-a-framework), jotka on sisällytetty näihin kehyksiin.

Moni React -pohjainen ohjelmistokehys ovat full-stackkeja ja antavat React-sovelluksesi hyödyntää palvelinta. Voit kuitenkin käyttää samaa lähestymistapaa, vaikka et voisi tai et haluaisi ajaa JavaScriptiä palvelimella. Tässä tapauksessa tarjoa HTML/CSS/JS -vientiä ([`next export` -lopputulos](https://nextjs.org/docs/advanced-features/static-html-export) Next.js:lle, oletusarvo Gatsbylle) `/some-app/` sijassa.

## Reactin käyttäminen osana olemassa olevaa sivua {/*using-react-for-a-part-of-your-existing-page*/}

Sanotaan, että sinulla on olemassa oleva sivu, joka on rakennettu toisella tekniikalla (joko palvelinteknologialla, kuten Rails, tai asiakasteknologialla, kuten Backbone), ja haluat renderöidä interaktiivisia React-komponentteja jossaain kohtaa sivua. Tämä on yleinen tapa integroida React--itse asiassa se on, miltä suurin osa Reactin käytöstä näytti Metalla monien vuosien ajan!

Voit tehdä tämän kahdessa vaiheessa:

1. **Asenna JavaScript ympäristö**, jonka avulla voit käyttää [JSX syntaksia](/learn/writing-markup-with-jsx), jakaa koodin useisiin moduuleihin [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) / [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) syntaksilla, ja käyttää paketteja (kuten, React) [npm](https://www.npmjs.com/) pakettirekisteristä.
2. **Renderöi React komponenttisi** missä haluat niiden näkyvän sivulla.

Tämä tarkka lähestymistapa riippuu olemassa olevasta sivustasi, joten käydään läpi joitain yksityiskohtia.

### 1. Vaihe: Asenna modulaarinen JavaScript ympäristö {/*step-1-set-up-a-modular-javascript-environment*/}

Modulaarisella JavaScript ympäristöllä voit kirjoittaa React komponenttisi yksittäisiin tiedostoihin, toisin kuin kirjoittamaan kaikki koodisi yhteen tiedostoon. Sen avulla voit käyttää kaikkia ihania paketteja, jotka on julkaistu muiden kehittäjien toimesta [npm](https://www.npmjs.com/) rekisterissä--mukaan lukien Reactin itse! Miten teet tämän riippuu olemassa olevasta asennuksestasi:

* **Jos sovelluksesi on jo jaettu tiedostoihin, jotka käyttävät `import` lausetta,** kokeile käyttää asenusta, joka sinulla jo on. Tarkista aiheuttaako `<div />`:n kirjoittaminen JS koodissasi syntaksivirheen. Jos se aiheuttaa syntaksivirheen, saatat tarvita [JavaScript koodin muuntamista Babelilla](https://babeljs.io/setup), ja [Babel React preset](https://babeljs.io/docs/babel-preset-react):n käyttöön ottamista käyttääksesi JSX:ää.

* **Jos sovelluksellasi ei ole olemassa olevaa ympäristöä JavaScript-moduulien kääntämistä varten,** luo se [Vite](https://vite.dev/):n avulla. Vite-yhteisö ylläpitää [monia integraatioita backend-kehysratkaisujen kanssa](https://github.com/vitejs/awesome-vite#integrations-with-backends), mukaan lukien Rails, Django ja Laravel. Jos backend-kehysratkaisua ei ole listattu, [seuraa tätä opasta](https://vite.dev/guide/backend-integration.html) integroidaksesi Vite-rakentamisen manuaalisesti backendiisi.

Tarkistaaksesi, toimiiko asennus, suorita tämä komento projektisi kansiossa:
<TerminalBlock>
npm install react react-dom
</TerminalBlock>


Lisää sitten nämä koodirivit pää-JavaScript-tiedostosi alkuun (se voi olla nimeltään `index.js` tai `main.js`):

<Sandpack>

```html public/index.html hidden
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- Olemassa oleva sivun sisältö (tässä esimerkissä, se korvataan) -->
    <div id="root"></div>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';

// Tyhjää olemassa oleva HTML sisältö
document.body.innerHTML = '<div id="app"></div>';

// Renderöi sen sijaan React komponentti
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

</Sandpack>

Jos koko sivusi sisältö korvattiin "Hello, world!" -tekstillä, kaikki toimi! Jatka lukemista.

<Note>

Modulaarisen JavaScript ympäristön integrointi olemassa olevaan projektiin ensimmäistä kertaa saattaa tuntua pelottavalta, mutta se kannattaa! Jos jäät jumiin, kokeile [yhteisöresurssejamme](/community) tai [Vite Chat](https://chat.vite.dev/).

</Note>

### 2. Vaihe: Renderöi React komponentteja missä tahansa kohdassa sivua {/*step-2-render-react-components-anywhere-on-the-page*/}

Edellisessä vaiheessa laitoit tämän koodin pää-tiedostosi alkuun:

```js
import { createRoot } from 'react-dom/client';

// Tyhjää olemassa oleva HTML sisältö
document.body.innerHTML = '<div id="app"></div>';

// Renderöi sen sijaan React komponentti
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

Tietenkään et halua oikeasti tyhjätä olemassa olevaa HTML sisältöä!

Poista tämä koodi.

Sen sijaan, saatat haluta renderöidä React komponenttisi tietyissä paikoissa HTML:ssäsi. Avaa HTML sivusi (tai palvelimen mallit, jotka tuottavat sen) ja lisää uniikki [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) attribuutti mihin tahansa tagiin, esimerkiksi:

```html
<!-- ... jossain kohtaa html koodiasi ... -->
<nav id="navigation"></nav>
<!-- ... lisää html koodia ... -->
```

Tämän avulla voit etsiä kyseisen HTML elementin käyttäen [`document.getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) ja välittää sen [`createRoot`](/reference/react-dom/client/createRoot):lle, jotta voit renderöidä oman React komponenttisi sen sisälle:

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>Minun appi</title></head>
  <body>
    <p>Tämä kappale on osa HTML koodia.</p>
    <nav id="navigation"></nav>
    <p>Tämä kappale on myös osa HTML koodia.</p>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';

function NavigationBar() {
  // TODO: Oikeasti toteuta navigaatiopalkki
  return <h1>Hello from React!</h1>;
}

const domNode = document.getElementById('navigation');
const root = createRoot(domNode);
root.render(<NavigationBar />);
```

</Sandpack>

Huomaa miten alkuperäinen HTML sisältö `index.html`:stä säilyy, mutta oma `NavigationBar` React komponenttisi ilmestyy nyt `<nav id="navigation">` sisälle HTML:stäsi. Lue [`createRoot` käyttödokumentaatiosta](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react) oppiaksesi lisää React komponenttien renderöinnistä olemassa olevan HTML sivun sisälle.

Kun otat Reactin käyttöön olemassa olevassa projektissa, on yleistä aloittaa pienillä interaktiivisilla komponenteilla (kuten painikkeilla) ja sitten vähitellen "liikkua ylöspäin", kunnes lopulta koko sivusi on rakennettu Reactilla. Jos koskaan saavutat tämän pisteen, suosittelemme siirtymistä [React-ohjelmistokehykseen](/learn/start-a-new-react-project) saadaksesi eniten irti Reactista.

## React Nativen käyttäminen olemassa olevassa natiivipuhelinsovelluksessa {/*using-react-native-in-an-existing-native-mobile-app*/}

[React Native](https://reactnative.dev/) voidaan myös integroida olemassa oleviin natiivisovelluksiin asteittain. Jos sinulla on olemassa oleva natiivisovellus Androidille (Java tai Kotlin) tai iOS:lle (Objective-C tai Swift), [seuraa tätä opasta](https://reactnative.dev/docs/integration-with-existing-apps) lisätäksesi React Native näytön siihen.
