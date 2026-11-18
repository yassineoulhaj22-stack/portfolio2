-- =============================================================
-- Ajout de la section « Applications » (à exécuter une seule fois)
-- Supabase → SQL Editor → New query → Run
-- =============================================================
create table if not exists apps (
  id uuid primary key default gen_random_uuid(),
  name text,
  description text,
  platform text default 'Android',
  version text,
  size_label text,
  download_url text,        -- lien vers le fichier .apk
  image_url text,           -- icône ou capture (facultatif)
  published boolean default true,
  position int default 0
);

alter table apps enable row level security;

drop policy if exists "lecture publique apps" on apps;
create policy "lecture publique apps" on apps for select using (published = true);
drop policy if exists "admin apps" on apps;
create policy "admin apps" on apps for all to authenticated
  using (auth.email() = 'yassineoulhaj22@gmail.com')
  with check (auth.email() = 'yassineoulhaj22@gmail.com');
