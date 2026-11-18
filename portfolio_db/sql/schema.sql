-- =============================================================
-- Base de données du portfolio (Supabase / PostgreSQL)
-- Exécuter ce script dans : Supabase → SQL Editor → New query → Run
-- =============================================================

-- 1. Profil (une seule ligne)
create table if not exists profile (
  id int primary key default 1,
  name text, title text, tagline text,
  bio text[] default '{}',
  photo_url text, cv_url text,
  email text, phone text, location text,
  linkedin text, github text, available text,
  constraint profile_single check (id = 1)
);
insert into profile (id) values (1) on conflict (id) do nothing;

-- 2. Parcours (formations, certifications, expériences)
create table if not exists experiences (
  id uuid primary key default gen_random_uuid(),
  kind text, title text, org text, period text, description text,
  position int default 0
);

-- 3. Compétences (groupes)
create table if not exists skill_groups (
  id uuid primary key default gen_random_uuid(),
  group_name text, items text[] default '{}',
  position int default 0
);

-- 4. Projets
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text, category text, year text,
  featured boolean default false,
  published boolean default true,
  summary text,
  tags text[] default '{}',
  image_url text,
  context text,
  problems text[] default '{}',
  solutions text[] default '{}',
  laws text[] default '{}',
  gallery jsonb default '[]',   -- [{"src": "...", "caption": "..."}]
  links jsonb default '[]',     -- [{"label": "...", "url": "..."}]
  position int default 0
);

-- =============================================================
-- Sécurité (Row Level Security)
-- Lecture : tout le monde (le site public).
-- Écriture : uniquement votre compte administrateur.
-- Remplacez l'email ci-dessous par le vôtre si besoin.
-- =============================================================
alter table profile enable row level security;
alter table experiences enable row level security;
alter table skill_groups enable row level security;
alter table projects enable row level security;

drop policy if exists "lecture publique profil" on profile;
create policy "lecture publique profil" on profile for select using (true);
drop policy if exists "admin profil" on profile;
create policy "admin profil" on profile for all to authenticated
  using (auth.email() = 'yassineoulhaj22@gmail.com')
  with check (auth.email() = 'yassineoulhaj22@gmail.com');

drop policy if exists "lecture publique parcours" on experiences;
create policy "lecture publique parcours" on experiences for select using (true);
drop policy if exists "admin parcours" on experiences;
create policy "admin parcours" on experiences for all to authenticated
  using (auth.email() = 'yassineoulhaj22@gmail.com')
  with check (auth.email() = 'yassineoulhaj22@gmail.com');

drop policy if exists "lecture publique competences" on skill_groups;
create policy "lecture publique competences" on skill_groups for select using (true);
drop policy if exists "admin competences" on skill_groups;
create policy "admin competences" on skill_groups for all to authenticated
  using (auth.email() = 'yassineoulhaj22@gmail.com')
  with check (auth.email() = 'yassineoulhaj22@gmail.com');

drop policy if exists "lecture publique projets" on projects;
create policy "lecture publique projets" on projects for select using (published = true);
drop policy if exists "admin projets" on projects;
create policy "admin projets" on projects for all to authenticated
  using (auth.email() = 'yassineoulhaj22@gmail.com')
  with check (auth.email() = 'yassineoulhaj22@gmail.com');

-- =============================================================
-- Stockage des images (photo, CV, captures de projets)
-- =============================================================
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

drop policy if exists "lecture publique fichiers" on storage.objects;
create policy "lecture publique fichiers" on storage.objects for select
  using (bucket_id = 'portfolio');
drop policy if exists "admin ecriture fichiers" on storage.objects;
create policy "admin ecriture fichiers" on storage.objects for all to authenticated
  using (bucket_id = 'portfolio' and auth.email() = 'yassineoulhaj22@gmail.com')
  with check (bucket_id = 'portfolio' and auth.email() = 'yassineoulhaj22@gmail.com');
