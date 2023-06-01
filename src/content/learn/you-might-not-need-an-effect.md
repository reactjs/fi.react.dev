---
title: Et ehkä tarvitse Effectia
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

### Logiikan jakaminen tapahtumakäsittelijöiden kesken {/*sharing-logic-between-event-handlers*/}

Sanotaan, että sinulla on tuotesivu, jossa on kaksi painiketta (Osta ja Siirry kassalle), jotka molemmat antavat sinun ostaa tuotteen. Haluat näyttää ilmoituksen aina, kun käyttäjä laittaa tuotteen ostoskoriin. `showNotification()`-funktion kutsuminen molempien painikkeiden klikkaustapahtumankäsittelijöissä tuntuu toistuvalta, joten saatat tuntea houkutuksen laittaa tämä logiikka Effectiin:

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
    // ✅ Hyvä: Tapahtumakohtainen logiikka on tapahtumakäsittelijässä
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

Ensimmäinen ongelma on, että se on hyvin tehoton: komponentti (ja sen lapset) täytyy renderöidä uudelleen jokaisen `set`-kutsun välillä ketjussa. Yllä olevassa esimerkissä, pahimmassa tapauksessa (`setCard` → renderöi → `setGoldCardCount` → renderöi → `setRound` → renderöi → `setIsGameOver` → renderöi) on kolme tarpeetonta uudelleenrenderöintiä puussa.

Vaikka se ei olisi hidas, koodisi eläessä tulet törmäämään tilanteisiin, joissa "ketju" jonka kirjoitit, ei vastaa uusia vaatimuksia. Kuvittele, että olet lisäämässä tapaa selata pelin siirtohistoriaa. Tämä tehdään päivittämällä jokainen tilamuuttuja arvoon menneisyydestä. Kuitenkin, `card`-tilan asettaminen menneisyyden arvoon aiheuttaisi Efektiketjun uudelleen ja muuttaisi näytettävää dataa. Tällainen koodi on usein jäykkää ja haurasta.

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

    // ✅ Laske koko seuraava tila tapahtumakäsittelijässä
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

Joissain tapauksissa, *et voi* laskea seuraavaa tilaa suoraan tapahtumankäsittelijässä. Esimerkiksi, kuvittele lomake, jossa on useita alasvetovalikoita, joiden seuraavat vaihtoehdot riippuvat edellisen alasvetovalikon valitusta arvosta. Tällöin Efektiketju on sopiva, koska synkronoit verkon kanssa.

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

Let's say you're writing a `Toggle` component with an internal `isOn` state which can be either `true` or `false`. There are a few different ways to toggle it (by clicking or dragging). You want to notify the parent component whenever the `Toggle` internal state changes, so you expose an `onChange` event and call it from an Effect:

