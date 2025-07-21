---
title: Asennus
---

<Intro>

React on suunniteltu alusta alkaen asteittaiseen käyttöönottoon. Voit käyttää niin paljon tai vähän Reactia kuin tarvitset. Halusitpa sitten koittaa Reactia, lisätä vähän interaktiivisuutta HTML sivuun, tai aloittaa monimutkaisen React-käyttöisen sovelluksen, tämä osio auttaa sinua pääsemään alkuun.

</Intro>

<<<<<<< HEAD
<YouWillLearn isChapter={true}>

- [Miten aloittaa uusi React -projekti](/learn/start-a-new-react-project)
- [Miten lisätä Reactia olemassa olevaan projektiin](/learn/add-react-to-an-existing-project)
- [Miten määritellä editori](/learn/editor-setup)
- [Miten asennetaan Reactin kehitystyökalut](/learn/react-developer-tools)

</YouWillLearn>

## Kokeile Reactia {/*try-react*/}
=======
## Try React {/*try-react*/}
>>>>>>> d52b3ec734077fd56f012fc2b30a67928d14cc73

Reactia kokeillaksesi sinun ei tarvitse asentaa mitään. Kokeile muokata tätä hiekkalaatikkoa!

<Sandpack>

```js
function Tervehdys({nimi}) {
  return <h1>Hei, {nimi}</h1>;
}

export default function App() {
  return <Tervehdys nimi="maailma" />;
}
```

</Sandpack>

Voit muokata sitä suoraan tai avata sen uudessa välilehdessä painamalla "Forkkaa" painiketta oikeasta yläreunasta.

<<<<<<< HEAD
Useimmat sivut Reactin dokumentaatiossa sisältävät hiekkalaatikkoja kuten tämän. Reactin dokumentaation ulkopuolelta löytyy monia hiekkalaatikkoja, jotka tukevat Reactia: esimerkiksi [CodeSandbox](https://codesandbox.io/s/new), [Stackblitz](https://stackblitz.com/fork/react), tai [CodePen](https://codepen.io/pen?&editors=0010&layout=left&prefill_data_id=3f4569d1-1b11-4bce-bd46-89090eed5ddb).

## Kokeile Reactia paikallisesti {/*try-react-locally*/}
=======
Most pages in the React documentation contain sandboxes like this. Outside of the React documentation, there are many online sandboxes that support React: for example, [CodeSandbox](https://codesandbox.io/s/new), [StackBlitz](https://stackblitz.com/fork/react), or [CodePen.](https://codepen.io/pen?template=QWYVwWN)
>>>>>>> d52b3ec734077fd56f012fc2b30a67928d14cc73

Kokeile Reactia paikallisesti omalla tietokoneellasi [lataamalla tämä HTML sivu](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html). Avaa se editorissasi sekä selaimesasi!

<<<<<<< HEAD
## Aloita uusi React projekti {/*start-a-new-react-project*/}

Jos sinun täytyy rakentaa sovellus tai verkkosivu täysin Reactilla, [aloita uusi React projekti.](/learn/start-a-new-react-project)
=======
## Creating a React App {/*creating-a-react-app*/}

If you want to start a new React app, you can [create a React app](/learn/creating-a-react-app) using a recommended framework.

## Build a React App from Scratch {/*build-a-react-app-from-scratch*/}

If a framework is not a good fit for your project, you prefer to build your own framework, or you just want to learn the basics of a React app you can [build a React app from scratch](/learn/build-a-react-app-from-scratch).
>>>>>>> d52b3ec734077fd56f012fc2b30a67928d14cc73

## Lisää React olemassa olevaan projektiin {/*start-a-react-project*/}

<<<<<<< HEAD
Jos haluat kokeilla Reactia olemassa olevassa sovelluksessa tai verkkosivussa, [lisää React olemassa olevaan projektiin.](/learn/add-react-to-an-existing-project)
=======
If want to try using React in your existing app or a website, you can [add React to an existing project.](/learn/add-react-to-an-existing-project)


<Note>

#### Should I use Create React App? {/*should-i-use-create-react-app*/}

No. Create React App has been deprecated. For more information, see [Sunsetting Create React App](/blog/2025/02/14/sunsetting-create-react-app).

</Note>
>>>>>>> d52b3ec734077fd56f012fc2b30a67928d14cc73

Jos olet valmis [aloittamaan itsenäisen projektin](/learn/start-a-new-react-project) Reactilla, voit pystyttää minimaalisen ympäristön miellyttävää kehittäjäkokemusta varten. Voit myös aloittaa käyttämällä ohjelmistokehystä, joka teke paljon päätöksiä puolestasi.

## Seuraavat vaiheet {/*next-steps*/}

Suuntaa kohti [Pika-aloitus](/learn) -oppaaseen ja tutustu tärkeimpiin React-ominaisuuksiin, joita kohtaat joka päivä.

