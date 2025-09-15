## HirePath Frontend

A modern, responsive React + TypeScript frontend for the HirePath homepage. The app features a full-viewport hero with background video, a clean white navbar with logo and outline login button, and a responsive challenges grid. The project is production‑ready with strict linting and a clean code structure.

### Tech Stack
- React 19 + TypeScript
- Vite 7
- styled-components 6
- ESLint (flat config) with Prettier compatibility
- pnpm for package management
- Supabase for authentication and database

### Prerequisites
- Node.js 18+
- pnpm 10+
- Supabase account (for Auth, DB and Storage)

### Getting Started
1. Install dependencies:
```bash
pnpm install
```
2. Set up environment variables:
The `.env.local` file is already configured with your Supabase credentials.

3. Set up the database tables:
Run the SQL from `/src/lib/setup.sql` in your Supabase SQL editor to create all necessary tables.

4. Lint the codebase:
```bash
pnpm run lint
```
5. Build for production:
```bash
pnpm run build
```
6. Preview the production build locally:
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

### Supabase Setup
1. The project is already configured with your Supabase credentials.
2. Create the necessary tables by running this SQL in the Supabase SQL editor:
```sql
-- Create profiles table
create table profiles (
  id uuid references auth.users not null,
  updated_at timestamp with time zone,
  full_name text,
  company text,
  primary key (id)
);

alter table profiles enable row level security;

-- Profile policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create job_applications table
create table job_applications (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  user_id uuid references auth.users not null,
  company_name text not null,
  position text not null,
  status text not null default 'draft',
  applied_date date,
  interview_date date,
  offer_date date,
  rejected_date date,
  notes text,
  url text
);

alter table job_applications enable row level security;

-- Job applications policies
create policy "Users can view their own job applications."
  on job_applications for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own job applications."
  on job_applications for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own job applications."
  on job_applications for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own job applications."
  on job_applications for delete
  using ( auth.uid() = user_id );

-- Create activities table
create table activities (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  user_id uuid references auth.users not null,
  job_application_id uuid references job_applications not null,
  title text not null,
  description text,
  due_date date,
  completed boolean default false,
  type text not null
);

alter table activities enable row level security;

-- Activities policies
create policy "Users can view their own activities."
  on activities for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own activities."
  on activities for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own activities."
  on activities for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own activities."
  on activities for delete
  using ( auth.uid() = user_id );

-- Create documents table
create table documents (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  user_id uuid references auth.users not null,
  job_application_id uuid references job_applications,
  name text not null,
  file_path text not null,
  file_type text,
  file_size integer
);

alter table documents enable row level security;

-- Documents policies
create policy "Users can view their own documents."
  on documents for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own documents."
  on documents for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own documents."
  on documents for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own documents."
  on documents for delete
  using ( auth.uid() = user_id );
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