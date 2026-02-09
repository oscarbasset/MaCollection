import React, { useMemo, useState } from 'react';
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
      <div className="relative w-full h-full overflow-hidden rounded-[32px] bg-black/80">
        <video
          src={mediaUrl}
          className="h-full w-full object-cover opacity-90"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-t from-black/55 via-transparent to-black/25" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden rounded-[32px] bg-black/80">
      <img
        src={mediaUrl}
        alt={title}
        className="h-full w-full object-cover"
        loading="lazy"
      />
      <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-t from-black/65 via-transparent to-black/25" />
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
    <section className="relative flex min-h-screen snap-start items-center justify-center px-3 py-4 sm:px-6 md:px-10">
      <motion.div
        layout
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -40, scale: 0.98 }}
        transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
        className="relative flex h-full w-full max-w-4xl flex-col gap-4 rounded-[40px] bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-black/90 p-3 sm:p-4 md:p-6 shadow-xl"
      >
        <div className="flex items-center justify-between gap-3 px-1 pt-1 text-xs uppercase tracking-[0.25em] text-slate-400">
          <span className="pill bg-white/5 text-[0.6rem] sm:text-[0.65rem]">
            Balade
          </span>
          <span className="hidden sm:inline-flex text-[0.6rem]">
            Glissez vers le bas pour continuer
          </span>
        </div>

        <div className="relative flex-1 overflow-hidden">
          <ArtworkMedia
            mediaType={artwork.mediaType}
            mediaUrl={artwork.mediaUrl}
            title={artwork.title}
          />

          {/* Overlay principal : infos œuvre + CTA */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 sm:p-6 md:p-8">
            <div className="flex items-start justify-between gap-3">
              <div className="pointer-events-auto inline-flex items-center gap-3 rounded-full bg-black/40 px-3 py-1.5 text-xs text-slate-200 backdrop-blur-2xl">
                <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-black/40">
                  {artist?.avatarUrl ? (
                    <img
                      src={artist.avatarUrl}
                      alt={artist.name}
                      className="h-full w-full object-cover"
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

              <div className="pointer-events-auto flex flex-col items-end gap-2 text-right">
                <div className="glass-panel flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-slate-100">
                  <BadgeDollarSign className="h-3.5 w-3.5 text-emerald-300" />
                  <span className="font-medium">{formatPrice(artwork.price)}</span>
                </div>
                <div className="rounded-full bg-black/40 px-2.5 py-1 text-[0.6rem] text-slate-200 backdrop-blur-lg">
                  Temps de vue moyen : {formatSeconds(artwork.averageViewTime)}
                </div>
              </div>
            </div>

            <div className="pointer-events-auto flex items-end justify-between gap-4">
              <div className="max-w-[70%] space-y-1.5 text-left sm:max-w-md">
                <h2 className="text-balance text-lg font-semibold text-slate-50 sm:text-xl md:text-2xl">
                  {artwork.title}
                </h2>
                <p className="line-clamp-3 text-xs text-slate-200/90 sm:text-sm md:text-[0.95rem]">
                  {artwork.description}
                </p>
              </div>

              <div className="flex flex-col items-center gap-2 text-xs text-slate-100">
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
              </div>
            </div>
          </div>

          {/* Panneau d’actions flottantes à droite (mobile-friendly) */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-end px-3 sm:px-5">
            <div className="pointer-events-auto flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={onOpenOffer}
                className="glass-panel flex h-11 w-11 items-center justify-center rounded-full text-xs font-medium text-emerald-100 transition hover:scale-[1.04] hover:bg-emerald-500/20 active:scale-[0.96]"
              >
                <BadgeDollarSign className="h-5 w-5" />
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

function CatalogView({
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

    return artworks.filter((artwork) => {
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
                  className="h-full w-full object-cover"
                  loading="lazy"
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
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center pb-4">
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
  const [feed, setFeed] = useState(artworks);
  const [likedById, setLikedById] = useState({});
  const [activeOfferArtwork, setActiveOfferArtwork] = useState(null);
  const [activeDetailArtwork, setActiveDetailArtwork] = useState(null);
  const [immersiveView, setImmersiveView] = useState({
    mode: 'feed',
    artistId: null,
  });
  const [view, setView] = useState('catalog');

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
            artworks.find((a) => a.id === artworkId);
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

  if (view === 'immersive' && immersiveView.mode === 'artist' && immersiveView.artistId) {
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
      <header className="pointer-events-none fixed inset-x-0 top-0 z-20 flex justify-center pt-3">
        <div className="pointer-events-auto flex w-full max-w-4xl items-center justify-between px-4 sm:px-6 md:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs text-slate-100 backdrop-blur-2xl">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="uppercase tracking-[0.25em] text-[0.6rem]">
              MaCollection
            </span>
          </div>
          <span className="hidden text-[0.6rem] uppercase tracking-[0.25em] text-slate-400 sm:inline">
            {view === 'catalog' ? 'Explorer' : 'Balade immersive'}
          </span>
        </div>
      </header>

      <main className="relative flex-1 pt-16 pb-20">
        {view === 'catalog' ? (
          <CatalogView
            likedById={likedById}
            onToggleLike={handleToggleLike}
            onOpenOffer={handleOpenOffer}
            onOpenArtistProfile={handleOpenArtistProfile}
            onOpenArtworkDetail={handleOpenArtworkDetail}
          />
        ) : (
          <div className="h-full snap-y snap-mandatory overflow-y-scroll scroll-smooth">
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

