## HirePath Frontend

A modern, responsive React + TypeScript frontend for the HirePath homepage. The app features a full-viewport hero with background video, a clean white navbar with logo and outline login button, and a responsive challenges grid. The project is production‑ready with strict linting and a clean code structure.

### Tech Stack
- React 19 + TypeScript
- Vite 7
- styled-components 6
- ESLint (flat config) with Prettier compatibility
- pnpm for package management

### Prerequisites
- Node.js 18+
- pnpm 10+

### Getting Started
1. Install dependencies:
```bash
pnpm install
```
2. Lint the codebase:
```bash
pnpm run lint
```
3. Build for production:
```bash
pnpm run build
```
4. Preview the production build locally:
```bash
pnpm run preview -- --host --port 4173
```
Then open http://localhost:4173.

### Project Structure (key files)
```
app/
  index.html                 # HTML entry; favicon + title
  eslint.config.js           # Flat ESLint config (with Prettier)
  src/
    main.tsx                 # App bootstrap
    index.css                # Global resets and root sizing
    App.tsx                  # Renders Home page
    pages/Home.tsx           # Hero section (video) + challenges grid
    components/
      Navbar.tsx             # White navbar, logo image, outline login button
      ChallengeCard.tsx      # Reusable challenge card component
  public/
    logo-hirepath-wide.png   # Wide brand logo used in navbar
    logo-utentekst.png       # Icon-only logo used as favicon
    videos/hero.mp4          # Background hero video
```

### Configuration & Conventions
- Styling: styled-components, colocated with components.
- Accessibility: semantic elements, focus-visible styles, aria labels where appropriate.
- Responsiveness: fluid typography, CSS grid breakpoints at ~900px and ~640px.
- Code style: explicit, readable names; SOLID-friendly components; no files >200–300 lines (prefer refactor).
- Linting: run `pnpm run lint` before committing. Build must pass.

### Navbar
- Background: off-white `#FAFAFA` to match brand background.
- Brand: image only, sourced from `/logo-hirepath-wide.png` (height set in `Navbar.tsx`).
- Login button: outline variant (white background, dark border/text).

To change the logo:
- Replace `app/public/logo-hirepath-wide.png` with your asset (same filename), or
- Update the `src` of `BrandImg` in `src/components/Navbar.tsx`.

### Hero Section
- Full-viewport hero with background video.
- Video path: `app/public/videos/hero.mp4`.
- Poster/fallback: `/hero.jpg` (optional).
- Overlay ensures text contrast remains accessible.

To change the video:
- Place your file at `app/public/videos/hero.mp4` (or update the `src` in `Home.tsx`).

### Challenges Grid
- Three example cards with image placeholders and participant counts.
- Update titles, counts, and images in `Home.tsx`.
- Provide card images in `app/public/images/` and reference with absolute paths (e.g., `/images/landing.jpg`).

### Favicon & Tab Title
- Favicon: `app/public/logo-utentekst.png` (square icon recommended for sharpness).
- Tab title: managed in `app/index.html`.

### Scripts
- `pnpm run lint` — run ESLint on the codebase
- `pnpm run build` — type-check and build for production
- `pnpm run preview` — preview the built app locally

### Troubleshooting
- Images not showing: ensure assets exist under `app/public/...` and paths in code begin with `/`.
- Video not playing: verify `app/public/videos/hero.mp4` exists and that the browser supports MP4 (H.264/AAC).
- Styles not applied: ensure styled-components is installed and components are imported correctly.

### Development Guidelines
- Keep components small and focused; extract UI into reusable pieces when they exceed ~150 lines.
- Prefer clarity over cleverness; explicit names and simple control flow.
- Avoid introducing new libraries unless necessary.
- Run `pnpm run lint` and `pnpm run build` before committing.

### License
This project is licensed under the MIT License. See `LICENSE` for details.
