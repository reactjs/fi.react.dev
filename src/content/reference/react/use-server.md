---
title: "'use server'"
canary: true
---

<Canary>

`'use client'` tavitaan vain jos [käytät Reactin palvelinkomponentteja](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) tai rakennat niiden kanssa yhteensopivia kirjastoja.

</Canary>


<Intro>

`'use server'` merkitsee palvelinpuolen funktioita, joita voidaan kutsua asiakaspuolen koodista.

</Intro>

<InlineToc />

---

## Viite {/*reference*/}

### `'use server'` {/*use-server*/}

Lisää `'use server';` async funktion alkuun merkitsemään että funktiota voidaan kutsua asiakaspuolelta.

```js
async function addToCart(data) {
  'use server';
  // ...
}

// <ProductDetailPage addToCart={addToCart} />
```

Tämä funktio voidaan välittää asiakkaalle. Kun sitä kutsutaan asiakaspuolella, se tekee verkkopyynnön palvelimelle, joka sisältää serialisoidun kopion kaikista annetuista argumenteista. Jos palvelimen funktio palauttaa arvon, se serialisoidaan ja palautetaan asiakkaalle.

Vaihtoehtoisesti, lisää `'use server';` tiedoston alkuun merkitsemään kaikki tiedoston exportit palvelinpuolen funktioiksi, joita voidaan käyttää missä tahansa, myös tuotuna asiakaspuolen komponenttitiedostoissa.

#### Rajoitukset {/*caveats*/}

* Muista, että `'use server'`-merkittyjen funktioiden parametrit ovat täysin asiakkaan hallinnassa. Turvallisuuden vuoksi käsittele niitä aina epäluotettavana syötteenä ja varmista, että validoit ja escapeet argumentit asianmukaisesti.
* Välttääksesi sekaannusta, joka voi johtua asiakas- ja palvelinpuolen koodin sekoittamisesta samassa tiedostossa, `'use server'` voidaan käyttää vain palvelinpuolen tiedostoissa; tuloksena olevia funktioita voidaan välittää asiakaspuolen komponenteille propsina.
* Koska taustalla olevat verkkopyynnöt ovat aina asynkronisia, `'use server'` voidaan käyttää vain async funktioissa.
* Direktiivit kuten `'use server'` on oltava funktion tai tiedoston alussa, ennen kaikkia tuontilausekkeita tai muuta koodia (kommentit direktiivien yläpuolella on OK). Ne on kirjoitettava yksittäisillä tai kaksinkertaisilla lainausmerkeillä, ei gravismerkeillä. (Direktiivien muoto `'use xyz'` muistuttaa jonkin verran `useXyz()`-Hookin nimeämiskäytäntöä, mutta samankaltaisuus on sattumanvaraista.)

## Käyttö {/*usage*/}

<Wip>
Tämä osio on kesken.

Tätä rajapintaa voidaan käyttää missä tahansa kehyksessä, joka tukee Reactin palvelinkomponentteja. Lisätietoja löytyy niiden dokumentaatiosta.
* [Next.js dokumentaatio](https://nextjs.org/docs/getting-started/react-essentials)
* Lisää tulossa pian
</Wip>