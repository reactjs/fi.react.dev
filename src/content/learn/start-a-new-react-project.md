---
title: Aloita uusi React-projekti
---

<Intro>

<<<<<<< HEAD
Jos haluat rakentaa uuden sovelluksen tai verkkosivuston täysin Reactilla, suosittelemme valitsemaan yhden React-ohjelmistokehyksistä, jotka ovat suosittuja yhteisössä. Ohjelmistokehykset tarjoavat ominaisuuksia, joita useimmat sovellukset ja sivustot lopulta tarvitsevat, mukaan lukien reititys, tietojen haku ja HTML:n luominen.
=======
If you want to build a new app or a new website fully with React, we recommend picking one of the React-powered frameworks popular in the community.
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

</Intro>


<<<<<<< HEAD
**Sinun täytyy asentaa [Node.js](https://nodejs.org/en/) paikallista kehitystä varten.** Voit *myös* valita käyttää Node.js:ää tuotannossa, mutta sinun ei tarvitse. Monet React-ohjelmistokehykset tukevat vientiä staattiseksi HTML/CSS/JS-kansioksi.
=======
You can use React without a framework, however we’ve found that most apps and sites eventually build solutions to common problems such as code-splitting, routing, data fetching, and generating HTML. These problems are common to all UI libraries, not just React.
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

By starting with a framework, you can get started with React quickly, and avoid essentially building your own framework later.

<DeepDive>

#### Can I use React without a framework? {/*can-i-use-react-without-a-framework*/}

You can definitely use React without a framework--that's how you'd [use React for a part of your page.](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) **However, if you're building a new app or a site fully with React, we recommend using a framework.**

Here's why.

Even if you don't need routing or data fetching at first, you'll likely want to add some libraries for them. As your JavaScript bundle grows with every new feature, you might have to figure out how to split code for every route individually. As your data fetching needs get more complex, you are likely to encounter server-client network waterfalls that make your app feel very slow. As your audience includes more users with poor network conditions and low-end devices, you might need to generate HTML from your components to display content early--either on the server, or during the build time. Changing your setup to run some of your code on the server or during the build can be very tricky.

**These problems are not React-specific. This is why Svelte has SvelteKit, Vue has Nuxt, and so on.** To solve these problems on your own, you'll need to integrate your bundler with your router and with your data fetching library. It's not hard to get an initial setup working, but there are a lot of subtleties involved in making an app that loads quickly even as it grows over time. You'll want to send down the minimal amount of app code but do so in a single client–server roundtrip, in parallel with any data required for the page. You'll likely want the page to be interactive before your JavaScript code even runs, to support progressive enhancement. You may want to generate a folder of fully static HTML files for your marketing pages that can be hosted anywhere and still work with JavaScript disabled. Building these capabilities yourself takes real work.

**React frameworks on this page solve problems like these by default, with no extra work from your side.** They let you start very lean and then scale your app with your needs. Each React framework has a community, so finding answers to questions and upgrading tooling is easier. Frameworks also give structure to your code, helping you and others retain context and skills between different projects. Conversely, with a custom setup it's easier to get stuck on unsupported dependency versions, and you'll essentially end up creating your own framework—albeit one with no community or upgrade path (and if it's anything like the ones we've made in the past, more haphazardly designed).

If your app has unusual constraints not served well by these frameworks, or you prefer to solve these problems yourself, you can roll your own custom setup with React. Grab `react` and `react-dom` from npm, set up your custom build process with a bundler like [Vite](https://vitejs.dev/) or [Parcel](https://parceljs.org/), and add other tools as you need them for routing, static generation or server-side rendering, and more.

</DeepDive>

## Tuotantokäyttöön soveltuvat React-ohjelmistokehykset {/*production-grade-react-frameworks*/}

These frameworks support all the features you need to deploy and scale your app in production and are working towards supporting our [full-stack architecture vision](#which-features-make-up-the-react-teams-full-stack-architecture-vision). All of the frameworks we recommend are open source with active communities for support, and can be deployed to your own server or a hosting provider. If you’re a framework author interested in being included on this list, [please let us know](https://github.com/reactjs/react.dev/issues/new?assignees=&labels=type%3A+framework&projects=&template=3-framework.yml&title=%5BFramework%5D%3A+).

<<<<<<< HEAD
**[Next.js](https://nextjs.org/) on full-stack React-ohjelmistokehys.** Se on monipuolinen ja antaa sinun luoda React-sovelluksia mistä tahansa koosta--lähes staattisesta blogista monimutkaiseen dynaamiseen sovellukseen. Luodaksesi uuden Next.js-projektin, aja terminaalissa:
=======
### Next.js {/*nextjs-pages-router*/}

**[Next.js' Pages Router](https://nextjs.org/) is a full-stack React framework.** It's versatile and lets you create React apps of any size--from a mostly static blog to a complex dynamic application. To create a new Next.js project, run in your terminal:
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

<<<<<<< HEAD
Jos olet uusi Next.js:ään, tutustu [Next.js tutoriaaliin.](https://nextjs.org/learn/foundations/about-nextjs)

Next.js:ää ylläpitää [Vercel](https://vercel.com/). Voit [julkaista Next.js-sovelluksen](https://nextjs.org/docs/deployment) mihin tahansa Node.js- tai serverless-ympäristöön, tai omalla palvelimellasi. [Täysin staattiset Next.js-sovellukset](https://nextjs.org/docs/advanced-features/static-html-export) voidaan julkaista missö tahansa staattisessa hosting-ympäristössä.
=======
If you're new to Next.js, check out the [learn Next.js course.](https://nextjs.org/learn)

Next.js is maintained by [Vercel](https://vercel.com/). You can [deploy a Next.js app](https://nextjs.org/docs/app/building-your-application/deploying) to any Node.js or serverless hosting, or to your own server. Next.js also supports a [static export](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports) which doesn't require a server.
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

### Remix {/*remix*/}

**[Remix](https://remix.run) on full-stack React ohjelmistokehys sisäkkäisellä reitityksellä.** Se antaa sinun jakaa sovelluksesi osiin, jotka voivat ladata dataa rinnakkain ja päivittää käyttäjän toimien mukaan. Luodaksesi uuden Remix-projektin, aja terminaalissa:

<TerminalBlock>
npx create-remix
</TerminalBlock>

Jos olet uusi Remixiin, tutustu Remixin [blogi -tutoriaaliin](https://remix.run/docs/en/main/tutorials/blog) (lyhyt) ja [sovellus -tutoriaaliin](https://remix.run/docs/en/main/tutorials/jokes) (pitkä).

Remixiä ylläpitää [Shopify](https://www.shopify.com/). Kun luot Remix-projektin, sinun täytyy [valita julkaisuympäristösi](https://remix.run/docs/en/main/guides/deployment). Voit julkaista Remix-sovelluksen mihin tahansa Node.js- tai serverless-ympäristöön käyttämällä tai kirjoittamalla [adapterin](https://remix.run/docs/en/main/other-api/adapter).

### Gatsby {/*gatsby*/}

**[Gatsby](https://www.gatsbyjs.com/) on React ohjelmistokehys nopeille CMS-taustaisille verkkosivustoille.** Sen rikas liitännäisjärjestelmä ja GraphQL-tietokerros yksinkertaistavat sisällön, API:en ja palveluiden integroimista yhteen verkkosivustoon. Luodaksesi uuden Gatsby-projektin, aja terminaalissa:

<TerminalBlock>
npx create-gatsby
</TerminalBlock>

Jos olet uusi Gatsbyyn, tutustu [Gatsby tutoriaaliin.](https://www.gatsbyjs.com/docs/tutorial/)

Gatsbya ylläpitää [Netlify](https://www.netlify.com/). Voit [julkaista täysin staattisen Gatsby-sivuston](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting) mihin tahansa staattiseen hosting-ympäristöön. Jos valitset palvelinpuolen ominaisuuksia, varmista, että hosting-palveluntarjoajasi tukee niitä Gatsbylle.

### Expo (natiivisovelluksille) {/*expo*/}

**[Expo](https://expo.dev/) on React ohjelmistokehys, joka antaa sinun luoda universaaleja Android-, iOS- ja web-sovelluksia, joissa on täysin native-käyttöliittymät.** Se tarjoaa SDK:n [React Native](https://reactnative.dev/):lle, joka tekee natiivi-osien käytöstä helpompaa. Luodaksesi uuden Expo-projektin, aja terminaalissa:

<TerminalBlock>
npx create-expo-app
</TerminalBlock>

Jos olet uusi Expoon, tutustu [Expo tutoriaaliin.](https://docs.expo.dev/tutorial/introduction/)

Expoa ylläpitää [Expo (yritys)](https://expo.dev/about). Sovellusten rakentaminen Expon kanssa on ilmaista, ja voit lähettää ne Google Play- ja Apple App Store -kauppoihin ilman rajoituksia. Expo tarjoaa myös valinnaisia maksullisia pilvipalveluita.

<<<<<<< HEAD
<DeepDive>

#### Voinko käyttää Reactia ilman ohjelmistokehystä? {/*can-i-use-react-without-a-framework*/}

Voit käyttää Reactia ilman ohjelmistokehystä--tämä on tapa [käyttää Reactia osana sivuasi.](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) **Kuitenkin, jos rakennat uutta sovellusta tai sivustoa täysin Reactilla, suosittelemme käyttämään ohjelmistokehystä.**

Tässä miksi.

Vaikka et tarvitsisi reititystä tai tiedonhakua aluksi, sinun täytyy todennäköisesti lisätä joitain kirjastoja niitä varten. Kun JavaScript-bundle kasvaa jokaisen uuden ominaisuuden myötä, saatat joutua selvittämään, miten jakaa koodi jokaiselle reitille erikseen. Kun tiedonhakutarpeesi monimutkaistuvat, saatat kohdata palvelin-asiakas-verkkojen vesiputouksia, jotka saavat sovelluksesi tuntumaan hyvin hitaalta. Kun yleisöösi kuuluu enemmän käyttäjiä, joilla on huonoja verkkoyhteyksiä ja heikkoja laitteita, saatat joutua luomaan HTML:ää komponenteistasi näyttääksesi sisältöä aikaisin--joko palvelimella tai rakennusaikana. Koodisi muuttaminen siten, että osa siitä suoritetaan palvelimella tai rakennusaikana, voi olla hyvin hankalaa.

**Nämä ongelmat eivät koske vain Reactia. Tämän takia Sveltellä on SvelteKit, Vuella on Nuxt, ja niin edelleen.** Ratkaistaksesi nämä ongelmat itse, sinun täytyy integroida bundlerisi reitittimesi ja tietojen hakukirjastosi kanssa. Alkuperäisen asennuksen saaminen toimimaan ei ole vaikeaa, mutta on paljon hienovaraisuuksia, jotka liittyvät sovelluksen nopeaan lataamiseen, vaikka se kasvaisi ajan myötä. Haluat lähettää mahdollisimman vähän sovelluskoodia, mutta tehdä se yhdellä asiakas-palvelin-kierroksella, rinnakkain minkä tahansa sivun vaatiman datan kanssa. Haluat todennäköisesti, että sivu on interaktiivinen ennen kuin JavaScript-koodisi edes suoritetaan, jotta tuet progressiivista parannusta. Saatat haluta luoda kansio täysin staattisista HTML-tiedostoista markkinointisivuillesi, jotka voidaan julkaista missä tahansa ja toimia JavaScriptin ollessa poissa käytöstä. Näiden kykyjen rakentaminen itse vaatii todellista työtä.

**React ohjelmistokehykset tällä sivulla ratkaisevat tämän kaltaisia ongelmia oletuksena, ilman ylimääräistä työtä puoleltasi.** Ne antavat sinun aloittaa hyvin kevyesti ja sitten skaalata sovelluksesi tarpeidesi mukaan. Jokaisella React-ohjelmistokehyksellä on yhteisö, joten vastausten löytäminen kysymyksiin ja työkalujen päivittäminen on helpompaa. Ohjelmistokehykset myös antavat rakennetta koodillesi, auttaen sinua ja muita säilyttämään kontekstin ja taidot eri projektien välillä. Toisaalta, omalla asennuksella on helpompaa jäädä tukemattomien riippuvuuksien versioiden vangiksi, ja lopulta päädyt luomaan oman ohjelmistokehyksen--sellaisen, jolla ei ole yhteisöä tai päivityspolkua (ja jos se on mitä tahansa, mitä me olemme tehneet aiemmin, se on hutiloidusti suunniteltu).

Jos et ole vielä vakuuttunut, tai sovelluksellasi on epätavallisia rajoitteita, joita nämä ohjelmistokehykset eivät palvele hyvin ja haluat luoda oman mukautetun asennuksen, emme voi estää sinua--anna palaa! Nappaa `react` ja `react-dom` npm:stä, asenna mukautettu rakennusprosessisi bundlerilla kuten [Vite](https://vitejs.dev/) tai [Parcel](https://parceljs.org/), ja lisää muita työkaluja tarpeen mukaan reititykseen, staattiseen generointiin tai palvelinpuolen renderöintiin, ja niin edelleen.
</DeepDive>

## Kehityksen reunalla olevat React ohjelmistokehykset {/*bleeding-edge-react-frameworks*/}
=======
## Bleeding-edge React frameworks {/*bleeding-edge-react-frameworks*/}
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

Kuten olemme tutkineet miten Reactia voidaan parantaa, olemme huomanneet, että Reactin integroiminen tiiviimmin ohjelmistokehysten kanssa (erityisesti reitityksen, bundlauksen ja palvelinteknologioiden kanssa) on suurin mahdollisuutemme auttaa Reactin käyttäjiä rakentamaan parempia sovelluksia. Next.js-tiimi on suostunut yhteistyöhön kanssamme tutkimalla, kehittämällä, integroimalla ja testaamalla ohjelmistokehysten kanssa yhteensopivia Reactin kehityksen reunalla olevia ominaisuuksia, kuten [Reactin palvelinkomponentit.](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)

Nämä ominaisuudet ovat lähempänä tuotantokäyttöä joka päivä, ja olemme keskustelleet muiden bundler- ja ohjelmistokehyskehittäjien kanssa niiden integroimisesta. Toivomme, että vuoden tai kahden kuluttua kaikilla tällä sivulla luetelluilla ohjelmistokehyksillä on täysi tuki näille ominaisuuksille. (Jos olet ohjelmistokehyskehittäjä, joka on kiinnostunut yhteistyöstä kanssamme näiden ominaisuuksien kokeilemiseksi, kerro meille!)

### Next.js (App Router) {/*nextjs-app-router*/}

<<<<<<< HEAD
**[Next.js's App Router](https://beta.nextjs.org/docs/getting-started) on Next.js:n API:en uudelleensuunnittelu, joka tähtää React-tiimin full-stack arkkitehtuurin visioon.** Se antaa sinun hakea dataa asynkronisissa komponenteissa, jotka suoritetaan palvelimella tai jopa rakennusaikana.

Next.js:ää ylläpitää [Vercel](https://vercel.com/). Voit [julkaista Next.js-sovelluksen](https://nextjs.org/docs/deployment) mihin tahansa Node.js- tai serverless-ympäristöön, tai omalla palvelimellasi. Next.js tukee myös [staattista vientiä](https://nextjs.org/docs/advanced-features/static-html-export), joka ei vaadi palvelinta.
<Pitfall>

**Next.js:n App Router on tällä hetkellä beta-vaiheessa eikä sitä vielä suositella tuotantokäyttöön** (maaliskuussa 2023). Kokeillaksesi sitä olemassa olevassa Next.js-projektissa, [seuraa tätä ohjeistusta](https://beta.nextjs.org/docs/upgrade-guide#migrating-from-pages-to-app).

</Pitfall>
=======
**[Next.js's App Router](https://nextjs.org/docs) is a redesign of the Next.js APIs aiming to fulfill the React team’s full-stack architecture vision.** It lets you fetch data in asynchronous components that run on the server or even during the build.

Next.js is maintained by [Vercel](https://vercel.com/). You can [deploy a Next.js app](https://nextjs.org/docs/app/building-your-application/deploying) to any Node.js or serverless hosting, or to your own server. Next.js also supports [static export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports) which doesn't require a server.
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

<DeepDive>

#### Mitkä ominaisuudet kuvaavat React-tiimin full-stack arkkitehtuurin visiota? {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

Next.js:n App Router bundler toteuttaa täysin virallisen [Reactin palvelinkomponenttien määrittelyn](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md). Tämä antaa sinun sekoittaa rakennusajan, vain-palvelimella-toimivat ja interaktiiviset komponentit yhteen React-puuhun.

Esimerkiksi, voit kirjotitaa vain-palvelimella-toimivan React-komponentin `async`-funktiona, joka lukee tietokannasta tai tiedostosta. Sitten voit välittää dataa alas siitä interaktiivisille komponenteillesi:

```js
// Tämä komponentti suoritetaan *vain* palvelimella (tai rakennuksen aikana).
async function Talks({ confId }) {.
  // 1. Jos olet palvelimella, voit jutella data-tasosi kanssa. API endpointtia ei vaadita.
  const talks = await db.Talks.findAll({ confId });

  // 2. Lisää renderöintilogiikkaa miten paljon tahansa. Se ei tee JavaScript bundlestasi yhtään suurempaa.
  const videos = talks.map(talk => talk.video);

  // 3. Välitä data alas komponenteillesi, jotka suoritetaan selaimessa.
  return <SearchableVideoList videos={videos} />;
}
```

Next.js:n App Router integroituu myös [datan hakemiseen Suspensen kanssa](/blog/2022/03/29/react-v18#suspense-in-data-frameworks). Tämän avulla voit määritellä lataustilan (kuten tilapäisen luurangon) eri osille käyttöliittymääsi suoraan React-puussasi:

```js

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

Palvelinkomponentit sekä SUspense ovat React -ominaisuuksia eivätkä Next.js -ominaisuuksia. Kuitenkin, niiden ottaminen käyttöön ohjelmistokehyksen tasolla vaatii sitoutumista ja ei-triviaalia toteutustyötä. Tällä hetkellä, Next.js App Router on täydellisin toteutus. React-tiimi työskentelee bundler-kehittäjien kanssa tehdäkseen näiden ominaisuuksien toteuttamisesta helpompaa seuraavan sukupolven ohjelmistokehyksissä.

</DeepDive>
