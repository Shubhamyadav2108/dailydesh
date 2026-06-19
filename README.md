# Daily Desh — News Portal

Next.js 15 (App Router) + TypeScript + Tailwind + Supabase.
Public news site + admin CMS + auth, all in one repo. No server to manage.

## Stack
- **Frontend + hosting:** Next.js on Vercel (free)
- **DB + auth + CMS backend:** Supabase (free)
- **Domain:** your Hostinger domain points at Vercel

## Features
- Homepage: breaking ticker, featured hero, latest feed, most-viewed rail
- 10 categories, category pages, SEO-friendly article URLs
- Article page: breadcrumbs, reading time, view counter, NewsArticle schema, share buttons
- Admin panel: create / edit / delete / publish / draft, breaking + featured flags
- Email+password auth; only emails in the `admins` table can publish (RLS-enforced)
- Dark mode, mobile-first

## Setup — see DEPLOY.md for the full walkthrough
1. Create a Supabase project, run `supabase/schema.sql` in the SQL editor
2. `insert into admins (email) values ('you@example.com');`
3. Copy `.env.example` → `.env.local`, fill in Supabase URL + anon key
4. `npm install && npm run dev`
5. Sign up at `/login` with your admin email, then go to `/admin`
