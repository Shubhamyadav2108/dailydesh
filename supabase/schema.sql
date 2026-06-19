-- ============================================================
-- SAMACHAR NEWS PORTAL — Supabase schema
-- Paste this whole file into Supabase → SQL Editor → Run.
-- ============================================================

-- ---------- CATEGORIES ----------
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz default now()
);

-- ---------- ARTICLES ----------
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  body text not null,
  cover_image text,
  category_id uuid references categories(id) on delete set null,
  author_name text not null default 'Staff Reporter',
  status text not null default 'draft' check (status in ('draft','published')),
  is_breaking boolean not null default false,
  is_featured boolean not null default false,
  views int not null default 0,
  published_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_articles_status on articles(status);
create index if not exists idx_articles_category on articles(category_id);
create index if not exists idx_articles_published on articles(published_at desc);

-- ---------- ADMIN ALLOWLIST ----------
-- Only emails in this table can write via the admin panel.
create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz default now()
);

-- helper: is the current logged-in user an admin?
create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from admins
    where email = (select auth.jwt() ->> 'email')
  );
$$;

-- ---------- ROW LEVEL SECURITY ----------
alter table categories enable row level security;
alter table articles   enable row level security;
alter table admins     enable row level security;

-- Public can READ categories + published articles
drop policy if exists "public read categories" on categories;
create policy "public read categories" on categories
  for select using (true);

drop policy if exists "public read published" on articles;
create policy "public read published" on articles
  for select using (status = 'published' or is_admin());

-- Admins can do everything
drop policy if exists "admin write articles" on articles;
create policy "admin write articles" on articles
  for all using (is_admin()) with check (is_admin());

drop policy if exists "admin write categories" on categories;
create policy "admin write categories" on categories
  for all using (is_admin()) with check (is_admin());

drop policy if exists "admin read admins" on admins;
create policy "admin read admins" on admins
  for select using (is_admin());

-- ---------- SEED CATEGORIES ----------
insert into categories (name, slug) values
  ('National', 'national'),
  ('International', 'international'),
  ('Politics', 'politics'),
  ('Business', 'business'),
  ('Technology', 'technology'),
  ('Sports', 'sports'),
  ('Entertainment', 'entertainment'),
  ('Education', 'education'),
  ('Lifestyle', 'lifestyle'),
  ('Health', 'health')
on conflict (slug) do nothing;

-- ---------- SEED SAMPLE ARTICLES ----------
insert into articles (title, slug, excerpt, body, cover_image, category_id, author_name, status, is_breaking, is_featured, views, published_at)
select
  'Monsoon arrives early across the western coast',
  'monsoon-arrives-early-western-coast',
  'The meteorological department confirms the season set in days ahead of schedule, bringing relief to farmers.',
  E'The southwest monsoon has advanced over the western coast earlier than the long-period average, the weather office said on Thursday.\n\nOfficials noted favourable conditions over the Arabian Sea and expect steady progress inland over the coming week. Farmers in the region, who had delayed sowing amid an extended dry spell, welcomed the development.\n\n"An early onset gives us room to plan the kharif cycle," a state agriculture officer said.',
  'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=1200',
  (select id from categories where slug = 'national'),
  'Staff Reporter', 'published', true, true, 1240, now()
where not exists (select 1 from articles where slug = 'monsoon-arrives-early-western-coast');

insert into articles (title, slug, excerpt, body, cover_image, category_id, author_name, status, is_breaking, is_featured, views, published_at)
select
  'Startups pivot to on-device AI as costs fall',
  'startups-pivot-on-device-ai',
  'A new wave of founders is betting that running models locally beats the cloud bill — and users notice the speed.',
  E'A growing number of early-stage companies are shipping features that run machine-learning models directly on a user''s device rather than calling a remote server.\n\nThe shift is driven by falling hardware costs and privacy expectations. Investors say the trend could reshape how consumer apps are built over the next two years.',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200',
  (select id from categories where slug = 'technology'),
  'Tech Desk', 'published', false, true, 890, now()
where not exists (select 1 from articles where slug = 'startups-pivot-on-device-ai');

insert into articles (title, slug, excerpt, body, cover_image, category_id, author_name, status, is_breaking, is_featured, views, published_at)
select
  'City marathon sees record turnout this year',
  'city-marathon-record-turnout',
  'More than forty thousand runners took to the streets at dawn for the annual event.',
  E'The annual city marathon drew its largest field yet, organisers confirmed, with participants spanning amateurs and elite athletes.\n\nRoad closures were lifted by mid-morning and officials praised the smooth conduct of the event.',
  'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200',
  (select id from categories where slug = 'sports'),
  'Sports Desk', 'published', false, false, 430, now()
where not exists (select 1 from articles where slug = 'city-marathon-record-turnout');

-- ============================================================
-- AFTER RUNNING: add yourself as admin (replace the email):
--   insert into admins (email) values ('you@example.com');
-- Then sign up with that same email in the app.
-- ============================================================
