import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BadgeDollarSign,
  Heart,
  User2,
  X,
  Search as SearchIcon,
  Compass,
  PlayCircle,
  LogOut,
} from 'lucide-react';
import { artists, collections, artworks } from './mockData';
import { supabase } from './supabaseClient';

const LS_EXPOSANT_KEY = 'macollection_has_exposant_profile';
// Nom de la colonne photo de profil dans la table profiles (à changer en 'photo_url' si votre table l'utilise)
const PROFILE_AVATAR_COLUMN = 'avatar_url';

function getInitials(profile, email) {
  if (profile?.first_name || profile?.last_name) {
    const first = (profile.first_name ?? '').trim().charAt(0).toUpperCase();
    const last = (profile.last_name ?? '').trim().charAt(0).toUpperCase();
    if (first || last) return (first + last).slice(0, 2);
  }
  if (email && typeof email === 'string') {
    const local = email.split('@')[0].trim();
    return local.charAt(0).toUpperCase().slice(0, 2);
  }
  return '?';
}

function getArtistById(id) {
  return artists.find((artist) => artist.id === id);
}

function getCollectionsForArtist(artistId) {
  return collections.filter((collection) => collection.artistId === artistId);
}

function getArtworksForCollection(collectionId) {
  return artworks.filter((artwork) => artwork.collectionId === collectionId);
}

// Algorithme très simple qui favorise les œuvres
// de la même collection puis du même artiste lorsqu’une œuvre est likée.
function reorderFeed(currentFeed, pivotArtwork) {
  if (!pivotArtwork) return currentFeed;

  const pivotArtistId = pivotArtwork.artistId;
  const pivotCollectionId = pivotArtwork.collectionId;

  const scored = [...currentFeed].map((artwork) => {
    let score = 0;
    if (artwork.id === pivotArtwork.id) score += 3;
    if (artwork.collectionId === pivotCollectionId) score += 2;
    if (artwork.artistId === pivotArtistId) score += 1;
    return { artwork, score };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.map((item) => item.artwork);
}

function formatPrice(euros) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(euros);
}

function formatSeconds(seconds) {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.round(seconds / 60);
  return `${minutes} min`;
}

function ArtworkMedia({ mediaType, mediaUrl, title }) {
  /* width 100%, height 100%, object-fit cover : plein écran ; desktop = centré dans la colonne */
  const mediaClasses =
    'absolute inset-0 z-0 h-full w-full object-cover object-center';
  if (mediaType === 'video') {
    return (
      <video
        src={mediaUrl}
        className={`${mediaClasses} opacity-90`}
        autoPlay
        loop
        muted
        playsInline
      />
    );
  }

  return (
    <img
      src={mediaUrl}
      alt={title}
      className={mediaClasses}
      loading="eager"
      referrerPolicy="no-referrer"
    />
  );
}

function ArtworkSlide({
  artwork,
  isLiked,
  onToggleLike,
  onOpenOffer,
  onOpenArtistProfile,
}) {
  const artist = getArtistById(artwork.artistId);
  const collection = collections.find(
    (col) => col.id === artwork.collectionId,
  );

  const displayedLikes = artwork.likes + (isLiked ? 1 : 0);

  return (
    <section className="balade-slide w-full shrink-0 snap-start snap-always overflow-hidden bg-black md:mx-auto md:max-w-[420px]">
      <motion.div
        layout
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -40, scale: 0.98 }}
        transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
        className="relative h-full w-full overflow-hidden"
      >
        {/* Arrière-plan : image en position absolue (z-0), ne pousse pas le texte */}
        <ArtworkMedia
          mediaType={artwork.mediaType}
          mediaUrl={artwork.mediaUrl}
          title={artwork.title}
        />

        {/* Description : overlay transparent au-dessus de l’image (z-10), dégradé + padding large */}
        <div className="balade-overlay-bottom">
          <h2 className="text-lg font-semibold drop-shadow-lg sm:text-xl md:text-2xl">
            {artwork.title}
          </h2>
          <p className="mt-0.5 text-sm drop-shadow-lg">
            {artist?.name}
            {collection ? ` · ${collection.title}` : ''}
          </p>
          <p className="balade-description-clamp mt-2 text-xs text-white/95 drop-shadow-lg sm:text-sm">
            {artwork.description}
          </p>
        </div>

        {/* Boutons d’action : colonne verticale à droite */}
        <div className="balade-actions-safe absolute right-4 z-30 flex flex-col justify-end gap-4">
            <div className="pointer-events-auto flex flex-col items-center gap-3 text-xs text-slate-100">
              <button
                type="button"
                onClick={onToggleLike}
                className="glass-panel flex h-11 w-11 items-center justify-center rounded-full transition hover:scale-[1.04] hover:bg-white/15 active:scale-[0.96]"
              >
                <Heart
                  className={`h-5 w-5 ${
                    isLiked ? 'fill-rose-500 text-rose-400' : 'text-slate-100'
                  }`}
                />
              </button>
              <span className="text-[0.6rem] uppercase tracking-[0.2em] text-white drop-shadow-lg">
                {displayedLikes.toLocaleString('fr-FR')}
              </span>

              <button
                type="button"
                onClick={onOpenOffer}
                className="glass-panel flex h-12 w-20 flex-col items-center justify-center rounded-full text-[0.6rem] font-medium text-emerald-100 transition hover:scale-[1.04] hover:bg-emerald-500/20 active:scale-[0.96]"
              >
                <BadgeDollarSign className="h-4 w-4" />
                <span className="mt-0.5">
                  {formatPrice(artwork.price).replace(/\s?EUR/, '€')}
                </span>
              </button>

              <button
                type="button"
                onClick={onOpenArtistProfile}
                className="glass-panel flex h-11 w-11 items-center justify-center rounded-full text-xs font-medium text-sky-100 transition hover:scale-[1.04] hover:bg-sky-500/20 active:scale-[0.96]"
              >
                <User2 className="h-5 w-5" />
              </button>
            </div>
        </div>
      </motion.div>
    </section>
  );
}