```js {4-7}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  // 🔴 Avoid: The onChange handler runs too late
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

Like earlier, this is not ideal. The `Toggle` updates its state first, and React updates the screen. Then React runs the Effect, which calls the `onChange` function passed from a parent component. Now the parent component will update its own state, starting another render pass. It would be better to do everything in a single pass.

Delete the Effect and instead update the state of *both* components within the same event handler:

```js {5-7,11,16,18}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  function updateToggle(nextIsOn) {
    // ✅ Good: Perform all updates during the event that caused them
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

With this approach, both the `Toggle` component and its parent component update their state during the event. React [batches updates](/learn/queueing-a-series-of-state-updates) from different components together, so there will only be one render pass.

You might also be able to remove the state altogether, and instead receive `isOn` from the parent component:

```js {1,2}
// ✅ Also good: the component is fully controlled by its parent
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

["Lifting state up"](/learn/sharing-state-between-components) lets the parent component fully control the `Toggle` by toggling the parent's own state. This means the parent component will have to contain more logic, but there will be less state overall to worry about. Whenever you try to keep two different state variables synchronized, try lifting state up instead!

### Tiedon välittäminen pääkomponentille {/*passing-data-to-the-parent*/}

This `Child` component fetches some data and then passes it to the `Parent` component in an Effect:

```js {9-14}
function Parent() {
  const [data, setData] = useState(null);
  // ...
  return <Child onFetched={setData} />;
}

function Child({ onFetched }) {
  const data = useSomeAPI();
  // 🔴 Avoid: Passing data to the parent in an Effect
  useEffect(() => {
    if (data) {
      onFetched(data);
    }
  }, [onFetched, data]);
  // ...
}
```

In React, data flows from the parent components to their children. When you see something wrong on the screen, you can trace where the information comes from by going up the component chain until you find which component passes the wrong prop or has the wrong state. When child components update the state of their parent components in Effects, the data flow becomes very difficult to trace. Since both the child and the parent need the same data, let the parent component fetch that data, and *pass it down* to the child instead:

```js {4-5}
function Parent() {
  const data = useSomeAPI();
  // ...
  // ✅ Good: Passing data down to the child
  return <Child data={data} />;
}

function Child({ data }) {
  // ...
}
```

This is simpler and keeps the data flow predictable: the data flows down from the parent to the child.

### Tilaaminen ulkoiseen varastoon {/*subscribing-to-an-external-store*/}

Sometimes, your components may need to subscribe to some data outside of the React state. This data could be from a third-party library or a built-in browser API. Since this data can change without React's knowledge, you need to manually subscribe your components to it. This is often done with an Effect, for example:

```js {2-17}
function useOnlineStatus() {
  // Not ideal: Manual store subscription in an Effect
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

Here, the component subscribes to an external data store (in this case, the browser `navigator.onLine` API). Since this API does not exist on the server (so it can't be used for the initial HTML), initially the state is set to `true`. Whenever the value of that data store changes in the browser, the component updates its state.

Although it's common to use Effects for this, React has a purpose-built Hook for subscribing to an external store that is preferred instead. Delete the Effect and replace it with a call to [`useSyncExternalStore`](/reference/react/useSyncExternalStore):

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
  // ✅ Good: Subscribing to an external store with a built-in Hook
  return useSyncExternalStore(
    subscribe, // React won't resubscribe for as long as you pass the same function
    () => navigator.onLine, // How to get the value on the client
    () => true // How to get the value on the server
  );
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

This approach is less error-prone than manually syncing mutable data to React state with an Effect. Typically, you'll write a custom Hook like `useOnlineStatus()` above so that you don't need to repeat this code in the individual components. [Read more about subscribing to external stores from React components.](/reference/react/useSyncExternalStore)

### Tiedon haku {/*fetching-data*/}

Many apps use Effects to kick off data fetching. It is quite common to write a data fetching Effect like this:

```js {5-10}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // 🔴 Avoid: Fetching without cleanup logic
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

You *don't* need to move this fetch to an event handler.

This might seem like a contradiction with the earlier examples where you needed to put the logic into the event handlers! However, consider that it's not *the typing event* that's the main reason to fetch. Search inputs are often prepopulated from the URL, and the user might navigate Back and Forward without touching the input.

It doesn't matter where `page` and `query` come from. While this component is visible, you want to keep `results` [synchronized](/learn/synchronizing-with-effects) with data from the network for the current `page` and `query`. This is why it's an Effect.

However, the code above has a bug. Imagine you type `"hello"` fast. Then the `query` will change from `"h"`, to `"he"`, `"hel"`, `"hell"`, and `"hello"`. This will kick off separate fetches, but there is no guarantee about which order the responses will arrive in. For example, the `"hell"` response may arrive *after* the `"hello"` response. Since it will call `setResults()` last, you will be displaying the wrong search results. This is called a ["race condition"](https://en.wikipedia.org/wiki/Race_condition): two different requests "raced" against each other and came in a different order than you expected.

**To fix the race condition, you need to [add a cleanup function](/learn/synchronizing-with-effects#fetching-data) to ignore stale responses:**

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

This ensures that when your Effect fetches data, all responses except the last requested one will be ignored.

Handling race conditions is not the only difficulty with implementing data fetching. You might also want to think about caching responses (so that the user can click Back and see the previous screen instantly), how to fetch data on the server (so that the initial server-rendered HTML contains the fetched content instead of a spinner), and how to avoid network waterfalls (so that a child can fetch data without waiting for every parent).

**These issues apply to any UI library, not just React. Solving them is not trivial, which is why modern [frameworks](/learn/start-a-new-react-project#production-grade-react-frameworks) provide more efficient built-in data fetching mechanisms than fetching data in Effects.**

If you don't use a framework (and don't want to build your own) but would like to make data fetching from Effects more ergonomic, consider extracting your fetching logic into a custom Hook like in this example:

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

You'll likely also want to add some logic for error handling and to track whether the content is loading. You can build a Hook like this yourself or use one of the many solutions already available in the React ecosystem. **Although this alone won't be as efficient as using a framework's built-in data fetching mechanism, moving the data fetching logic into a custom Hook will make it easier to adopt an efficient data fetching strategy later.**

In general, whenever you have to resort to writing Effects, keep an eye out for when you can extract a piece of functionality into a custom Hook with a more declarative and purpose-built API like `useData` above. The fewer raw `useEffect` calls you have in your components, the easier you will find to maintain your application.

<Recap>

- If you can calculate something during render, you don't need an Effect.
- To cache expensive calculations, add `useMemo` instead of `useEffect`.
- To reset the state of an entire component tree, pass a different `key` to it.
- To reset a particular bit of state in response to a prop change, set it during rendering.
- Code that runs because a component was *displayed* should be in Effects, the rest should be in events.
- If you need to update the state of several components, it's better to do it during a single event.
- Whenever you try to synchronize state variables in different components, consider lifting state up.
- You can fetch data with Effects, but you need to implement cleanup to avoid race conditions.

</Recap>

<Challenges>

#### Transform data without Effects {/*transform-data-without-effects*/}

The `TodoList` below displays a list of todos. When the "Show only active todos" checkbox is ticked, completed todos are not displayed in the list. Regardless of which todos are visible, the footer displays the count of todos that are not yet completed.

Simplify this component by removing all the unnecessary state and Effects.

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

```js todos.js
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

If you can calculate something during rendering, you don't need state or an Effect that updates it.

</Hint>

<Solution>

There are only two essential pieces of state in this example: the list of `todos` and the `showActive` state variable which represents whether the checkbox is ticked. All of the other state variables are [redundant](/learn/choosing-the-state-structure#avoid-redundant-state) and can be calculated during rendering instead. This includes the `footer` which you can move directly into the surrounding JSX.

Your result should end up looking like this:

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

```js todos.js
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

#### Cache a calculation without Effects {/*cache-a-calculation-without-effects*/}

In this example, filtering the todos was extracted into a separate function called `getVisibleTodos()`. This function contains a `console.log()` call inside of it which helps you notice when it's being called. Toggle "Show only active todos" and notice that it causes `getVisibleTodos()` to re-run. This is expected because visible todos change when you toggle which ones to display.

Your task is to remove the Effect that recomputes the `visibleTodos` list in the `TodoList` component. However, you need to make sure that `getVisibleTodos()` does *not* re-run (and so does not print any logs) when you type into the input.

<Hint>

One solution is to add a `useMemo` call to cache the visible todos. There is also another, less obvious solution.

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

```js todos.js
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

Remove the state variable and the Effect, and instead add a `useMemo` call to cache the result of calling `getVisibleTodos()`:

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

```js todos.js
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

With this change, `getVisibleTodos()` will be called only if `todos` or `showActive` change. Typing into the input only changes the `text` state variable, so it does not trigger a call to `getVisibleTodos()`.

There is also another solution which does not need `useMemo`. Since the `text` state variable can't possibly affect the list of todos, you can extract the `NewTodo` form into a separate component, and move the `text` state variable inside of it:

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

```js todos.js
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

This approach satisfies the requirements too. When you type into the input, only the `text` state variable updates. Since the `text` state variable is in the child `NewTodo` component, the parent `TodoList` component won't get re-rendered. This is why `getVisibleTodos()` doesn't get called when you type. (It would still be called if the `TodoList` re-renders for another reason.)

</Solution>

#### Reset state without Effects {/*reset-state-without-effects*/}

This `EditContact` component receives a contact object shaped like `{ id, name, email }` as the `savedContact` prop. Try editing the name and email input fields. When you press Save, the contact's button above the form updates to the edited name. When you press Reset, any pending changes in the form are discarded. Play around with this UI to get a feel for it.

When you select a contact with the buttons at the top, the form resets to reflect that contact's details. This is done with an Effect inside `EditContact.js`. Remove this Effect. Find another way to reset the form when `savedContact.id` changes.

<Sandpack>

```js App.js hidden
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

```js ContactList.js hidden
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

```js EditContact.js active
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

It would be nice if there was a way to tell React that when `savedContact.id` is different, the `EditContact` form is conceptually a _different contact's form_ and should not preserve state. Do you recall any such way?

</Hint>

<Solution>

Split the `EditContact` component in two. Move all the form state into the inner `EditForm` component. Export the outer `EditContact` component, and make it pass `savedContact.id` as the `key` to the inner `EditContact` component. As a result, the inner `EditForm` component resets all of the form state and recreates the DOM whenever you select a different contact.

<Sandpack>

```js App.js hidden
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

```js ContactList.js hidden
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

```js EditContact.js active
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

#### Submit a form without Effects {/*submit-a-form-without-effects*/}

This `Form` component lets you send a message to a friend. When you submit the form, the `showForm` state variable is set to `false`. This triggers an Effect calling `sendMessage(message)`, which sends the message (you can see it in the console). After the message is sent, you see a "Thank you" dialog with an "Open chat" button that lets you get back to the form.

Your app's users are sending way too many messages. To make chatting a little bit more difficult, you've decided to show the "Thank you" dialog *first* rather than the form. Change the `showForm` state variable to initialize to `false` instead of `true`. As soon as you make that change, the console will show that an empty message was sent. Something in this logic is wrong!

What's the root cause of this problem? And how can you fix it?

<Hint>

Should the message be sent _because_ the user saw the "Thank you" dialog? Or is it the other way around?

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

The `showForm` state variable determines whether to show the form or the "Thank you" dialog. However, you aren't sending the message because the "Thank you" dialog was _displayed_. You want to send the message because the user has _submitted the form._ Delete the misleading Effect and move the `sendMessage` call inside the `handleSubmit` event handler:

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

Notice how in this version, only _submitting the form_ (which is an event) causes the message to be sent. It works equally well regardless of whether `showForm` is initially set to `true` or `false`. (Set it to `false` and notice no extra console messages.)

</Solution>

</Challenges>
