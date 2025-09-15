# HirePath Dashboard — Implementation Checklist

Repository context: `vision-ui-dashboard-react` (React 18, MUI v5, Emotion, react-router-dom v5, ApexCharts).  
Goal: Rebrand and restructure the template into **HirePath – Your clear path from application to job** with a dark, neon-accented dashboard focused on job-search KPIs, charts, and actionable cards.

---

## 0) High-Level Objectives

- [ ] Replace Vision UI branding with HirePath (logo, palette, copy).
- [ ] Simplify navigation to HirePath pages only.
- [ ] Build a focused dashboard with KPIs, charts, reminders, and activity.
- [ ] Apply a cohesive dark theme with blue→purple accents and accessible contrast.
- [ ] Ensure responsiveness, accessibility, and code cleanliness.

---

## 1) Branding & Theme

**Palette**

- [ ] Background: `#0B0E16`
- [ ] Surface/Card: `#151A24`
- [ ] Primary: `#3B82F6`
- [ ] Secondary: `#8B5CF6`
- [ ] Success: `#22C55E`
- [ ] Warning: `#F59E0B`
- [ ] Error: `#EF4444`
- [ ] Headings: `#FFFFFF`
- [ ] Body text: `#B0B8C1`
- [ ] Dividers/borders: `rgba(255,255,255,0.08)`

**Theme updates (MUI v5)**

- [ ] Update `src/assets/theme/**` to use the palette above.
- [ ] Set `palette.primary.main = #3B82F6`, `palette.secondary.main = #8B5CF6`.
- [ ] Ensure typography has sufficient contrast for h1–h6 and body text.
- [ ] Keep rounded corners at `20px`; subtle shadows; hover gradient ring (blue→violet).

**Brand assets and copy**

- [ ] Add HirePath logo to `src/assets/images/logo-hirepath.*`.
- [ ] Replace logo references in sidebar/header with the HirePath asset.
- [ ] Replace visible “Vision UI/Creative Tim” branding in UI with “HirePath”.
- [ ] Tagline in UI: `Your clear path from application to job.`

**Deliverables**

- [ ] Committed theme files reflecting new palette.
- [ ] Sidebar/header show HirePath logo and tagline.

---

## 2) Navigation & Routing

**Routes (react-router-dom v5)**

- [ ] Update `src/routes.js` to expose only:
  - [ ] `/dashboard` (default)
  - [ ] `/applications`
  - [ ] `/tasks`
  - [ ] `/documents`
  - [ ] `/insights`
  - [ ] `/profile`
  - [ ] `/authentication/sign-in`
  - [ ] `/authentication/sign-up`

**Sidebar (left)**

- [ ] Items with icons (react-icons, or existing icon set):
  - [ ] Dashboard
  - [ ] Applications
  - [ ] Tasks
  - [ ] Documents
  - [ ] Insights
  - [ ] Profile
- [ ] Bottom helper card: “Help & Docs”
- [ ] Active item styling aligned with new theme.

**Navbar (top)**

- [ ] Search input (placeholder: `Search…`)
- [ ] Notification bell
- [ ] User avatar with dropdown: Profile, Settings, Logout

**Deliverables**

- [ ] Cleaned `routes.js` with matching component imports.
- [ ] Sidebar and navbar rendered with correct items and behavior.

---

## 3) Dashboard Page

Create/modify `src/layouts/dashboard/index.js` (or equivalent) with the following sections and styles:

**A. Welcome Card**

- [ ] Title: `Welcome back, Mark.`
- [ ] Subtitle: `Here’s your job search overview.`
- [ ] Accent pill: `Next interview: Tue 10:30`
- [ ] Abstract image/illustration retained or replaced with a subtle new asset.
- [ ] Card style: surface `#151A24`, `border-radius: 20px`, subtle shadow.

**B. KPI Cards (row of 4)**

- [ ] Applications Submitted: value `32`, sublabel `+5 this week` (green).
- [ ] Interviews Scheduled: value `4`, sublabel `2 this week`.
- [ ] Documents Uploaded: value `21`, sublabel `CVs & cover letters`.
- [ ] Success Rate: circular progress `18%`, sublabel `offers / applications`.
- [ ] Hover effect: faint outer glow (blue→violet), `transform: scale(1.01)`.
- [ ] Keyboard focus visible on all cards.

**C. Charts Row (2 panels)**

- [ ] Line chart: `Applications over time` (last 12 weeks).
  - [ ] Implement with `react-apexcharts`.
  - [ ] Blue gradient line, subtle gridlines, minimal y-ticks.
- [ ] Bar chart: `Tasks Completed vs Pending` (last 8 weeks).
  - [ ] Stacked bars: Completed=green, Pending=neutral slate.
- [ ] Charts share theme colors and typography.

**D. Insights & Activity (3 panels)**

- [ ] Upcoming Reminders
  - [ ] Example items: `Follow up with Acme – Thu 09:00`, `Prepare portfolio for Globex – Fri 14:00`.
