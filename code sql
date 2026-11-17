-- =============================================================
-- Mode Public / Privé + demandes d'accès
-- À exécuter une seule fois : Supabase → SQL Editor → New query → Run
-- =============================================================

-- 1. Réglage de visibilité
alter table profile add column if not exists visibility text default 'public'
  check (visibility in ('public', 'private'));
update profile set visibility = 'public' where id = 1 and visibility is null;

-- 2. Personnes autorisées à voir un portfolio privé
create table if not exists allowed_viewers (
  email text primary key,
  added_at timestamptz default now()
);

-- 3. Demandes d'accès
create table if not exists access_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  status text default 'pending' check (status in ('pending', 'accepted', 'refused')),
  created_at timestamptz default now()
);

alter table allowed_viewers enable row level security;
alter table access_requests enable row level security;

-- Fonctions utilisées par les règles
create or replace function is_public_profile() returns boolean
language sql stable as $$
  select coalesce((select visibility from profile where id = 1), 'public') = 'public'
$$;

create or replace function is_approved_viewer() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from allowed_viewers where email = auth.email())
$$;

-- Règles des personnes autorisées
drop policy if exists "admin viewers" on allowed_viewers;
create policy "admin viewers" on allowed_viewers for all to authenticated
  using (auth.email() = 'yassineoulhaj22@gmail.com')
  with check (auth.email() = 'yassineoulhaj22@gmail.com');
drop policy if exists "viewer voit son acces" on allowed_viewers;
create policy "viewer voit son acces" on allowed_viewers for select to authenticated
  using (email = auth.email());

-- Règles des demandes
drop policy if exists "demander acces" on access_requests;
create policy "demander acces" on access_requests for insert to authenticated
  with check (email = auth.email());
drop policy if exists "voir sa demande" on access_requests;
create policy "voir sa demande" on access_requests for select to authenticated
  using (email = auth.email());
drop policy if exists "admin demandes" on access_requests;
create policy "admin demandes" on access_requests for all to authenticated
  using (auth.email() = 'yassineoulhaj22@gmail.com')
  with check (auth.email() = 'yassineoulhaj22@gmail.com');

-- 4. Lecture des contenus : public OU personne approuvée
drop policy if exists "lecture publique parcours" on experiences;
create policy "lecture parcours" on experiences for select
  using (is_public_profile() or is_approved_viewer());

drop policy if exists "lecture publique competences" on skill_groups;
create policy "lecture competences" on skill_groups for select
  using (is_public_profile() or is_approved_viewer());

drop policy if exists "lecture publique projets" on projects;
create policy "lecture projets" on projects for select
  using (published = true and (is_public_profile() or is_approved_viewer()));

drop policy if exists "lecture publique apps" on apps;
create policy "lecture apps" on apps for select
  using (published = true and (is_public_profile() or is_approved_viewer()));

-- Le profil (nom, titre, photo) reste visible : c'est la page d'accès.
