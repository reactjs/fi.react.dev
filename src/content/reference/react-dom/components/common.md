---
title: "Yleiset komponentit (esim <div>)"
---

<Intro>

Kaikki selaimeen sisäänrakennetut komponentit, kuten [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div), tukevat joitakin yleisiä propseja ja tapahtumia.

</Intro>

<InlineToc />

---

## Viite {/*reference*/}

### Yleiset komponentit (kuten `<div>`) {/*common*/}

```js
<div className="wrapper">Jotain sisältöä</div>
```

[Näe lisää esimerkkejä alla.](#usage)

#### Propsit {/*common-props*/}

Nämä Reactin erikoispropsit tuetaan kaikissa sisäänrakennetuissa komponenteissa:

* `children`: A React noodi (elementti, merkkijono, numero, [portaali,](/reference/react-dom/createPortal) tyhjä noodi kuten `null`, `undefined` ja totuusarvot, tai taulukko muista React noodeista). Määrittää komponentin sisällön. Kun käytät JSX:ää, määrität `children` propsin yleensä epäsuorasti upottamalla tageja kuten `<div><span /></div>`.

* `dangerouslySetInnerHTML`: Olio muodossa `{ __html: '<p>some html</p>' }` jossa on raaka HTML merkkijono sisällä. Ohittaa DOM noodin [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) ominaisuuden ja näyttää annetun HTML:n sisällä. Tätä tulisi käyttää erityisellä varovaisuudella! Jos HTML sisällä ei ole luotettavaa (esimerkiksi jos se perustuu käyttäjän dataan), riski [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting) haavoittuvuuden tuomisesta. [Lue lisää `dangerouslySetInnerHTML`:n käytöstä.](#dangerously-setting-the-inner-html)

* `ref`: Ref olio [`useRef`:sta](/reference/react/useRef) tai [`createRef`:sta](/reference/react/createRef), tai [`ref` kutsufunktio,](#ref-callback) tai merkkijono [vanhoille refseille.](https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs) Refisi täytetään tämän DOM noodin elementillä. [Lue lisää DOM:n manipuloinnista refien avulla.](#manipulating-a-dom-node-with-a-ref)

* `suppressContentEditableWarning`: Totuusarvo. Jos `true`, estää Reactin näyttämästä varoitusta elementeille joilla on sekä `children` että `contentEditable={true}` (jotka eivät normaalisti toimi yhdessä). Käytä tätä jos rakennat tekstisyöttökirjastoa joka hallinnoi `contentEditable` sisältöä manuaalisesti.

* `suppressHydrationWarning`: Totuusarvo. Jos käytät [palvelimen renderöintiä,](/reference/react-dom/server) normaalisti varoitetaan jos palvelin ja selain renderöivät eri sisältöä. Joissain harvoissa tapauksissa (kuten aikaleimoissa), on hyvin vaikeaa tai mahdotonta taata täsmällistä vastaavuutta. Jos asetat `suppressHydrationWarning`:n arvoksi `true`, React ei varoita sinua eroista elementin attribuuteissa ja sisällössä. Se toimii vain yhden tason syvyyteen asti, ja on tarkoitettu käytettäväksi pakotienä. Älä käytä sitä liikaa. [Lue lisää hydratointivirheiden estämisestä.](/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors)

* `style`: Olio CSS tyyleistä, esimerkiksi `{ fontWeight: 'bold', margin: 20 }`. Samalla tavalla kuin DOM [`style`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) ominaisuudessa, CSS ominaisuudet tulee kirjoittaa `camelCase` muodossa, esimerkiksi `fontWeight` `font-weight`:n sijaan. Voit antaa merkkijonoja tai numeroita arvoiksi. Jos annat numeron, kuten `width: 100`, React lisää automaattisesti `px` ("pikseliä") arvon perään ellei kyseessä ole [yksikköominaisuus.](https://github.com/facebook/react/blob/81d4ee9ca5c405dce62f64e61506b8e155f38d8d/packages/react-dom-bindings/src/shared/CSSProperty.js#L8-L57) Suosittelemme käyttämään `style`:a vain dynaamisissa tyyleissä joissa et tiedä tyylejä etukäteen. Muissa tapauksissa, pelkkien CSS luokkien käyttäminen `className`:n kanssa on tehokkaampaa. [Lue lisää `className` ja `style`:sta.](#applying-css-styles)

Nämä standardit DOM propsit tuetaan myös kaikissa sisäänrakennetuissa komponenteissa:

* [`accessKey`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey): Merkkijono. Määrittää pikanäppäimen elementille. [Ei yleensä suositeltavaa.](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey#accessibility_concerns)
* [`aria-*`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes): ARIA attribuuttien avulla voit määrittää saavutettavuuspuun tiedot tälle elementille. Katso [ARIA attribuutit](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes) täydellistä viitettä varten. Reactissa kaikki ARIA attribuuttien nimet ovat täsmälleen samat kuin HTML:ssä.
* [`autoCapitalize`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autocapitalize): Merkkijono. Määrittää pitäisikö ja miten käyttäjän syöte kirjoittaa isolla alkukirjaimella.
* [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className): Merkkijono. Määrittää elementin CSS luokan. [Lue lisää CSS tyyleistä.](#applying-css-styles)
* [`contentEditable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable): Totuusarvo. Jos `true`, selain antaa käyttäjän muokata renderöityä elementtiä suoraan. Tätä käytetään toteuttamaan rikastekstisyöttökirjastoja kuten [Lexical.](https://lexical.dev/) React varoittaa jos yrität antaa React lapsia elementille jolla on `contentEditable={true}` koska React ei pysty päivittämään sisältöä käyttäjän muokkauksen jälkeen.
* [`data-*`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*): Data attribuuttien avulla voit liittää merkkijono-dataa elementtiin, esimerkiksi `data-fruit="banana"`. Reactissa niitä ei yleensä käytetä koska data luetaan yleensä propsista tai tilasta.
* [`dir`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir): Joko `'ltr'` tai `'rtl'`. Määrittää elementin tekstin suunnan.
* [`draggable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/draggable): Totuusarvo. Määrittää onko elementti raahattava. Osa [HTML Drag and Drop API:a.](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
* [`enterKeyHint`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/enterKeyHint): Merkkijono. Määrittää mitä toimintoa esitetään enter näppäimelle virtuaalisilla näppäimistöillä.
* [`htmlFor`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor): Merkkijono. [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) ja [`<output>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output) elementeille, antaa sinun [liittää labelin johonkin kontrolliin.](/reference/react-dom/components/input#providing-a-label-for-an-input) Sama kuin [`for` HTML attribuutti.](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/for) React käyttää standardia DOM ominaisuuden nimeä (`htmlFor`) HTML attribuutin nimen sijaan.
* [`hidden`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden): Totuusarvo tai merkkijono. Määrittää pitäisikö elementin olla piilotettuna.
* [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id): Merkkijono. Määrittää uniikin tunnisteen tälle elementille, jota voidaan käyttää löytämään se myöhemmin tai yhdistämään se muihin elementteihin. Luo se [`useId`:lla](/reference/react/useId) välttääksesi törmäykset saman komponentin useiden instanssien välillä.
* [`is`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is): Merkkijono. Jos määritetty, komponentti käyttäytyy kuin [custom elementti.](/reference/react-dom/components#custom-html-elements)
* [`inputMode`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode): Merkkijono. Määrittää minkä tyyppisen näppäimistön näyttää (esimerkiksi teksti, numero tai puhelinnumero).
* [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop): Merkkijono. Määrittää minkä ominaisuuden elementti edustaa strukturoituja data crawlereita varten.
* [`lang`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang): Merkkijono. Määrittää elementin kielen.
* [`onAnimationEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event): [`AnimationEvent` käsittelijäfunktio](#animationevent-handler). Suoritetaan kun CSS animaatio päättyy.
* `onAnimationEndCapture`: Versio `onAnimationEnd`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onAnimationIteration`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationiteration_event): [`AnimationEvent` käsittelijäfunktio](#animationevent-handler). Suoritetaan kun CSS animaation iteraatio päättyy ja toinen alkaa.
* `onAnimationIterationCapture`: Versio `onAnimationIteration`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onAnimationStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationstart_event): [`AnimationEvent` käsittelijäfunktio](#animationevent-handler). Suoritetaan kun CSS animaatio alkaa.
* `onAnimationStartCapture`: `onAnimationStart`, mutta suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onAuxClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/auxclick_event): [`MouseEvent` käsittelijäfunktio](#mouseevent-handler). Suoritetaan kun ei-pääpainiketta painetaan.
* `onAuxClickCapture`: Versio `onAuxClick`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* `onBeforeInput`: [`InputEvent` käsittelijäfunktio](#inputevent-handler). Suoritetaan ennen muokattavan elementin arvon muuttamista. React ei vielä käytä selaimen [`beforeinput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/beforeinput_event) tapahtumaa, vaan yrittää polyfillata sen käyttäen muita eventtejä.
* `onBeforeInputCapture`: Versio `onBeforeInput`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* `onBlur`: [`FocusEvent` käsittelijäfunktio](#focusevent-handler). Suoritetaan kun elementti menettää kohdistuksen. Toisin kuin selaimen [`blur`](https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event) tapahtuma, Reactissa `onBlur` tapahtuma kuplii.
* `onBlurCapture`: Versio `onBlur`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event): [`MouseEvent` käsittelijäfunktio](#mouseevent-handler). Suoritetaan kun pääpainiketta painetaan osoittimella.
* `onClickCapture`: Versio `onClick`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionstart_event): [`CompositionEvent` käsittelijäfunktio](#compositionevent-handler). Suoritetaan kun [syöttömenetelmän editori](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) aloittaa uuden kompositioistunnon.
* `onCompositionStartCapture`: Versio `onCompositionStart`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event): [`CompositionEvent` käsittelijäfunktio](#compositionevent-handler). Suoritetaan kun [syöttömenetelmän editori](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) lopettaa tai peruuttaa kompositioistunnon.
* `onCompositionEndCapture`: Versio `onCompositionEnd`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionupdate_event): [`CompositionEvent` käsittelijäfunktio](#compositionevent-handler). Suoritetaan kun [syöttömenetelmän editori](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) vastaanottaa uuden merkin.
* `onCompositionUpdateCapture`: Versio `onCompositionUpdate`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onContextMenu`](https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event): [`MouseEvent` käsittelijäfunktio](#mouseevent-handler). Suoritetaan kun käyttäjä yrittää avata kontekstivalikon.
* `onContextMenuCapture`: Versio `onContextMenu`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onCopy`](https://developer.mozilla.org/en-US/docs/Web/API/Element/copy_event): [`ClipboardEvent` käsittelijäfunktio](#clipboardevent-handler). Suoritetaan kun käyttäjä yrittää kopioida jotain leikepöydälle.
* `onCopyCapture`: Versio `onCopy`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onCut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/cut_event): [`ClipboardEvent` käsittelijäfunktio](#clipboardevent-handler). Suoritetaan kun käyttäjä yrittää leikata jotain leikepöydälle.
* `onCutCapture`: Versio `onCut`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* `onDoubleClick`: [`MouseEvent` käsittelijäfunktio](#mouseevent-handler). Suoritetaan kun käyttäjä painaa pääpainiketta kahdesti. Vastaa selaimen [`dblclick` tapahtumaa.](https://developer.mozilla.org/en-US/docs/Web/API/Element/dblclick_event)
* `onDoubleClickCapture`: Versio `onDoubleClick`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onDrag`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drag_event): [`DragEvent` käsittelijäfunktio](#dragevent-handler). Suoritetaan kun käyttäjä raahaa jotain.
* `onDragCapture`: Versio `onDrag`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onDragEnd`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragend_event): [`DragEvent` käsittelijäfunktio](#dragevent-handler). Suoritetaan kun käyttäjä lopettaa raahaamisen.
* `onDragEndCapture`: Versio `onDragEnd`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onDragEnter`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragenter_event): [`DragEvent` käsittelijäfunktio](#dragevent-handler). Suoritetaan kun raahattu sisältö tulee pätevän pudotuskohteen sisään.
* `onDragEnterCapture`: Versio `onDragEnter`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onDragOver`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragover_event): [`DragEvent` käsittelijäfunktio](#dragevent-handler). Suoritetaan pätevällä pudotuskohteella kun raahattu sisältö raahataan sen päällä. Sinun tulee kutsua `e.preventDefault()` täällä jotta pudottaminen sallitaan.
* `onDragOverCapture`: Versio `onDragOver`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onDragStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragstart_event): [`DragEvent` käsittelijäfunktio](#dragevent-handler). Suoritetaan kun käyttäjä aloittaa raahaamisen.
* `onDragStartCapture`: Versio `onDragStart`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onDrop`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event): [`DragEvent` käsittelijäfunktio](#dragevent-handler). Suoritetaan kun jotain pudotetaan pätevälle pudotuskohteelle.
* `onDropCapture`: Versio `onDrop`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* `onFocus`: [`FocusEvent` käsittelijäfunktio](#focusevent-handler). Suoritetaan kun elementti saa kohdistuksen. Toisin kuin selaimen [`focus`](https://developer.mozilla.org/en-US/docs/Web/API/Element/focus_event) tapahtuma, Reactissa `onFocus` tapahtuma kuplii.
* `onFocusCapture`: Versio `onFocus`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onGotPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/gotpointercapture_event): [`PointerEvent` käsittelijäfunktio](#pointerevent-handler). Suoritetaan kun elementti ohjelmallisesti nappaa osoittimen.
* `onGotPointerCaptureCapture`: Versio `onGotPointerCapture`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onKeyDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event): [`KeyboardEvent` käsittelijäfunktio](#pointerevent-handler). Suoritetaan kun näppäintä painetaan.
* `onKeyDownCapture`: Versio `onKeyDown`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onKeyPress`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keypress_event): [`KeyboardEvent` käsittelijäfunktio](#pointerevent-handler). Vanhentunut. Käytä sen sijaan `onKeyDown` tai `onBeforeInput`.
* `onKeyPressCapture`: Versio `onKeyPress`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onKeyUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keyup_event): [`KeyboardEvent` käsittelijäfunktio](#pointerevent-handler). Suoritetaan kun näppäin vapautetaan.
* `onKeyUpCapture`: Versio `onKeyUp`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onLostPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/lostpointercapture_event): [`PointerEvent` käsittelijäfunktio](#pointerevent-handler). Suoritetaan kun elementti lopettaa osoittimen nappaamisen.
* `onLostPointerCaptureCapture`: Versio `onLostPointerCapture`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onMouseDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousedown_event): [`MouseEvent` käsittelijäfunktio](#mouseevent-handler). Suoritetaan kun osoitin painetaan alas.
* `onMouseDownCapture`: Versio `onMouseDown`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onMouseEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event): [`MouseEvent` käsittelijäfunktio](#mouseevent-handler). Suoritetaan kun osoitin liikkuu elementin sisään. Ei ole nappausvaihetta. Sen sijaan, `onMouseLeave` ja `onMouseEnter` leviävät elementistä josta poistutaan elementtiin johon tullaan.
* [`onMouseLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseleave_event): [`MouseEvent` käsittelijäfunktio](#mouseevent-handler). Suoritetaan kun osoitin liikkuu elementin ulkopuolelle. Ei ole nappausvaihetta. Sen sijaan, `onMouseLeave` ja `onMouseEnter` leviävät elementistä josta poistutaan elementtiin johon tullaan.
* [`onMouseMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event): [`MouseEvent` käsittelijäfunktio](#mouseevent-handler). Suoritetaan osoittimen koordinaatit muuttuvat.
* `onMouseMoveCapture`: Versio `onMouseMove`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onMouseOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseout_event): [`MouseEvent` käsittelijäfunktio](#mouseevent-handler). Suoritetaan kun osoitin liikkuu elementin ulkopuolelle, tai jos se liikkuu lapsielementtiin.
* `onMouseOutCapture`: Versio `onMouseOut`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onMouseUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseup_event): [`MouseEvent` käsittelijäfunktio](#mouseevent-handler). Suoritetaan kun osoitin vapautetaan.
* `onMouseUpCapture`: Versio `onMouseUp`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onPointerCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointercancel_event): [`PointerEvent` käsittelijäfunktio](#pointerevent-handler). Suoritetaan kun selain peruuttaa osoittimen interaktion.
* `onPointerCancelCapture`: Versio `onPointerCancel`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onPointerDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerdown_event): [`PointerEvent` käsittelijäfunktio](#pointerevent-handler). Suoritetaan kun osoitin aktivoituu.
* `onPointerDownCapture`: Versio `onPointerDown`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onPointerEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerenter_event): [`PointerEvent` käsittelijäfunktio](#pointerevent-handler). Suoritetaan kun osoitin liikkuu elementin sisään. Ei ole nappausvaihetta. Sen sijaan, `onPointerLeave` ja `onPointerEnter` leviävät elementistä josta poistutaan elementtiin johon tullaan.
* [`onPointerLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerleave_event): [`PointerEvent` käsittelijäfunktio](#pointerevent-handler). Suoritetaan kun osoitin liikkuu elementin ulkopuolelle. Ei ole nappausvaihetta. Sen sijaan, `onPointerLeave` ja `onPointerEnter` leviävät elementistä josta poistutaan elementtiin johon tullaan.
* [`onPointerMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event): [`PointerEvent` käsittelijäfunktio](#pointerevent-handler). Suoritetaan kun osoittimen koordinaatit muuttuvat.
* `onPointerMoveCapture`: Versio `onPointerMove`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onPointerOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event): [`PointerEvent` käsittelijäfunktio](#pointerevent-handler). Suoritetaan kun osoitin liikkuu elementin ulkopuolelle, jos osoittimen interaktio peruutetaan, ja [muutamista muista syistä.](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event)
* `onPointerOutCapture`: Versio `onPointerOut`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onPointerUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerup_event): [`PointerEvent` käsittelijäfunktio](#pointerevent-handler). Suoritetaan kun osoitin ei ole enää aktiivinen.
* `onPointerUpCapture`: Versio `onPointerUp`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onPaste`](https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event): [`ClipboardEvent` käsittelijäfunktio](#clipboardevent-handler). Suoritetaan kun käyttäjä yrittää liittää jotain leikepöydältä.
* `onPasteCapture`: Versio `onPaste`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onScroll`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll_event): [`Event` käsittelijäfunktio](#event-handler). Suoritetaan kun elementtiä on skrollattu. Tämä tapahtuma ei kupli.
* `onScrollCapture`: Versio `onScroll`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): [`Event` käsittelijäfunktio](#event-handler). Suoritetaan kun valinta muuttuu muokattavassa elementissä kuten inputissa. React laajentaa `onSelect` tapahtuman toimimaan myös `contentEditable={true}` elementeille. Lisäksi, React laajentaa sen suorittumaan tyhjälle valinnalle ja muokkauksille (jotka voivat vaikuttaa valintaan).
* `onSelectCapture`: Versio `onSelect`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onTouchCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchcancel_event): [`TouchEvent` käsittelijäfunktio](#touchevent-handler). Suoritetaan kun selain peruuttaa kosketus interaktion.
* `onTouchCancelCapture`: Versio `onTouchCancel`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onTouchEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchend_event): [`TouchEvent` käsittelijäfunktio](#touchevent-handler). Suoritetaan kun yksi tai useampi kosketuspiste poistetaan.
* `onTouchEndCapture`: Versio `onTouchEnd`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onTouchMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchmove_event): [`TouchEvent` käsittelijäfunktio](#touchevent-handler). Suoritetaan kun yksi tai useampi kosketuspiste liikkuu.
* `onTouchMoveCapture`: Versio `onTouchMove`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onTouchStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchstart_event): [`TouchEvent` käsittelijäfunktio](#touchevent-handler). Suoritetaan kun yksi tai useampi kosketuspiste asetetaan.
* `onTouchStartCapture`: Versio `onTouchStart`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onTransitionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event): [`TransitionEvent` käsittelijäfunktio](#transitionevent-handler). Suoritetaan kun CSS siirtymä päättyy.
* `onTransitionEndCapture`: Versio `onTransitionEnd`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onWheel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event): [`WheelEvent` käsittelijäfunktio](#wheelevent-handler). Suoritetaan kun käyttäjä pyörittää rullaa.
* `onWheelCapture`: Versio `onWheel`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`role`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): Merkkijono. Määrittää elementin roolin selkeästi avustaville teknologioille.
* [`slot`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): Merkkijono. Määrittää slotin nimen kun käytetään shadow DOM:ia. Reactissa, vastaava tapahtuu yleensä välittämällä JSX propseina, esimerkiksi `<Layout left={<Sidebar />} right={<Content />} />`.
* [`spellCheck`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/spellcheck): Totuusarvo tai null. Jos asetettu `true` tai `false`, mahdollistaa tai estää oikeinkirjoituksen tarkistuksen.
* [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex): Numero. Ylikirjoittaa oletus sarkain -näppäimen käyttäytymisen. [Vältä käyttämästä arvoja jotka eivät ole `-1` ja `0`.](https://www.tpgi.com/using-the-tabindex-attribute/)
* [`title`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/title): Merkkijono. Määrittää työkaluvihjeen tekstin elementille.
* [`translate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/translate): Joko `'yes'` tai `'no'`. `'no'` estää elementin sisällön kääntämisen.

Voit myös välittää omia attribuutteja propseina, esimerkiksi `mycustomprop="someValue"`. Tämä voi olla hyödyllistä kun integroit kolmannen osapuolen kirjastojen kanssa. Oma attribuutin nimi tulee olla pienillä kirjaimilla ja ei saa alkaa `on`:lla. Arvo muutetaan merkkijonoksi. Jos välität `null` tai `undefined`, oma attribuutti poistetaan.

Nämä tapahtumat suoritetaan vain [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) elementeille:

* [`onReset`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reset_event): [`Event` käsittelijäfunktio](#event-handler). Suoritetaan kun lomake nollataan.
* `onResetCapture`: Versio `onReset`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onSubmit`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event): [`Event` käsittelijäfunktio](#event-handler). Suoritetaan kun lomake lähetetään.
* `onSubmitCapture`: Versio `onSubmit`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)

Nämä tapahtumat suoritetaan vain [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) elementeille. Toisin kuin selaimen tapahtumat, ne kuplivat Reactissa:

* [`onCancel`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/cancel_event): [`Event` käsittelijäfunktio](#event-handler). Suoritetaan kun käyttäjä yrittää sulkea dialogin.
* `onCancelCapture`: Versio `onCancel`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onClose`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close_event): [`Event` käsittelijäfunktio](#event-handler). Suoritetaan kun dialogi on suljettu.
* `onCloseCapture`: Versio `onClose`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)

Nämä tapahtumat suoritetaan vain [`<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details) elementeille. Toisin kuin selaimen tapahtumat, ne kuplivat Reactissa:

* [`onToggle`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDetailsElement/toggle_event): [`Event` käsittelijäfunktio](#event-handler). Suoritetaan kun käyttäjä vaihtaa tilaa.
* `onToggleCapture`: Versio `onToggle`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)

Nämä tapahtumat suoritetaan [`<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img), [`<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe), [`<object>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object), [`<embed>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed), [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link), ja [SVG `<image>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_Image_Tag) elementeille. Toisin kuin selaimen tapahtumat, ne kuplivat Reactissa:

* `onLoad`: [`Event` käsittelijäfunktio](#event-handler). Suoritetaan kun resurssi on ladattu.
* `onLoadCapture`: Versio `onLoad`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): [`Event` käsittelijäfunktio](#event-handler). Suoritetaan kun resurssia ei voitu ladata.
* `onErrorCapture`: Versio `onError`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)

Nämä tapahtumat suoritetaan resursseille kuten [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) ja [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video). Toisin kuin selaimen tapahtumat, ne kuplivat Reactissa:

* [`onAbort`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/abort_event): [`Event` käsittelijäfunktio](#event-handler). Suoritetaan kun resurssia ei voitu ladata, mutta ei virheen takia.
* `onAbortCapture`: Versio `onAbort`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onCanPlay`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplay_event): [`Event` käsittelijäfunktio](#event-handler). Suoritetaan kun dataa on tarpeeksi toistoa varten, mutta ei tarpeeksi toistamiseen loppuun asti ilman puskurointia.
* `onCanPlayCapture`: Versio `onCanPlay`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onCanPlayThrough`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event): [`Event` käsittelijäfunktio](#event-handler). Suoritetaan kun dataa on tarpeeksi toistoa varten, ja todennäköisesti mahdollista aloittaa toisto ilman puskurointia loppuun asti.
* `onCanPlayThroughCapture`: Versio `onCanPlayThrough`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onDurationChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/durationchange_event): [`Event` käsittelijäfunktio](#event-handler). Suoritetaan kun median kesto on päivitetty.
* `onDurationChangeCapture`: Versio `onDurationChange`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onEmptied`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/emptied_event): [`Event` käsittelijäfunktio](#event-handler). Suoritetaan kun media on tyhjentynyt.
* `onEmptiedCapture`: Versio `onEmptied`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onEncrypted`](https://w3c.github.io/encrypted-media/#dom-evt-encrypted): [`Event` käsittelijäfunktio](#event-handler). Suoritetaan kun selain kohtaa salattua mediaa.
* `onEncryptedCapture`: Versio `onEncrypted`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onEnded`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event): [`Event` käsittelijäfunktio](#event-handler). Suoritetaan kun toisto loppuu koska mitään ei ole jäljellä toistettavaksi.
* `onEndedCapture`: Versio `onEnded`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): [`Event` käsittelijäfunktio](#event-handler). Suoritetaan kun resurssia ei voitu ladata.
* `onErrorCapture`: Versio `onError`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onLoadedData`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadeddata_event): [`Event` käsittelijäfunktio](#event-handler). Suoritetaan kun nykyinen toistokehys on ladattu.
* `onLoadedDataCapture`: Versio `onLoadedData`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onLoadedMetadata`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event): [`Event` käsittelijäfunktio](#event-handler). Suoritetaan kun metadata on ladattu.
* `onLoadedMetadataCapture`: Versio `onLoadedMetadata`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onLoadStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadstart_event): [`Event` käsittelijäfunktio](#event-handler). Suoritetaan kun selain aloittaa resurssin lataamisen.
* `onLoadStartCapture`: Versio `onLoadStart`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onPause`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause_event): [`Event` käsittelijäfunktio](#event-handler). Suoritetaan kun media on tauolla.
* `onPauseCapture`: Versio `onPause`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onPlay`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play_event): [`Event` käsittelijäfunktio](#event-handler). Suoritetaan kun media ei ole enää tauolla.
* `onPlayCapture`: Versio `onPlay`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onPlaying`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playing_event): [`Event` käsittelijäfunktio](#event-handler). Suoritetaan kun media alkaa tai jatkaa toistoa.
* `onPlayingCapture`: Versio `onPlaying`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onProgress`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/progress_event): [`Event` käsittelijäfunktio](#event-handler). Suoritetaan säännöllisesti kun resurssiä ladataan.
* `onProgressCapture`: Versio `onProgress`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onRateChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ratechange_event): [`Event` käsittelijäfunktio](#event-handler). Suoritetaan kun toistonopeus muuttuu.
* `onRateChangeCapture`: Versio `onRateChange`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* `onResize`: [`Event` käsittelijäfunktio](#event-handler). Suoritetaan kun videon koko muuttuu.
* `onResizeCapture`: Versio `onResize`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onSeeked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeked_event): [`Event` käsittelijäfunktio](#event-handler). Suoritetaan kun siirtymisoperaatio on valmis.
* `onSeekedCapture`: Versio `onSeeked`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onSeeking`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeking_event): [`Event` käsittelijäfunktio](#event-handler). Suoritetaan kun siirtymisoperaatio alkaa.
* `onSeekingCapture`: Versio `onSeeking`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onStalled`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/stalled_event): [`Event` käsittelijäfunktio](#event-handler). Suoritetaan kun selain odottaa dataa mutta se ei lataudu.
* `onStalledCapture`: Versio `onStalled`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onSuspend`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/suspend_event): [`Event` käsittelijäfunktio](#event-handler). Suoritetaan kun resurssin lataus keskeytyy.
* `onSuspendCapture`: Versio `onSuspend`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onTimeUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event): [`Event` käsittelijäfunktio](#event-handler). Suoritetaan kun nykyinen toistoaika päivittyy.
* `onTimeUpdateCapture`: Versio `onTimeUpdate`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onVolumeChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volumechange_event): [`Event` käsittelijäfunktio](#event-handler). Suoritetaan kun äänenvoimakkuus on muuttunut.
* `onVolumeChangeCapture`: Versio `onVolumeChange`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)
* [`onWaiting`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/waiting_event): [`Event` käsittelijäfunktio](#event-handler). Suoritetaan kun toisto on pysähtynyt väliaikaisesti data puutteen takia.
* `onWaitingCapture`: Versio `onWaiting`:sta joka suoritetaan [nappausvaiheessa.](/learn/responding-to-events#capture-phase-events)

#### Rajoitukset {/*common-caveats*/}

- Et voi välittää sekä `children` että `dangerouslySetInnerHTML` samaan aikaan.
- Jotkin tapahtumat (kuten `onAbort` ja `onLoad`) eivät kupli selaimessa, mutta kuplivat Reactissa.

---

### `ref` callback-funktio {/*ref-callback*/}

Ref olion sijaan (kuten [`useRef`](/reference/react/useRef#manipulating-the-dom-with-a-ref) palauttama), voit välittää funktion `ref` attribuuttiin.

```js
<div ref={(node) => console.log(node)} />
```

[Esimerkki `ref` callbackin käytöstä.](/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback)

Kun `<div>` DOM noodi lisätään näytölle, React kutsuu `ref` callbackia DOM `node` argumentilla. Kun `<div>` DOM noodi poistetaan, React kutsuu `ref` callbackia `null` argumentilla.

React kutsuu myös `ref` callbackia aina kun välität *erilaisen* `ref` callbackin. Yllä olevassa esimerkissä, `(node) => { ... }` on eri funktio joka renderöinnillä. Kun komponenttisi renderöidään uudelleen, *edellinen* funktio kutsutaan `null` argumentilla, ja *seuraava* funktio kutsutaan DOM nodella.

#### Parametrit {/*ref-callback-parameters*/}

* `node`: DOM noodi tai `null`. React välittää DOM noden kun ref liitetään, ja `null` kun ref irrotetaan. Ellei välitä samaa funktiota `ref` callbackiin joka renderöinnillä, callback irrotetaan ja liitetään uudelleen jokaisella komponentin renderöinnillä.

#### Palautukset {/*returns*/}

Ei palauta mitään `ref` callbackista.

---

### React tapahtumaolio {/*react-event-object*/}

Tapahtumakäsittelijäsi vastaanottaa *React tapahtumaolion*. Sitä kutsutaan myös joskus "synteettiseksi tapahtumaksi".

```js
<button onClick={e => {
  console.log(e); // React tapahtumaolio
}} />
```

Se noudattaa samaa standardia kuin taustalla olevat DOM tapahtumat, mutta korjaa joitain selaimen epäjohdonmukaisuuksia.

Jotkin React tapahtumat eivät mäppäydy suoraan selaimen alkuperäisiin tapahtumiin. Esimerkiksi `onMouseLeave`, `e.nativeEvent` osoittaa `mouseout` tapahtumaan. Tämä mäppäys ei ole osa julkista API:a ja saattaa muuttua tulevaisuudessa. Jos tarvitset taustalla olevan selaimen tapahtuman jostain syystä, lue se `e.nativeEvent` kautta.

#### Ominaisuudet {/*react-event-object-properties*/}

React tapahtumaolio toteuttaa joitain standardin [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) ominaisuuksia:

* [`bubbles`](https://developer.mozilla.org/en-US/docs/Web/API/Event/bubbles): Totuusarvo. Palauttaa kupliiko tapahtuma DOMin läpi.
* [`cancelable`](https://developer.mozilla.org/en-US/docs/Web/API/Event/cancelable): Totuusarvo. Palauttaa voiko tapahtuman peruuttaa.
* [`currentTarget`](https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget): DOM noodi. Palauttaa noodin johon nykyinen käsittelijä on liitetty React puussa.
* [`defaultPrevented`](https://developer.mozilla.org/en-US/docs/Web/API/Event/defaultPrevented): Totuusarvo. Palauttaa onko `preventDefault` kutsuttu.
* [`eventPhase`](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase): Numero. Palauttaa missä vaiheessa tapahtuma on tällä hetkellä.
* [`isTrusted`](https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted): Totuusarvo. Palauttaa onko tapahtuma käyttäjän aloittama.
* [`target`](https://developer.mozilla.org/en-US/docs/Web/API/Event/target): DOM noodi. Palauttaa noodin jossa tapahtuma on tapahtunut (joka voi olla kaukainen lapsi).
* [`timeStamp`](https://developer.mozilla.org/en-US/docs/Web/API/Event/timeStamp): Numero. Palauttaa ajan jolloin tapahtuma tapahtui.

Lisäksi, React tapahtumaoliot tarjoavat nämä ominaisuudet:

* `nativeEvent`: DOM [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event). Alkuperäinen selaimen tapahtumaolio.

#### Metodit {/*react-event-object-methods*/}

React tapahtumaolio toteuttaa joitain standardin [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) metodeista:

* [`preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault): Estää tapahtuman oletustoiminnon.
* [`stopPropagation()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation): Estää tapahtuman kuplimisen React puussa.

Lisäksi, React tapahtumaoliot tarjoavat nämä metodit:

* `isDefaultPrevented()`: Palauttaa totuusarvon joka kertoo onko `preventDefault` kutsuttu.
* `isPropagationStopped()`: Palauttaa totuusarvon joka kertoo onko `stopPropagation` kutsuttu.
* `persist()`: Ei käytetä React DOMin kanssa. React Nativella, kutsu tätä lukeaksesi tapahtuman ominaisuudet tapahtuman jälkeen.
* `isPersistent()`: Ei käytetä React DOMin kanssa. React Nativella, palauttaa onko `persist` kutsuttu.

#### Rajoitukset {/*react-event-object-caveats*/}

* `currentTarget`, `eventPhase`, `target`, ja `type` arvot heijastaa arvoja, joita React koodisi olettaa. Taustalla, React liittää tapahtumakäsittelijät juureen, mutta tätä ei heijasteta React tapahtumaolioissa. Esimerkiksi, `e.currentTarget` ei välttämättä ole sama kuin taustalla oleva `e.nativeEvent.currentTarget`. Polyfillatuissa tapahtumissa, `e.type` (React tapahtuman tyyppi) voi erota `e.nativeEvent.type` (taustalla oleva tyyppi).

---

### `AnimationEvent` käsittelijäfunktio {/*animationevent-handler*/}

Tapahtumakäsittelijätyyppi [CSS animaatioiden](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations) -tapahtumiin.

```js
<div
  onAnimationStart={e => console.log('onAnimationStart')}
  onAnimationIteration={e => console.log('onAnimationIteration')}
  onAnimationEnd={e => console.log('onAnimationEnd')}
/>
```

#### Parametrit {/*animationevent-handler-parameters*/}

* `e`: [React tapahtumaolio](#react-event-object) näillä ylimääräisillä [`AnimationEvent`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent) ominaisuuksilla:
  * [`animationName`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/animationName)
  * [`elapsedTime`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/elapsedTime)
  * [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/pseudoElement)

---

### `ClipboardEvent` käsittelijäfunktio {/*clipboadevent-handler*/}

Tapahtumakäsittelijätyyppi [Clipboard API] tapahtumiin.

```js
<input
  onCopy={e => console.log('onCopy')}
  onCut={e => console.log('onCut')}
  onPaste={e => console.log('onPaste')}
/>
```

#### Parametrit {/*clipboadevent-handler-parameters*/}

* `e`: [React tapahtumaolio](#react-event-object) näillä ylimääräisillä [`ClipboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent) ominaisuuksilla:

  * [`clipboardData`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent/clipboardData)

---

### `CompositionEvent` käsittelijäfunktio {/*compositionevent-handler*/}

Tapahtumakäsittelijätyyppi [syöttömenetelmän editorin (IME)](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) tapahtumiin.

```js
<input
  onCompositionStart={e => console.log('onCompositionStart')}
  onCompositionUpdate={e => console.log('onCompositionUpdate')}
  onCompositionEnd={e => console.log('onCompositionEnd')}
/>
```

#### Parametrit {/*compositionevent-handler-parameters*/}

* `e`: [React tapahtumaolio](#react-event-object) näillä ylimääräisillä [`CompositionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent) ominaisuuksilla:
  * [`data`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent/data)

---

### `DragEvent` käsittelijäfunktio {/*dragevent-handler*/}

Tapahtumakäisttelijätyyppi [HTML Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API) tapahtumiin.

```js
<>
  <div
    draggable={true}
    onDragStart={e => console.log('onDragStart')}
    onDragEnd={e => console.log('onDragEnd')}
  >
    Drag lähde
  </div>

  <div
    onDragEnter={e => console.log('onDragEnter')}
    onDragLeave={e => console.log('onDragLeave')}
    onDragOver={e => { e.preventDefault(); console.log('onDragOver'); }}
    onDrop={e => console.log('onDrop')}
  >
    Drop kohde
  </div>
</>
```

#### Parametrit {/*dragevent-handler-parameters*/}

* `e`: [React tapahtumaolio](#react-event-object) näillä ylimääräisillä [`DragEvent`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent) ominaisuuksilla:
  * [`dataTransfer`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent/dataTransfer)

  Sisältää myös perityt [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) ominaisuudet:

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  Sisältää myös perityt [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) ominaisuudet:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `FocusEvent` käsittelijäfunktio {/*focusevent-handler*/}

Tapahtumakäsittelijätyyppi kohdistumisen tapahtumiin.

```js
<input
  onFocus={e => console.log('onFocus')}
  onBlur={e => console.log('onBlur')}
/>
```

[Katso esimerkki.](#handling-focus-events)

#### Parametrit {/*focusevent-handler-parameters*/}

* `e`: [React tapahtumaolio](#react-event-object) näillä ylimääräisillä [`FocusEvent`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent) ominaisuuksilla:
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent/relatedTarget)

  Sisältää myös perityt [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) ominaisuudet:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `Event` käsittelijäfunktio {/*event-handler*/}

Tapahtumakäsittelijätyyppi yleisiin tapahtumiin.

#### Parametrit {/*event-handler-parameters*/}

* `e`: [React tapahtumaolio](#react-event-object) ilman ylimääräisiä ominaisuuksia.

---

### `InputEvent` käsittelijäfunktio {/*inputevent-handler*/}

Tapahtumakäsittelijätyyppi `onBeforeInput` tapahtumalle.

```js
<input onBeforeInput={e => console.log('onBeforeInput')} />
```

#### Parametrit {/*inputevent-handler-parameters*/}

* `e`: [React tapahtumaolio](#react-event-object) näillä ylimääräisillä [`InputEvent`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent) ominaisuuksilla:
  * [`data`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/data)

---

### `KeyboardEvent` käsittelijäfunktio {/*keyboardevent-handler*/}

Tapahtumakäsittelijätyyppi näppäimistötapahtumiin.

```js
<input
  onKeyDown={e => console.log('onKeyDown')}
  onKeyUp={e => console.log('onKeyUp')}
/>
```

[Katso esimerkki.](#handling-keyboard-events)

#### Parametrit {/*keyboardevent-handler-parameters*/}

* `e`: [React tapahtumaolio](#react-event-object) näillä ylimääräisillä [`KeyboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent) ominaisuuksilla:
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/altKey)
  * [`charCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/charCode)
  * [`code`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/ctrlKey)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState)
  * [`key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
  * [`keyCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode)
  * [`locale`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/locale)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/metaKey)
  * [`location`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/location)
  * [`repeat`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/shiftKey)
  * [`which`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/which)

  Sisältää myös perityt [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) ominaisuudet:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `MouseEvent` käsittelijäfunktio {/*mouseevent-handler*/}

Tapahtumakäsittelijätyyppi hiiritapahtumiin.

```js
<div
  onClick={e => console.log('onClick')}
  onMouseEnter={e => console.log('onMouseEnter')}
  onMouseOver={e => console.log('onMouseOver')}
  onMouseDown={e => console.log('onMouseDown')}
  onMouseUp={e => console.log('onMouseUp')}
  onMouseLeave={e => console.log('onMouseLeave')}
/>
```

[Katso esimerkki.](#handling-mouse-events)

#### Parametrit {/*mouseevent-handler-parameters*/}

* `e`: [React tapahtumaolio](#react-event-object) näillä ylimääräisillä [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) ominaisuuksilla:
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  Sisältää myös perityt [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) ominaisuudet:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `PointerEvent` käsittelijäfunktio {/*pointerevent-handler*/}

Tapahtumakäisttelijätyyppi [osoitintapahtumiin.](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)

```js
<div
  onPointerEnter={e => console.log('onPointerEnter')}
  onPointerMove={e => console.log('onPointerMove')}
  onPointerDown={e => console.log('onPointerDown')}
  onPointerUp={e => console.log('onPointerUp')}
  onPointerLeave={e => console.log('onPointerLeave')}
/>
```

[Katso esimerkki.](#handling-pointer-events)

#### Parametrit {/*pointerevent-handler-parameters*/}

* `e`: [React tapahtumaolio](#react-event-object) näillä ylimääräisillä [`PointerEvent`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent) ominaisuuksilla:
  * [`height`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/height)
  * [`isPrimary`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/isPrimary)
  * [`pointerId`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerId)
  * [`pointerType`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType)
  * [`pressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pressure)
  * [`tangentialPressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tangentialPressure)
  * [`tiltX`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltX)
  * [`tiltY`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltY)
  * [`twist`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/twist)
  * [`width`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/width)

  Sisältää myös perityt [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) ominaisuudet:

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  Sisältää myös perityt [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) ominaisuudet:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `TouchEvent` käsittelijäfunktio {/*touchevent-handler*/}

Tapahtumakäsittelijätyyppi [kosketustapahtumiin.](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)

```js
<div
  onTouchStart={e => console.log('onTouchStart')}
  onTouchMove={e => console.log('onTouchMove')}
  onTouchEnd={e => console.log('onTouchEnd')}
  onTouchCancel={e => console.log('onTouchCancel')}
/>
```

#### Parametrit {/*touchevent-handler-parameters*/}

* `e`: [React tapahtumaolio](#react-event-object) näillä ylimääräisillä [`TouchEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent) ominaisuuksilla:
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/altKey)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/ctrlKey)
  * [`changedTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/changedTouches)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/metaKey)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/shiftKey)
  * [`touches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/touches)
  * [`targetTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/targetTouches)
  
  Sisältää myös perityt [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) ominaisuudet:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `TransitionEvent` käsittelijäfunktio {/*transitionevent-handler*/}

Tapahtumakäsittelijätyyppi CSS siirtymätapahtumiin.

```js
<div
  onTransitionEnd={e => console.log('onTransitionEnd')}
/>
```

#### Parametrit {/*transitionevent-handler-parameters*/}

* `e`: [React tapahtumaolio](#react-event-object) näillä ylimääräisillä [`TransitionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent) ominaisuuksilla:
  * [`elapsedTime`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/elapsedTime)
  * [`propertyName`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/propertyName)
  * [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/pseudoElement)

---

### `UIEvent` käsittelijäfunktio {/*uievent-handler*/}

Tapahtumakäsittelijätyyppi yleisiin käyttöliittymätapahtumiin.

```js
<div
  onScroll={e => console.log('onScroll')}
/>
```

#### Parametrit {/*uievent-handler-parameters*/}

* `e`: [React tapahtumaolio](#react-event-object) näillä ylimääräisillä [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) ominaisuuksilla:
  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `WheelEvent` käsittelijäfunktio {/*wheelevent-handler*/}

Tapahtumakäsittelijätyyppi `onWheel` tapahtumalle.

```js
<div
  onWheel={e => console.log('onWheel')}
/>
```

#### Parametrit {/*wheelevent-handler-parameters*/}

* `e`: [React tapahtumaolio](#react-event-object) näillä ylimääräisillä [`WheelEvent`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent) ominaisuuksilla:
  * [`deltaMode`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaMode)
  * [`deltaX`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaX)
  * [`deltaY`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaY)
  * [`deltaZ`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaZ)


  Sisältää myös perityt [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) ominaisuudet:

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  Sisältää myös perityt [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) ominaisuudet:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

## Käyttö {/*usage*/}

### CSS tyylien käyttö {/*applying-css-styles*/}

Reactissa, määrität CSS-luokan [`className`:lla.](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) Se toimii kuten `class` attribuutti HTML:ssä:

```js
<img className="avatar" />
```

Sitten kirjoitat CSS säännöt sille erillisessä CSS tiedostossa:

```css
/* CSS tiedostossasi */
.avatar {
  border-radius: 50%;
}
```

React ei määrää miten lisäät CSS tiedostoja. Yksinkertaisimmassa tapauksessa, lisäät [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) tagin HTML:ään. Jos käytät rakennustyökalua tai frameworkkia, tutustu sen dokumentaatioon oppiaksesi miten lisäät CSS tiedoston projektiisi.

Joskus, tyylien arvot riippuvat datasta. Käytä `style` attribuuttia välittääksesi joitain tyylejä dynaamisesti:

```js {3-6}
<img
  className="avatar"
  style={{
    width: user.imageSize,
    height: user.imageSize
  }}
/>
```


Ylläolevassa esimerkissä, `style={{}}` ei ole erikoissyntaksi, vaan tavallinen `{}` objekti `style={ }` [JSX aaltosulkeiden](/learn/javascript-in-jsx-with-curly-braces) sisällä. Suosittelemme käyttämään `style` attribuuttia vain silloin kun tyylit riippuvat JavaScript muuttujista.

<Sandpack>

```js src/App.js
import Avatar from './Avatar.js';

const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function App() {
  return <Avatar user={user} />;
}
```

```js src/Avatar.js active
export default function Avatar({ user }) {
  return (
    <img
      src={user.imageUrl}
      alt={'Photo of ' + user.name}
      className="avatar"
      style={{
        width: user.imageSize,
        height: user.imageSize
      }}
    />
  );
}
```

```css src/styles.css
.avatar {
  border-radius: 50%;
}
```

</Sandpack>

<DeepDive>

#### Miten käyttää useita CSS-luokkia ehdollisesti? {/*how-to-apply-multiple-css-classes-conditionally*/}

Määrittääksesi CSS luokkia ehdollisesti, sinun täytyy tuottaa `className` merkkijono itse käyttäen JavaScriptiä.

Esimerkiksi, `className={'row ' + (isSelected ? 'selected': '')}` tuottaa joko `className="row"` tai `className="row selected"` riippuen siitä onko `isSelected` `true`.

Tehdäksesi tästä luettavamman, voit käyttää pientä apukirjastoa kuten [`classnames`:](https://github.com/JedWatson/classnames)

```js
import cn from 'classnames';

function Row({ isSelected }) {
  return (
    <div className={cn('row', isSelected && 'selected')}>
      ...
    </div>
  );
}
```

Se on erityisen kätevää jos sinulla on useita ehdollisia luokkia:

```js
import cn from 'classnames';

function Row({ isSelected, size }) {
  return (
    <div className={cn('row', {
      selected: isSelected,
      large: size === 'large',
      small: size === 'small',
    })}>
      ...
    </div>
  );
}
```

</DeepDive>

---

### DOM elemetin manipuolinti refillä {/*manipulating-a-dom-node-with-a-ref*/}

Joskus sinun täytyy saada selaimen DOM noodi joka on yhdistetty JSX tagiin. Esimerkiksi, jos haluat kohdistaa `<input>`:iin kun painiketta painetaan, sinun täytyy kutsua [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) selaimen `<input>` DOM noodilla.

To obtain the browser DOM node for a tag, [declare a ref](/reference/react/useRef) and pass it as the `ref` attribute to that tag:

```js {7}
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);
  // ...
  return (
    <input ref={inputRef} />
    // ...
```

React asettaa DOM noodin `inputRef.current`:iin kun se on renderöity näytölle.

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

Lue lisää [DOM manipuloinnista refien avulla](/learn/manipulating-the-dom-with-refs) ja [katso lisää esimerkkejä.](/reference/react/useRef#examples-dom)

Kehittyneempiin käyttötapauksiin, `ref` attribuutti hyväksyy myös [takaisinkutsufunktion.](#ref-callback)

---

### Sisäisen HTML sisällön asettaminen vaarallisesti {/*dangerously-setting-the-inner-html*/}

Voit välittää raakaa HTML merkkijonoa elementille näin:

```js
const markup = { __html: '<p>some raw html</p>' };
return <div dangerouslySetInnerHTML={markup} />;
```

**Tämä on vaarallista. Kuten DOM:n [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) ominaisuudella, sinun täytyy olla erittäin varovainen! Ellei merkintä tule täysin luotettavasta lähteestä, on triviaalia aiheuttaa [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting) haavoittuvuus tällä tavalla.**

Esimerkiksi, jos käytät Markdown kirjastoa joka muuntaa Markdownia HTML:ksi, luotat että sen parseri ei sisällä bugeja, ja käyttäjä näkee vain oman syötteen, voit näyttää tuloksena olevan HTML:n näin:

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Hello,_ **Markdown**!');
  return (
    <>
      <label>
        Enter some markdown:
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

```js src/MarkdownPreview.js active
import { Remarkable } from 'remarkable';

const md = new Remarkable();

function renderMarkdownToHTML(markdown) {
  // Tämä on turvallista VAIN koska HTML näytetään
  // samalle käyttäjälle, ja koska luotat tämän
  // Markdown parserin oelvan bugivapaa.
  const renderedHTML = md.render(markdown);
  return {__html: renderedHTML};
}

export default function MarkdownPreview({ markdown }) {
  const markup = renderMarkdownToHTML(markdown);
  return <div dangerouslySetInnerHTML={markup} />;
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

<<<<<<< HEAD
Nähdäksesi miksi mielivaltaisen HTML renderöiminen on vaarallista, korvaa ylläoleva koodi tällä:
=======
The `{__html}` object should be created as close to where the HTML is generated as possible, like the above example does in the `renderMarkdownToHTML` function. This ensures that all raw HTML being used in your code is explicitly marked as such, and that only variables that you expect to contain HTML are passed to `dangerouslySetInnerHTML`. It is not recommended to create the object inline like `<div dangerouslySetInnerHTML={{__html: markup}} />`.

To see why rendering arbitrary HTML is dangerous, replace the code above with this:
>>>>>>> bbb08a5a04b0221137e5d60472fc979747af2954

```js {1-4,7,8}
const post = {
  // Kuvittele tämä sisältö tallennettuna tietokantaan.
  content: `<img src="" onerror='alert("sinut häkkeröitiin")'>`
};

export default function MarkdownPreview() {
  // 🔴 TIETOTURVA-AUKKO: luotettamattoman syötteen välittäminen dangerouslySetInnerHTML:lle
  const markup = { __html: post.content };
  return <div dangerouslySetInnerHTML={markup} />;
}
```

Koodi upotettuna HTML:ssä suoritetaan. Hakkeri voisi käyttää tätä tietoturva-aukkoa varastaakseen käyttäjän tietoja tai suorittaakseen toimia heidän puolestaan. **Käytä `dangerouslySetInnerHTML`:ää vain luotettavan ja puhdistetun datan kanssa.**

---

### Hiiren tapahtumien käsitteleminen {/*handling-mouse-events*/}

Tämä esimerkki näyttää joitain yleisiä [hiiritapahtumia](#mouseevent-handler) ja milloin ne suoritetaan.

<Sandpack>

```js
export default function MouseExample() {
  return (
    <div
      onMouseEnter={e => console.log('onMouseEnter (parent)')}
      onMouseLeave={e => console.log('onMouseLeave (parent)')}
    >
      <button
        onClick={e => console.log('onClick (ensimmäinen painike)')}
        onMouseDown={e => console.log('onMouseDown (ensimmäinen painike)')}
        onMouseEnter={e => console.log('onMouseEnter (ensimmäinen painike)')}
        onMouseLeave={e => console.log('onMouseLeave (ensimmäinen painike)')}
        onMouseOver={e => console.log('onMouseOver (ensimmäinen painike)')}
        onMouseUp={e => console.log('onMouseUp (ensimmäinen painike)')}
      >
        Ensimmäinen painike
      </button>
      <button
        onClick={e => console.log('onClick (toinen painike)')}
        onMouseDown={e => console.log('onMouseDown (toinen painike)')}
        onMouseEnter={e => console.log('onMouseEnter (toinen painike)')}
        onMouseLeave={e => console.log('onMouseLeave (toinen painike)')}
        onMouseOver={e => console.log('onMouseOver (toinen painike)')}
        onMouseUp={e => console.log('onMouseUp (toinen painike)')}
      >
        Toinen painike
      </button>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Osoittimen tapahtumien käsitteleminen {/*handling-pointer-events*/}

Tämä esimerkki näyttää joitain yleisiä [osoitintapahtumia](#pointerevent-handler) ja milloin ne suoritetaan.

<Sandpack>

```js
export default function PointerExample() {
  return (
    <div
      onPointerEnter={e => console.log('onPointerEnter (parent)')}
      onPointerLeave={e => console.log('onPointerLeave (parent)')}
      style={{ padding: 20, backgroundColor: '#ddd' }}
    >
      <div
        onPointerDown={e => console.log('onPointerDown (ensimmäinen lapsi)')}
        onPointerEnter={e => console.log('onPointerEnter (ensimmäinen lapsi)')}
        onPointerLeave={e => console.log('onPointerLeave (ensimmäinen lapsi)')}
        onPointerMove={e => console.log('onPointerMove (ensimmäinen lapsi)')}
        onPointerUp={e => console.log('onPointerUp (ensimmäinen lapsi)')}
        style={{ padding: 20, backgroundColor: 'lightyellow' }}
      >
        Ensimmäinen lapsi
      </div>
      <div
        onPointerDown={e => console.log('onPointerDown (toinen lapsi)')}
        onPointerEnter={e => console.log('onPointerEnter (toinen lapsi)')}
        onPointerLeave={e => console.log('onPointerLeave (toinen lapsi)')}
        onPointerMove={e => console.log('onPointerMove (toinen lapsi)')}
        onPointerUp={e => console.log('onPointerUp (toinen lapsi)')}
        style={{ padding: 20, backgroundColor: 'lightblue' }}
      >
        Toinen lapsi
      </div>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Kohdennustapahtumien käsitteleminen {/*handling-focus-events*/}

Reactissa, [kohdennustapahtumat](#focusevent-handler) kuplivat. Voit käyttää `currentTarget` ja `relatedTarget` erottaaksesi onko kohdennus peräisin ulkopuolelta vai ei. Esimerkki näyttää miten havaita lapsen kohdennustapahtuma, vanhemman kohdennustapahtuma, ja miten havaita kohdennuksen tuleminen tai lähteminen koko alipuusta.

<Sandpack>

```js
export default function FocusExample() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('focused parent');
        } else {
          console.log('focused child', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Ei suoritettu kun vaihdetaan kohdennusta lasten välillä
          console.log('focus entered parent');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('unfocused parent');
        } else {
          console.log('unfocused child', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Ei suoritettu kun vaihdetaan kohdennusta lasten välillä
          console.log('focus left parent');
        }
      }}
    >
      <label>
        Etunimi:
        <input name="firstName" />
      </label>
      <label>
        Sukunimi:
        <input name="lastName" />
      </label>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Näppäimistötapahtumien käsitteleminen {/*handling-keyboard-events*/}

Tämä esimerkki näyttää joitain yleisiä [näppäimistötapahtumia](#keyboardevent-handler) ja milloin ne suoritetaan.

<Sandpack>

```js
export default function KeyboardExample() {
  return (
    <label>
      Etunimi:
      <input
        name="firstName"
        onKeyDown={e => console.log('onKeyDown:', e.key, e.code)}
        onKeyUp={e => console.log('onKeyUp:', e.key, e.code)}
      />
    </label>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>