- [ ] Follow-ups Needed
  - [ ] Count badge `3`; list items include company and last contact date.
- [ ] Recent Activity
  - [ ] Timeline entries: `Moved 'Globex' to Interview`, `Uploaded CV v3.pdf`, `Sent follow-up to Initech`.

**Data placement**

- [ ] Place mock data in `src/layouts/dashboard/data/**` as arrays/objects for easy replacement later.

**Deliverables**

- [ ] Dashboard renders all four KPI cards and both charts.
- [ ] Insights panels show lists/timeline with sample items.

---

## 4) Page Scaffolds

Create minimal pages that reuse the same card style and include empty states.

**Applications**

- [ ] Header: `Applications`
- [ ] Filters: Status (Applied, Interview, Offer, Rejected), Company, Date range.
- [ ] Table or Kanban placeholder.
- [ ] Empty state: `No applications yet. Create your first one.`

**Tasks**

- [ ] Header: `Tasks`
- [ ] Tabs: All, Due Today, Overdue, Completed.
- [ ] List with checkbox, due date, linked application.
- [ ] Empty state: `No tasks yet. Add your first task to stay on track.`

**Documents**

- [ ] Header: `Documents`
- [ ] Drag & drop upload area.
- [ ] File list: name, type, linked application, last updated.
- [ ] Empty state: `No documents uploaded. Drag & drop files to get started.`

**Insights**

- [ ] Header: `Insights`
- [ ] Cards: Success rate over time, Average response time, Applications by channel.
- [ ] Placeholder charts/metrics.

**Profile**

- [ ] Header: `Profile`
- [ ] Sections: Account info, Notifications, Security (password), Danger zone (delete account).

---

## 5) Accessibility & UX

- [ ] Validate color contrast meets WCAG AA for text on dark surfaces.
- [ ] Provide `aria-label` for all icon buttons and chart containers.
- [ ] Ensure tab order is logical; focus rings visible.
- [ ] If sidebar collapses on mobile, trap focus inside while open and restore on close.
- [ ] Keyboard shortcut (optional): `/` focuses search; `g d` navigates to dashboard.

---

## 6) Cleanup & Consistency

- [ ] Remove unused routes: Tables, Billing, RTL, and other demo pages.
- [ ] Remove or archive unused assets.
- [ ] Replace visible “Vision UI/Creative Tim” labels with “HirePath” in the UI (retain license comments in code where required).
- [ ] Ensure consistent spacing, border-radius, and shadows across cards.

---

## 7) Copy: Use Exactly

- [ ] Tagline: `Your clear path from application to job.`
- [ ] KPI labels:
  - [ ] `Applications Submitted`
  - [ ] `Interviews Scheduled`
  - [ ] `Documents Uploaded`
  - [ ] `Success Rate`
- [ ] Chart titles:
  - [ ] `Applications over time`
  - [ ] `Tasks Completed vs Pending`
- [ ] Section headers:
  - [ ] `Upcoming Reminders`
  - [ ] `Follow-ups Needed`
  - [ ] `Recent Activity`
- [ ] Empty states:
  - [ ] Applications: `No applications yet. Create your first one.`
  - [ ] Tasks: `No tasks yet. Add your first task to stay on track.`
  - [ ] Documents: `No documents uploaded. Drag & drop files to get started.`

---

## 8) Acceptance Criteria

- [ ] App boots to `/dashboard` with new theme, branding, and layout.
- [ ] Sidebar and navbar match spec, are responsive, and sidebar collapses at ≤1024px.
- [ ] All KPI cards render with mock values.
- [ ] Both charts render with themed colors and titles.
- [ ] Insights panels render with example items.
- [ ] All target pages exist and are routable from the sidebar; no dead links.
- [ ] Lighthouse (desktop): Performance ≥ 85, Accessibility ≥ 95, Best Practices ≥ 95.
- [ ] ESLint passes; no broken imports; no console errors.

---

## 9) Handover Notes

- [ ] Create `README_HirePath.md` containing:
  - [ ] Overview of changes and branding decisions.
  - [ ] Where to tweak theme colors (`src/assets/theme/base/colors.js` and overrides).
  - [ ] Where to update chart data (`src/layouts/dashboard/data/**`).
  - [ ] How to add real data later (prop patterns and data providers).
- [ ] Provide a short summary of file changes and key diffs in the PR description.

---

## 10) Optional Enhancements

- [ ] Add gradient borders on hover using `::before` with blur for the neon feel.
- [ ] Add reduced-motion fallbacks for users with `prefers-reduced-motion`.
- [ ] Add persistent sidebar collapse state to `localStorage`.
- [ ] Implement simple mock services for Applications/Tasks to simulate real data.

---

**Definition of Done**

- [ ] The UI visually aligns with HirePath branding and the dark neon prototype style.
- [ ] Navigation is streamlined; dashboard is informative at a glance.
- [ ] Codebase is clean, accessible, responsive, and ready to integrate with real data.

---