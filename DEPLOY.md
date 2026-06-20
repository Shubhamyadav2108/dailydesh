# DEPLOY.md — Get Samachar live on your Hostinger domain

Total time: ~30–40 min. Everything here is free.
You'll do three things: **Supabase** (database), **Vercel** (hosting), **Hostinger** (point your domain).

---

## PART 1 — Supabase (your database + login system)  ~10 min

1. Go to **https://supabase.com** → sign in → **New project**.
2. Give it a name (e.g. `samachar`), set a database password (save it somewhere), pick the region closest to India (`Mumbai` / `ap-south-1`). Click **Create**. Wait ~2 min.
3. Left sidebar → **SQL Editor** → **New query**.
4. Open the file `supabase/schema.sql` from this project, copy ALL of it, paste, click **Run**. You should see "Success".
5. In the same SQL editor, run this with YOUR email:
   ```sql
   insert into admins (email) values ('youremail@gmail.com');
   ```
   (This is the only account that can publish articles.)
6. Left sidebar → **Project Settings** (gear) → **API**. Copy two values, keep this tab open:
   - **Project URL** → goes into `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → goes into `NEXT_PUBLIC_SUPABASE_ANON_KEY`

> Optional: Settings → **Authentication** → turn OFF "Confirm email" while testing, so signup is instant. Turn it back on before real launch.

---

## PART 2 — Push the code to GitHub  ~5 min

From the project folder on your computer:

```bash
git init
git add .
git commit -m "Samachar news portal"
```

Create a new repo on github.com (e.g. `samachar`), then:

```bash
git remote add origin https://github.com/YOUR-USERNAME/samachar.git
git branch -M main
git push -u origin main
```

---

## PART 3 — Deploy on Vercel  ~5 min

1. Go to **https://vercel.com** → sign in **with GitHub**.
2. **Add New → Project** → import your `samachar` repo.
3. Vercel auto-detects Next.js. Before deploying, expand **Environment Variables** and add these three:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | (Project URL from Supabase) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (anon public key) |
   | `SUPABASE_SERVICE_ROLE_KEY` | (Settings → API → service_role key) |

4. Click **Deploy**. Wait ~2 min. You'll get a live URL like `samachar-xyz.vercel.app`.
5. Open it — your news site is live with the 3 seed articles. Go to `/login`, sign up with your admin email, then `/admin` to publish.

---

## PART 4 — Point your Hostinger domain at Vercel  ~10 min + DNS wait

1. In Vercel → your project → **Settings → Domains** → type your domain (e.g. `samachar.com`) → **Add**.
2. Vercel shows you DNS records. You'll typically get:
   - An **A record**: `@` → `76.76.21.21`
   - A **CNAME**: `www` → `cname.vercel-dns.com`
   (Use whatever Vercel actually displays — it's authoritative.)
3. Log in to **Hostinger → hPanel → Domains → your domain → DNS / Nameservers → DNS Records**.
4. Delete any existing `A` record for `@` that points to Hostinger's parking IP. Then:
   - **Add A record:** Type `A`, Name `@`, Points to `76.76.21.21`, TTL default.
   - **Add CNAME:** Type `CNAME`, Name `www`, Points to `cname.vercel-dns.com`.
5. Save. Go back to Vercel — it will say "Valid Configuration" once DNS propagates (5 min to a few hours, usually fast).
6. Vercel auto-issues a free SSL certificate. Your site is now live on `https://yourdomain.com`. Done.

---

## Daily use — publishing news

- Go to `https://yourdomain.com/admin` → **+ New article**.
- Fill headline, excerpt, body (one paragraph per line), paste a cover image URL.
- Tick **Breaking** to put it in the top ticker, **Featured** to make it the homepage hero.
- Set status **Published** → Save. It's live within 60 seconds (cache revalidation).

---

## Risks / things to watch

- **Email confirmation:** if signup seems stuck, it's the Supabase "Confirm email" setting (Part 1, step 6 note).
- **Can't publish / "Not authorised":** your login email isn't in the `admins` table. Re-run the insert from Part 1 step 5 with the exact email you signed up with.
- **Free-tier limits:** Supabase free tier pauses a project after ~1 week of zero activity — one visit wakes it. Fine for a portfolio/small site; upgrade if it's a real traffic site.
- **Images:** the editor takes image URLs (e.g. from Unsplash or any public link). To upload files directly, you'd add Supabase Storage later — say the word and I'll wire it in additively.
- **Service role key:** never commit `.env.local` to GitHub. It's already in `.gitignore`.
