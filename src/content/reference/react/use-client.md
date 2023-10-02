---
title: "'use client'"
canary: true
---

<Canary>

`'use client'` tavitaan vain jos [käytät Reactin palvelinkomponentteja](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) tai rakennat niiden kanssa yhteensopivia kirjastoja.
</Canary>


<Intro>

`'use client'` merkitsee tiedostoja, joiden komponentit suoritetaan asiakaspuolella.

</Intro>

<InlineToc />

---

## Viite {/*reference*/}

### `'use client'` {/*use-client*/}

Lisää `'use client';` tiedoston alkuun merkitsemään, että tiedosto (mukaan lukien kaikki sen käyttämät alikomponentit) suoritetaan asiakaspuolella, riippumatta siitä, missä se on tuotu.

```js
'use client';

import { useState } from 'react';

export default function RichTextEditor(props) {
  // ...
```

Kun `'use client'`:lla merkitty tiedosto tuodaan palvelinkomponentista, [yhteensopivat paketinhallintajärjestelmät](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) käsittelevät tuonnin "katkaisupisteenä" palvelinpuolen ja asiakaspuolen koodin välillä. Tästä pisteestä alaspäin olevat komponentit voivat käyttää vain asiakaspuolen React-ominaisuuksia, kuten [`useState`](/reference/react/useState).

#### Rajoitukset {/*caveats*/}

* `'use client'`:a ei ole tarpeen lisätä jokaiseen tiedostoon, joka käyttää asiakaspuolen React-ominaisuuksia, ainoastaan tiedostoihin, jotka tuodaan palvelinkomponenttitiedostoissa. `'use client'` merkitsee palvelin- ja asiakaspuolen koodin välistä _rajaa_; kaikki komponentit, jotka ovat alempana puussa, suoritetaan automaattisesti asiakaspuolella. Jotta niitä voitaisiin renderöidä palvelinkomponenteista, `'use client'`-tiedostoista tuoduilla komponenteilla on oltava serialisoitavat propsit.
* Kun `'use client'`-tiedosto tuodaan palvelintiedostosta, tuodut arvot voidaan renderöidä React-komponenttina tai välittää propsina asiakaspuolen komponentille. Muu käyttö heittää poikkeuksen.
* Kun `'use client'` tiedosto tuodaan toisesta asiakaspuolen tiedostosta, direktiivillä ei ole vaikutusta. Tämä mahdollistaa asiakaspuolen komponenttien kirjoittamisen, jotka ovat samanaikaisesti käytettävissä palvelin- ja asiakaspuolen komponenteista.
* Kaikki koodi `'use client'` tiedostossa ja kaikki moduulit, joita se tukee (suoraan tai epäsuorasti), tulevat osaksi asiakaspuolen moduuligraafia ja ne on lähetettävä ja suoritettava asiakkaalla, jotta ne voidaan renderöidä selaimessa. Asiakaspuolen pakettikokojen pienentämiseksi ja palvelimen täyden potentiaalin hyödyntämiseksi siirrä tila (ja `'use client'`-direktiivit) mahdollisuuksien mukaan alemmas puussa ja välitä renderöidyt palvelinkomponentit [lapsina](/learn/passing-props-to-a-component#passing-jsx-as-children) asiakaspuolen komponenteille.
* Koska propsit serialisoidaan palvelin-asiakaspuolen rajapinnan yli, huomaa, että näiden direktiivien sijoittelu voi vaikuttaa asiakkaalle lähetettävän datan määrään; vältä tarpeettoman suuria datarakenteita.
* Komponentit kuten `<MarkdownRenderer>`, jotka eivät käytä palvelin- tai asiakaspuolen ominaisuuksia, eivät yleensä tarvitse `'use client'`-merkintää. Tällöin ne voidaan renderöidä yksinomaan palvelimella, kun niitä käytetään palvelinkomponentista, mutta ne lisätään asiakaspuolen pakettiin, kun niitä käytetään asiakaspuolen komponentista.
* npm:ään julkaistujen kirjastojen tulisi sisältää `'use client'`-merkintä niille React-komponenteille, jotka voidaan renderöidä serialisoitavilla propsilla, jotka käyttävät vain asiakaspuolen React-ominaisuuksia, jotta nämä komponentit voidaan tuoda ja renderöidä palvelinkomponenteista. Muuten käyttäjien on käärittävä kirjaston komponentit omiin `'use client'`-tiedostoihinsa, mikä voi olla hankalaa ja estää kirjastoa siirtämästä logiikkaa palvelimelle myöhemmin. Kun julkaiset esikäännetyt tiedostot npm:ään, varmista, että `'use client'`-lähdetiedostot päätyvät bundleen, joka on merkitty `'use client'`:lla, erillään mistään bundlesta, joka sisältää suoraan palvelimella käytettäviä exportteja.
* Asiakaspuolen komponentit suoritetaan silti osana palvelinpuolen renderöintiä (SSR) tai build-vaiheen staattisen sivun generointia (SSG), joka toimii asiakkaana muuttaakseen React-komponenttien alustavan renderöinnin HTML:ksi, joka voidaan renderöidä ennen kuin JavaScript-paketit on ladattu. Mutta ne eivät voi käyttää palvelinpuolen ominaisuuksia, kuten tietokannasta lukemista.
* Direktiivit kuten `'use client'` on oltava tiedoston alussa, ennen kaikkia tuontilausekkeita tai muuta koodia (kommentit direktiivien yläpuolella on OK). Ne on kirjoitettava yksittäisillä tai kaksinkertaisilla lainausmerkeillä, ei gravismerkeillä. (Direktiivien muoto `'use xyz'` muistuttaa jonkin verran `useXyz()`-Hookin nimeämiskäytäntöä, mutta samankaltaisuus on sattumanvaraista.)

## Käyttö {/*usage*/}

<Wip>
Tämä osio on kesken.

Tätä rajapintaa voidaan käyttää missä tahansa kehyksessä, joka tukee Reactin palvelinkomponentteja. Lisätietoja löytyy niiden dokumentaatiosta.
* [Next.js dokumentaatio](https://nextjs.org/docs/getting-started/react-essentials)
* Lisää tulossa pian
</Wip>