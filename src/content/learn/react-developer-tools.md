---
title: React kehitystyökalut
---

<Intro>

React kehitystyökaluja voi käyttää tarkastamaan React [komponentteja](/learn/your-first-component), muokkaamaan [propseja](/learn/passing-props-to-a-component) ja [tilaa](/learn/state-a-components-memory) sekä tunnistamaan suorityskykyongelmia.

</Intro>

<YouWillLearn>

* Miten asennetaan React kehitystyökalut

</YouWillLearn>

## Selainlisäosa {/*browser-extension*/}

Helpoin tapa debugata Reactilla rakennettuja verkkosivuja on asentamalla React Developer Tools selainlisäosa. Se on saatavilla useille suosituille selaimille:

* [Asenna **Chrome** selaimeen](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
* [Asenna **Firefox** selaimeen](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
* [Asenna **Edge** selaimeen](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

Nyt jos vierailet **Reactilla rakennetulla** verkkosivulla, näet _Components_ ja _Profile_ välilehdet.

![React Developer Tools lisäosa](/images/docs/react-devtools-extension.png)

### Safari ja muut selaimet {/*safari-and-other-browsers*/}

Muille selaimille (kuten esimerkiksi, Safarille), asenna [`react-devtools`](https://www.npmjs.com/package/react-devtools) npm lisäosa:
```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

Seuraavaksi avaa kehitystyökalut terminaalista:
```bash
react-devtools
```

Sitten yhdistä verkkosivusi lisäämällä seuraava `<script>` tagi `<head>` tagin alkuun:
```html {3}
<html>
  <head>
    <script src="http://localhost:8097"></script>
```

Lataa sivu uudelleen selaimessa näähdäksesi sen kehitystyökalussa.

![Itsenäinen React Developer Tools](/images/docs/react-devtools-standalone.png)

<<<<<<< HEAD
## Mobiili (React Native) {/*mobile-react-native*/}

React kehistystyökalulla voidaan katsoa myöskin [React Native](https://reactnative.dev/):lla rakennettuja sovelluksia.

Helpoin tapa käyttää React kehitystyökaluja on asentamalla se globaalisti:
```bash
# Yarn
yarn global add react-devtools
=======
## Mobile (React Native) {/*mobile-react-native*/}

To inspect apps built with [React Native](https://reactnative.dev/), you can use [React Native DevTools](https://reactnative.dev/docs/debugging/react-native-devtools), the built-in debugger that deeply integrates React Developer Tools. All features work identically to the browser extension, including native element highlighting and selection.
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682

[Learn more about debugging in React Native.](https://reactnative.dev/docs/debugging)

<<<<<<< HEAD
Sitten avaa kehitystyökalut terminaalista.
```bash
react-devtools
```

Sen pitäisi yhdistää mihin tahansa paikalliseen, käynnissäolevaan React Native sovellukseen.

> Kokeile käynnistää sovellus uudelleen mikäli kehitystyökalu ei yhdistä muutaman sekuntin kuluttua.

[Lue lisää React Nativen debuggaamisesta.](https://reactnative.dev/docs/debugging)
=======
> For versions of React Native earlier than 0.76, please use the standalone build of React DevTools by following the [Safari and other browsers](#safari-and-other-browsers) guide above.
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682
