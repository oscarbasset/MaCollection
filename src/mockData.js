// Données fictives pour MaCollection
// Structure :
// - artists : artistes avec bio et avatar
// - collections : sous-collections éditoriales par artiste
// - artworks : œuvres reliées à un artiste et une collection

export const artists = [
  {
    id: 'artist-lina-moreau',
    name: 'Lina Moreau',
    bio: 'Artiste numérique basée à Paris, Lina explore les frontières entre lumière, glitch et mémoire. Ses pièces jouent avec la persistance rétinienne et les flux vidéos compressés.',
    avatarUrl:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'artist-malik-essadi',
    name: 'Malik Essadi',
    bio: 'Peintre et sculpteur, Malik construit des architectures imaginaires inspirées des médinas et des skylines contemporaines. Son travail est intensément tactile, même en numérique.',
    avatarUrl:
      'https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'artist-aya-nakamori',
    name: 'Aya Nakamori',
    bio: 'Aya travaille à l’intersection de la photographie et du son. Ses vidéos lentes sont pensées comme des haïkus visuels sur le temps qui passe.',
    avatarUrl:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'artist-sofia-klein',
    name: 'Sofia Klein',
    bio: 'Peintre berlinoise, Sofia travaille des surfaces très texturées où les couches de peinture racontent des fragments de mémoire urbaine.',
    avatarUrl:
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'artist-idriss-ben-amar',
    name: 'Idriss Ben Amar',
    bio: 'Sculpteur basé à Marseille, Idriss assemble béton, métal et verre pour construire des totems minimalistes.',
    avatarUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'artist-clara-rossi',
    name: 'Clara Rossi',
    bio: 'Photographe italienne, Clara documente les ateliers d’artistes et les détails anodins qui précèdent la création.',
    avatarUrl:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'artist-jonas-kappel',
    name: 'Jonas Kappel',
    bio: 'Artiste multidisciplinaire de Copenhague, Jonas crée des installations lumineuses à partir d’objets trouvés.',
    avatarUrl:
      'https://images.unsplash.com/photo-1494797710133-75adf6c1f4a3?auto=format&fit=crop&w=200&q=80',
  },
];

export const collections = [
  {
    id: 'col-lina-neon',
    artistId: 'artist-lina-moreau',
    title: 'Néons fantômes',
    concept:
      'Une plongée dans des villes réinventées uniquement par leurs reflets lumineux. Chaque pièce est pensée comme un souvenir flou d’un lieu jamais visité.',
  },
  {
    id: 'col-lina-pixels',
    artistId: 'artist-lina-moreau',
    title: 'Pixels fragiles',
    concept:
      'Séries d’images volontairement compressées, où les artefacts deviennent le sujet principal de l’œuvre.',
  },
  {
    id: 'col-malik-structures',
    artistId: 'artist-malik-essadi',
    title: 'Structures silencieuses',
    concept:
      'Des masses architecturales quasi-monolithiques, éclairées comme des maquettes de cinéma.',
  },
  {
    id: 'col-malik-desert',
    artistId: 'artist-malik-essadi',
    title: 'Cartographies d’un désert imaginaire',
    concept:
      'Encre, sable et pigments pour dessiner des territoires qui n’existent que dans les rêves.',
  },
  {
    id: 'col-aya-tides',
    artistId: 'artist-aya-nakamori',
    title: 'Tides',
    concept:
      'Vidéos ultra-lentes de paysages côtiers, accompagnées de nappes sonores minimalistes.',
  },
  {
    id: 'col-aya-trains',
    artistId: 'artist-aya-nakamori',
    title: 'Les trains lents',
    concept:
      'Série sur les trains régionaux japonais, où presque rien ne se passe. Tout est dans l’atmosphère.',
  },
  {
    id: 'col-sofia-textures',
    artistId: 'artist-sofia-klein',
    title: 'Palimpsestes',
    concept:
      'Toiles épaisses recouvertes de couches qui laissent deviner des fragments effacés.',
  },
  {
    id: 'col-sofia-chromes',
    artistId: 'artist-sofia-klein',
    title: 'Cold Chromes',
    concept:
      'Travail sur des palettes froides, inspirées des façades industrielles de Berlin.',
  },
  {
    id: 'col-idriss-monoliths',
    artistId: 'artist-idriss-ben-amar',
    title: 'Monolithes',
    concept:
      'Sculptures massives en béton poli qui semblent flotter dans l’espace.',
  },
  {
    id: 'col-idriss-fragments',
    artistId: 'artist-idriss-ben-amar',
    title: 'Fragments',
    concept:
      'Assemblages de morceaux de métal récupéré, réorganisés en constellations minimales.',
  },
  {
    id: 'col-clara-ateliers',
    artistId: 'artist-clara-rossi',
    title: 'Ateliers silencieux',
    concept:
      'Série de photographies d’ateliers d’artistes entre deux œuvres, sans présence humaine.',
  },
  {
    id: 'col-clara-vitres',
    artistId: 'artist-clara-rossi',
    title: 'Vitrines floues',
    concept:
      'Reflets captés à travers des vitrines, entre intérieur et extérieur.',
  },
  {
    id: 'col-jonas-lights',
    artistId: 'artist-jonas-kappel',
    title: 'Borrowed Lights',
    concept:
      'Installations lumineuses composées uniquement de lampes récupérées dans la rue.',
  },
  {
    id: 'col-jonas-objects',
    artistId: 'artist-jonas-kappel',
    title: 'Found Choreographies',
    concept:
      'Objets trouvés mis en scène comme des personnages figés au milieu d’un mouvement.',
  },
];

