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
      'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: 'artist-malik-essadi',
    name: 'Malik Essadi',
    bio: 'Peintre et sculpteur, Malik construit des architectures imaginaires inspirées des médinas et des skylines contemporaines. Son travail est intensément tactile, même en numérique.',
    avatarUrl:
      'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: 'artist-aya-nakamori',
    name: 'Aya Nakamori',
    bio: 'Aya travaille à l’intersection de la photographie et du son. Ses vidéos lentes sont pensées comme des haïkus visuels sur le temps qui passe.',
    avatarUrl:
      'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=200',
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
];

