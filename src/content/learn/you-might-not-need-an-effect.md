---
title: Et ehkä tarvitse Efektiä
---

<Intro>

Efektit ovat pelastusluukku React-paradigmasta. Niiden avulla voit "astua ulos" Reactista ja synkronoida komponenttejasi jonkin ulkoisen järjestelmän, kuten ei-React-widgetin, verkon tai selaimen DOM:in kanssa. Jos ulkoista järjestelmää ei ole mukana (esimerkiksi jos haluat päivittää komponentin tilan, kun joitain propseja tai tiloja muutetaan), sinun ei pitäisi tarvita Effektia. Tarpeettomien efektien poistaminen tekee koodistasi helpommin seurattavan, nopeamman suorittaa ja vähemmän virhealttiin.
</Intro>

<YouWillLearn>

* Miksi ja miten poistaa tarpeettomat Effektit komponenteistasi
* Miten välimuistittaa kalliit laskutoimitukset ilman Effekteja
* Miten nollata ja säätää komponentin tilaa ilman Effekteja
* Miten jakaa logiikkaa tapahtumankäsittelijöiden välillä
* Millainen logiikka tulisi siirtää tapahtumankäsittelijöihin
* Miten ilmoittaa muutoksista vanhemmille komponenteille

</YouWillLearn>

## Miten poistaa turhia Effecteja {/*how-to-remove-unnecessary-effects*/}

On kaksi yleistä tapausta, joissa et tarvitse efektejä:

* **Et tarvitse efektejä datan muokkaamiseen renderöintiä varten.** Esimerkiksi, sanotaan että haluat suodattaa listaa ennen sen näyttämistä. Saatat tuntea houkutuksen efektin kirjoittamiseen, joka päivittää tilamuuttujan, kun lista muuttuu. Kuitenkin tämä on tehottomaa. Kun päivität tilaa, React ensin kutsuu komponenttifunktioitasi laskemaan, mitä tulisi näytölle. Sitten React ["kommittaa"](/learn/render-and-commit) nämä muutokset DOMiin päivittäen näytön. Sitten React suorittaa efektit. Jos efektisi *myös* päivittää välittömästi tilaa, tämä käynnistää koko prosessin alusta! Välttääksesi tarpeettomat renderöintikierrokset, muokkaa kaikki data komponenttiesi ylätasolla. Tuo koodi ajetaan automaattisesti aina kun propsit tai tila muuttuvat.
* **Et tarvitse efektejä käsittelemään käyttäjätapahtumia.** Esimerkiksi, oletetaan että haluat lähettää `/api/buy` POST-pyynnön ja näyttää ilmoituksen, kun käyttäjä ostaa tuotteen. Osta-nappulan klikkaustapahtumankäsittelijässä tiedät tarkalleen mitä tapahtui. Kun efekti suoritetaan, et tiedä *mitä* käyttäjä teki (esimerkiksi, minkä nappulan hän klikkasi). Tämän vuoksi käyttäjätapahtumat käsitellään yleensä vastaavissa tapahtumankäsittelijöissä.

