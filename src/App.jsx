import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BadgeDollarSign,
  Heart,
  User2,
  X,
  Search as SearchIcon,
  Compass,
  PlayCircle,
} from 'lucide-react';
import { artists, collections, artworks } from './mockData';

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
  if (mediaType === 'video') {
    return (
      <div className="relative h-full w-full overflow-hidden bg-black/80">
        <video
          src={mediaUrl}
          className="h-full w-full object-cover opacity-90"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-black/80">
      <img
        src={mediaUrl}
        alt={title}
        className="h-full w-full"
        style={{ objectFit: 'cover', objectPosition: 'center' }}
        loading="eager"
        referrerPolicy="no-referrer"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25" />
    </div>
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
    <section className="balade-slide relative snap-center flex items-center justify-center bg-black">
      <motion.div
        layout
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -40, scale: 0.98 }}
        transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
        className="relative flex h-full w-full items-center justify-center"
      >
        <div className="relative h-full w-full md:h-[90vh] md:w-auto md:aspect-[9/16]">
          <ArtworkMedia
            mediaType={artwork.mediaType}
            mediaUrl={artwork.mediaUrl}
            title={artwork.title}
          />

          {/* Overlay : infos artiste en haut (safe area), titre + description en bas */}
          <div className="pointer-events-none absolute inset-0 flex flex-col">
            <div className="safe-area-top flex items-start justify-between px-4 pt-4 sm:px-6 md:pt-4">
              <div className="pointer-events-auto inline-flex items-center gap-3 rounded-full bg-black/45 px-3 py-1.5 text-xs text-slate-200 backdrop-blur-2xl">
                <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-black/40">
                  {artist?.avatarUrl ? (
                    <img
                      src={artist.avatarUrl}
                      alt={artist.name}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <User2 className="h-3.5 w-3.5 opacity-70" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-100">
                    {artist?.name}
                  </span>
                  {collection && (
                    <span className="text-[0.6rem] text-slate-300/80">
                      {collection.title}
                    </span>
                  )}
                </div>
              </div>

              <div className="pointer-events-auto rounded-full bg-black/50 px-2.5 py-1 text-[0.6rem] text-slate-200 backdrop-blur-lg">
                Temps de vue moyen : {formatSeconds(artwork.averageViewTime)}
              </div>
            </div>

            {/* Titre + description en bas : dégradé 30 % + texte à ~80px du bas */}
            <div className="pointer-events-auto absolute bottom-0 left-0 right-0">
              <div
                className="balade-gradient-bottom absolute inset-0 h-[30%] min-h-[120px]"
                aria-hidden
              />
              <div className="relative px-4 pb-20 pt-3 sm:px-6 sm:pb-24 md:pb-8">
                <h2 className="text-balance text-lg font-semibold text-slate-50 sm:text-xl md:text-2xl">
                  {artwork.title}
                </h2>
                <p className="mt-1 text-xs text-slate-200/95 sm:text-sm md:text-[0.95rem]">
                  {artwork.description}
                </p>
              </div>
            </div>
          </div>

          {/* Panneau d’actions flottantes à droite (like, prix, profil) */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-end pr-3 sm:pr-5">
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
              <span className="text-[0.6rem] uppercase tracking-[0.2em] text-slate-200/90">
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

function LoginView({ artistsList, initialArtistId, onLogin, onBackToVisitor }) {
  const [selectedArtistId, setSelectedArtistId] = useState(
    initialArtistId ?? artistsList[0]?.id ?? '',
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedArtistId) return;
    onLogin(selectedArtistId);
  };

  return (
    <div className="w-full max-w-md rounded-3xl bg-slate-900/70 p-6 shadow-soft-xl">
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
          Artiste
          <select
            value={selectedArtistId}
            onChange={(event) => setSelectedArtistId(event.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-slate-100 outline-none ring-0 focus:border-emerald-400"
          >
            {artistsList.map((artist) => (
              <option key={artist.id} value={artist.id}>
                {artist.name}
              </option>
            ))}
          </select>
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
            className="flex h-9 items-center justify-center rounded-full bg-emerald-400/95 px-5 text-xs font-semibold text-emerald-950 shadow-soft-xl hover:bg-emerald-300"
          >
            Entrer dans le mode exposant
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
              URL de photo de profil
              <input
                type="url"
                value={localProfile.avatarUrl}
                onChange={(event) =>
                  setLocalProfile((prev) => ({
                    ...prev,
                    avatarUrl: event.target.value,
                  }))
                }
                placeholder="https://…"
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-slate-100 outline-none ring-0 focus:border-emerald-400"
              />
            </label>
            <label className="block text-xs text-slate-300">
              Texte de présentation
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
              Ajouter une œuvre
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
                URL de l’image
                <input
                  type="url"
                  value={newArtwork.imageUrl}
                  onChange={(event) =>
                    setNewArtwork((prev) => ({
                      ...prev,
                      imageUrl: event.target.value,
                    }))
                  }
                  placeholder="https://images.unsplash.com/…"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-slate-100 outline-none ring-0 focus:border-emerald-400"
                />
              </label>
              <label className="block text-xs text-slate-300">
                Description courte
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
                        {artist?.name ?? 'Artiste anonyme'}
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

function BottomNav({ view, onChangeView }) {
  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center safe-area-bottom">
      <div className="pointer-events-auto flex w-full max-w-xs items-center justify-between rounded-full bg-black/70 px-2.5 py-1.5 text-xs text-slate-200 backdrop-blur-2xl sm:max-w-sm">
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

function ArtworkDetailModal({
  artwork,
  onClose,
  onOpenOffer,
  onOpenArtistProfile,
}) {
  if (!artwork) return null;

  const artist = getArtistById(artwork.artistId);
  const collection = collections.find(
    (col) => col.id === artwork.collectionId,
  );

  return (
    <AnimatePresence>
      {artwork && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-black/75 px-4 py-6 backdrop-blur-2xl sm:py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel w-full max-w-3xl rounded-[32px] p-4 sm:p-6 md:p-7 max-h-[90vh] overflow-y-auto"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-[0.65rem] uppercase tracking-[0.25em] text-slate-400">
                  Détail de l’œuvre
                </p>
                <h2 className="text-base font-semibold text-slate-50 sm:text-lg md:text-xl">
                  {artwork.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                  {artist && (
                    <button
                      type="button"
                      onClick={() => onOpenArtistProfile(artist.id)}
                      className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-[0.7rem] text-slate-100 hover:bg-white/10"
                    >
                      <User2 className="h-3.5 w-3.5" />
                      {artist.name}
                    </button>
                  )}
                  {collection && (
                    <span className="pill bg-white/5 text-[0.6rem] text-slate-200">
                      {collection.title}
                    </span>
                  )}
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[0.6rem] text-emerald-200">
                    {formatPrice(artwork.price)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-200 hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-4 grid gap-4 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              <div className="overflow-hidden rounded-3xl bg-black/70">
                <ArtworkMedia
                  mediaType={artwork.mediaType}
                  mediaUrl={artwork.mediaUrl}
                  title={artwork.title}
                />
              </div>
              <div className="space-y-3 text-sm text-slate-200">
                <p className="text-xs text-slate-300">
                  Catégorie :{' '}
                  {artwork.category === 'peinture' && 'Peinture'}
                  {artwork.category === 'sculpture' && 'Sculpture'}
                  {artwork.category === 'style' && 'Style artistique'}
                  {artwork.category === 'objet' && 'Objet'}
                </p>
                <p className="text-sm leading-relaxed">{artwork.description}</p>
                <p className="text-xs text-slate-400">
                  Temps de vue moyen :{' '}
                  <span className="font-medium text-slate-100">
                    {formatSeconds(artwork.averageViewTime)}
                  </span>
                </p>
                <p className="text-xs text-slate-400">
                  Dans une vraie version produit, cette vue détaillée pourrait
                  inclure la provenance, des vues multiples, un certificat et
                  des informations sur les expositions.
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 pb-1 sm:mt-5 sm:flex-row sm:justify-end">
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

export default function App() {
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

  const allArtworks = useMemo(
    () => [...artworks, ...userArtworks],
    [userArtworks],
  );

  const [feed, setFeed] = useState(artworks);
  const [likedById, setLikedById] = useState({});
  const [activeOfferArtwork, setActiveOfferArtwork] = useState(null);
  const [activeDetailArtwork, setActiveDetailArtwork] = useState(null);
  const [immersiveView, setImmersiveView] = useState({
    mode: 'feed',
    artistId: null,
  });
  const [view, setView] = useState('catalog');

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
        <ArtistProfileView
          artistId={immersiveView.artistId}
          onBackToFeed={handleBackToFeed}
        />
        <OfferModal artwork={activeOfferArtwork} onClose={() => setActiveOfferArtwork(null)} />
      </>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-black via-mc-bg to-black">
      {!(role === 'visitor' && view === 'immersive' && immersiveView.mode === 'feed') && (
        <header className="pointer-events-none fixed inset-x-0 top-0 z-20 flex justify-center pt-3">
          <div className="pointer-events-auto flex w-full max-w-4xl items-center justify-between px-4 sm:px-6 md:px-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs text-slate-100 backdrop-blur-2xl">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="uppercase tracking-[0.25em] text-[0.6rem]">
                MaCollection
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-[0.6rem] uppercase tracking-[0.25em] text-slate-400 sm:inline">
                {view === 'catalog' ? 'Explorer' : 'Balade immersive'}
              </span>
              <button
                type="button"
                onClick={handleExhibitorAccessClick}
                className="hidden rounded-full border border-white/20 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-slate-100 hover:bg-white/10 sm:inline-flex"
              >
                Accès exposant
              </button>
            </div>
          </div>
        </header>
      )}

      <main
        className={
          view === 'catalog'
            ? 'relative flex-1 pt-16 pb-20'
            : 'relative flex-1 pb-20'
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
          <div className="balade-viewport snap-y snap-mandatory overflow-y-scroll scroll-smooth">
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
      />

      <OfferModal
        artwork={activeOfferArtwork}
        onClose={() => setActiveOfferArtwork(null)}
      />
    </div>
  );
}

