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

export const artworks = [
  {
    id: 'art-lina-01',
    artistId: 'artist-lina-moreau',
    collectionId: 'col-lina-neon',
    title: 'Midnight Reflection #3',
    description:
      'Reflet de néons sur un pare-brise, capturé pendant une averse. L’image semble presque liquide.',
    price: 2400,
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80',
    likes: 132,
    averageViewTime: 18,
    category: 'peinture',
  },
  {
    id: 'art-lina-02',
    artistId: 'artist-lina-moreau',
    collectionId: 'col-lina-neon',
    title: 'Ghosts of Shibuya',
    description:
      'Composition abstraite de panneaux lumineux superposés, comme vus à travers une mémoire défaillante.',
    price: 3200,
    mediaType: 'video',
    mediaUrl:
      'https://videos.pexels.com/video-files/854149/854149-hd_1280_720_30fps.mp4',
    likes: 201,
    averageViewTime: 27,
    category: 'style',
  },
  {
    id: 'art-lina-03',
    artistId: 'artist-lina-moreau',
    collectionId: 'col-lina-pixels',
    title: 'Compression Study I',
    description:
      'Une image volontairement détruite par la compression, où chaque bloc de pixel devient une brique de couleur.',
    price: 1800,
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?auto=format&fit=crop&w=1200&q=80',
    likes: 98,
    averageViewTime: 15,
    category: 'style',
  },
  {
    id: 'art-lina-04',
    artistId: 'artist-lina-moreau',
    collectionId: 'col-lina-pixels',
    title: 'Signal Lost #2',
    description:
      'Un portrait brouillé par des glitchs colorés, comme récupéré d’une VHS abîmée.',
    price: 2600,
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1526481280695-3c687fd543c0?auto=format&fit=crop&w=1200&q=80',
    likes: 176,
    averageViewTime: 21,
    category: 'style',
  },
  {
    id: 'art-malik-01',
    artistId: 'artist-malik-essadi',
    collectionId: 'col-malik-structures',
    title: 'Atlas 02',
    description:
      'Une masse architecturale isolée au milieu d’un vide noir, éclairée par une unique source rasante.',
    price: 5400,
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1505842679540-5a1c49f0cde2?auto=format&fit=crop&w=1200&q=80',
    likes: 256,
    averageViewTime: 34,
    category: 'peinture',
  },
  {
    id: 'art-malik-02',
    artistId: 'artist-malik-essadi',
    collectionId: 'col-malik-desert',
    title: 'Dune Map #7',
    description:
      'Cartographie imaginaire réalisée à partir de sable fixé sur toile, ensuite numérisé en haute définition.',
    price: 3100,
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80',
    likes: 143,
    averageViewTime: 22,
    category: 'peinture',
  },
  {
    id: 'art-malik-03',
    artistId: 'artist-malik-essadi',
    collectionId: 'col-malik-desert',
    title: 'Dust Storm Blueprint',
    description:
      'Pigments ocre et indigo pour évoquer une tempête de sable vue depuis le ciel.',
    price: 2800,
    mediaType: 'video',
    mediaUrl:
      'https://videos.pexels.com/video-files/854149/854149-hd_1280_720_30fps.mp4',
    likes: 167,
    averageViewTime: 29,
    category: 'style',
  },
  {
    id: 'art-malik-04',
    artistId: 'artist-malik-essadi',
    collectionId: 'col-malik-structures',
    title: 'Concrete Dreams',
    description:
      'Sculpture numérique d’un bloc de béton poli, éclairé comme un bijou.',
    price: 4800,
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1526481280693-3b113a42129b?auto=format&fit=crop&w=1200&q=80',
    likes: 211,
    averageViewTime: 26,
    category: 'sculpture',
  },
  {
    id: 'art-aya-01',
    artistId: 'artist-aya-nakamori',
    collectionId: 'col-aya-tides',
    title: 'Tide Study #4',
    description:
      'Vidéo lente d’une marée montante, où seules de petites variations de lumière trahissent le temps qui passe.',
    price: 2100,
    mediaType: 'video',
    mediaUrl:
      'https://videos.pexels.com/video-files/854149/854149-hd_1280_720_30fps.mp4',
    likes: 189,
    averageViewTime: 41,
    category: 'style',
  },
  {
    id: 'art-aya-02',
    artistId: 'artist-aya-nakamori',
    collectionId: 'col-aya-trains',
    title: 'Local Line, 17:03',
    description:
      'Un train régional filmé depuis l’intérieur, presque vide, baigné d’une lumière orange très douce.',
    price: 2600,
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1515165562835-c4c9e0737eaa?auto=format&fit=crop&w=1200&q=80',
    likes: 134,
    averageViewTime: 24,
    category: 'objet',
  },
  {
    id: 'art-aya-03',
    artistId: 'artist-aya-nakamori',
    collectionId: 'col-aya-trains',
    title: 'Sleeper Car Memory',
    description:
      'Une image granuleuse d’un wagon de nuit, où les couleurs semblent presque désaturées par le temps.',
    price: 2950,
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1518300670681-9fd99daedf98?auto=format&fit=crop&w=1200&q=80',
    likes: 120,
    averageViewTime: 19,
    category: 'objet',
  },
  {
    id: 'art-aya-04',
    artistId: 'artist-aya-nakamori',
    collectionId: 'col-aya-tides',
    title: 'Harbor Lights',
    description:
      'Photographie d’un port de nuit, où les reflets colorés se dissolvent dans l’eau sombre.',
    price: 3200,
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=1200&q=80',
    likes: 178,
    averageViewTime: 28,
    category: 'style',
  },
  {
    id: 'art-lina-05',
    artistId: 'artist-lina-moreau',
    collectionId: 'col-lina-neon',
    title: 'Overexposed City',
    description:
      'Panorama urbain surexposé où les enseignes deviennent des traits de pinceau lumineux.',
    price: 3500,
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
    likes: 203,
    averageViewTime: 25,
    category: 'peinture',
  },
  {
    id: 'art-sofia-01',
    artistId: 'artist-sofia-klein',
    collectionId: 'col-sofia-textures',
    title: 'Surface 27B',
    description:
      'Grande toile presque monochrome où des griffures révèlent les couches de peinture sous-jacentes.',
    price: 4100,
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80',
    likes: 145,
    averageViewTime: 23,
    category: 'peinture',
  },
  {
    id: 'art-sofia-02',
    artistId: 'artist-sofia-klein',
    collectionId: 'col-sofia-textures',
    title: 'Blue Ashes',
    description:
      'Empâtements bleus et gris qui rappellent un mur effacé puis repeint des dizaines de fois.',
    price: 3800,
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1519710164239-5ac8a301cdf0?auto=format&fit=crop&w=1200&q=80',
    likes: 122,
    averageViewTime: 20,
    category: 'peinture',
  },
  {
    id: 'art-sofia-03',
    artistId: 'artist-sofia-klein',
    collectionId: 'col-sofia-chromes',
    title: 'Industrial Light',
    description:
      'Abstraction froide inspirée des reflets métalliques d’un entrepôt au petit matin.',
    price: 4400,
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1526481280694-3b113a42129b?auto=format&fit=crop&w=1200&q=80',
    likes: 167,
    averageViewTime: 27,
    category: 'peinture',
  },
  {
    id: 'art-idriss-01',
    artistId: 'artist-idriss-ben-amar',
    collectionId: 'col-idriss-monoliths',
    title: 'Totem 04',
    description:
      'Bloc de béton blanc nervuré de lignes fines, posé sur une base de métal brut.',
    price: 6900,
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
    likes: 211,
    averageViewTime: 32,
    category: 'sculpture',
  },
  {
    id: 'art-idriss-02',
    artistId: 'artist-idriss-ben-amar',
    collectionId: 'col-idriss-monoliths',
    title: 'Vertical Split',
    description:
      'Deux colonnes de béton séparées par une fente lumineuse, comme un paysage miniature.',
    price: 7200,
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1545235617-9465c4b8baad?auto=format&fit=crop&w=1200&q=80',
    likes: 189,
    averageViewTime: 30,
    category: 'sculpture',
  },
  {
    id: 'art-idriss-03',
    artistId: 'artist-idriss-ben-amar',
    collectionId: 'col-idriss-fragments',
    title: 'Rust Constellation',
    description:
      'Fragments de métal rouillé assemblés sur une plaque sombre, comme une carte de ciel inversée.',
    price: 3500,
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?auto=format&fit=crop&w=1200&q=80',
    likes: 132,
    averageViewTime: 21,
    category: 'objet',
  },
  {
    id: 'art-idriss-04',
    artistId: 'artist-idriss-ben-amar',
    collectionId: 'col-idriss-fragments',
    title: 'Broken Grid',
    description:
      'Carrés de métal découpés puis réassemblés en un damier volontairement incomplet.',
    price: 3300,
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=80',
    likes: 118,
    averageViewTime: 19,
    category: 'objet',
  },
  {
    id: 'art-clara-01',
    artistId: 'artist-clara-rossi',
    collectionId: 'col-clara-ateliers',
    title: 'Studio Corner',
    description:
      'Un coin d’atelier baigné d’une lumière laiteuse, avec une chaise tachée de peinture.',
    price: 1900,
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=80',
    likes: 167,
    averageViewTime: 24,
    category: 'objet',
  },
  {
    id: 'art-clara-02',
    artistId: 'artist-clara-rossi',
    collectionId: 'col-clara-ateliers',
    title: 'Drying Canvas',
    description:
      'Vue rapprochée d’une toile en train de sécher, suspendue à côté de pinceaux usés.',
    price: 2100,
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=80',
    likes: 138,
    averageViewTime: 22,
    category: 'style',
  },
  {
    id: 'art-clara-03',
    artistId: 'artist-clara-rossi',
    collectionId: 'col-clara-vitres',
    title: 'Window Fog',
    description:
      'Photographie d’une vitre embuée où l’on devine des sculptures floues à l’intérieur.',
    price: 2300,
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1438109491414-7198515b166b?auto=format&fit=crop&w=1200&q=80',
    likes: 125,
    averageViewTime: 20,
    category: 'style',
  },
  {
    id: 'art-clara-04',
    artistId: 'artist-clara-rossi',
    collectionId: 'col-clara-vitres',
    title: 'Gallery Night',
    description:
      'Reflets de néons sur une vitrine de galerie, où les œuvres se mélangent à la ville.',
    price: 2600,
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=1200&q=80',
    likes: 179,
    averageViewTime: 26,
    category: 'style',
  },
  {
    id: 'art-jonas-01',
    artistId: 'artist-jonas-kappel',
    collectionId: 'col-jonas-lights',
    title: 'Borrowed Neon',
    description:
      'Installation constituée uniquement de tubes néon récupérés, assemblés en cercle imparfait.',
    price: 5100,
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1200&q=80',
    likes: 214,
    averageViewTime: 33,
    category: 'objet',
  },
  {
    id: 'art-jonas-02',
    artistId: 'artist-jonas-kappel',
    collectionId: 'col-jonas-lights',
    title: 'Cable Forest',
    description:
      'Forêt de câbles électriques suspendus où chaque ampoule pulse à un rythme différent.',
    price: 4800,
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
    likes: 192,
    averageViewTime: 30,
    category: 'objet',
  },
  {
    id: 'art-jonas-03',
    artistId: 'artist-jonas-kappel',
    collectionId: 'col-jonas-objects',
    title: 'Chair Orbit',
    description:
      'Une simple chaise entourée de cercles de lumière projetés, comme en orbite silencieuse.',
    price: 2700,
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    likes: 163,
    averageViewTime: 23,
    category: 'objet',
  },
  {
    id: 'art-jonas-04',
    artistId: 'artist-jonas-kappel',
    collectionId: 'col-jonas-objects',
    title: 'Table Still Life',
    description:
      'Assemblage d’objets trouvés sur une table blanche, éclairés comme une nature morte classique.',
    price: 2500,
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=80',
    likes: 149,
    averageViewTime: 21,
    category: 'objet',
  },
  {
    id: 'art-jonas-05',
    artistId: 'artist-jonas-kappel',
    collectionId: 'col-jonas-lights',
    title: 'Afterglow',
    description:
      'Photographie d’une installation lumineuse éteinte, où seules subsistent des traces de lumière sur les murs.',
    price: 3000,
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=1200&q=80',
    likes: 171,
    averageViewTime: 24,
    category: 'style',
  },
];