Tarvitset *kyllä* efektejä [synkronoimiseen](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events) ulkoisten järjestelmien kanssa. Esimerkiksi voit kirjoittaa efektin, joka pitää jQuery-widgetin synkronoituna Reactin tilan kanssa. Voit myös noutaa tietoja efekteillä: esimerkiksi voit pitää hakutulokset synkronoituna nykyisen hakukyselyn kanssa. On kuitenkin hyvä pitää mielessä, että nykyaikaiset [kehysratkaisut](/learn/start-a-new-react-project#production-grade-react-frameworks) tarjoavat tehokkaampia sisäänrakennettuja tiedonhakumekanismeja kuin efektien kirjoittaminen suoraan komponentteihin.

Katsotaanpa joitakin yleisiä konkreettisia esimerkkejä saadaksesi oikeanlaisen intuition.

### Tilan päivittäminen propsin tai tilan pohjalta {/*updating-state-based-on-props-or-state*/}

Oletetaan, että sinulla on komponentti, jossa on kaksi tilamuuttujaa: `firstName` ja `lastName`. Haluat laskea niistä `fullName`-nimen yhdistämällä ne. Lisäksi haluat, että `fullName` päivittyy aina, kun `firstName` tai `lastName` muuttuvat. Ensimmäinen vaistosi saattaa olla lisätä `fullName`-tilamuuttuja ja päivittää se effektissa:

```js {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Vältä: turha tila ja tarpeeton Effekti
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

Tämä on tarpeettoman monimutkainen. Se on myös tehotonta: se suorittaa koko renderöinnin vanhentuneella `fullName`-arvolla ja päivittää sen sitten välittömästi uudelleen päivitetyllä arvolla. Poista tilamuuttuja ja Effekti:

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Hyvä: lasketaan renderöinnin aikana
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

**Kun jotain voidaan laskea olemassa olevista propseista tai tilamuuttujista, [älä aseta sitä tilaan.](/learn/choosing-the-state-structure#avoid-redundant-state) Sen sijaan laske se renderöinnin aikana.** Tämä tekee koodistasi nopeamman (vältät ylimääräiset "kaskadiset" päivitykset), yksinkertaisemman (poistat osan koodista) ja vähemmän virhealttiin (vältät bugeja, jotka johtuvat tilamuuttujien epäsynkronoinnista). Jos tämä lähestymistapa tuntuu uudelta sinulle, [Ajattelu Reactissa](/learn/thinking-in-react#step-3-find-the-minimal-but-complete-representation-of-ui-state) selittää, mitä tilaan tulisi laittaa.

### Raskaiden laskujen välimuistittaminen {/*caching-expensive-calculations*/}

Tämä komponentti laskee `visibleTodos`-muuttujan ottamalla `todos`-muuttujan propsina vastaan ja suodattamalla sen `filter`-propsin perusteella. Saatat tuntea houkutuksen tallentaa tulos tilaan ja päivittää sen Effektin avulla:

```js {4-8}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');

  // 🔴 Vältä: turha tila ja tarpeeton Effekti
  const [visibleTodos, setVisibleTodos] = useState([]);
  useEffect(() => {
    setVisibleTodos(getFilteredTodos(todos, filter));
  }, [todos, filter]);

  // ...
}
```

Kuten aiemmassa esimerkissä, tämä on sekä tarpeeton että tehoton. Poista ensin tila ja Effekti:

```js {3-4}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ Tämä on okei jos getFilteredTodos() ei ole hidas.
  const visibleTodos = getFilteredTodos(todos, filter);
  // ...
}
```

Useiten, tämä koodi on okei! Mutta ehkä `getFilteredTodos()` on hidas tai sinulla on useita `todos` kohteita. Tässä tapauksessa et halua laskea `getFilteredTodos()` uudelleen, jos jokin epäolennainen tilamuuttuja, kuten `newTodo`, on muuttunut.

Voit välimuistittaa (tai ["memoisoida"](https://en.wikipedia.org/wiki/Memoization)) kalliin laskutoimituksen käärimällä sen [`useMemo`](/reference/react/useMemo)-Hookin sisään:

```js {5-8}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  const visibleTodos = useMemo(() => {
    // ✅ Ei suoriteta uudelleen, elleivät todos tai filter muutu
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);
  // ...
}
```

Tai kirjoitettuna yhtenä rivinä:

```js {5-6}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ getFilteredTodos()-funktiota ei suoriteta uudelleen, elleivät todos tai filter muutu.
  const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);
  // ...
}
```

**Tämä kertoo Reactille, että et halua sisäisen funktion suorittuvan uudelleen, elleivät `todos` tai `filter` ole muuttuneet.** React muistaa `getFilteredTodos()`-funktion palautusarvon ensimmäisellä renderöinnillä. Seuraavilla renderöinneillä se tarkistaa, ovatko `todos` tai `filter` erilaisia. Jos ne ovat samat kuin viime kerralla, `useMemo` palauttaa viimeksi tallennetun tuloksen. Mutta jos ne ovat erilaisia, React kutsuu sisäistä funktiota uudelleen (ja tallentaa sen tuloksen).

Funktio, jonka käärit [`useMemo`](/reference/react/useMemo)-Hookin sisään, suoritetaan renderöinnin aikana, joten tämä toimii vain [puhtaiden laskutoimitusten](/learn/keeping-components-pure) kanssa.

<DeepDive>

#### Kuinka tunnistan, onko laskenta kallis? {/*how-to-tell-if-a-calculation-is-expensive*/}

Yleisesti ottaen, ellet luo tai silmukoi tuhansia objekteja, se ei todennäköisesti ole kallista. Jos haluat olla varmempi, voit lisätä konsolilokin mittaamaan aikaa, joka kuluu koodin palan suorittamiseen:

```js {1,3}
console.time('filter taulukko');
const visibleTodos = getFilteredTodos(todos, filter);
console.timeEnd('filter taulukko');
```

Suorita vuorovaikutus, jota mitataan (esimerkiksi kirjoittaminen syötekenttään). Näet sitten lokit, kuten `filter taulukko: 0.15ms` konsolissasi. Jos kokonaisaika on merkittävä (esimerkiksi `1ms` tai enemmän), saattaa olla järkevää välimuistittaa laskutoimitus. Kokeilun vuoksi voit sitten kääriä laskutoimituksen `useMemo`-Hookin sisään ja tarkistaa, onko kokonaisaika vähentynyt vai ei:

```js
console.time('filter taulukko');
const visibleTodos = useMemo(() => {
  return getFilteredTodos(todos, filter); // Ohita, jos todos ja filter eivät ole muuttuneet.
}, [todos, filter]);
console.timeEnd('filter taulukko');
```

`useMemo` ei tee ensimmäistä renderöintiä nopeammaksi. Se auttaa ainoastaan välttämään tarpeetonta työtä päivityksissä.

Pidä mielessä, että koneesi on todennäköisesti nopeampi kuin käyttäjäsi, joten on hyvä idea testata suorituskykyä keinotekoisella hidastuksella. Esimerkiksi Chrome tarjoaa [CPU Throttling](https://developer.chrome.com/blog/new-in-devtools-61/#throttling)-vaihtoehdon tätä varten.

Huomaa myös, että suorituskyvyn mittaaminen kehitysvaiheessa ei anna sinulle tarkimpia tuloksia. (Esimerkiksi, kun [Strict Mode](/reference/react/StrictMode) on päällä, näet jokaisen komponentin renderöityvän kahdesti kerran sijaan.) Saadaksesi tarkimmat ajat, rakenna sovelluksesi tuotantoon ja testaa sitä laitteella, joka käyttäjilläsi on.

</DeepDive>

### Kaiken tilan palauttaminen kun propsi muuttuu {/*resetting-all-state-when-a-prop-changes*/}

`ProfilePage` komponentti saa `userId` propsin. Sivulla on kommenttikenttä, ja käytät `comment`-tilamuuttujaa sen arvon säilyttämiseen. Eräänä päivänä huomaat ongelman: kun navigoit yhdestä profiilista toiseen, `comment`-tila ei nollaudu. Tämän seurauksena on helppo vahingossa lähettää kommentti väärälle käyttäjän profiilille. Korjataksesi ongelman, haluat tyhjentää `comment`-tilamuuttujan aina, kun `userId` muuttuu:

```js {4-7}
export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState('');

  // 🔴 Vältä: Tilan resetointi prospin muuttuesssa Effektissa
  useEffect(() => {
    setComment('');
  }, [userId]);
  // ...
}
```

Tämä on tehotonta, koska `ProfilePage` ja sen lapset renderöityvät ensin vanhentuneella arvolla ja sitten uudelleen. Se on myös monimutkaista, koska sinun täytyisi tehdä tämä *jokaisessa* komponentissa, jossa on tilaa `ProfilePage`:n sisällä. Esimerkiksi, jos kommenttikäyttöliittymä on sisäkkäinen, haluat nollata myös sisäkkäisen kommentin tilan.

Sen sijaan, voit kertoa Reactille, että jokainen käyttäjän profiili on käsitteellisesti *erilainen* profiili antamalla sille eksplisiittisen avaimen. Jaa komponenttisi kahteen ja välitä `key`-attribuutti ulkoisesta komponentista sisäiseen:

```js {5,11-12}
export default function ProfilePage({ userId }) {
  return (
    <Profile
      userId={userId}
      key={userId}
    />
  );
}

