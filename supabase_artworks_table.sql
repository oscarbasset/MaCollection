-- Table artworks pour les œuvres ajoutées par les exposants (Supabase)
-- À exécuter dans l’éditeur SQL du projet Supabase (Dashboard > SQL Editor).

create table if not exists public.artworks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now() not null,
  title text not null,
  description text,
  image_url text,
  user_id uuid references auth.users(id) on delete set null
);

-- RLS : lecture publique, écriture pour les utilisateurs connectés
alter table public.artworks enable row level security;

create policy "Lecture publique des œuvres"
  on public.artworks for select
  using (true);

create policy "Un utilisateur peut insérer ses propres œuvres"
  on public.artworks for insert
  with check (auth.uid() = user_id);

create policy "Un utilisateur peut modifier ses propres œuvres"
  on public.artworks for update
  using (auth.uid() = user_id);

create policy "Un utilisateur peut supprimer ses propres œuvres"
  on public.artworks for delete
  using (auth.uid() = user_id);

-- Index pour les requêtes par user_id
create index if not exists artworks_user_id_idx on public.artworks (user_id);
create index if not exists artworks_created_at_idx on public.artworks (created_at desc);
