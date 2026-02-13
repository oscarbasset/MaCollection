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
  // 1–10
  {
    id: 'art-001',
    artistId: 'artist-lina-moreau',
    collectionId: 'col-lina-neon',
    title: 'Midnight Reflection #1',
    description:
      'Reflet de néons sur un pare-brise, capturé en sortie de galerie.',
    price: 2400,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/1269948/pexels-photo-1269948.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 132,
    averageViewTime: 18,
    category: 'peinture',
    artistName: 'Lina Moreau',
  },
  {
    id: 'art-002',
    artistId: 'artist-lina-moreau',
    collectionId: 'col-lina-neon',
    title: 'Ghosts of Shibuya',
    description:
      'Panneaux lumineux superposés où les typographies se dissolvent.',
    price: 3200,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/1579739/pexels-photo-1579739.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 201,
    averageViewTime: 27,
    category: 'style',
    artistName: 'Lina Moreau',
  },
  {
    id: 'art-003',
    artistId: 'artist-lina-moreau',
    collectionId: 'col-lina-pixels',
    title: 'Compression Study I',
    description:
      'Une image volontairement détruite par la compression numérique.',
    price: 1800,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/1047540/pexels-photo-1047540.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 98,
    averageViewTime: 15,
    category: 'style',
    artistName: 'Lina Moreau',
  },
  {
    id: 'art-004',
    artistId: 'artist-lina-moreau',
    collectionId: 'col-lina-pixels',
    title: 'Signal Lost #2',
    description:
      'Portrait brouillé par des glitchs colorés, comme récupéré d’une VHS.',
    price: 2600,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 176,
    averageViewTime: 21,
    category: 'style',
    artistName: 'Lina Moreau',
  },
  {
    id: 'art-005',
    artistId: 'artist-malik-essadi',
    collectionId: 'col-malik-structures',
    title: 'Atlas 02',
    description:
      'Masse architecturale isolée au milieu d’un vide noir, éclairée de biais.',
    price: 5400,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/1646953/pexels-photo-1646953.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 256,
    averageViewTime: 34,
    category: 'peinture',
    artistName: 'Malik Essadi',
  },
  {
    id: 'art-006',
    artistId: 'artist-malik-essadi',
    collectionId: 'col-malik-desert',
    title: 'Dune Map #7',
    description:
      'Cartographie imaginaire réalisée à partir de sable fixé sur toile.',
    price: 3100,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/1579739/pexels-photo-1579739.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 143,
    averageViewTime: 22,
    category: 'peinture',
    artistName: 'Malik Essadi',
  },
  {
    id: 'art-007',
    artistId: 'artist-malik-essadi',
    collectionId: 'col-malik-desert',
    title: 'Dust Storm Blueprint',
    description:
      'Pigments ocre et indigo pour évoquer une tempête de sable vue du ciel.',
    price: 2800,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/1269948/pexels-photo-1269948.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 167,
    averageViewTime: 29,
    category: 'style',
    artistName: 'Malik Essadi',
  },
  {
    id: 'art-008',
    artistId: 'artist-malik-essadi',
    collectionId: 'col-malik-structures',
    title: 'Concrete Dreams',
    description:
      'Bloc de béton poli, éclairé comme un bijou dans une vitrine sombre.',
    price: 4800,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/3634730/pexels-photo-3634730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 211,
    averageViewTime: 26,
    category: 'sculpture',
    artistName: 'Malik Essadi',
  },
  {
    id: 'art-009',
    artistId: 'artist-aya-nakamori',
    collectionId: 'col-aya-tides',
    title: 'Tide Study #4',
    description:
      'Mer presque immobile où seules les traces d’écume bougent lentement.',
    price: 2100,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/1047540/pexels-photo-1047540.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 189,
    averageViewTime: 41,
    category: 'style',
    artistName: 'Aya Nakamori',
  },
  {
    id: 'art-010',
    artistId: 'artist-aya-nakamori',
    collectionId: 'col-aya-trains',
    title: 'Local Line, 17:03',
    description:
      'Intérieur d’un train régional presque vide, baigné d’une lumière orange.',
    price: 2600,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 134,
    averageViewTime: 24,
    category: 'objet',
    artistName: 'Aya Nakamori',
  },

  // 11–20
  {
    id: 'art-011',
    artistId: 'artist-aya-nakamori',
    collectionId: 'col-aya-trains',
    title: 'Sleeper Car Memory',
    description:
      'Wagon de nuit granuleux, comme vu à travers une pellicule oubliée.',
    price: 2950,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/1646953/pexels-photo-1646953.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 120,
    averageViewTime: 19,
    category: 'objet',
    artistName: 'Aya Nakamori',
  },
  {
    id: 'art-012',
    artistId: 'artist-aya-nakamori',
    collectionId: 'col-aya-tides',
    title: 'Harbor Lights',
    description:
      'Reflets colorés d’un port de nuit qui vibrent sur la surface de l’eau.',
    price: 3200,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/1579739/pexels-photo-1579739.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 178,
    averageViewTime: 28,
    category: 'style',
    artistName: 'Aya Nakamori',
  },
  {
    id: 'art-013',
    artistId: 'artist-lina-moreau',
    collectionId: 'col-lina-neon',
    title: 'Overexposed City',
    description:
      'Panorama urbain où les enseignes deviennent des traits de pinceau lumineux.',
    price: 3500,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/1269948/pexels-photo-1269948.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 203,
    averageViewTime: 25,
    category: 'peinture',
    artistName: 'Lina Moreau',
  },
  {
    id: 'art-014',
    artistId: 'artist-sofia-klein',
    collectionId: 'col-sofia-textures',
    title: 'Surface 27B',
    description:
      'Grande toile monochrome où des griffures révèlent les couches cachées.',
    price: 4100,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 145,
    averageViewTime: 23,
    category: 'peinture',
    artistName: 'Sofia Klein',
  },
  {
    id: 'art-015',
    artistId: 'artist-sofia-klein',
    collectionId: 'col-sofia-textures',
    title: 'Blue Ashes',
    description:
      'Empâtements bleus et gris rappelant un mur effacé puis repeint.',
    price: 3800,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/1579739/pexels-photo-1579739.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 122,
    averageViewTime: 20,
    category: 'peinture',
    artistName: 'Sofia Klein',
  },
  {
    id: 'art-016',
    artistId: 'artist-sofia-klein',
    collectionId: 'col-sofia-chromes',
    title: 'Industrial Light',
    description:
      'Abstraction froide inspirée des reflets métalliques d’un entrepôt.',
    price: 4400,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/1047540/pexels-photo-1047540.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 167,
    averageViewTime: 27,
    category: 'peinture',
    artistName: 'Sofia Klein',
  },
  {
    id: 'art-017',
    artistId: 'artist-idriss-ben-amar',
    collectionId: 'col-idriss-monoliths',
    title: 'Totem 04',
    description:
      'Bloc de béton nervuré posé sur une base métallique sombre.',
    price: 6900,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/4276143/pexels-photo-4276143.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 211,
    averageViewTime: 32,
    category: 'sculpture',
    artistName: 'Idriss Ben Amar',
  },
  {
    id: 'art-018',
    artistId: 'artist-idriss-ben-amar',
    collectionId: 'col-idriss-monoliths',
    title: 'Vertical Split',
    description:
      'Deux colonnes de béton séparées par une fente lumineuse centrale.',
    price: 7200,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/3634730/pexels-photo-3634730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 189,
    averageViewTime: 30,
    category: 'sculpture',
    artistName: 'Idriss Ben Amar',
  },
  {
    id: 'art-019',
    artistId: 'artist-idriss-ben-amar',
    collectionId: 'col-idriss-fragments',
    title: 'Rust Constellation',
    description:
      'Fragments de métal rouillé assemblés comme une carte du ciel.',
    price: 3500,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/1269948/pexels-photo-1269948.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 132,
    averageViewTime: 21,
    category: 'objet',
    artistName: 'Idriss Ben Amar',
  },
  {
    id: 'art-020',
    artistId: 'artist-idriss-ben-amar',
    collectionId: 'col-idriss-fragments',
    title: 'Broken Grid',
    description:
      'Carrés de métal découpés puis réassemblés en un damier incomplet.',
    price: 3300,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/1570779/pexels-photo-1570779.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 118,
    averageViewTime: 19,
    category: 'objet',
    artistName: 'Idriss Ben Amar',
  },

  // 21–30
  {
    id: 'art-021',
    artistId: 'artist-clara-rossi',
    collectionId: 'col-clara-ateliers',
    title: 'Studio Corner',
    description:
      'Coin d’atelier baigné d’une lumière laiteuse, chaise tachée de peinture.',
    price: 1900,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 167,
    averageViewTime: 24,
    category: 'objet',
    artistName: 'Clara Rossi',
  },
  {
    id: 'art-022',
    artistId: 'artist-clara-rossi',
    collectionId: 'col-clara-ateliers',
    title: 'Drying Canvas',
    description:
      'Toile en train de sécher, suspendue à côté de pinceaux usés.',
    price: 2100,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/1570779/pexels-photo-1570779.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 138,
    averageViewTime: 22,
    category: 'style',
    artistName: 'Clara Rossi',
  },
  {
    id: 'art-023',
    artistId: 'artist-clara-rossi',
    collectionId: 'col-clara-vitres',
    title: 'Window Fog',
    description:
      'Vitre embuée derrière laquelle se devinent des formes sculpturales.',
    price: 2300,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 125,
    averageViewTime: 20,
    category: 'style',
    artistName: 'Clara Rossi',
  },
  {
    id: 'art-024',
    artistId: 'artist-clara-rossi',
    collectionId: 'col-clara-vitres',
    title: 'Gallery Night',
    description:
      'Reflets de néons sur une vitrine de galerie un soir de vernissage.',
    price: 2600,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/1269948/pexels-photo-1269948.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 179,
    averageViewTime: 26,
    category: 'style',
    artistName: 'Clara Rossi',
  },
  {
    id: 'art-025',
    artistId: 'artist-jonas-kappel',
    collectionId: 'col-jonas-lights',
    title: 'Borrowed Neon',
    description:
      'Cercle imparfait de tubes néon récupérés, suspendus dans le vide.',
    price: 5100,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/1269948/pexels-photo-1269948.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 214,
    averageViewTime: 33,
    category: 'objet',
    artistName: 'Jonas Kappel',
  },
  {
    id: 'art-026',
    artistId: 'artist-jonas-kappel',
    collectionId: 'col-jonas-lights',
    title: 'Cable Forest',
    description:
      'Forêt de câbles électriques où chaque ampoule pulse à un rythme différent.',
    price: 4800,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/1579739/pexels-photo-1579739.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 192,
    averageViewTime: 30,
    category: 'objet',
    artistName: 'Jonas Kappel',
  },
  {
    id: 'art-027',
    artistId: 'artist-jonas-kappel',
    collectionId: 'col-jonas-objects',
    title: 'Chair Orbit',
    description:
      'Une chaise ordinaire encerclée de halos lumineux projetés au sol.',
    price: 2700,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 163,
    averageViewTime: 23,
    category: 'objet',
    artistName: 'Jonas Kappel',
  },
  {
    id: 'art-028',
    artistId: 'artist-jonas-kappel',
    collectionId: 'col-jonas-objects',
    title: 'Table Still Life',
    description:
      'Objets trouvés disposés sur une table blanche comme une nature morte.',
    price: 2500,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/1646953/pexels-photo-1646953.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 149,
    averageViewTime: 21,
    category: 'objet',
    artistName: 'Jonas Kappel',
  },
  {
    id: 'art-029',
    artistId: 'artist-jonas-kappel',
    collectionId: 'col-jonas-lights',
    title: 'Afterglow',
    description:
      'Murs marqués par la lumière d’une installation tout juste éteinte.',
    price: 3000,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/1047540/pexels-photo-1047540.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 171,
    averageViewTime: 24,
    category: 'style',
    artistName: 'Jonas Kappel',
  },
  {
    id: 'art-030',
    artistId: 'artist-sofia-klein',
    collectionId: 'col-sofia-chromes',
    title: 'Cold Facade',
    description:
      'Palette froide inspirée d’une façade industrielle berlinoise.',
    price: 3600,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/1269948/pexels-photo-1269948.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 140,
    averageViewTime: 22,
    category: 'peinture',
    artistName: 'Sofia Klein',
  },

  // 31–40
  {
    id: 'art-031',
    artistId: 'artist-lina-moreau',
    collectionId: 'col-lina-neon',
    title: 'Neon Rain',
    description:
      'Pluie de lumière verte et rose reflétée sur l’asphalte mouillé.',
    price: 2600,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/1269948/pexels-photo-1269948.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 150,
    averageViewTime: 24,
    category: 'style',
    artistName: 'Lina Moreau',
  },
  {
    id: 'art-032',
    artistId: 'artist-lina-moreau',
    collectionId: 'col-lina-pixels',
    title: 'Pixel Drift',
    description:
      'Suite de pixels colorés qui semblent se détacher de l’écran.',
    price: 1900,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/1579739/pexels-photo-1579739.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 110,
    averageViewTime: 18,
    category: 'style',
    artistName: 'Lina Moreau',
  },
  {
    id: 'art-033',
    artistId: 'artist-malik-essadi',
    collectionId: 'col-malik-structures',
    title: 'Silent Block',
    description:
      'Volume massif posé au centre d’une pièce noire, éclairé par le haut.',
    price: 5200,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/3634730/pexels-photo-3634730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 175,
    averageViewTime: 29,
    category: 'sculpture',
    artistName: 'Malik Essadi',
  },
  {
    id: 'art-034',
    artistId: 'artist-idriss-ben-amar',
    collectionId: 'col-idriss-fragments',
    title: 'Iron Veins',
    description:
      'Réseau de lignes métalliques oxydées courant sur une plaque sombre.',
    price: 3400,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/1269948/pexels-photo-1269948.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 128,
    averageViewTime: 20,
    category: 'objet',
    artistName: 'Idriss Ben Amar',
  },
  {
    id: 'art-035',
    artistId: 'artist-clara-rossi',
    collectionId: 'col-clara-ateliers',
    title: 'Brushes Resting',
    description:
      'Gros plan sur des pinceaux couverts de peinture reposant dans un bocal.',
    price: 1800,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/1570779/pexels-photo-1570779.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 119,
    averageViewTime: 19,
    category: 'objet',
    artistName: 'Clara Rossi',
  },
  {
    id: 'art-036',
    artistId: 'artist-clara-rossi',
    collectionId: 'col-clara-vitres',
    title: 'Street Reflection',
    description:
      'Reflets d’une rue dans une vitrine de galerie partiellement masquée.',
    price: 2400,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/1646953/pexels-photo-1646953.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 144,
    averageViewTime: 22,
    category: 'style',
    artistName: 'Clara Rossi',
  },
  {
    id: 'art-037',
    artistId: 'artist-jonas-kappel',
    collectionId: 'col-jonas-objects',
    title: 'Hanging Objects',
    description:
      'Objets du quotidien suspendus à des fils presque invisibles.',
    price: 2600,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 151,
    averageViewTime: 23,
    category: 'objet',
    artistName: 'Jonas Kappel',
  },
  {
    id: 'art-038',
    artistId: 'artist-sofia-klein',
    collectionId: 'col-sofia-textures',
    title: 'Wall Memory',
    description:
      'Surface de mur grattée où affleurent d’anciennes couleurs de peinture.',
    price: 3000,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 137,
    averageViewTime: 21,
    category: 'peinture',
    artistName: 'Sofia Klein',
  },
  {
    id: 'art-039',
    artistId: 'artist-malik-essadi',
    collectionId: 'col-malik-structures',
    title: 'Floating Slab',
    description:
      'Plaque de béton suspendue par des câbles presque invisibles.',
    price: 6100,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/4276143/pexels-photo-4276143.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 188,
    averageViewTime: 31,
    category: 'sculpture',
    artistName: 'Malik Essadi',
  },
  {
    id: 'art-040',
    artistId: 'artist-aya-nakamori',
    collectionId: 'col-aya-tides',
    title: 'Low Tide Echo',
    description:
      'Plage à marée basse où seules quelques flaques reflètent le ciel.',
    price: 2800,
    mediaType: 'image',
    mediaUrl:
      'https://images.pexels.com/photos/1269948/pexels-photo-1269948.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    likes: 160,
    averageViewTime: 25,
    category: 'style',
    artistName: 'Aya Nakamori',
  },
];