function Profile({ userId }) {
  // ✅ Tämä ja muut alla olevat tilat nollautuvat key:n muuttuessa automaattisesti
  const [comment, setComment] = useState('');
  // ...
}
```

Normaalisti, React säilyttää tilan kun sama komponentti on renderöity samaan paikkaan. **Antamalla `userId`:n `key`-attribuuttina `Profile`-komponentille, pyydät Reactia kohtelemaan kahta `Profile`-komponenttia, joilla on eri `userId`, kahtena eri komponenttina, jotka eivät jaa tilaa.** Aina kun avain (jonka olet asettanut `userId`:ksi) muuttuu, React luo uudelleen DOMin ja [nollaa tilan](/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key) `Profile`-komponentissa ja kaikissa sen lapsikomponenteissa. Nyt `comment`-kenttä tyhjenee automaattisesti navigoidessasi profiilien välillä.

Huomaa, että tässä esimerkissä vain ulkoinen `ProfilePage`-komponentti on exportattu ja näkyvissä muissa projektin tiedostoissa. Komponentit, jotka renderöivät `ProfilePage`:a, eivät tarvitse välittää avainta sille: ne välittävät `userId`:n tavallisena propina. Se, että `ProfilePage` välittää sen `key`-attribuuttina sisäiselle `Profile`-komponentille, on toteutuksen yksityiskohta.

### Tilan säätäminen kun propsi muuttuu {/*adjusting-some-state-when-a-prop-changes*/}

Joskus saatat haluat nollata tai säätää osan tilasta propin muuttuessa, mutta et kaikkea.

`List` komponetti vastaanottaa listan `items` propsina ja ylläpitää valittua kohdetta `selection`-tilamuuttujassa. Haluat nollata `selection`-tilan `null`:ksi aina kun `items`-propiin tulee eri taulukko:

```js {5-8}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // 🔴 Vältä: Tilan säätämistä propsin muutoksen pohjalta Effektissa
  useEffect(() => {
    setSelection(null);
  }, [items]);
  // ...
}
```

Tämä myöskään ei ole ideaali. Joka kerta kun `items` muuttuu, `List` ja sen lapsikomponentit renderöityvät ensin vanhentuneella `selection`-arvolla. Sitten React päivittää DOMin ja suorittaa Efektit. Lopuksi, `setSelection(null)`-kutsu aiheuttaa uuden renderöinnin `List`-komponentille ja sen lapsikomponenteille, käynnistäen tämän koko prosessin uudelleen.

Aloita poistamalla Effekti. Sen sijaan, säädä tila suoraan renderöinnin aikana:

```js {5-11}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // Parempi: Säädä tila renderöinnin aikana
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}
```

[Tiedon tallentaminen edellisistä renderöinneistä](/reference/react/useState#storing-information-from-previous-renders) kuten tässä voi olla hankalaa ymmärtää, mutta se on parempi kuin saman tilan päivittäminen Effektissa. Yllä olevassa esimerkissä `setSelection` kutsutaan suoraan renderöinnin aikana. React renderöi `List`-komponentin *välittömästi* sen jälkeen, kun se poistuu `return`-lauseella. React ei ole vielä renderöinyt `List`-lapsia tai päivittänyt DOMia, joten tämän avulla `List`-lapset voivat ohittaa vanhentuneen `selection`-arvon renderöinnin.

Kun päivität komponenttia kesken renderöinnin, React heittää pois palautetun JSX:n ja välittömästi yrittää renderöintiä uudelleen. Välttääksesi hyvin hitaat kaskadiset uudelleenyritykset, React sallii *saman* komponentin tilapäivityksen renderöinnin aikana. Jos päivität toisen komponentin tilaa renderöinnin aikana, näet virheen. Ehto kuten `items !== prevItems` on tarpeen välttääksesi silmukoita. Voit säätää tilaa tällä tavalla, mutta kaikki muut sivuvaikutukset (kuten DOMin muuttaminen tai timeoutin asettaminen) tulisi pysyä tapahtumankäsittelijöissä tai Efekteissä [pitääksesi komponentit puhtaina.](/learn/keeping-components-pure)

**Vaikka tämä malli on tehokkaampi kuin Effect, useimpien komponenttien ei pitäisi tarvita sitäkään.** Riippumatta siitä, miten teet sen, tilan säätäminen propsien tai muiden tilojen pohjalta tekee datavirrasta vaikeampaa ymmärtää ja debugata. Tarkista aina, voitko [nollata kaiken tilan avaimella](#resetting-all-state-when-a-prop-changes) tai [laskea kaiken renderöinnin aikana](#updating-state-based-on-props-or-state) sen sijaan. Esimerkiksi, sen sijaan, että tallentaisit (ja nollaisit) valitun *kohteen*, voit tallentaa valitun *kohteen ID:n*:

```js {3-5}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // ✅ Laske kaikki renderöinnin aikana
  const selection = items.find(item => item.id === selectedId) ?? null;
  // ...
}
```

Nyt ei ole tarvetta "säätää" tilaa ollenkaan. Jos kohde valitulla ID:llä on listassa, se pysyy valittuna. Jos ei ole, renderöinnin aikana laskettu `selection` tulee olemaan `null` sillä yhtään vastaavaa kohdetta ei löytynyt. Tämä käyttäytyminen erilainen, mutta väitetysti parempi, koska useimmat muutokset `items`-propsissa säilyttävät valinnan.

### Logiikan jakaminen Tapahtumankäsittelijöiden kesken {/*sharing-logic-between-event-handlers*/}

Sanotaan, että sinulla on tuotesivu, jossa on kaksi painiketta (Osta ja Siirry kassalle), jotka molemmat antavat sinun ostaa tuotteen. Haluat näyttää ilmoituksen aina, kun käyttäjä laittaa tuotteen ostoskoriin. `showNotification()`-funktion kutsuminen molempien painikkeiden klikkaustapahtumankäsittelijöissä tuntuu toistuvalta, joten saatat tuntea houkutuksen laittaa tämä logiikka Efektiin:

```js {2-7}
function ProductPage({ product, addToCart }) {
  // 🔴 Vältä: Tapahtumakohtainen logiikka Effektissa
  useEffect(() => {
    if (product.isInCart) {
      showNotification(`Lisätty ${product.name} ostoskoriin!`);
    }
  }, [product]);

  function handleBuyClick() {
    addToCart(product);
  }

  function handleCheckoutClick() {
    addToCart(product);
    navigateTo('/checkout');
  }
  // ...
}
```

Tämä Effekti on turha. Se todennäköisesti tulee aiheuttamaan bugeja. Esimerkiksi, sanotaan, että sovelluksesi "muistaa" ostoskorin sivulatausten välillä. Jos lisäät tuotteen ostoskoriin kerran ja päivität sivua, ilmoitus tulee näkyviin uudestaan. Se tulee näkymään joka kerta, kun päivität tuotteen sivun. Tämä johtuu siitä, että `product.isInCart` on jo `true` sivun latauksessa, joten yllä oleva Effekti kutsuu `showNotification()`-funktiota.

**Kun et ole varma, pitäisikö koodin olla Effektissa vai tapahtumankäsittelijässä, kysy itseltäsi *miksi* tämä koodi täytyy ajaa. Käytä Effektejä vain koodille, joka täytyy ajaa *koska* komponentti näytettiin käyttäjälle.** Tässä esimerkissä ilmoituksen tulisi näkyä koska käyttäjä *painoi nappia*, ei koska sivu näytettiin! Poista Effekti ja laita jaettu logiikka funktioon, jota kutsutaan molemmista tapahtumankäsittelijöistä:

```js {2-6,9,13}
function ProductPage({ product, addToCart }) {
  // ✅ Tapahtumakohtainen logiikka kutsutaan tapahtumankäsittelijöistä
  function buyProduct() {
    addToCart(product);
    showNotification(`Lisätty ${product.name} ostoskoriin!`);
  }

  function handleBuyClick() {
    buyProduct();
  }

  function handleCheckoutClick() {
    buyProduct();
    navigateTo('/checkout');
  }
  // ...
}
```

Tämä sekä poistaa turhan Effektin sekä korjaa bugin.

### POST pyynnön lähettäminen {/*sending-a-post-request*/}

Tämä `Form` komponentti lähettää kahdenlaisia POST-pyyntöjä. Se lähettää analytiikkatapahtuman kun se renderöidään. Kun täytät lomakkeen ja painat Lähetä-nappia, se lähettää POST-pyynnön `/api/register`-päätepisteeseen:

```js {5-8,10-16}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Tämä logiikka tulisi suorittaa sillä komponentti näytettiin
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  // 🔴 Vältä: Tapahtumakohtainen logiikka Effektissa
  const [jsonToSubmit, setJsonToSubmit] = useState(null);
  useEffect(() => {
    if (jsonToSubmit !== null) {
      post('/api/register', jsonToSubmit);
    }
  }, [jsonToSubmit]);

  function handleSubmit(e) {
    e.preventDefault();
    setJsonToSubmit({ firstName, lastName });
  }
  // ...
}
```

Otetaan käyttöön sama kriteeri kuin edellisessä esimerkissä.

Analytiikka-POST-pyynnön tulisi pysyä Effektissa. Tämä johtuu siitä, että *syy* lähettää analytiikkatapahtuma on se, että lomake näytettiin. (Se tultaisiin suorittamaan kahdesti kehitysvaiheessa, mutta [katso täältä](/learn/synchronizing-with-effects#sending-analytics) miten hoitaa se.)

Kuitenkin, `/api/register` POST-pyyntö ei ole aiheutettu lomakkeen _näyttämisestä_. Haluat lähettää pyynnön vain yhteen tiettyyn aikaan: kun käyttäjä painaa nappia. Se tulisi tapahtua vain _tässä tiettynä vuorovaikutuksena_. Poista toinen Effekti ja siirrä POST-pyyntö tapahtumankäsittelijään:

```js {12-13}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Hyvä: Logiikka suoritetaan, koska komponentti näytettiin
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // ✅ Hyvä: Tapahtumakohtainen logiikka on Tapahtumankäsittelijässä
    post('/api/register', { firstName, lastName });
  }
  // ...
}
```

Kun valitset laitatko logiikan tapahtumankäsittelijään vai Effektiin, pääkysymys, johon sinun täytyy vastata on _minkä tyyppistä logiikkaa_ se on käyttäjän näkökulmasta. Jos tämä logiikka on aiheutettu tietystä vuorovaikutuksesta, pidä se tapahtumankäsittelijässä. Jos se on aiheutettu käyttäjän _näkemisestä_ komponentin ruudulla, pidä se Effektissä.

### Laskutoimitusten ketjutus {/*chains-of-computations*/}

Joskus saatat tuntea houkutuksen ketjuttaa Efektejä, jotka kumpikin säätävät tilaa toisen tilan pohjalta:

```js {7-29}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);

  // 🔴 Avoid: Chains of Effects that adjust the state solely to trigger each other
  useEffect(() => {
    if (card !== null && card.gold) {
      setGoldCardCount(c => c + 1);
    }
  }, [card]);

  useEffect(() => {
    if (goldCardCount > 3) {
      setRound(r => r + 1)
      setGoldCardCount(0);
    }
  }, [goldCardCount]);

  useEffect(() => {
    if (round > 5) {
      setIsGameOver(true);
    }
  }, [round]);

  useEffect(() => {
    alert('Good game!');
  }, [isGameOver]);

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    } else {
      setCard(nextCard);
    }
  }

  // ...
