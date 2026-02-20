# Bucket Storage "avatars" (photos de profil)

L’upload de la photo de profil utilise le bucket **`avatars`** dans Supabase Storage.

## Créer le bucket

1. Supabase Dashboard → **Storage** → **New bucket**
2. Nom : **`avatars`**
3. Public : **oui** (pour afficher les photos en lecture publique)
4. Créer

## Politiques (Policies) RLS Storage

Si vous avez une **StorageApiError** ou une erreur de permission à l’upload :

1. Supabase Dashboard → **Storage** → **Buckets** → **avatars**
2. Onglet **Policies**
3. Ajouter des politiques pour :
   - **Upload** : les utilisateurs connectés peuvent uploader dans leur dossier (ex. `auth.uid()::text` dans le chemin)
   - **Lecture** : tout le monde peut lire (bucket public) ou restreindre selon vos besoins

Exemple de policy **INSERT** (upload) pour autoriser l’upload uniquement dans son dossier :

- Policy name : `Users can upload their own avatar`
- Allowed operation : **INSERT**
- Target roles : `authenticated`
- Policy definition (WITH CHECK) :  
  `(bucket_id = 'avatars') AND (auth.uid()::text = (storage.foldername(name))[1])`

Exemple de policy **SELECT** (lecture) pour bucket public :

- Policy name : `Public read for avatars`
- Allowed operation : **SELECT**
- Policy definition : `bucket_id = 'avatars'`

Adaptez les conditions selon votre schéma (dossier = `user_id` dans le chemin).
