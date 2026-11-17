# 3_semester_eksamen_kulturbooking

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Firebase events og tilmeldinger (MVP)

Der er ingen betalingsfunktion. `price` er kun information.

- `events/<eventId>` indeholder titel, kategori, `startsAt` (Unix-tid i millisekunder),
  sted, pris, beskrivelse og billede.
- `users/<uid>` bevarer den eksisterende profil og interesser.
- `registrations/<uid>/<eventId>/registeredAt` indeholder et Firebase-serverstempel.
  Afmelding fjerner kun den konkrete tilmelding. Gentagen tilmelding opretter ikke dubletter.
- Events kan laeses offentligt, men ikke skrives fra appen. Brugere kan kun laese og
  aendre egne tilmeldinger. Serverreglerne afviser ny tilmelding fra eventets start.
  Afmelding er fortsat mulig efter start.

### Opsaetning i Firebase Console

1. Eksporter en backup fra Realtime Database, foer du aendrer databasen.
2. Vaelg **Realtime Database > Data** og opret/vaelg noden **events**.
   Importer [firebase/events.json](firebase/events.json) **under `/events`, aldrig ved roden**.
   Import erstatter indholdet af den valgte node, saa bevar eventuelle eksisterende
   events, hvis der allerede ligger data der. Filen indeholder de fire demo-events
   med samme ID'er som tidligere og datoer i januar 2027.
3. Under **Rules**: sammenhold de eksisterende regler med
   [firebase/database.rules.json](firebase/database.rules.json), og publicer dem.
   Filen bevarer de oplyste `users`- og `events`-regler og tilfoejer `registrations`.
   Bevar andre regler, hvis teamet har tilfoejet nogen siden.
4. Opret ikke tomme tilmeldinger manuelt. `registrations` oprettes automatisk ved
   foerste tilmelding. `registeredAt` skrives af appen med `serverTimestamp()`.

Demoernes `imageKey` henviser til de fire eksisterende billeder i appen. Et event kan
i stedet have `imageUrl` med en offentlig HTTP(S)-adresse eller en sti i appen.
Dato og klokkeslaet vises altid i tidszonen `Europe/Copenhagen`.
Der er ingen lokal fallback: tom database og afvist adgang vises eksplicit i UI.

### Kontrol

```sh
node --test src/services/eventData.test.js
npm run build
```

Efter import og publicering af regler:

1. Aabn `/events` uden login: fire januar-events og detaljer skal kunne ses.
2. Log ind med en testbruger med profil. Tilmeld et kommende event, genindlaes siden,
   og kontroller, at knappen viser **Afmeld event**.
3. Kontroller tilmeldingen under `/profile` > **Mine events**. Interesser matcher
   kommende events i **Anbefalede events**; allerede tilmeldte events udelades.
4. Afmeld via detaljesiden. Tilmeldingen skal forsvinde fra **Mine events**.
5. Brug Firebase Rules Playground til at kontrollere, at ingen kan laese/skrive en
   anden brugers tilmeldinger, og at manglende/allerede startede events afvises.
   Kun egen afmelding skal stadig vaere tilladt efter start.

Firebase Console-opsaetning og disse live-tests skal gennemfoeres separat; et
godkendt build verificerer ikke de publicerede databaseregler.