```

Tässä koodissa on kaksi ongelmaa.

<<<<<<< HEAD
Ensimmäinen ongelma on, että se on hyvin tehoton: komponentti (ja sen lapset) täytyy renderöidä uudelleen jokaisen `set`-kutsun välillä ketjussa. Yllä olevassa esimerkissä, pahimmassa tapauksessa (`setCard` → renderöi → `setGoldCardCount` → renderöi → `setRound` → renderöi → `setIsGameOver` → renderöi) on kolme tarpeetonta uudelleenrenderöintiä puussa.

Vaikka se ei olisi hidas, koodisi eläessä tulet törmäämään tilanteisiin, joissa "ketju" jonka kirjoitit, ei vastaa uusia vaatimuksia. Kuvittele, että olet lisäämässä tapaa selata pelin siirtohistoriaa. Tämä tehdään päivittämällä jokainen tilamuuttuja arvoon menneisyydestä. Kuitenkin, `card`-tilan asettaminen menneisyyden arvoon aiheuttaisi Efektiketjun uudelleen ja muuttaisi näytettävää dataa. Tällainen koodi on usein jäykkää ja haurasta.
=======
The first problem is that it is very inefficient: the component (and its children) have to re-render between each `set` call in the chain. In the example above, in the worst case (`setCard` → render → `setGoldCardCount` → render → `setRound` → render → `setIsGameOver` → render) there are three unnecessary re-renders of the tree below.

The second problem is that even if it weren't slow, as your code evolves, you will run into cases where the "chain" you wrote doesn't fit the new requirements. Imagine you are adding a way to step through the history of the game moves. You'd do it by updating each state variable to a value from the past. However, setting the `card` state to a value from the past would trigger the Effect chain again and change the data you're showing. Such code is often rigid and fragile.
>>>>>>> eb174dd932613fb0784a78ee2d9360554538cc08

Tässä tilanteessa on parempi laskea mitä voit renderöinnin aikana ja säätää tilaa tapahtumankäsittelijässä:

```js {6-7,14-26}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);

  // ✅ Lakse mitä voit renderöinnin aikana
  const isGameOver = round > 5;

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    }

    // ✅ Laske koko seuraava tila Tapahtumankäsittelijässä
    setCard(nextCard);
    if (nextCard.gold) {
      if (goldCardCount <= 3) {
        setGoldCardCount(goldCardCount + 1);
      } else {
        setGoldCardCount(0);
        setRound(round + 1);
        if (round === 5) {
          alert('Good game!');
        }
      }
    }
  }

  // ...
