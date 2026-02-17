-- Profils artistes (exposants)
-- À exécuter dans l’éditeur SQL du projet Supabase (Dashboard > SQL Editor).

-- Table profiles : un enregistrement par utilisateur (artiste)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  first_name text,
  last_name text,
  description text
);

alter table public.profiles enable row level security;

create policy "Lecture publique des profils"
  on public.profiles for select
  using (true);

create policy "Un utilisateur peut insérer son propre profil"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Un utilisateur peut modifier son propre profil"
  on public.profiles for update
  using (auth.uid() = id);

create index if not exists profiles_id_idx on public.profiles (id);

-- Table collections : collections créées par les exposants
create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now() not null,
  name text not null,
  description text,
  user_id uuid references auth.users(id) on delete cascade not null
);

alter table public.collections enable row level security;

create policy "Lecture publique des collections"
  on public.collections for select
  using (true);

create policy "Un utilisateur peut insérer ses propres collections"
  on public.collections for insert
  with check (auth.uid() = user_id);

create policy "Un utilisateur peut modifier ses propres collections"
  on public.collections for update
  using (auth.uid() = user_id);

create policy "Un utilisateur peut supprimer ses propres collections"
  on public.collections for delete
  using (auth.uid() = user_id);

create index if not exists collections_user_id_idx on public.collections (user_id);
create index if not exists collections_created_at_idx on public.collections (created_at desc);

-- Ajouter la colonne collection_id à la table artworks (si elle existe déjà)
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'artworks' and column_name = 'collection_id'
  ) then
    alter table public.artworks
    add column collection_id uuid references public.collections(id) on delete set null;
  end if;
end $$;

create index if not exists artworks_collection_id_idx on public.artworks (collection_id);
