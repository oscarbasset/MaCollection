-- Ajouter la colonne photo de profil à la table profiles
-- À exécuter dans Supabase : Dashboard > SQL Editor > New query, coller puis Run.

-- Option 1 : créer la colonne "avatar_url" (recommandé, le code l’utilise par défaut)
alter table public.profiles
add column if not exists avatar_url text;

-- Option 2 : si votre table a déjà "photo_url" ou "avatar", pas besoin de créer une colonne.
-- Dans ce cas, dans src/App.jsx, changez la constante :
--   const PROFILE_AVATAR_COLUMN = 'photo_url';   -- ou 'avatar'