function ArtistProfileView({ artistId, onBackToFeed }) {
  const artist = getArtistById(artistId);

  const collectionsWithArtworks = useMemo(() => {
    if (!artist) return [];
    const artistCollections = getCollectionsForArtist(artist.id);
    return artistCollections
      .map((collection) => ({
        collection,
        artworks: getArtworksForCollection(collection.id),
      }))
      .filter((group) => group.artworks.length > 0);
  }, [artist]);

  if (!artist) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-center">
        <p className="mb-4 text-sm text-slate-300">
          Artiste introuvable. La collection a peut-être été déplacée.
        </p>
        <button
          type="button"
          onClick={onBackToFeed}
          className="glass-panel rounded-full px-4 py-2 text-xs font-medium text-slate-50"
        >
          Revenir à la balade
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-black via-mc-bg to-black px-3 py-4 sm:px-6 md:px-10">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 pb-4 pt-2">
        <button
          type="button"
          onClick={onBackToFeed}
          className="glass-panel inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-slate-100"
        >
          <X className="h-3.5 w-3.5" />
          <span className="uppercase tracking-[0.18em]">Balade</span>
        </button>
        <span className="text-[0.65rem] uppercase tracking-[0.2em] text-slate-400">
          Profil artiste
        </span>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 pb-6">
        <section className="glass-panel flex flex-col gap-4 rounded-[32px] p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-[24px] border border-white/20 bg-black/50 sm:h-20 sm:w-20">
              {artist.avatarUrl ? (
                <img
                  src={artist.avatarUrl}
                  alt={artist.name}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <User2 className="h-7 w-7 text-slate-300" />
                </div>
              )}
            </div>
            <div className="space-y-1">
              <h1 className="text-lg font-semibold text-slate-50 sm:text-xl">
                {artist.name}
              </h1>
              <p className="text-xs text-slate-300 sm:text-sm">
                {artist.bio}
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-5 pb-12">
          {collectionsWithArtworks.map(({ collection, artworks: colArtworks }) => (
            <div
              key={collection.id}
              className="space-y-3 rounded-[28px] bg-black/40 p-3 sm:p-4 md:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h2 className="text-sm font-semibold text-slate-50 sm:text-base">
                    {collection.title}
                  </h2>
                  <p className="text-[0.7rem] leading-relaxed text-slate-300 sm:text-xs">
                    {collection.concept}
                  </p>
                </div>
                <span className="pill bg-white/5 text-[0.6rem] text-slate-200">
                  {colArtworks.length} œuvre
                  {colArtworks.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
                {colArtworks.map((artwork) => (
                  <div
                    key={artwork.id}
                    className="group relative overflow-hidden rounded-2xl bg-black/60"
                  >
                    <ArtworkMedia
                      mediaType={artwork.mediaType}
                      mediaUrl={artwork.mediaUrl}
                      title={artwork.title}
                    />
                    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/70 via-black/20 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="flex justify-end text-[0.6rem] text-slate-200">
                        {formatPrice(artwork.price)}
                      </div>
                      <div className="space-y-0.5 text-[0.65rem] text-slate-50">
                        <p className="line-clamp-2 font-medium">
                          {artwork.title}
                        </p>
                        <p className="text-[0.6rem] text-slate-300">
                          {formatSeconds(artwork.averageViewTime)} de vue
                          moyenne
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

function MonEspaceView({ user, onBack, onEdit, onProfileUpdated }) {
  const [profile, setProfile] = useState(null);
  const [collections, setCollections] = useState([]);
  const [userArtworks, setUserArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showAddArtworkModal, setShowAddArtworkModal] = useState(false);

  const loadData = React.useCallback(async () => {
    const [profileRes, collectionsRes, artworksRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
      supabase.from('collections').select('id, name, description').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('artworks').select('id, title, description, image_url, collection_id').eq('user_id', user.id).order('created_at', { ascending: false }),
    ]);
    setProfile(profileRes.data ?? null);
    setCollections(Array.isArray(collectionsRes.data) ? collectionsRes.data : []);
    const raw = Array.isArray(artworksRes.data) ? artworksRes.data : [];
    setUserArtworks(raw.map((row) => ({
      id: row.id,
      title: row.title ?? '',
      description: row.description ?? '',
      mediaType: 'image',
      mediaUrl: row.image_url ?? '',
      price: 0,
      averageViewTime: 0,
      collectionId: row.collection_id ?? null,
    })));
  }, [user.id]);

  useEffect(() => {
    let cancelled = false;
    loadData().then(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [loadData]);

  useEffect(() => {
    if (profile) {
      setEditFirstName(profile.first_name ?? '');
      setEditLastName(profile.last_name ?? '');
      setEditDescription(profile.description ?? '');
    }
  }, [profile?.id]);

  useEffect(() => {
    if (!loading && !profile) {
      setEditingProfile(true);
    }
  }, [loading, profile]);

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl);
    };
  }, [avatarPreviewUrl]);

  const collectionsWithArtworks = useMemo(() => {
    return collections.map((col) => ({
      collection: col,
      artworks: userArtworks.filter((a) => a.collectionId === col.id),
    })).filter((g) => g.artworks.length > 0);
  }, [collections, userArtworks]);

  const artworksWithoutCollection = useMemo(
    () => userArtworks.filter((a) => !a.collectionId),
    [userArtworks],
  );

  const handleAvatarChange = (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl);
    setAvatarFile(file);
    setAvatarPreviewUrl(URL.createObjectURL(file));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveError('');
    setSaveSuccess(false);
    setSaving(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        setSaveError('Erreur de connexion. Reconnectez-vous puis réessayez.');
        setSaving(false);
        return;
      }
      if (!user?.id) {
        setSaveError('Session invalide. Reconnectez-vous.');
        setSaving(false);
        return;
      }
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(user.id)) {
        setSaveError('Identifiant utilisateur invalide. Reconnectez-vous.');
        setSaving(false);
        return;
      }
      const userId = user.id;
      let avatarUrl = profile?.[PROFILE_AVATAR_COLUMN] ?? null;
      if (avatarFile) {
        try {
          avatarUrl = await uploadAvatarImage(supabase, userId, avatarFile);
          setAvatarFile(null);
          if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl);
          setAvatarPreviewUrl('');
        } catch (storageErr) {
          setSaveError('Erreur de stockage : l\'image n\'a pas pu être envoyée. Vérifiez le bucket "avatars" et les politiques Storage sur Supabase.');
          setSaving(false);
          return;
        }
      }
      const row = {
        id: userId,
        first_name: editFirstName.trim() || null,
        last_name: editLastName.trim() || null,
        description: editDescription.trim() || null,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase
        .from('profiles')
        .upsert(row, { onConflict: 'id' });
      if (error) throw error;
      setProfile((prev) => (prev ? { ...prev, first_name: editFirstName.trim(), last_name: editLastName.trim(), description: editDescription.trim(), avatar_url: avatarUrl } : { id: userId, first_name: editFirstName.trim(), last_name: editLastName.trim(), description: editDescription.trim(), avatar_url: avatarUrl }));
      onProfileUpdated?.({ first_name: editFirstName.trim(), last_name: editLastName.trim(), description: editDescription.trim(), avatar_url: avatarUrl });
      setEditingProfile(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err?.message ?? 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <p className="text-slate-400">Chargement…</p>
      </div>
    );
  }

  const displayName = profile ? [profile.first_name, profile.last_name].filter(Boolean).join(' ').trim() || 'Mon espace' : 'Mon espace';
  const description = profile?.description ?? '';
  const currentAvatarUrl = avatarPreviewUrl || profile?.[PROFILE_AVATAR_COLUMN];

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-black via-mc-bg to-black px-3 py-4 sm:px-6 md:px-10">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 pb-4 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="glass-panel inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-slate-100"
        >
          <X className="h-3.5 w-3.5" />
          <span className="uppercase tracking-[0.18em]">Catalogue</span>
        </button>
        <span className="text-[0.65rem] uppercase tracking-[0.2em] text-slate-400">
          Mon espace
        </span>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 pb-6">
        {/* Bloc Profil / Bio */}
        <section className="glass-panel rounded-[32px] p-4 sm:p-6">
          {editingProfile ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <label className="block shrink-0 cursor-pointer">
                  <span className="mb-2 block text-xs text-slate-400">Photo de profil</span>
                  <div className="relative h-20 w-20 overflow-hidden rounded-[24px] border border-white/20 bg-black/50 sm:h-24 sm:w-24">
                    {currentAvatarUrl ? (
                      <img src={currentAvatarUrl} alt="Aperçu" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <User2 className="h-10 w-10 text-slate-500" />
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="mt-2 block w-full text-[0.65rem] text-slate-400 file:mr-2 file:rounded-lg file:border-0 file:bg-white/10 file:px-2 file:py-1 file:text-xs file:text-slate-200"
                  />
                </label>
                <div className="min-w-0 flex-1 space-y-3">
                  <label className="block text-xs text-slate-400">
                    Prénom
                    <input
                      type="text"
                      value={editFirstName}
                      onChange={(e) => setEditFirstName(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                      placeholder="Prénom"
                    />
                  </label>
                  <label className="block text-xs text-slate-400">
                    Nom
                    <input
                      type="text"
                      value={editLastName}
                      onChange={(e) => setEditLastName(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                      placeholder="Nom"
                    />
                  </label>
                  <label className="block text-xs text-slate-400">
                    Bio / Description
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows={4}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                      placeholder="Présentez votre travail…"
                    />
                  </label>
                </div>
              </div>
              {saveError && <p className="text-xs text-rose-400">{saveError}</p>}
              {saveSuccess && <p className="text-xs text-emerald-400">Profil mis à jour !</p>}
              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-100 disabled:opacity-50"
                >
                  {saving ? 'Sauvegarde…' : 'Sauvegarder'}
                </button>
                <button
                  type="button"
                  onClick={() => { setEditingProfile(false); setSaveError(''); }}
                  className="rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-white/5"
                >
                  Annuler
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-[24px] border border-white/20 bg-black/50 sm:h-20 sm:w-20 flex items-center justify-center">
                  {profile?.[PROFILE_AVATAR_COLUMN] ? (
                    <img src={profile[PROFILE_AVATAR_COLUMN]} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <User2 className="h-8 w-8 text-slate-400 sm:h-10 sm:w-10" />
                  )}
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <h1 className="text-lg font-semibold text-slate-50 sm:text-xl truncate">
                    {displayName}
                  </h1>
                  {description && (
                    <p className="text-xs text-slate-300 sm:text-sm line-clamp-3">
                      {description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingProfile(true)}
                  className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-slate-100 hover:bg-white/10"
                >
                  Modifier mon profil
                </button>
                <button
                  type="button"
                  onClick={onEdit}
                  className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-slate-100 hover:bg-white/10"
                >
                  Gérer mes œuvres
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Ajouter une œuvre */}
        <section className="rounded-2xl border border-white/10 bg-black/40 p-4">
          <h2 className="text-sm font-semibold text-slate-50 mb-2">Mes œuvres</h2>
          {collections.length === 0 ? (
            <p className="text-xs text-slate-400 mb-3">
              Créez d’abord une collection depuis « Gérer mes œuvres » pour pouvoir ajouter des œuvres.
            </p>
          ) : (
            <button
              type="button"
              onClick={() => setShowAddArtworkModal(true)}
              className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-100"
            >
              Ajouter une œuvre
            </button>
          )}
        </section>

        {/* Œuvres par collection */}
        <section className="space-y-5 pb-12">
          {collectionsWithArtworks.map(({ collection, artworks: colArtworks }) => (
            <div
              key={collection.id}
              className="space-y-3 rounded-[28px] bg-black/40 p-3 sm:p-4 md:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h2 className="text-sm font-semibold text-slate-50 sm:text-base">
                    {collection.name}
                  </h2>
                  {collection.description && (
                    <p className="text-[0.7rem] leading-relaxed text-slate-300 sm:text-xs">
                      {collection.description}
                    </p>
                  )}
                </div>
                <span className="pill bg-white/5 text-[0.6rem] text-slate-200">
                  {colArtworks.length} œuvre
                  {colArtworks.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
                {colArtworks.map((artwork) => (
                  <div
                    key={artwork.id}
                    className="group relative overflow-hidden rounded-2xl bg-black/60"
                  >
                    <ArtworkMedia
                      mediaType={artwork.mediaType}
                      mediaUrl={artwork.mediaUrl}
                      title={artwork.title}
                    />
                    <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-2">
                      <p className="line-clamp-2 text-[0.65rem] font-medium text-slate-50">
                        {artwork.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {artworksWithoutCollection.length > 0 && (
            <div className="space-y-3 rounded-[28px] bg-black/40 p-3 sm:p-4 md:p-5">
              <h2 className="text-sm font-semibold text-slate-50 sm:text-base">
                Sans collection
              </h2>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
                {artworksWithoutCollection.map((artwork) => (
                  <div
                    key={artwork.id}
                    className="group relative overflow-hidden rounded-2xl bg-black/60"
                  >
                    <ArtworkMedia
                      mediaType={artwork.mediaType}
                      mediaUrl={artwork.mediaUrl}
                      title={artwork.title}
                    />
                    <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-2">
                      <p className="line-clamp-2 text-[0.65rem] font-medium text-slate-50">
                        {artwork.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {collectionsWithArtworks.length === 0 && artworksWithoutCollection.length === 0 && (
            <p className="text-sm text-slate-400">Aucune œuvre publiée pour l’instant.</p>
          )}
        </section>
      </main>

      {showAddArtworkModal && collections.length > 0 && (
        <AddArtworkModal
          user={user}
          profile={profile}
          collections={collections}
          onClose={() => setShowAddArtworkModal(false)}
          onSuccess={(newArtwork) => {
            setUserArtworks((prev) => [
              {
                id: newArtwork.id,
                title: newArtwork.title ?? '',
                description: newArtwork.description ?? '',
                mediaType: 'image',
                mediaUrl: newArtwork.mediaUrl ?? '',
                price: 0,
                averageViewTime: 0,
                collectionId: newArtwork.collectionId ?? null,
              },
              ...prev,
            ]);
            setShowAddArtworkModal(false);
          }}
        />
      )}
    </div>
  );
}

function LoginView({ artistsList, initialArtistId, onLogin, onBackToVisitor }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Simulation : connexion réussie quel que soit l'identifiant (pour tests)
    const artistId = initialArtistId ?? artistsList[0]?.id ?? '';
    if (artistId) onLogin(artistId);
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-soft-xl">
      <div className="mb-5 space-y-2 text-center">
        <p className="text-[0.65rem] uppercase tracking-[0.25em] text-slate-400">
          Espace exposant
        </p>
        <h1 className="text-lg font-semibold text-slate-50">
          Accéder à votre tableau de bord
        </h1>
        <p className="text-xs text-slate-300">
          Sélectionnez un artiste pour pré-remplir le profil. Il ne s’agit pas
          d’une authentification réelle mais d’un mode démo.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 text-sm text-slate-100">
        <label className="block text-xs text-slate-300">
          E-mail
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="vous@exemple.com"
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 outline-none ring-0 focus:border-emerald-400"
          />
        </label>
        <label className="block text-xs text-slate-300">
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 outline-none ring-0 focus:border-emerald-400"
          />
        </label>
        <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onBackToVisitor}
            className="h-9 rounded-full border border-white/15 px-4 text-xs font-medium text-slate-100 hover:bg-white/5"
          >
            Revenir au mode visiteur
          </button>
          <button
            type="submit"
            className="flex h-9 items-center justify-center rounded-full bg-white px-5 text-xs font-semibold text-slate-900 shadow-soft-xl hover:bg-slate-100"
          >
            Se connecter
          </button>
        </div>
      </form>
    </div>
  );
}

function ExhibitorDashboard({
  artist,
  profile,
  onProfileChange,
  collections,
  onAddCollection,
  artworks,
  onAddArtwork,
  onBackToVisitor,
}) {
  const [localProfile, setLocalProfile] = useState({
    name: profile.name,
    avatarUrl: profile.avatarUrl,
    bio: profile.bio,
  });

  const [newCollectionTitle, setNewCollectionTitle] = useState('');
  const [newCollectionConcept, setNewCollectionConcept] = useState('');

  const [newArtwork, setNewArtwork] = useState({
    title: '',
    imageUrl: '',
    price: '',
    description: '',
    year: '',
    category: 'peinture',
  });

  const handleProfileSave = (event) => {
    event.preventDefault();
    onProfileChange(localProfile);
  };

  const handleAddCollection = (event) => {
    event.preventDefault();
    if (!newCollectionTitle.trim()) return;
    onAddCollection({
      id: `user-col-${Date.now()}`,
      artistId: artist.id,
      title: newCollectionTitle.trim(),
      concept: newCollectionConcept.trim() || 'Collection personnelle',
    });
    setNewCollectionTitle('');
    setNewCollectionConcept('');
  };

  const handleAddArtwork = (event) => {
    event.preventDefault();
    if (!newArtwork.title.trim() || !newArtwork.imageUrl.trim()) return;
    const priceValue = Number(newArtwork.price || 0);
    const artworkToAdd = {
      id: `user-art-${Date.now()}`,
      artistId: artist.id,
      collectionId: null,
      title: newArtwork.title.trim(),
      description: newArtwork.description.trim() || 'Œuvre ajoutée via le tableau de bord.',
      price: Number.isFinite(priceValue) ? priceValue : 0,
      mediaType: 'image',
      mediaUrl: newArtwork.imageUrl.trim(),
      likes: 0,
      averageViewTime: 20,
      category: newArtwork.category,
      year: newArtwork.year.trim(),
    };
    onAddArtwork(artworkToAdd);
    setNewArtwork({
      title: '',
      imageUrl: '',
      price: '',
      description: '',
      year: '',
      category: newArtwork.category,
    });
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-950 text-slate-50">
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-slate-800 bg-slate-950/90 px-4 py-5 sm:flex">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-slate-200">
              MaCollection
            </span>
          </div>
        </div>
        <nav className="space-y-2 text-xs">
          <p className="mb-2 text-[0.6rem] uppercase tracking-[0.22em] text-slate-500">
            Mode exposant
          </p>
          <div className="space-y-1">
            <span className="block rounded-xl bg-slate-800/80 px-3 py-2 text-[0.8rem] font-medium text-slate-50">
              Tableau de bord
            </span>
            <span className="block rounded-xl px-3 py-1.5 text-[0.75rem] text-slate-400">
              Biographie & profil
            </span>
            <span className="block rounded-xl px-3 py-1.5 text-[0.75rem] text-slate-400">
              Collections
            </span>
            <span className="block rounded-xl px-3 py-1.5 text-[0.75rem] text-slate-400">
              Œuvres
            </span>
          </div>
        </nav>
        <div className="mt-auto pt-4">
          <button
            type="button"
            onClick={onBackToVisitor}
            className="w-full rounded-full border border-slate-700 px-3 py-2 text-[0.7rem] font-medium text-slate-100 hover:bg-slate-800"
          >
            Revenir au mode visiteur
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 px-4 py-4 sm:px-6 md:px-10">
        <header className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <User2 className="h-5 w-5 text-slate-400" />
                </div>
              )}
            </div>
            <div className="space-y-0.5">
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-slate-400">
                Tableau de bord exposant
              </p>
              <h1 className="text-base font-semibold text-slate-50 sm:text-lg">
                {profile.name}
              </h1>
            </div>
          </div>
          <button
            type="button"
            onClick={onBackToVisitor}
            className="inline-flex items-center rounded-full border border-slate-700 px-3 py-1.5 text-[0.7rem] font-medium text-slate-100 hover:bg-slate-800"
          >
            Retour visiteur
          </button>
        </header>

        <section className="mb-6 grid gap-4 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <form
            onSubmit={handleProfileSave}
            className="glass-panel space-y-3 rounded-3xl p-4 text-sm text-slate-100"
          >
            <p className="text-[0.65rem] uppercase tracking-[0.25em] text-slate-400">
              Biographie
            </p>
            <label className="block text-xs text-slate-300">
              Nom d’artiste
              <input
                type="text"
                value={localProfile.name}
                onChange={(event) =>
                  setLocalProfile((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-slate-100 outline-none ring-0 focus:border-emerald-400"
              />
            </label>
            <label className="block text-xs text-slate-300">
              Photo de profil
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () =>
                    setLocalProfile((prev) => ({
                      ...prev,
                      avatarUrl: reader.result,
                    }));
                  reader.readAsDataURL(file);
                }}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-slate-100 file:mr-2 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:text-slate-100"
              />
              {localProfile.avatarUrl && (
                <p className="mt-1.5 text-[0.65rem] text-slate-500">
                  Photo chargée (enregistrez pour conserver)
                </p>
              )}
            </label>
            <label className="block text-xs text-slate-300">
              Bio / Description de l'artiste
              <textarea
                rows={4}
                value={localProfile.bio}
                onChange={(event) =>
                  setLocalProfile((prev) => ({
                    ...prev,
                    bio: event.target.value,
                  }))
                }
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-slate-100 outline-none ring-0 focus:border-emerald-400"
              />
            </label>
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="inline-flex items-center rounded-full bg-emerald-400/95 px-4 py-1.5 text-[0.7rem] font-semibold text-emerald-950 shadow-soft-xl hover:bg-emerald-300"
              >
                Enregistrer la biographie
              </button>
            </div>
          </form>

          <form
            onSubmit={handleAddCollection}
            className="glass-panel space-y-3 rounded-3xl p-4 text-sm text-slate-100"
          >
            <p className="text-[0.65rem] uppercase tracking-[0.25em] text-slate-400">
              Collections
            </p>
            <label className="block text-xs text-slate-300">
              Titre de la collection
              <input
                type="text"
                value={newCollectionTitle}
                onChange={(event) => setNewCollectionTitle(event.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-slate-100 outline-none ring-0 focus:border-emerald-400"
              />
            </label>
            <label className="block text-xs text-slate-300">
              Concept éditorial (optionnel)
              <textarea
                rows={3}
                value={newCollectionConcept}
                onChange={(event) => setNewCollectionConcept(event.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-slate-100 outline-none ring-0 focus:border-emerald-400"
              />
            </label>
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="inline-flex items-center rounded-full bg-slate-100 px-4 py-1.5 text-[0.7rem] font-semibold text-slate-900 shadow-soft-xl hover:bg-white"
              >
                Ajouter une collection
              </button>
            </div>
            {collections.length > 0 && (
              <ul className="mt-2 space-y-1.5 text-[0.7rem] text-slate-200">
                {collections.map((collection) => (
                  <li
                    key={collection.id}
                    className="flex items-center justify-between rounded-xl bg-black/40 px-3 py-1.5"
                  >
                    <span className="line-clamp-1">{collection.title}</span>
                    <span className="text-[0.6rem] text-slate-400">Perso</span>
                  </li>
                ))}
              </ul>
            )}
          </form>
        </section>

        <section className="glass-panel mb-10 rounded-3xl p-4 text-sm text-slate-100">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-[0.65rem] uppercase tracking-[0.25em] text-slate-400">
              Ajouter mes œuvres
            </p>
          </div>
          <form
            onSubmit={handleAddArtwork}
            className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,2fr)]"
          >
            <div className="space-y-3">
              <label className="block text-xs text-slate-300">
                Titre
                <input
                  type="text"
                  value={newArtwork.title}
                  onChange={(event) =>
                    setNewArtwork((prev) => ({
                      ...prev,
                      title: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-slate-100 outline-none ring-0 focus:border-emerald-400"
                />
              </label>
              <label className="block text-xs text-slate-300">
                Image de l’œuvre
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () =>
                      setNewArtwork((prev) => ({
                        ...prev,
                        imageUrl: reader.result,
                      }));
                    reader.readAsDataURL(file);
                  }}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-slate-100 file:mr-2 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:text-slate-100"
                />
                {newArtwork.imageUrl && (
                  <p className="mt-1.5 text-[0.65rem] text-slate-500">
                    Image chargée
                  </p>
                )}
              </label>
              <label className="block text-xs text-slate-300">
                Description courte (optionnel)
                <textarea
                  rows={3}
                  value={newArtwork.description}
                  onChange={(event) =>
                    setNewArtwork((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-slate-100 outline-none ring-0 focus:border-emerald-400"
                />
              </label>
            </div>
            <div className="space-y-3">
              <label className="block text-xs text-slate-300">
                Prix (EUR)
                <input
                  type="number"
                  min="0"
                  value={newArtwork.price}
                  onChange={(event) =>
                    setNewArtwork((prev) => ({
                      ...prev,
                      price: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-slate-100 outline-none ring-0 focus:border-emerald-400"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-xs text-slate-300">
                  Année
                  <input
                    type="text"
                    value={newArtwork.year}
                    onChange={(event) =>
                      setNewArtwork((prev) => ({
                        ...prev,
                        year: event.target.value,
                      }))
                    }
                    placeholder="2024"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-slate-100 outline-none ring-0 focus:border-emerald-400"
                  />
                </label>
                <label className="block text-xs text-slate-300">
                  Catégorie
                  <select
                    value={newArtwork.category}
                    onChange={(event) =>
                      setNewArtwork((prev) => ({
                        ...prev,
                        category: event.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-slate-100 outline-none ring-0 focus:border-emerald-400"
                  >
                    <option value="peinture">Peinture</option>
                    <option value="sculpture">Sculpture</option>
                    <option value="style">Style artistique</option>
                    <option value="objet">Objet</option>
                  </select>
                </label>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-full bg-emerald-400/95 px-4 py-1.5 text-[0.7rem] font-semibold text-emerald-950 shadow-soft-xl hover:bg-emerald-300"
                >
                  Ajouter l’œuvre au catalogue
                </button>
              </div>
            </div>
          </form>

          {artworks.length > 0 && (
            <div className="mt-4 border-t border-white/10 pt-3">
              <p className="mb-2 text-[0.65rem] uppercase tracking-[0.25em] text-slate-400">
                Dernières œuvres ajoutées
              </p>
              <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-3">
                {artworks.map((artwork) => (
                  <div
                    key={artwork.id}
                    className="flex items-center gap-2 rounded-2xl bg-black/40 p-2"
                  >
                    <div className="h-12 w-12 overflow-hidden rounded-xl bg-black/60">
                      <img
                        src={artwork.mediaUrl}
                        alt={artwork.title}
                        className="h-full w-full"
                        style={{ objectFit: 'cover' }}
                        loading="eager"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="line-clamp-1 text-[0.75rem] font-medium text-slate-50">
                        {artwork.title}
                      </p>
                      <p className="text-[0.65rem] text-slate-400">
                        {artwork.year || 'Année non renseignée'} ·{' '}
                        {formatPrice(artwork.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function CatalogView({
  artworksList,
  likedById,
  onToggleLike,
  onOpenOffer,
  onOpenArtistProfile,
  onOpenArtworkDetail,
}) {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'Tout' },
    { id: 'peinture', label: 'Peinture' },
    { id: 'sculpture', label: 'Sculpture' },
    { id: 'style', label: 'Style artistique' },
    { id: 'objet', label: 'Objet' },
  ];

  const filteredArtworks = useMemo(() => {
    const q = query.toLowerCase().trim();

    return artworksList.filter((artwork) => {
      const artist = getArtistById(artwork.artistId);
      const category = artwork.category ?? 'autre';

      const matchesFilter =
        activeFilter === 'all' || category === activeFilter;

      const matchesQuery =
        !q ||
        artwork.title.toLowerCase().includes(q) ||
        artwork.description.toLowerCase().includes(q) ||
        (artist?.name.toLowerCase().includes(q) ?? false);

      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, query]);

  return (
    <div className="relative h-full overflow-y-auto">
      <div className="bg-gradient-to-b from-black/90 via-mc-bg/95 to-mc-bg px-4 pb-3 pt-2 sm:px-6 md:px-8">
        <div className="mx-auto w-full max-w-4xl space-y-3">
          <div className="glass-panel flex items-center gap-2 rounded-2xl px-3 py-2.5 text-xs text-slate-100">
            <SearchIcon className="h-4 w-4 text-slate-300" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher une œuvre, un artiste, une collection…"
              className="h-7 w-full bg-transparent text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto pb-1 pt-1 text-xs">
            {filters.map((filter) => {
              const isActive = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  className={`whitespace-nowrap rounded-full border px-3 py-1 text-[0.7rem] transition ${
                    isActive
                      ? 'border-white bg-white text-slate-900 shadow-soft-xl'
                      : 'border-white/15 bg-white/5 text-slate-100 hover:border-white/35 hover:bg-white/10'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-3 pb-24 pt-2 sm:px-6 md:px-8">
        <div className="mx-auto grid w-full max-w-4xl grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
          {filteredArtworks.map((artwork, index) => {
            const artist = getArtistById(artwork.artistId);
            const isTall = index % 3 === 0;

            return (
              <div
                key={artwork.id}
                onClick={() => onOpenArtworkDetail(artwork)}
                className={`group relative overflow-hidden rounded-3xl bg-black/70 transition-transform duration-300 hover:-translate-y-1 hover:shadow-soft-xl hover:shadow-emerald-500/15 ${
                  isTall ? 'aspect-[9/14]' : 'aspect-[9/13]'
                } cursor-pointer`}
              >
                <img
                  src={artwork.mediaUrl}
                  alt={artwork.title}
                  className="h-full w-full"
                  style={{ objectFit: 'cover' }}
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/85 via-black/25 to-transparent p-2.5">
                  <div className="flex items-start justify-between gap-1 text-[0.6rem] text-slate-200">
                    <span className="line-clamp-2 font-medium">
                      {artwork.title}
                    </span>
                    <span className="rounded-full bg-black/70 px-2 py-0.5 text-[0.6rem] text-slate-100">
                      {formatPrice(artwork.price)}
                    </span>
                  </div>
                  <div className="flex items-end justify-between gap-1 text-[0.6rem] text-slate-300">
                    <div className="flex flex-col gap-0.5">
                      <span className="line-clamp-1">
                        {artwork.artistDisplayName ?? artist?.name ?? 'Artiste'}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[0.55rem] text-slate-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-200/70" />
                        {artwork.category === 'peinture' && 'Peinture'}
                        {artwork.category === 'sculpture' && 'Sculpture'}
                        {artwork.category === 'style' && 'Style artistique'}
                        {artwork.category === 'objet' && 'Objet'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onToggleLike(artwork.id);
                        }}
                        className="glass-panel flex h-7 w-7 items-center justify-center rounded-full text-[0.6rem] text-slate-100 hover:bg-white/15"
                      >
                        <Heart
                          className={`h-3.5 w-3.5 ${
                            likedById[artwork.id]
                              ? 'fill-rose-500 text-rose-400'
                              : 'text-slate-100'
                          }`}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onOpenOffer(artwork);
                        }}
                        className="glass-panel hidden h-7 w-7 items-center justify-center rounded-full text-[0.6rem] text-emerald-100 hover:bg-emerald-500/25 sm:flex"
                      >
                        <BadgeDollarSign className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onOpenArtistProfile(artwork.artistId);
                        }}
                        className="glass-panel hidden h-7 w-7 items-center justify-center rounded-full text-[0.6rem] text-sky-100 hover:bg-sky-500/25 md:flex"
                      >
                        <User2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Navbar({ user, profile, onConnexionClick, onMonEspaceClick, onSignOut }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const avatarUrl = profile?.[PROFILE_AVATAR_COLUMN];
  const initials = user ? getInitials(profile, user.email) : '';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-end gap-2 border-b border-white/10 bg-black/80 px-4 py-3 backdrop-blur-md">
      <div className="flex items-center gap-2">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/20 bg-slate-700 text-sm font-medium text-white shadow-lg transition hover:border-white/40 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-white/30"
              aria-label="Menu compte"
              aria-expanded={dropdownOpen}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="select-none">{initials}</span>
              )}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 min-w-[10rem] overflow-hidden rounded-xl border border-white/10 bg-slate-900/95 py-1 shadow-xl backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    onMonEspaceClick?.();
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[0.8rem] text-slate-100 transition hover:bg-white/10"
                >
                  <User2 className="h-4 w-4 text-slate-400" />
                  Mon Espace
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    onSignOut?.();
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[0.8rem] text-slate-100 transition hover:bg-white/10"
                >
                  <LogOut className="h-4 w-4 text-slate-400" />
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={onConnexionClick}
            className="rounded-full border border-white/30 px-4 py-2 text-[0.7rem] font-medium text-slate-100 transition hover:border-white/50 hover:bg-white/5"
          >
            Connexion
          </button>
        )}
      </div>
    </header>
  );
}

function BottomNav({ view, onChangeView }) {
  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex items-center justify-center bg-black balade-nav-bar">
      <div className="pointer-events-auto flex w-full max-w-xs items-center justify-between rounded-full bg-slate-900/95 px-2.5 py-1.5 text-xs text-slate-200 sm:max-w-sm">
        <button
          type="button"
          onClick={() => onChangeView('catalog')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-1 ${
            view === 'catalog'
              ? 'bg-white text-slate-900 shadow-soft-xl'
              : 'text-slate-200 hover:bg-white/5'
          }`}
        >
          <Compass className="h-4 w-4" />
          <span className="uppercase tracking-[0.2em] text-[0.6rem]">
            Explorer
          </span>
        </button>
        <button
          type="button"
          onClick={() => onChangeView('immersive')}
          className={`ml-1 flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-1 ${
            view === 'immersive'
              ? 'bg-white text-slate-900 shadow-soft-xl'
              : 'text-slate-200 hover:bg-white/5'
          }`}
        >
          <PlayCircle className="h-4 w-4" />
          <span className="uppercase tracking-[0.2em] text-[0.6rem]">
            Balade
          </span>
        </button>
      </div>
    </nav>
  );
}

/** Vue détaillée complète : image plein format, artiste, description, prix, Like, offre. Données via artwork (Supabase). */
function ArtworkDetailModal({
  artwork,
  onClose,
  onOpenOffer,
  onOpenArtistProfile,
  isLiked = false,
  onToggleLike,
}) {
  if (!artwork) return null;

  const artist = getArtistById(artwork.artistId);
  const collection = collections.find(
    (col) => col.id === artwork.collectionId,
  );
  const displayedLikes = artwork.likes + (isLiked ? 1 : 0);

  return (
    <AnimatePresence>
      {artwork && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-black/75 p-0 backdrop-blur-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ padding: 0 }}
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex h-[90vh] max-h-[90vh] w-full max-w-4xl flex-nowrap gap-0 overflow-hidden rounded-[32px] border-0 bg-transparent p-0 shadow-2xl"
          >
            {/* Croix de fermeture : absolute tout en haut à droite */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-slate-100 shadow-lg backdrop-blur-sm hover:bg-black/75"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Bloc gauche : image calée gauche/haut/bas, width:auto height:100%, zéro fond gris */}
            <div className="flex h-full shrink-0 items-stretch border-0 p-0">
              <div className="h-full w-max">
                {artwork.mediaType === 'video' ? (
                  <video
                    src={artwork.mediaUrl}
                    className="block h-full w-auto object-contain object-left object-top"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={artwork.mediaUrl}
                    alt={artwork.title}
                    className="block h-full w-auto object-contain object-left object-top"
                    loading="eager"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
            </div>

            {/* Bloc droit : collé à l'image, 100% largeur restante, aucun pixel vide */}
            <div className="flex min-w-0 flex-1 flex-col overflow-y-auto border-0 bg-slate-900 p-0">
              <div className="p-4 pr-12 pt-10 sm:p-5 sm:pr-14 sm:pt-12">
              <h2 className="mb-2 text-lg font-semibold text-slate-50 sm:text-xl md:text-2xl">
                {artwork.title}
              </h2>
              {artist && (
                <button
                  type="button"
                  onClick={() => onOpenArtistProfile(artist.id)}
                  className="mb-3 inline-flex w-fit items-center gap-1.5 text-sm text-slate-300 hover:text-slate-100"
                >
                  <User2 className="h-4 w-4 shrink-0" />
                  {artist.name}
                  {collection && (
                    <span className="text-slate-500"> · {collection.title}</span>
                  )}
                </button>
              )}
              <p className="mb-3 min-w-0 break-words text-sm leading-relaxed text-slate-200">
                {artwork.description}
              </p>
              <p className="mb-3 inline-block w-fit rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-medium text-emerald-200">
                {formatPrice(artwork.price)}
              </p>
              {typeof onToggleLike === 'function' && (
                <button
                  type="button"
                  onClick={() => onToggleLike(artwork.id)}
                  className="mb-4 flex w-fit items-center gap-1.5 rounded-full bg-white/5 px-3 py-2 text-slate-100 transition hover:bg-white/10"
                >
                  <Heart
                    className={`h-5 w-5 shrink-0 ${isLiked ? 'fill-rose-500 text-rose-400' : 'text-slate-300'}`}
                  />
                  <span className="text-xs font-medium tabular-nums">
                    {displayedLikes.toLocaleString('fr-FR')}
                  </span>
                </button>
              )}
              <div className="mt-auto flex flex-col gap-2 border-t border-white/10 pt-4 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={() => onOpenArtistProfile(artwork.artistId)}
                  className="h-10 rounded-full border border-white/15 px-4 text-xs font-medium text-slate-100 hover:bg-white/5"
                >
                  Voir le profil de l’artiste
                </button>
                <button
                  type="button"
                  onClick={() => onOpenOffer(artwork)}
                  className="flex h-10 items-center justify-center gap-2 rounded-full bg-emerald-400/95 px-5 text-xs font-semibold text-emerald-950 shadow-soft-xl hover:bg-emerald-300"
                >
                  <BadgeDollarSign className="h-4 w-4" />
                  Faire une offre
                </button>
              </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function OfferModal({ artwork, onClose }) {
  if (!artwork) return null;

  return (
    <AnimatePresence>
      {artwork && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-6 backdrop-blur-2xl sm:py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel w-full max-w-md rounded-[32px] p-5 sm:p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-[0.65rem] uppercase tracking-[0.25em] text-slate-400">
                  Faire une offre
                </p>
                <h2 className="text-base font-semibold text-slate-50 sm:text-lg">
                  {artwork.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-200 hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-5 space-y-3 text-sm text-slate-200">
              <p>
                Cette œuvre est proposée à{' '}
                <span className="font-semibold">
                  {formatPrice(artwork.price)}
                </span>
                .
              </p>
              <p className="text-xs text-slate-300">
                Dans cette version démo, la validation ne déclenche aucune
                transaction réelle. L’objectif est de ressentir le geste
                d’acquisition, comme si vous étiez dans une viewing room
                privée.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="h-10 rounded-full border border-white/15 px-4 text-xs font-medium text-slate-100 hover:bg-white/5"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 items-center justify-center gap-2 rounded-full bg-emerald-400/95 px-5 text-xs font-semibold text-emerald-950 shadow-xl hover:bg-emerald-300"
              >
                <BadgeDollarSign className="h-4 w-4" />
                Confirmer au prix fixé
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ExposantDashboardView({ user, onBack, onAddArtworkSuccess }) {
  const [profile, setProfile] = useState(null);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [addingCollection, setAddingCollection] = useState(false);
  const [showAddArtwork, setShowAddArtwork] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      const [profileRes, collectionsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase.from('collections').select('id, created_at, name, description, user_id').eq('user_id', user.id).order('created_at', { ascending: false }),
      ]);
      if (cancelled) return;
      if (profileRes.data) setProfile(profileRes.data);
      setCollections(Array.isArray(collectionsRes.data) ? collectionsRes.data : []);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user.id]);

  const refreshCollections = async () => {
    const { data } = await supabase.from('collections').select('id, created_at, name, description, user_id').eq('user_id', user.id).order('created_at', { ascending: false });
    setCollections(Array.isArray(data) ? data : []);
  };

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    setAddingCollection(true);
    try {
      await supabase.from('collections').insert({ name: newCollectionName.trim(), user_id: user.id });
      setNewCollectionName('');
      await refreshCollections();
    } finally {
      setAddingCollection(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
        <p className="text-slate-400">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="fixed top-14 left-0 right-0 bottom-0 z-50 flex flex-col overflow-y-auto bg-slate-950">
      <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
        <h1 className="text-lg font-semibold text-white">Tableau de bord</h1>
        <button type="button" onClick={onBack} className="rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-white/5">
          Retour au catalogue
        </button>
      </header>
      <main className="flex-1 p-4 space-y-6">
        <section className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
          <h2 className="text-sm font-semibold text-white mb-2">Mes collections</h2>
          {collections.length === 0 ? (
            <p className="text-xs text-slate-400">Aucune collection pour l’instant. Créez-en une ci-dessous.</p>
          ) : (
            <ul className="space-y-2">
              {collections.map((c) => (
                <li key={c.id} className="rounded-xl bg-black/30 px-3 py-2 text-sm text-slate-200">
                  {c.name}
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
          <h2 className="text-sm font-semibold text-white mb-3">Créer une collection</h2>
          <form onSubmit={handleCreateCollection} className="flex gap-2">
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="Nom de la collection"
              className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
            />
            <button type="submit" disabled={addingCollection || !newCollectionName.trim()} className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-100 disabled:opacity-50 shrink-0">
              {addingCollection ? '…' : 'Créer'}
            </button>
          </form>
        </section>
        <section className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
          <h2 className="text-sm font-semibold text-white mb-2">Ajouter une œuvre</h2>
          {collections.length === 0 ? (
            <p className="text-xs text-slate-400 mb-3">Créez d’abord au moins une collection ci-dessus, puis vous pourrez ajouter des œuvres.</p>
          ) : (
            <button type="button" onClick={() => setShowAddArtwork(true)} className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-100">
              Ajouter une œuvre
            </button>
          )}
        </section>
      </main>
      {showAddArtwork && collections.length > 0 && (
        <AddArtworkModal
          user={user}
          profile={profile}
          collections={collections}
          onClose={() => setShowAddArtwork(false)}
          onSuccess={(newArtwork) => {
            onAddArtworkSuccess?.(newArtwork);
            setShowAddArtwork(false);
          }}
        />
      )}
    </div>
  );
}

const BUCKET_ARTWORKS = 'artworks';
const BUCKET_AVATARS = 'avatars';

// Bucket "avatars" : créer le bucket dans Supabase (Storage) et configurer les policies RLS
// (Storage > Buckets > avatars > Policies) pour autoriser l'upload des utilisateurs connectés.
async function uploadAvatarImage(supabaseClient, userId, file) {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const uniqueName = `${userId}-${Date.now()}.${ext}`;
  const filePath = `${userId}/${uniqueName}`;
  const { error: uploadError } = await supabaseClient.storage
    .from(BUCKET_AVATARS)
    .upload(filePath, file, { cacheControl: '3600', upsert: true });
  if (uploadError) throw uploadError;
  const { data: urlData } = supabaseClient.storage.from(BUCKET_AVATARS).getPublicUrl(filePath);
  return urlData.publicUrl;
}

async function uploadArtworkImage(supabaseClient, userId, file) {
  const safeName = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
  const filePath = `${userId}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabaseClient.storage
    .from(BUCKET_ARTWORKS)
    .upload(filePath, file, { cacheControl: '3600', upsert: false });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabaseClient.storage
    .from(BUCKET_ARTWORKS)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

function AddArtworkModal({ user, profile, collections = [], onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [collectionId, setCollectionId] = useState(collections[0]?.id ?? '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (collections.length > 0 && !collectionId) setCollectionId(collections[0].id);
  }, [collections, collectionId]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Libérer l’URL de prévisualisation au démontage ou changement de fichier
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('Le titre est requis.');
      return;
    }
    if (!selectedFile) {
      setError('Veuillez sélectionner une image.');
      return;
    }
    if (collections.length > 0 && !collectionId) {
      setError('Veuillez choisir une collection.');
      return;
    }
    setLoading(true);
    try {
      const imageUrl = await uploadArtworkImage(supabase, user.id, selectedFile);

      const { data, error: insertError } = await supabase
        .from('artworks')
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          image_url: imageUrl,
          user_id: user.id,
          collection_id: collectionId || null,
        })
        .select('id, created_at, title, description, image_url, user_id, collection_id')
        .single();
      if (insertError) throw insertError;
      const defaultArtistId = artists[0]?.id ?? 'artist-lina-moreau';
      const artistDisplayName = profile
        ? [profile.first_name, profile.last_name].filter(Boolean).join(' ').trim() || undefined
        : undefined;
      onSuccess({
        id: data.id,
        artistId: defaultArtistId,
        collectionId: data.collection_id ?? null,
        title: data.title ?? '',
        description: data.description ?? '',
        price: 0,
        mediaType: 'image',
        mediaUrl: data.image_url ?? '',
        likes: 0,
        averageViewTime: 0,
        category: 'peinture',
        artistDisplayName,
      });
    } catch (err) {
      setError(err?.message ?? 'Erreur lors de l\'ajout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/95 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Ajouter une œuvre</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-300 hover:bg-white/10"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-xs text-slate-300">
            Titre
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
              placeholder="Titre de l'œuvre"
            />
          </label>
          {collections.length > 0 && (
            <label className="block text-xs text-slate-300">
              Collection
              <select
                value={collectionId}
                onChange={(e) => setCollectionId(e.target.value)}
                required={collections.length > 0}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="">Choisir une collection</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>
          )}
          <label className="block text-xs text-slate-300">
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
              placeholder="Description (optionnel)"
            />
          </label>
          <label className="block text-xs text-slate-300">
            Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white file:mr-2 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:text-slate-100"
            />
            {previewUrl && (
              <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                <img
                  src={previewUrl}
                  alt="Aperçu"
                  className="h-40 w-full object-contain"
                />
                <p className="p-2 text-center text-[0.65rem] text-emerald-400">
                  Aperçu — l’image sera envoyée au bucket au moment de la validation
                </p>
              </div>
            )}
          </label>
          {error && <p className="text-xs text-rose-400">{error}</p>}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-white/5"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-100 disabled:opacity-50"
            >
              {loading ? 'Envoi…' : 'Ajouter l\'œuvre'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage({
          type: 'success',
          text: 'Compte créé. Consultez votre boîte mail pour confirmer si demandé.',
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onAuthenticated?.();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err?.message ?? 'Une erreur est survenue.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-black via-slate-950 to-black p-4">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl">
        <h1 className="text-center text-lg font-semibold text-white">MaCollection</h1>
        <p className="mt-1 text-center text-xs text-slate-400">
          {mode === 'signup' ? 'Créer un compte' : 'Se connecter'}
        </p>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block text-xs text-slate-300">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="vous@exemple.com"
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </label>
          <label className="block text-xs text-slate-300">
            Mot de passe
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </label>
          {message.text && (
            <p className={message.type === 'error' ? 'text-xs text-rose-400' : 'text-xs text-emerald-400'}>
              {message.text}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-white py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:opacity-50"
          >
            {loading ? 'Chargement…' : mode === 'signup' ? 'Créer mon compte' : 'Se connecter'}
          </button>
        </form>
        <button
          type="button"
          onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); setMessage({ type: '', text: '' }); }}
          className="mt-4 w-full text-center text-xs text-slate-400 underline hover:text-slate-200"
        >
          {mode === 'signup' ? 'Déjà un compte ? Se connecter' : "Pas de compte ? S'inscrire"}
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('visitor');
  const [isExhibitorAuthenticated, setIsExhibitorAuthenticated] =
    useState(false);
  const [exhibitorArtistId, setExhibitorArtistId] = useState(
    'artist-lina-moreau',
  );
  const [exhibitorProfile, setExhibitorProfile] = useState({
    name: '',
    avatarUrl: '',
    bio: '',
  });
  const [exhibitorCollections, setExhibitorCollections] = useState([]);
  const [userArtworks, setUserArtworks] = useState([]);
  const [artworksFromSupabase, setArtworksFromSupabase] = useState([]);

  const allArtworks = useMemo(
    () => [
      ...(Array.isArray(artworks) ? artworks : []),
      ...(Array.isArray(artworksFromSupabase) ? artworksFromSupabase : []),
      ...(Array.isArray(userArtworks) ? userArtworks : []),
    ],
    [artworksFromSupabase, userArtworks],
  );

  const [feed, setFeed] = useState([]);
  const [likedById, setLikedById] = useState({});
  const [activeOfferArtwork, setActiveOfferArtwork] = useState(null);
  const [activeDetailArtwork, setActiveDetailArtwork] = useState(null);
  const [immersiveView, setImmersiveView] = useState({
    mode: 'feed',
    artistId: null,
  });
  const [view, setView] = useState('catalog');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingMonEspace, setPendingMonEspace] = useState(false);
  const [showAddArtworkModal, setShowAddArtworkModal] = useState(false);
  const [exposantView, setExposantView] = useState(null);
  const [exposantProfile, setExposantProfile] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isMonEspaceRoute = location.pathname === '/mon-espace';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription?.unsubscribe();
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!user) {
      setExposantProfile(null);
      try { window.localStorage.removeItem(LS_EXPOSANT_KEY); } catch (_) {}
      return;
    }
    supabase.from('profiles').select(`id, first_name, last_name, description, ${PROFILE_AVATAR_COLUMN}`).eq('id', user.id).maybeSingle().then(({ data }) => {
      if (!cancelled) {
        setExposantProfile(data ?? null);
        try {
          if (data) window.localStorage.setItem(LS_EXPOSANT_KEY, user.id);
          else window.localStorage.removeItem(LS_EXPOSANT_KEY);
        } catch (_) {}
      }
    });
    return () => { cancelled = true; };
  }, [user?.id]);

  const openExposantSpace = React.useCallback(async () => {
    if (!user) return;
    const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).maybeSingle();
    if (!profile) setExposantView('profile');
    else setExposantView('dashboard');
  }, [user]);

  useEffect(() => {
    if (user && pendingMonEspace) {
      setPendingMonEspace(false);
      navigate('/mon-espace');
    }
  }, [user, pendingMonEspace, navigate]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from('artworks')
        .select('id, created_at, title, description, image_url, user_id, collection_id')
        .order('created_at', { ascending: false });
      if (cancelled) return;
      if (error) {
        console.warn('Supabase artworks:', error.message);
        setArtworksFromSupabase([]);
        return;
      }
      const raw = Array.isArray(data) ? data : [];
      const userIds = [...new Set(raw.map((r) => r.user_id).filter(Boolean))];
      let profilesMap = {};
      if (userIds.length > 0) {
        const { data: profiles } = await supabase.from('profiles').select('id, first_name, last_name').in('id', userIds);
        if (Array.isArray(profiles)) {
          profilesMap = Object.fromEntries(profiles.map((p) => [p.id, p]));
        }
      }
      const defaultArtistId = artists[0]?.id ?? 'artist-lina-moreau';
      const mapped = raw.map((row) => {
        const profile = row.user_id ? profilesMap[row.user_id] : null;
        const artistDisplayName = profile
          ? [profile.first_name, profile.last_name].filter(Boolean).join(' ').trim() || 'Artiste'
          : null;
        return {
          id: row.id,
          artistId: defaultArtistId,
          collectionId: row.collection_id ?? null,
          title: row.title ?? '',
          description: row.description ?? '',
          price: 0,
          mediaType: 'image',
          mediaUrl: row.image_url ?? '',
          likes: 0,
          averageViewTime: 0,
          category: 'peinture',
          user_id: row.user_id,
          artistDisplayName: artistDisplayName || undefined,
        };
      });
      if (!cancelled) setArtworksFromSupabase(mapped);
    })().catch((err) => {
      if (!cancelled) {
        console.warn('Supabase artworks:', err?.message);
        setArtworksFromSupabase([]);
      }
    });

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const raw = window.localStorage.getItem('macollection_exhibitor_v1');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.role) setRole(parsed.role);
      if (typeof parsed.isExhibitorAuthenticated === 'boolean') {
        setIsExhibitorAuthenticated(parsed.isExhibitorAuthenticated);
      }
      if (parsed.exhibitorArtistId) {
        setExhibitorArtistId(parsed.exhibitorArtistId);
      }
      if (parsed.exhibitorProfile) {
        setExhibitorProfile(parsed.exhibitorProfile);
      }
      if (Array.isArray(parsed.exhibitorCollections)) {
        setExhibitorCollections(parsed.exhibitorCollections);
      }
      if (Array.isArray(parsed.userArtworks)) {
        setUserArtworks(parsed.userArtworks);
      }
    } catch (error) {
      console.error('Erreur chargement état exposant', error);
    }
  }, []);

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const payload = {
        role,
        isExhibitorAuthenticated,
        exhibitorArtistId,
        exhibitorProfile,
        exhibitorCollections,
        userArtworks,
      };
      window.localStorage.setItem(
        'macollection_exhibitor_v1',
        JSON.stringify(payload),
      );
    } catch (error) {
      console.error('Erreur sauvegarde état exposant', error);
    }
  }, [
    role,
    isExhibitorAuthenticated,
    exhibitorArtistId,
    exhibitorProfile,
    exhibitorCollections,
    userArtworks,
  ]);

  useEffect(() => {
    setFeed(allArtworks);
  }, [allArtworks]);

  const handleToggleLike = (artworkId) => {
    setLikedById((prev) => {
      const currentlyLiked = !!prev[artworkId];
      const next = { ...prev, [artworkId]: !currentlyLiked };

      // Lorsque l’œuvre passe en "likée", on favorise les œuvres
      // de la même collection / du même artiste dans le feed.
      if (!currentlyLiked) {
        setFeed((currentFeed) => {
          const pivot =
            currentFeed.find((a) => a.id === artworkId) ??
            allArtworks.find((a) => a.id === artworkId);
          if (!pivot) return currentFeed;
          return reorderFeed(currentFeed, pivot);
        });
      }

      return next;
    });
  };

  const handleOpenOffer = (artwork) => {
    setActiveOfferArtwork(artwork);
  };

  const handleOpenArtistProfile = (artistId) => {
    setImmersiveView({ mode: 'artist', artistId });
    setView('immersive');
  };

  const handleBackToFeed = () => {
    setImmersiveView({ mode: 'feed', artistId: null });
  };

  const handleOpenArtworkDetail = (artwork) => {
    setActiveDetailArtwork(artwork);
  };

  const hasExposantProfile = !!exposantProfile || (typeof window !== 'undefined' && user && window.localStorage.getItem(LS_EXPOSANT_KEY) === user.id);

  useEffect(() => {
    if (isMonEspaceRoute && !user) navigate('/', { replace: true });
  }, [isMonEspaceRoute, user, navigate]);

  const handleMonEspaceClick = () => {
    if (!user) {
      setShowAuthModal(true);
      setPendingMonEspace(true);
    } else {
      navigate('/mon-espace');
    }
  };

  const handleExhibitorAccessClick = () => {
    setRole('exhibitor');
  };

  const handleBackToVisitor = () => {
    setRole('visitor');
  };

  const effectiveExhibitorBaseArtist =
    artists.find((artist) => artist.id === exhibitorArtistId) ?? artists[0];

  const effectiveExhibitorProfile = {
    name: exhibitorProfile.name || effectiveExhibitorBaseArtist?.name || '',
    avatarUrl:
      exhibitorProfile.avatarUrl || effectiveExhibitorBaseArtist?.avatarUrl || '',
    bio: exhibitorProfile.bio || effectiveExhibitorBaseArtist?.bio || '',
  };

  if (role === 'exhibitor') {
    if (!isExhibitorAuthenticated) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-50">
          <LoginView
            artistsList={artists}
            initialArtistId={exhibitorArtistId}
            onLogin={(artistId) => {
              setExhibitorArtistId(artistId);
              setIsExhibitorAuthenticated(true);
            }}
            onBackToVisitor={handleBackToVisitor}
          />
        </div>
      );
    }

    return (
      <ExhibitorDashboard
        artist={effectiveExhibitorBaseArtist}
        profile={effectiveExhibitorProfile}
        onProfileChange={setExhibitorProfile}
        collections={exhibitorCollections}
        onAddCollection={(collection) =>
          setExhibitorCollections((previous) => [...previous, collection])
        }
        artworks={userArtworks}
        onAddArtwork={(artwork) =>
          setUserArtworks((previous) => [...previous, artwork])
        }
        onBackToVisitor={handleBackToVisitor}
      />
    );
  }

  if (
    view === 'immersive' &&
    immersiveView.mode === 'artist' &&
    immersiveView.artistId
  ) {
    return (
      <>
        <Navbar
          user={user}
          profile={exposantProfile}
          onConnexionClick={() => setShowAuthModal(true)}
          onMonEspaceClick={handleMonEspaceClick}
          onSignOut={() => supabase.auth.signOut().then(() => setUser(null))}
        />
        <div className="pt-14">
          <ArtistProfileView
            artistId={immersiveView.artistId}
            onBackToFeed={handleBackToFeed}
          />
        </div>
        <OfferModal artwork={activeOfferArtwork} onClose={() => setActiveOfferArtwork(null)} />
      </>
    );
  }

  if (exposantView === 'dashboard' && user) {
    return (
      <>
        <Navbar
          user={user}
          profile={exposantProfile}
          onConnexionClick={() => setShowAuthModal(true)}
          onMonEspaceClick={handleMonEspaceClick}
          onSignOut={() => supabase.auth.signOut().then(() => setUser(null))}
        />
        <div className="pt-14">
          <ExposantDashboardView
            user={user}
            onBack={() => setExposantView(null)}
            onAddArtworkSuccess={(newArtwork) => setArtworksFromSupabase((prev) => [newArtwork, ...prev])}
          />
        </div>
      </>
    );
  }

  if (isMonEspaceRoute && user) {
    return (
      <>
        <Navbar
          user={user}
          profile={exposantProfile}
          onConnexionClick={() => setShowAuthModal(true)}
          onMonEspaceClick={handleMonEspaceClick}
          onSignOut={() => supabase.auth.signOut().then(() => setUser(null))}
        />
        <div className="pt-14">
          <MonEspaceView
            user={user}
            onBack={() => navigate('/')}
            onEdit={() => setExposantView('dashboard')}
            onProfileUpdated={(updated) => setExposantProfile((prev) => (prev ? { ...prev, ...updated } : { id: user.id, ...updated }))}
          />
        </div>
      </>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-black via-mc-bg to-black">
      {view === 'catalog' && (
        <Navbar
          user={user}
          profile={exposantProfile}
          onConnexionClick={() => setShowAuthModal(true)}
          onMonEspaceClick={handleMonEspaceClick}
          onSignOut={() => supabase.auth.signOut().then(() => setUser(null))}
        />
      )}
      <main
        className={
          view === 'catalog'
            ? 'relative flex-1 pb-24 pt-14'
            : 'relative flex-1 min-h-0 overflow-hidden bg-black top-0 h-[100dvh]'
        }
      >
        {view === 'catalog' ? (
          <CatalogView
            artworksList={allArtworks}
            likedById={likedById}
            onToggleLike={handleToggleLike}
            onOpenOffer={handleOpenOffer}
            onOpenArtistProfile={handleOpenArtistProfile}
            onOpenArtworkDetail={handleOpenArtworkDetail}
          />
        ) : (
          <div className="balade-scroll-container snap-y snap-mandatory overflow-y-auto scroll-smooth bg-black">
            <AnimatePresence mode="popLayout">
              {feed.map((artwork) => (
                <ArtworkSlide
                  key={artwork.id}
                  artwork={artwork}
                  isLiked={!!likedById[artwork.id]}
                  onToggleLike={() => handleToggleLike(artwork.id)}
                  onOpenOffer={() => handleOpenOffer(artwork)}
                  onOpenArtistProfile={() =>
                    handleOpenArtistProfile(artwork.artistId)
                  }
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <BottomNav view={view} onChangeView={setView} />

      <ArtworkDetailModal
        artwork={activeDetailArtwork}
        onClose={() => setActiveDetailArtwork(null)}
        onOpenOffer={(artwork) => {
          setActiveDetailArtwork(null);
          handleOpenOffer(artwork);
        }}
        onOpenArtistProfile={(artistId) => {
          setActiveDetailArtwork(null);
          handleOpenArtistProfile(artistId);
        }}
        isLiked={activeDetailArtwork ? !!likedById[activeDetailArtwork.id] : false}
        onToggleLike={() => activeDetailArtwork && handleToggleLike(activeDetailArtwork.id)}
      />

      <OfferModal
        artwork={activeOfferArtwork}
        onClose={() => setActiveOfferArtwork(null)}
      />

      {showAuthModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-sm">
            <AuthScreen
              onAuthenticated={() => setShowAuthModal(false)}
            />
            <button
              type="button"
              onClick={() => {
                setShowAuthModal(false);
                setPendingMonEspace(false);
              }}
              className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {showAddArtworkModal && user && (
        <AddArtworkModal
          user={user}
          onClose={() => setShowAddArtworkModal(false)}
          onSuccess={(newArtwork) => {
            setArtworksFromSupabase((prev) => [newArtwork, ...prev]);
            setShowAddArtworkModal(false);
          }}
        />
      )}
    </div>
  );
}