```

Tämä on paljon tehokkaampaa. Myöskin, jos toteutat tavan katsoa siirtohistoriaa, voit nyt asettaa jokaisen tilamuuttujan menneisyyden arvoon käynnistämättä Efektiketjua, joka säätää jokaista muuta arvoa. Jos tarvitset uudelleenkäytettävää logiikkaa useiden tapahtumankäsittelijöiden välillä, voit [irroittaa funktion](#sharing-logic-between-event-handlers) ja kutsua sitä näistä käsittelijöistä.

Muista, että tapahtumankäsittelijöissä tila käyttäytyy kuin tilannekuva. Esimerkiksi, vaikka kutsuisit `setRound(round + 1)`, `round`-muuttuja heijastaa arvoa siihen aikaan, kun käyttäjä painoi nappia. Jos tarvitset seuraavan arvon laskutoimituksiin, määrittele se manuaalisesti kuten `const nextRound = round + 1`.

Joissain tapauksissa, *et voi* laskea seuraavaa tilaa suoraan tapahtumankäsittelijässä. Esimerkiksi, kuvittele lomake, jossa on useita pudotusvalikoita, joiden seuraavat vaihtoehdot riippuvat edellisen pudotusvalikon valitusta arvosta. Tällöin Efektiketju on sopiva, koska synkronoit verkon kanssa.

### Sovelluksen alustaminen {/*initializing-the-application*/}

Osa logiikasta tulisi suorittaa kerran kun sovellus alustetaan.

Saatat tuntea houkutuksen laittaa se Effektiin pääkomponenttiin:

```js {2-6}
function App() {
  // 🔴 Vältä: Effektit logiikalla, joka tulisi suorittaa vain kerran
  useEffect(() => {
    loadDataFromLocalStorage();
    checkAuthToken();
  }, []);
  // ...
}
```

Kuitenkin, tulet nopeasti huomaamaan, että se [suoritetaan kahdesti kehitysvaiheessa.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) Tämä voi aiheuttaa ongelmia--esimerkiksi, se voi mitätöidä autentikointitokenin, koska funktio ei ollut suunniteltu kutsuttavaksi kahdesti. Yleisesti ottaen, komponenttiesi tulisi olla joustavia uudelleenmounttaukselle. Pääkomponenttisi mukaanlukien.

Vaikka sitä ei välttämättä koskaan uudelleenmountata käytännössä tuotannossa, samojen rajoitteiden noudattaminen kaikissa komponenteissa tekee koodin siirtämisestä ja uudelleenkäytöstä helpompaa. Jos jotain logiikkaa täytyy suorittaa *kerran sovelluksen latauksessa* sen sijaan, että se suoritettaisiin *kerran komponentin mounttauksessa*, lisää pääkomponenttiin muuttuja, joka seuraa onko se jo suoritettu:

```js {1,5-6,10}
let didInit = false;

