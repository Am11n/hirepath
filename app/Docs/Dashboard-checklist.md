# HirePath Dashboard — Implementation Checklist (Project-Specific)


**Stack detected:** React 19 + Vite 7 + TypeScript + styled-components 6 + react-router-dom 6 + Supabase Auth  
**Current structure highlights:**  
- Routing configured in `src/main.tsx` with protected route for `/dashboard` via `ProtectedRoute`.  
- Existing pages: `About.tsx`, `Blog.tsx`, `Dashboard.tsx`, `Features.tsx`, `Home.tsx`, `Login.tsx`, `PrivacyPolicy.tsx`, `Profile.tsx`, `Signup.tsx` under `src/pages/`.  
- Navbar exists `src/components/Navbar.tsx`. **Sidebar component created**.  
- Auth context present: `src/contexts/AuthContext.tsx` (Supabase).  
- Public assets exist under `app/public/` (`logo-hirepath-wide.png`, `logo-utentekst.png`, `videos/hero.mp4`).

**Goal:** Implement a complete **HirePath dashboard** (dark neon theme) with sidebar + navbar layout, KPI cards, charts, reminders, and activity. Keep wording consistent with: **"Your clear path from application to job."**

---

## 0) High-Level Objectives

- [x] Implement a reusable **AppLayout** with **Sidebar + Navbar** that wraps routed pages.  
- [x] Apply HirePath branding (theme colors, typography, tagline).  
- [x] Build `/dashboard` with KPIs, charts, and insights, using mock data.  
- [x] Ensure responsiveness, accessibility (WCAG AA), and clean code (ESLint OK).

---

## 1) Theme & Branding

**Colors**

- [x] Background: `#0B0E16`  
- [x] Card surface: `#151A24`  
- [x] Primary: `#3B82F6` (blue)  
- [x] Secondary: `#8B5CF6` (violet)  
- [x] Success: `#22C55E`  
- [x] Warning: `#F59E0B`  
- [x] Error: `#EF4444`  
- [x] Headings: `#FFFFFF`  
- [x] Body text: `#B0B8C1`  
- [x] Borders/dividers: `rgba(255,255,255,0.08)`

**Implementation**

- [x] Create `src/styles/theme.ts` exporting a styled-components theme object.  
- [x] Wrap app with `<ThemeProvider>` in `src/main.tsx`.  
- [x] Add `GlobalStyle` (e.g., `src/styles/global.ts`) to set background, fonts, base text color.  
- [x] Card pattern: `border-radius: 20px; box-shadow: 0 8px 24px rgba(0,0,0,.35);`  
- [x] Hover: subtle glow (blue→violet) via outline/box-shadow or pseudo-element.

**Brand copy**

- [x] Tagline in UI: `Your clear path from application to job.`  
- [x] Use `public/logo-hirepath-wide.png` in Sidebar and/or Navbar.

---

## 2) Layout & Navigation

**Create a shared layout**

- [x] Add `src/layouts/AppLayout.tsx` that renders:
  - [x] `<Sidebar />` (left, fixed/collapsible)  
  - [x] `<Navbar />` (top)  
  - [x] `<Outlet />` (main content area)  
- [x] Use CSS Grid or flex to create a 2-column layout (sidebar + content), with responsive collapse ≤ 1024px.

**Sidebar (`src/components/Sidebar.tsx`)**

- [x] Build a vertical menu with icons (use `react-icons` or `lucide-react`):  
  - [x] Dashboard (`/dashboard`)  
  - [x] Applications (`/applications`)  
  - [x] Tasks (`/tasks`)  
  - [x] Documents (`/documents`)  
  - [x] Insights (`/insights`)  
  - [x] Profile (`/profile`)  
- [x] Bottom helper link: "Help & Docs".  
- [x] Active state styling (primary/secondary accent, subtle left bar).  
- [x] Collapsible behavior on mobile (hamburger button in Navbar toggles Sidebar).

**Navbar (`src/components/Navbar.tsx`)**

- [x] Keep existing component; enhance with:  
  - [x] Search input (placeholder: `Search…`, focus via keyboard `/`).  
  - [x] Notification bell icon.  
  - [x] User avatar with dropdown: Profile, Settings, Logout.  
- [x] Maintain sticky top and dark surface background.

**Routing (react-router-dom v6)**

- [x] In `src/main.tsx`, wrap **protected app routes** with `AppLayout`. Example:
  - [x] `/dashboard` (default protected page)  
  - [x] `/applications`  
  - [x] `/tasks`  
  - [x] `/documents`  
  - [x] `/insights`  
  - [x] `/profile`  
- [x] Keep public routes: `/`, `/login`, `/signup`, `/privacy`, `/blog`, `/about`, `/features`.

---

## 3) Dashboard Page (`src/pages/Dashboard.tsx`)

**A. Welcome Card**

- [x] Title: `Welcome back, [User Name]`  
- [x] Subtitle: `Here's your job search overview.`  
- [x] Pill: `Next interview: Tue 10:30`  
- [x] Small abstract illustration or icon.  
- [x] Style: theme surface, 20px radius, subtle shadow.

**B. KPI Cards (grid of 4)**

- [x] **Applications Submitted** — value `32` — sub: `+5 this week` (green).  
- [x] **Interviews Scheduled** — value `4` — sub: `2 this week`.  
- [x] **Documents Uploaded** — value `21` — sub: `CVs & cover letters`.  
- [x] **Success Rate** — circular progress `18%` — sub: `offers / applications`.  
- [x] Hover: faint neon glow; keyboard focus outline.

**C. Charts Row (2 panels)**

