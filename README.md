# HirePath

HirePath is a React + TypeScript application for managing job applications end‑to‑end: applications, tasks, documents, insights and a personalized dashboard. The stack uses Vite, styled‑components, and Supabase (Auth, Postgres, Storage).

---

## Overview

HirePath helps you track every step of your job search. Capture applications, schedule and complete tasks, upload and link documents, and review insights on your progress. The UI is fast, mobile‑friendly, and supports light/dark themes with a refined "glass" look.

---

## Features

- Authentication and profile
  - Email sign‑up/sign‑in via Supabase Auth
  - First/last name captured and used for a personalized dashboard greeting
  - Settings (Profile) with avatar upload to Supabase Storage

- Dashboard
  - Welcome card with upcoming interview date (when applicable)
  - KPI cards and charts (applications over time, tasks completed vs pending, success rate)
  - Real‑time updates via Supabase postgres changes
  - Notification banner when an offer or interview is relevant

- Applications
  - List and Kanban views with persistent selection (remembered across refreshes)
  - Drag‑and‑drop between Kanban columns (Applied, Interview, Offer, Rejected)
  - Inline edits: status change on the colored pill, inline date editing for applied date
  - Status Date column (shows interview/offer/rejected date as relevant)
  - Sorting (date, company, status) and collapsible filters
  - Bulk actions (change status, delete)
  - Per‑row action menu (Edit, Delete, Mark followed up)
  - Quick add in each Kanban column and counts per column
  - "Next action" surfaced from activities

- Tasks
  - Create/edit tasks linked to applications; types (note, call, email, meeting, other)
  - Toggle completed with optimistic UI updates
  - Tabs: All, Due Today, Overdue, Completed (remembered across refreshes)

- Documents
  - Upload to Supabase Storage `documents` bucket with content‑type and signed download URLs
  - Reconciliation to ensure uploaded objects appear in the table
  - Link/unlink to applications, delete from Storage and database
  - Position (from linked application) displayed; dates formatted for readability

- Insights
  - KPIs and charts including Application Conversion Funnel (Rejections in funnel),
    Top Companies Applied To, Job Application Outcomes, Time to First Response
  - Weekly Progress card (Applications, Interviews, Offers, Rejections)
  - Filters (time range/position) and drill‑down on selected charts
  - Real‑time refresh on application changes

- Theming & UX
  - Light/dark mode with refined glassmorphism for cards, navbar, and sidebar
  - Gradient page background applied consistently across authenticated pages
  - Mobile‑friendly layout with overflow fixes and responsive spacing
  - Persistent last visited route (refresh returns you to where you were)

---

## Requirements

- Node.js 18+
- pnpm 10+
- Supabase project (URL + anon key)

---

## Repository layout

```
hirepath/
  app/                 # application source (package.json lives here)
    src/
    public/
    ...
```

All commands below are run inside the `app/` directory.

---

## Setup (local)

1. Clone and enter the project

```bash
git clone https://github.com/<your-org-or-user>/hirepath.git
cd hirepath-1/app
```

2. Install dependencies

```bash
pnpm install
```

3. Configure environment variables

Create a file named `.env.local` in `app/` with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

4. Initialize the database schema in Supabase

- Open the Supabase SQL editor and run the SQL from:
  - `app/src/lib/setup.sql`

This creates the core tables (`profiles`, `job_applications`, `activities`, `documents`), enables Row Level Security, and adds the required policies.

5. Configure Storage (documents)

- In the Supabase dashboard → Storage → Create a bucket named `documents` (private).
- Add Storage RLS policies (SQL editor). Example:

```sql
-- Allow users to manage files under their own folder: {auth.uid()}/...
-- Read
drop policy if exists documents_read on storage.objects;
create policy documents_read
  on storage.objects for select
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Insert/Update/Delete
drop policy if exists documents_write on storage.objects;
create policy documents_write
  on storage.objects for all
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  ) with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
```

6. Lint and build

```bash
pnpm run lint
pnpm run build
```

7. Preview the production build locally

```bash
pnpm run preview -- --host --port 4173
```
Open http://localhost:4173.

---

## Development commands

- `pnpm run lint` – run ESLint
- `pnpm run build` – type‑check and build
- `pnpm run preview` – preview the built app

---

## Troubleshooting

- Commands fail in the repository root: change into `app/` first (`cd app`).
- 403/401 on Storage uploads: verify the `documents` bucket exists and RLS policies include your user folder rule.
- Data not appearing after upload: ensure the `documents` table exists and that `refresh` logic is calling the reconciliation (already implemented in the app).
- Environment variables missing at runtime: confirm `.env.local` lives in `app/` and keys start with `VITE_`.

---

## License

MIT © 2025 – Amin Ismail