function App() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      // ✅ Suoritetaan vain kerran sovelluksen alustuksessa
      loadDataFromLocalStorage();
      checkAuthToken();
    }
  }, []);
  // ...
}
```

Voit myös suorittaa sen moduulin alustuksen aikana ja ennen kuin sovellus renderöidään:

```js {1,5}
if (typeof window !== 'undefined') { // Tarkista, olemmeko selaimessa.
   // ✅ Suoritetaan vain kerran alustuksessa
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

Ylätasolla oleva koodi suoritetaan kerran kun komponenttisi importataan--vaikka sitä ei tultaisi renderöimään. Välttääksesi hidastumista tai yllättävää käytöstä importatessa satunnaisia komponentteja, älä käytä tätä mallia liikaa. Pidä sovelluksen laajuinen alustuslogiikka juurikomponenttimoduuleissa kuten `App.js` tai sovelluksesi sisäänkäynnissä.

### Tilamuutosten ilmoittaminen pääkomponentille {/*notifying-parent-components-about-state-changes*/}

Sanotaan, että olet kirjoittamassa `Toggle` komponenttia sisäisellä `isOn` tilalla, joka voi olla joko `true` tai `false`. On muutamia eri tapoja asettaa se (klikkaamalla tai raahaamalla). Haluat ilmoittaa pääkomponentille aina kun `Toggle`:n sisäinen tila muuttuu, joten paljastat `onChange` tapahtuman ja kutsut sitä Efektistä:

```js {4-7}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  // 🔴 Vältä: onChange käsittelijä suoritetaan myöhässä
  useEffect(() => {
    onChange(isOn);
  }, [isOn, onChange])

  function handleClick() {
    setIsOn(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      setIsOn(true);
    } else {
      setIsOn(false);
    }
  }

  // ...
}
```

Kuten aiemmin, tämä ei ole ihanteellista. `Toggle` päivittää tilansa ensin ja React päivittää näytön. Sitten React suorittaa Efektin, joka kutsuu `onChange` funktiota, joka on välitetty pääkomponentilta. Nyt pääkomponentti päivittää oman tilansa, aloittaen toisen renderöintikierroksen. Olisi parempi tehdä kaikki yhdellä kierroksella.

Poista Effekti ja päivitä sen sijaan *molempien* komponenttien tila samassa tapahtumankäsittelijässä:

```js {5-7,11,16,18}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  function updateToggle(nextIsOn) {
    // ✅ Hyvä: Suorita kaikki päivitykset tapahtuman aikana
    setIsOn(nextIsOn);
    onChange(nextIsOn);
  }

  function handleClick() {
    updateToggle(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      updateToggle(true);
    } else {
      updateToggle(false);
    }
  }

  // ...
}
```

Tällä lähestymistavalla sekä `Toggle` komponentti että sen pääkomponentti päivittävät tilansa tapahtuman aikana. React [pakkaa päivitykset](/learn/queueing-a-series-of-state-updates) eri komponenteista yhteen, joten renderöintikierroksia on vain yksi.

Saatat myös pystyä poistamaan tilan kokonaan ja vastaanottamaan `isOn` arvon pääkomponentilta:

```js {1,2}
// ✅ Myös hyvä: komponentti on täysin kontrolloitu sen pääkomponentin toimesta
function Toggle({ isOn, onChange }) {
  function handleClick() {
    onChange(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      onChange(true);
    } else {
      onChange(false);
    }
  }

  // ...
}
```

["Nostamalla tilan ylös"](/learn/sharing-state-between-components) voit täysin kontrolloida `Toggle`:n tilaa  pääkomponentista vaihtamalla pääkomponentin omaa tilaa. Tämä tarkoittaa, että pääkomponentin täytyy sisältää enemmän logiikkaa, mutta vähemmän tilaa yleisesti ottaen. Aina kun yrität pitää kaksi eri tilamuuttujaa synkronoituna, kokeile nostaa tila ylös sen sijaan!

### Tiedon välittäminen pääkomponentille {/*passing-data-to-the-parent*/}

Tämä `Child` komponentti hakee dataa ja välittää sen sitten `Parent` komponentille Efektissä:

```js {9-14}
function Parent() {
  const [data, setData] = useState(null);
  // ...
  return <Child onFetched={setData} />;
}

function Child({ onFetched }) {
  const data = useSomeAPI();
  // 🔴 Vältä: Välitetään dataa pääkomponenille Effektissa
  useEffect(() => {
    if (data) {
      onFetched(data);
    }
  }, [onFetched, data]);
  // ...
}
```

Reactissa data kulkee pääkomponentista sen alakomponenteille. Kun näet jotain väärin ruudulla, voit jäljittää mistä tiedot tulevat menemällä ylöspäin komponenttiketjussa kunnes löydät komponentin, joka välittää väärän propin tai jolla on väärä tila. Kun alakomponentit päivittävät pääkomponenttien tilaa Efekteissä, tiedon virtaus on hyvin vaikea jäljittää. Koska sekä alakomponentti että pääkomponentti tarvitsevat samat tiedot, anna pääkomponentin hakea tiedot ja *välitä ne* alakomponentille sen sijaan:

```js {4-5}
function Parent() {
  const data = useSomeAPI();
  // ...
  // ✅ Hyvä: Välitetään dataa alakomponentille
  return <Child data={data} />;
}

function Child({ data }) {
  // ...
}
```

Tämä on yksinkertaisempaa ja pitää datavirran ennustettavana: data virtaa alaspäin pääkomponentilta alakomponentille.

### Tilaaminen ulkoiseen varastoon {/*subscribing-to-an-external-store*/}

Joskus komponenttisi saattavat tarvita tilata dataa Reactin ulkopuolelta. Tämä data voisi olla kolmannen osapuolen kirjastosta tai selaimen sisäänrakennetusta API:sta. Koska tämä data voi muuttua Reactin tietämättä, sinun täytyy manuaalisesti tilata komponenttisi siihen. Tämä tehdään usein Efektillä, esimerkiksi:

```js {2-17}
function useOnlineStatus() {
  // Ei ideaali: Manuaalinen tietovaraston tilaus Efektissä
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function updateState() {
      setIsOnline(navigator.onLine);
    }

    updateState();

    window.addEventListener('online', updateState);
    window.addEventListener('offline', updateState);
    return () => {
      window.removeEventListener('online', updateState);
      window.removeEventListener('offline', updateState);
    };
  }, []);
  return isOnline;
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Tässä komponentti tilaa ulkoisen tietovaraston (tässä tapauksessa selaimen `navigator.onLine` APIn). Koska tätä APIa ei ole olemassa palvelimella (joten sitä ei voi käyttää alustavaan HTML:ään), alustetaan tila aluksi `true`:ksi. Aina kun tietovaraston arvo muuttuu selaimessa, komponentti päivittää tilansa.

Vaikka on yleistä käyttää Effektia tähän, React sisältää tietovaraston tilaukseen tarkoitukseen tehdyn Hookin, jota suositellaan sen sijaan. Poista Efekti ja korvaa se [`useSyncExternalStore`](/reference/react/useSyncExternalStore) kutsulla:

```js {11-16}
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);

  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function useOnlineStatus() {
  // ✅ Hyvä: Tilataan ulkoinen varasto Reactin sisäänrakennetulla Hookilla
  return useSyncExternalStore(
    subscribe, // React ei tilaa uudelleen niin kauan kuin välität saman funktion
    () => navigator.onLine, // Miten arvo haetaan selaimella
    () => true // Miten arvo haetaan palvelimella
  );
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Tämä lähestymistapa on vähemmän virhealtis kuin muuttuvan datan manuaalinen synkronointi Reactin tilaan Efektillä. Yleensä kirjoitat oman Hookin kuten `useOnlineStatus()` yllä, jotta sinun ei tarvitse toistaa tätä koodia yksittäisissä komponenteissa. [Lue lisää ulkoisten varastojen tilaamisesta React komponenteista.](/reference/react/useSyncExternalStore)

### Tiedon haku {/*fetching-data*/}

Moni sovellus käyttää effekteja datan hakemiseen. On hyvin yleistä kirjoittaa datan hakemiseen tarkoitettu efekti näin:

```js {5-10}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // 🔴 Vältä: Tiedon hakeminen ilman siivouslogiikkaa
    fetchResults(query, page).then(json => {
      setResults(json);
    });
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

Sinun *ei* tarvitse siirtää tätä hakua tapahtumankäsittelijään.

Tämä saattaa kuulostaa ristiriitaiselta edellisten esimerkkien kanssa, jossa sinun täytyi asettaa logiikka Tapahtumankäsittelijöihin! Kuitenkin, harkitse, että *kirjoitustapahtuma* ei ole itse pääsyy hakemiseen. Hakusyötteet ovat usein esitäytetty URL:stä, ja käyttäjä saattaa navigoida takaisin ja eteenpäin ilman että koskee syötteeseen.

Ei ole väliä mistä `page` ja `query` tulevat. Vaikka tämä komponentti on näkyvissä, saatat haluta pitää `results` tilan [synkronoituna](/learn/synchronizing-with-effects) verkon datan kanssa nykyiselle `page`lle ja `querylle`. Tämän takia se on Efekti.

Kuitenkin, yllä olevassa koodissa on bugi. Kuvittele, että kirjoitat `"moikka"` todella nopeasti. Sitten `query` muuttuu ensin `"m"`, josta `"mo"`, `"moi"`, `"moik"`, `"moikk"`, and `"moikka"`. Tämä käynnistää useita hakuja, muta ei ole takuita siitä missä järjestyksessä vastaukset tulevat. Esimerkiksi, `"moik"` vastaus saattaa saapua `"moikka"` vastauksen jälkeen. Koska se kutsuu lopuksi `setResults()`:a, väärät hakutulokset tulevat näkyviin. Tätä kutsutaan englanniksi ["race condition"](https://en.wikipedia.org/wiki/Race_condition): kaksi eri pyyntöä "kilpailivat" toisiaan vastaan ja tulivat eri järjestyksessä kuin odotit.

**Korjataksesi race conditioniin, sinun täytyy [lisätä siivousfunktio](/learn/synchronizing-with-effects#fetching-data), joka jättää huomiotta vanhentuneet vastaukset:**

```js {5,7,9,11-13}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    let ignore = false;
    fetchResults(query, page).then(json => {
      if (!ignore) {
        setResults(json);
      }
    });
    return () => {
      ignore = true;
    };
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

Tämä varmistaa, että kun Efekti hakee dataa, kaikki vastaukset paitsi viimeisin pyydetty jätetään huomiotta.

Race conditionien käsitteleminen ei ole ainoa vaikeus datan hakemisessa. Saatat myös haluta miettiä vastausten välimuistitusta (jotta käyttäjä voi klikata takaisin ja nähdä edellisen näytön välittömästi), miten hakea dataa palvelimella (jotta alustava palvelimella renderöity HTML sisältää haetun sisällön sen sijaan että näyttäisi latausikonia), ja miten välttää verkon vesiputoukset (jotta alakomponentti voi hakea dataa ilman että odottaa jokaista vanhempaa).

**Nämä ongelmat pätevät mihin tahansa käyttöliittymäkirjastoon, ei vain Reactiin. Niiden ratkaiseminen ei ole triviaalia, minkä takia modernit [ohjelmistokehykset](/learn/start-a-new-react-project#production-grade-react-frameworks) tarjoavat tehokkaampia sisäänrakennettuja datan hakumekanismeja kuin datan hakeminen effekteissä.**

Jos et käytä ohjelmistokehitystä (ja et halua rakentaa omaasi), mutta haluat tehdä datan hakemisesta effekteistä ergonomisempaa, harkitse hakulogiiikan eristämistä omaksi Hookiksi kuten tässä esimerkissä:

```js {4}
function SearchResults({ query }) {
  const [page, setPage] = useState(1);
  const params = new URLSearchParams({ query, page });
  const results = useData(`/api/search?${params}`);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}

function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setData(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [url]);
  return data;
}
```

Todennäköisesti haluat myös lisätä logiikkaa virheiden käsittelyyn ja seurata onko sisältö latautumassa. Voit rakentaa Hookin kuten tämän itse tai käyttää yhtä monista ratkaisuista, jotka ovat jo saatavilla React-ekosysteemissä. **Vaikka tämä yksinään ei ole yhtä tehokas kuin ohjelmistokehyksen sisäänrakennettu datan hakumekanismi, datan hakulogiikan siirtäminen omaan Hookiin tekee tehokkaan datan hakustrategian käyttöönotosta helpompaa myöhemmin.**

Yleisesti ottaen aina kun joudut turvautumaan Efektien kirjoittamiseen, pidä silmällä milloin voit eristää toiminnallisuuden omaksi Hookiksi, jolla on deklaratiivisempi ja tarkoitukseen sopivampi API kuten `useData` yllä. Mitä vähemmän raakoja `useEffect`-kutsuja sinulla on komponenteissasi, sitä helpompaa sinun on ylläpitää sovellustasi.

<Recap>

- Jos voit laskea jotain renderöinnin aikana, et tarvitse Efektiä.
- Välimuistittaaksesi kalliit laskelmat, lisää `useMemo` `useEffect`n sijaan.
- Nollataksesi kokonaisen komponenttipuun tilan, välitä eri `key` propsi komponentille.
- Nollataksesi tilan propsin muutoksen jälkeen, aseta se renderöinnin aikana.
- Koodi joka suoritetaan koska komponentti *näytetään* tulisi olla Efekteissä, muu koodi tapahtumissa.
- Jos sinun täytyy päivittää useamman kuin yhden komponentin tila, on parempi tehdä se yhden tapahtuman aikana.
- Aina kun sinun täytyy synkronoida tila useiden komponenttien välillä, harkitse tilan nostamista ylös.
- Voit hakea dataa Effekteissa, mutta sinun täytyy toteuttaa siivousfuktio välttääksesi kilpailutilanteet.

</Recap>

<Challenges>

#### Muunna dataa ilman Effektejä {/*transform-data-without-effects*/}

`TodoList` komponentti alla näyttää listan tehtävistä. Kun "Show only active todos" valintaruutu on valittuna, valmiita tehtäviä ei näytetä listassa. Riippumatta siitä mitkä tehtävät ovat näkyvissä, alatunniste näyttää tehtävien määrän, jotka eivät ole vielä valmiita.

Yksinkertaista tämä komponentti poistamalla turha tila ja Effektit.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [activeTodos, setActiveTodos] = useState([]);
  const [visibleTodos, setVisibleTodos] = useState([]);
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    setActiveTodos(todos.filter(todo => !todo.completed));
  }, [todos]);

  useEffect(() => {
    setVisibleTodos(showActive ? activeTodos : todos);
  }, [showActive, todos, activeTodos]);

  useEffect(() => {
    setFooter(
      <footer>
        {activeTodos.length} todos left
      </footer>
    );
  }, [activeTodos]);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      {footer}
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Hint>