- [x] Line chart — **Applications over time** (last 12 weeks).  
- [x] Bar chart — **Tasks Completed vs Pending** (last 8 weeks).  
- [x] Use **Recharts** (add to deps if missing): `recharts@latest`.  
- [x] Theme the charts: blue line with gradient, stacked bars (completed=success, pending=slate).
- [x] Add tooltip with exact values and benchmark line (10 applications/week) - **Applications over time**
- [x] Change to stacked bar chart and add percentage values over bars - **Tasks Completed vs Pending**
- [x] Fix legend labels (Completed in green, Pending in gray) - **Tasks Completed vs Pending**
- [x] Fix tooltip to correctly show "Completed" and "Pending" - **Tasks Completed vs Pending**
- [x] Ensure legend text is white and readable - **Both charts**
- [x] Ensure tooltip text is white and readable - **Both charts**
- [x] Use consistent custom legend implementation - **Both charts**

**D. Insights Row (3 panels)**

- [x] **Upcoming Reminders** (list): e.g., `Follow up with Acme — Thu 09:00`, `Prepare portfolio — Fri 14:00`.  
- [x] **Follow-ups Needed**: badge count `3` + list with company and last contact date.  
- [x] **Recent Activity**: timeline entries `Moved 'Globex' to Interview`, `Uploaded CV v3.pdf`, `Sent follow-up to Initech`.
- [x] Use "due soon" colors (yellow for tomorrow, red for overdue) in Upcoming Reminders
- [x] Add "+ Add reminder" button for quick input in Upcoming Reminders
- [x] Add "Contact now" button/icon for direct action in Follow-ups Needed
- [x] Show small icons for activity type (document, interview, application, communication) in Recent Activity
- [x] Add filtering capability (Last 7 days, Last 30 days) to Recent Activity

**Data placement**

- [x] Create `src/data/mock/` and store arrays for KPIs, charts, reminders, activity.  
- [x] Keep all mock data typed with small interfaces.

---

## 4) Other Pages (Scaffolds in `src/pages/`)

**Applications**

- [x] Header: `Applications`  
- [x] Filters: Status (Applied, Interview, Offer, Rejected), Company, Date range.  
- [x] Table or Kanban placeholder.  
- [x] Empty state: `No applications yet. Create your first one.`

**Tasks**

- [x] Header: `Tasks`  
- [x] Tabs: All, Due Today, Overdue, Completed.  
- [x] List with checkbox, due date, linked application.  
- [x] Empty state: `No tasks yet. Add your first task to stay on track.`

**Documents**

- [x] Header: `Documents`  
- [x] Drag & drop upload area.  
- [x] File list: name, type, linked application, last updated.  
- [x] Empty state: `No documents uploaded. Drag & drop files to get started.`

**Insights**

- [x] Header: `Insights`  
- [x] Cards: Success rate over time, Average response time, Applications by channel.  
- [x] Placeholder charts/metrics.

**Profile**

- [x] Header: `Profile`  
- [x] Sections: Account info, Notifications, Security (password), Danger zone (delete account).

---

## 5) Accessibility & UX

- [x] Validate contrast (WCAG AA) for text on dark surfaces.  
- [x] Provide `aria-label` for icon buttons and chart containers.  
- [x] Ensure logical tab order; visible focus rings.  
- [x] Sidebar keyboard trap when open on mobile; restore focus on close.  
- [x] Keyboard shortcut: `/` focuses search input.

---

## 6) Cleanup & Consistency

- [x] Remove placeholder/demo code if any.  
- [x] Unify spacing, border-radius, and shadows across cards.  
- [x] Ensure ESLint + Prettier pass; no console errors.  
- [x] Keep file naming consistent: `PascalCase` components, `kebab-case` assets.

---

## 7) Copy (Use Exactly)

- [x] Tagline: `Your clear path from application to job.`  
- [x] KPI labels:
  - [x] `Applications Submitted`
  - [x] `Interviews Scheduled`
  - [x] `Documents Uploaded`
  - [x] `Success Rate`
- [x] Chart titles:
  - [x] `Applications over time`
  - [x] `Tasks Completed vs Pending`
- [x] Section headers:
  - [x] `Upcoming Reminders`
  - [x] `Follow-ups Needed`
  - [x] `Recent Activity`

---

## 8) Acceptance Criteria

- [x] `/dashboard` uses **AppLayout** (Sidebar + Navbar).  
- [x] Dashboard renders: Welcome card, 4 KPI cards, 2 charts, 3 insights panels.  
- [x] All nav pages exist and are reachable from Sidebar.  
- [x] Responsive (sidebar collapses ≤ 1024px).  
- [ ] Lighthouse desktop: Performance ≥ 85, Accessibility ≥ 95.  
- [x] No build or runtime errors; ESLint clean.

---

## 9) Handover Notes

- [x] Theme in `src/styles/theme.ts` and `src/styles/global.ts`.  
- [x] Mock data in `src/data/mock/*`.  
- [x] Public assets under `app/public/` (logos, videos).  
- [x] Future: connect KPIs/Lists to Supabase via `src/contexts/AuthContext.tsx` and `src/lib/supabaseClient.ts`.

---

## 10) Optional Enhancements

- [ ] Gradient borders on card hover (neon feel).  
- [ ] `prefers-reduced-motion` media query to reduce animations.  
- [ ] Persist sidebar collapsed state to `localStorage`.  
- [ ] Add minimal services layer for Applications/Tasks with fake latency to mimic real API.

---

**Definition of Done**

- Visuals match HirePath brand and dark neon style.  
- Navigation streamlined; no dead links.  
- Code is clean, accessible, and ready for data integration.