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
  ('देश', 'desh'),
  ('विदेश', 'videsh'),
  ('राजनीति', 'politics'),
  ('खेल', 'sports'),
  ('अपराध', 'crime'),
  ('मनोरंजन', 'entertainment'),
  ('व्यापार', 'business'),
  ('टेक्नोलॉजी', 'technology'),
  ('स्वास्थ्य', 'health'),
  ('शिक्षा', 'education')
on conflict (slug) do nothing;

-- ---------- SEED SAMPLE ARTICLES ----------
insert into articles (title, slug, excerpt, body, cover_image, category_id, author_name, status, is_breaking, is_featured, views, published_at)
select
  'पश्चिमी तट पर मानसून ने समय से पहले दी दस्तक',
  'monsoon-arrives-early-western-coast',
  'मौसम विभाग ने पुष्टि की कि इस बार मानसून तय समय से कुछ दिन पहले पहुँचा, जिससे किसानों को राहत मिली है।',
  E'दक्षिण-पश्चिम मानसून ने इस बार पश्चिमी तट पर दीर्घकालिक औसत से पहले दस्तक दी है, मौसम विभाग ने गुरुवार को यह जानकारी दी।\n\nअधिकारियों ने बताया कि अरब सागर के ऊपर अनुकूल परिस्थितियाँ बनी हुई हैं और आने वाले सप्ताह में मानसून के आगे बढ़ने की उम्मीद है। लंबे सूखे के बीच बुवाई टाल रहे किसानों ने इस ख़बर का स्वागत किया।\n\n"समय से पहले आगमन से हमें ख़रीफ़ की योजना बनाने का मौक़ा मिलता है," एक राज्य कृषि अधिकारी ने कहा।',
  'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=1200',
  (select id from categories where slug = 'desh'),
  'संवाददाता', 'published', true, true, 1240, now()
where not exists (select 1 from articles where slug = 'monsoon-arrives-early-western-coast');

insert into articles (title, slug, excerpt, body, cover_image, category_id, author_name, status, is_breaking, is_featured, views, published_at)
select
  'लागत घटने से स्टार्टअप्स का रुख़ ऑन-डिवाइस AI की ओर',
  'startups-pivot-on-device-ai',
  'नए संस्थापकों की एक पीढ़ी मान रही है कि मॉडल को लोकल चलाना क्लाउड बिल से बेहतर है — और यूज़र्स को रफ़्तार का फ़र्क़ साफ़ दिखता है।',
  E'बढ़ती संख्या में शुरुआती चरण की कंपनियाँ ऐसे फ़ीचर पेश कर रही हैं जो मशीन-लर्निंग मॉडल को रिमोट सर्वर पर भेजने के बजाय सीधे यूज़र के डिवाइस पर चलाते हैं।\n\nयह बदलाव घटती हार्डवेयर लागत और निजता की अपेक्षाओं से प्रेरित है। निवेशकों का कहना है कि अगले दो वर्षों में यह रुझान उपभोक्ता ऐप्स बनाने के तरीक़े को नया रूप दे सकता है।',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200',
  (select id from categories where slug = 'technology'),
  'टेक डेस्क', 'published', false, true, 890, now()
where not exists (select 1 from articles where slug = 'startups-pivot-on-device-ai');

insert into articles (title, slug, excerpt, body, cover_image, category_id, author_name, status, is_breaking, is_featured, views, published_at)
select
  'शहर की मैराथन में इस साल रिकॉर्ड भागीदारी',
  'city-marathon-record-turnout',
  'सालाना आयोजन में सुबह-सुबह चालीस हज़ार से ज़्यादा धावक सड़कों पर उतरे।',
  E'शहर की सालाना मैराथन में अब तक की सबसे बड़ी भागीदारी देखी गई, आयोजकों ने पुष्टि की कि इसमें शौक़िया से लेकर पेशेवर धावक तक शामिल हुए।\n\nसुबह तक सड़कें फिर से खोल दी गईं और अधिकारियों ने आयोजन के सुचारु संचालन की सराहना की।',
  'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200',
  (select id from categories where slug = 'sports'),
  'खेल डेस्क', 'published', false, false, 430, now()
where not exists (select 1 from articles where slug = 'city-marathon-record-turnout');

-- ============================================================
-- AFTER RUNNING: add yourself as admin (replace the email):
--   insert into admins (email) values ('you@example.com');
-- Then sign up with that same email in the app.
-- ============================================================