Jos voit laskea jotain renderöinnin aikana, et tarvitse tilaa taikka Effektia joka päivittää sitä.

</Hint>

<Solution>

On kaksi olennaista tilamuuttujaa tässä esimerkissä: `todos`-lista ja `showActive`-tilamuuttuja, joka edustaa onko valintaruutu valittuna. Kaikki muut tilamuuttujat ovat [turhia](/learn/choosing-the-state-structure#avoid-redundant-state) ja voidaan laskea renderöinnin aikana. Tähän sisältyy `footer`, jonka voit siirtää suoraan ympäröivään JSX:ään.

Lopputuloksen tulisi näyttää tältä:

<Sandpack>

```js
import { useState } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      <footer>
        {activeTodos.length} todos left
      </footer>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

</Solution>

#### Välimuistita laskelma ilman Effektejä {/*cache-a-calculation-without-effects*/}

Tässä esimerkissä, tehtävälistan suodattaminen on erotettu omaksi funktiokseen nimeltä `getVisibleTodos()`. Tämä funktio sisältää `console.log()` kutsun sisällään, jonka avulla huomaat milloin sitä kutsutaan. Kytke "Show only active todos" päälle ja huomaa, että se aiheuttaa `getVisibleTodos()` funktion uudelleen suorittamisen. Tämä on odotettua, koska näkyvät tehtävät muuttuvat kun vaihdat mitkä näytetään.

Tehtäväsi on poistaa Effekti joka uudelleenlaskee `visibleTodos` taulukon `TodosList` komponentissa. Sinun täytyy kuitenkin varmistaa, että `getVisibleTodos()` fuktiota *ei suoriteta* uudelleen (ja siten ei tulosta yhtään lokia) kun kirjoitat syötteeseen.

<Hint>

Yksi ratkaisu on lisätä `useMemo` kutsu välimuistittaaksesi näkyvät tehtävät. On myös toinen, vähemmän itsestään selvä ratkaisu.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const [visibleTodos, setVisibleTodos] = useState([]);

  useEffect(() => {
    setVisibleTodos(getVisibleTodos(todos, showActive));
  }, [todos, showActive]);

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Solution>

Poista tilamuuttuja ja Efekti, ja lisää sen sijaan `useMemo` kutsu välimuistittaaksesi `getVisibleTodos()` kutsun tuloksen:

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, showActive),
    [todos, showActive]
  );

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

Tällä muutoksella, `getVisibleTodos()` kutsutaan vain jos `todos` tai `showActive` muuttuu. Kirjoittaminen syötteeseen muuttaa vain `text` tilamuuttujaa, joten se ei aiheuta `getVisibleTodos()` kutsua.

On myös toinen ratkaisu joka ei tarvitse `useMemo`:a. Koska `text` tilamuuttuja ei voi vaikuttaa tehtävälistaan, voit eristää `NewTodo` lomakkeen omaan komponenttiin ja siirtää `text` tilamuuttujan sen sisälle:

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const visibleTodos = getVisibleTodos(todos, showActive);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

Tämä lähestymistapa täyttää vaatimukset. Kun kirjoitat syötteeseen, vain `text` tilamuuttuja päivittyy. Koska `text` tilamuuttuja on lapsi `NewTodo` komponentissa, vanhempi `TodoList` komponentti ei uudelleenrenderöidy. Tämän takia `getVisibleTodos()` funktiota ei kutsuta kun kirjoitat. (Se kutsuttaisiin jos `TodoList` uudelleenrenderöityisi jostain muusta syystä.)

</Solution>

#### Nollaa tila ilman Efektia {/*reset-state-without-effects*/}

Tämä `EditContact` komponentti vastaanottaa yhteystieto-olion muodoltaan `{ id, name, email }` `savedContact` propina. Kokeile muokata nimeä ja sähköpostia. Kun painat Save, yhteystiedon nappi yläpuolella päivittyy muokatun nimen mukaiseksi. Kun painat Nollaa, kaikki lomakkeen muutokset hylätään. Kokeile tätä käyttöliittymää saadaksesi tuntuman siihen.

Kun valitset yhteystiedon yläpuolella olevilla napeilla, lomake nollataan vastaamaan valitun yhteystiedon tietoja. Tämä tehdään Efektillä `EditContact.js` tiedostossa. Poista tämä Efekti. Etsi toinen tapa nollata lomake kun `savedContact.id` muuttuu.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js active
import { useState, useEffect } from 'react';

export default function EditContact({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  useEffect(() => {
    setName(savedContact.name);
    setEmail(savedContact.email);
  }, [savedContact]);

  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Hint>

Olisi kiva jos olisi tapa kertoa Reactille että kun `savedContact.id` on eri, `EditContact` lomake on käsitteellisesti _eri yhteystiedon lomake_ ja sen ei pitäisi säilyttää tilaa. Muistatko tällaisen tavan?

</Hint>

<Solution>

Jaa `EditContact` komponentti kahteen. Siirrä kaikki lomakkeen tila sisäiseen `EditForm` komponenttiin. Vie ulompi `EditContact` komponentti ja välittää `savedContact.id` sisäiselle `EditForm` komponentille `key` propsina. Tämän seurauksena sisäinen `EditForm` komponentti nollaa koko lomakkeen tilan ja luo uuden DOMin aina kun valitset eri yhteystiedon.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js active
import { useState } from 'react';

export default function EditContact(props) {
  return (
    <EditForm
      {...props}
      key={props.savedContact.id}
    />
  );
}

function EditForm({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### Lähetä lomake ilman Efektia {/*submit-a-form-without-effects*/}

Tällä `Form` komponentilla voit lähettää viestin ystävälle. Kun lähetät lomakkeen, `showForm` tilamuuttuja on arvoltaan `false`. Tämä käynnistää Efektin `sendMessage(message)`, joka lähettää viestin (voit nähdä sen konsolissa). Viestin lähettämisen jälkeen näet "Kiitos" dialogin "Avaa chat" napilla, joka vie sinut takaisin lomakkeeseen.

Sovelluksesi käyttäjät lähettävät liikaa viestejä. Tehdäksesi viestittelystä hieman hankalempaa, olet päättänyt näyttää "Thank you" viestin *ensin* lomakkeen sijaan. Muuta `showForm` tilamuuttujan alkuarvoksi `false` sen sijaan että se olisi `true`. Heti kun teet tämän muutoksen, konsoli näyttää että tyhjä viesti lähetettiin. Jokin tässä logiikassa on väärin!

Mikä on tämän ongelman juurisyy? Ja miten voit korjata sen?

<Hint>

Pitäisikö viestin lähteä _koska_ käyttäjä näki "Kiitos" dialogin? Vai onko se toisin päin?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!showForm) {
      sendMessage(message);
    }
  }, [showForm, message]);

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Send
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Sending message: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Solution>

`showForm` tilamuuttuja määrittää näytetäänkö lomake vai "Kiitos" dialogi. Kuitenkaan et lähetä viestiä koska "Kiitos" dialogi _näytettiin_. Haluat lähettää viestin koska käyttäjä on _lähettänyt lomakkeen_. Poista harhaanjohtava Efekti ja siirrä `sendMessage` kutsu `handleSubmit` tapahtumankäsittelijään:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
    sendMessage(message);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Send
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Sending message: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

Huomaa miten tässä versiossa, vain _lomakkeen lähettäminen_ (joka on tapahtuma) aiheuttaa viestin lähettämisen. Se toimii yhtä hyvin riippumatta siitä onko `showForm` alkuarvo `true` vai `false`. (Aseta se `false` ja huomaa ettei ylimääräisiä konsoli viestejä tule.)

</Solution>

</Challenges>
