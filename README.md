# 🚀 HirePath – Din klare vei fra søknad til jobb

HirePath er en moderne, mobilvennlig applikasjon for å spore jobbsøknader.  
Den gir deg full kontroll på søknadsprosessen – fra "Draft" til "Offer" – og hjelper deg å følge opp intervjuer, aktiviteter og dokumenter.  

Applikasjonen er bygget som et moderne React-prosjekt med **React 19**, **TypeScript**, **Vite 7**, **styled-components 6** og **Supabase** (Auth, Postgres, Storage, Edge Functions).  
Deploy skjer via **Vercel** for enkel CI/CD.

---

## ✨ Funksjoner

- **Dashboard med Kanban**  
  Dra-og-slipp søknader mellom statuser: Draft, Applied, Interview, Offer, Rejected.

- **Søknadsdetaljer**  
  Tabs for Overview, Activities og Documents med full oversikt over hver søknad.

- **Aktiviteter & Påminnelser**  
  Planlegg oppfølging, sett deadlines og få e-postvarsler når en oppgave forfaller.

- **Dokumenthåndtering**  
  Last opp CV-er, søknadsbrev eller andre filer til Supabase Storage, med sikre signerte nedlastingslenker.

- **Søk og filtre**  
  Globalt søk på selskap, rolle og notater, med filtre for status, prioritet, frister og lokasjon.

- **Statistikk og eksport**  
  KPI-kort, grafer og eksport til CSV for å følge progresjonen din.

- **Tilgjengelighet & mobilvennlighet**  
  Tastatursnarveier (N for ny søknad, F for filter), ARIA-støtte og responsivt design.

---

## 🖼 Mockups

HirePath er designet i en **Playful Startup-stil** inspirert av Notion/Airtable, med runde kort, myke farger og et lett uttrykk.

- **Homepage** – Introduksjon med "hero" og call-to-action  
- **Dashboard** – Oversikt og Kanban  
- **Application detail** – Tabs for søknadsinfo, aktiviteter og dokumenter  
- **Tasks** – Oppgaveliste på tvers av søknader  
- **Settings** – Profil, avatar og varslingstoggles  

*(Se `/mockups`-mappen for bilder av alle sidene.)*

---

## 🛠 Tech Stack

**Core**
- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) – moderne og typesikker frontend
- [Vite 7](https://vitejs.dev/) – rask bundler/dev-server
- [styled-components 6](https://styled-components.com/) – CSS-in-JS med temaer og dynamiske stiler
- [pnpm](https://pnpm.io/) – effektiv pakkehåndtering
- [ESLint (flat config)](https://eslint.org/docs/latest/use/configure/configuration-files-new) + [Prettier](https://prettier.io/) – kodekvalitet og autoformat

**UI & Interaksjon**
- [Radix UI](https://www.radix-ui.com/) – tilgjengelige og moderne UI primitives
- [Framer Motion](https://www.framer.com/motion/) – animasjoner og overgangseffekter
- [React DnD Kit](https://dndkit.com/) – drag-and-drop for Kanban-board
- [Recharts](https://recharts.org/en-US/) – grafer og KPI-visualisering
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) – formhåndtering og validering

**Backend / Data**
- [Supabase](https://supabase.com/) – Auth, Postgres database, RLS, Storage for dokumenter, Edge Functions for cron/varsler
- [Supabase-js v2](https://supabase.com/docs/reference/javascript/start) – klient for Auth, queries og Storage

**Testing & QA**
- [Vitest](https://vitest.dev/) – unit/integration tester
- [Playwright](https://playwright.dev/) – ende-til-ende tester
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) – komponenttester

**CI/CD & DevOps**
- [GitHub Actions](https://docs.github.com/en/actions) – CI for lint, test og build
- [Vercel](https://vercel.com/) – hosting, preview deploys, prod deploy
- [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/okonet/lint-staged) – pre-commit hooks

---

## 📋 Prerequisites

- [Node.js 18+](https://nodejs.org/)  
- [pnpm 10+](https://pnpm.io/)  
- [Supabase account](https://supabase.com/) (for Auth, DB og Storage)  
- [Vercel account](https://vercel.com/) (for deploy)  
- (Valgfritt) SMTP-leverandør som [Resend](https://resend.com/) eller Supabase Email for varsler  

---

## 📦 Kom i gang

### 1. Klon repoet
```bash
git clone git@github.com:<ditt-brukernavn>/hirepath.git
cd hirepath
```

### 2. Installer avhengigheter
```bash
pnpm install
```

### 3. Sett opp miljøvariabler
Opprett `.env.local`:

```env
VITE_SUPABASE_URL=<din-supabase-url>
VITE_SUPABASE_ANON_KEY=<din-anon-key>
```

Merk: med React + Vite må variabler prefikses med `VITE_` for å være tilgjengelige i koden.

### 4. Kjør lokalt
```bash
pnpm dev
```
Åpne http://localhost:5173 i nettleseren.

---

## 🔒 Sikkerhet

- Strenge Row Level Security policies i Supabase sikrer at hver bruker bare får tilgang til egne data.
- Alle dokumenter lagres i en privat bucket og lastes kun ned via signerte URL-er.
- Rate limiting på skrive-actions forhindrer misbruk.

---

## ✅ Status

- [x] Autentisering med Supabase
- [x] Kanban med CRUD
- [x] Aktiviteter med varsler
- [x] Dokumentopplasting og nedlasting
- [x] CSV-eksport
- [x] KPI-kort og grafer
- [x] Mobiloptimalisering
- [x] Forbedrede UI-komponenter (oppdaterte ikoner, blå fargede elementer)

---

## 📌 Veikart

- [ ] Import fra LinkedIn-jobb-URL (metadata-scraper)
- [ ] Deling med mentor via read-only link
- [ ] Push-varsler i appen (toast + realtime updates)
- [ ] Maler for følgebrev per selskap

---

## 👨‍💻 Bidra

Pull requests er velkomne! For større endringer, opprett en issue først for å diskutere hva du ønsker å endre.

---

## 📄 Lisens

MIT © 2025 – Xala Technologies