const ARTIST_IDS = [
  'artist-lina-moreau',
  'artist-malik-essadi',
  'artist-aya-nakamori',
  'artist-sofia-klein',
  'artist-idriss-ben-amar',
  'artist-clara-rossi',
  'artist-jonas-kappel',
];
const COLLECTION_IDS = [
  'col-lina-neon',
  'col-lina-pixels',
  'col-malik-structures',
  'col-malik-desert',
  'col-aya-tides',
  'col-aya-trains',
  'col-sofia-textures',
  'col-sofia-chromes',
  'col-idriss-monoliths',
  'col-idriss-fragments',
  'col-clara-ateliers',
  'col-clara-vitres',
  'col-jonas-lights',
  'col-jonas-objects',
];
const CATEGORIES = ['peinture', 'sculpture', 'style', 'objet'];

const TITLES = [
  "Éclat d'Azur",
  'Structure Nomade',
  'Silence Minéral',
  'Fragments de Ciel',
  'Lueur Résiduelle',
  'Mémoire de Sable',
  'Horizon Flottant',
  'Cendre et Lumière',
  'Vestige',
  'Étendue',
  'Pli du Temps',
  'Résurgence',
  'Sillage',
  'Écho de Pierre',
  'Nuée',
  'Traversée',
  'Dépôt',
  'Faille',
  'Refuge',
  'Souffle',
  'Déprise',
  'Lisière',
  'Creux',
  'Persistance',
  'Déclin',
  'Affleurement',
  'Déferlement',
  'Envers',
  'Ressac',
  'Étincelle',
  'Décombres',
  'Marge',
  'Déprise II',
  'Suspension',
  'Évaporation',
  'Coulée',
  'Révérence',
  'Stèle',
  'Dispersions',
  'Attente',
];

export const artworks = Array.from({ length: 40 }, (_, i) => {
  const n = i + 1;
  return {
    id: `art-${n}`,
    artistId: ARTIST_IDS[n % ARTIST_IDS.length],
    collectionId: COLLECTION_IDS[n % COLLECTION_IDS.length],
    title: TITLES[i],
    description: `Œuvre contemporaine, pièce unique. ${TITLES[i]} fait partie d’une série explorant la matière et la lumière.`,
    price: 150 + ((n * 123) % 4851),
    mediaType: 'image',
    mediaUrl: `https://picsum.photos/seed/${n}/1080/1920`,
    likes: 80 + ((n * 17) % 401),
    averageViewTime: 12 + ((n * 3) % 36),
    category: CATEGORIES[n % CATEGORIES.length],
  };
});
