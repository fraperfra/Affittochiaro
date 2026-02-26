export interface Listing {
  id: string; // formato "pub_N"
  type: string;
  title: string;
  price: string;
  priceNumber: number;
  city: string;
  desc: string;
  image: string;
  rooms: number;
  squareMeters: number;
  bathrooms: number;
  features?: string[];
}

export const listings: Listing[] = [
  {
    id: 'pub_1',
    type: 'Appartamento',
    title: 'Bilocale Moderno in Centro',
    price: '€ 850',
    priceNumber: 850,
    city: 'Milano',
    desc: '65mq • 2° Piano con ascensore • Zona residenziale silenziosa e ben servita dai mezzi.',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
    rooms: 2, squareMeters: 65, bathrooms: 1,
    features: ['Arredato', 'Ascensore'],
  },
  {
    id: 'pub_2',
    type: 'Attico',
    title: 'Attico Luxury con Terrazza',
    price: '€ 1.400',
    priceNumber: 1400,
    city: 'Milano',
    desc: '110mq • Vista Duomo, domotica integrata e finiture di pregio extralusso.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    rooms: 3, squareMeters: 110, bathrooms: 2,
    features: ['Arredato', 'Balcone', 'Aria Condizionata'],
  },
  {
    id: 'pub_3',
    type: 'Villa',
    title: 'Villa Unifamiliare Indipendente',
    price: '€ 2.100',
    priceNumber: 2100,
    city: 'Roma',
    desc: '180mq • Ampio Giardino Privato • Garage doppio e classe energetica A+.',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800',
    rooms: 5, squareMeters: 180, bathrooms: 3,
    features: ['Animali Ammessi'],
  },
  {
    id: 'pub_4',
    type: 'Monolocale',
    title: 'Monolocale Funzionale Prati',
    price: '€ 650',
    priceNumber: 650,
    city: 'Roma',
    desc: '35mq • Zona Prati • Completamente ristrutturato, luminoso, pronto da subito.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
    rooms: 1, squareMeters: 35, bathrooms: 1,
    features: ['Arredato'],
  },
  {
    id: 'pub_5',
    type: 'Appartamento',
    title: 'Trilocale con Balcone – Porta Venezia',
    price: '€ 1.200',
    priceNumber: 1200,
    city: 'Milano',
    desc: '90mq • Balcone panoramico • Zona Porta Venezia, ottimi collegamenti metro.',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800',
    rooms: 3, squareMeters: 90, bathrooms: 1,
    features: ['Balcone', 'Ascensore'],
  },
  {
    id: 'pub_6',
    type: 'Stanza Singola',
    title: 'Stanza Singola in Appartamento Condiviso',
    price: '€ 480',
    priceNumber: 480,
    city: 'Torino',
    desc: '18mq • Appartamento 4 camere • Bagno condiviso, cucina attrezzata, wifi incluso.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800',
    rooms: 1, squareMeters: 18, bathrooms: 1,
    features: ['Arredato'],
  },
  {
    id: 'pub_7',
    type: 'Appartamento',
    title: 'Bilocale Ristrutturato – Oltrarno',
    price: '€ 950',
    priceNumber: 950,
    city: 'Firenze',
    desc: '55mq • Zona Oltrarno • Parquet originale, soffitti alti, esposizione doppia.',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800',
    rooms: 2, squareMeters: 55, bathrooms: 1,
    features: ['Arredato', 'Animali Ammessi'],
  },
  {
    id: 'pub_8',
    type: 'Loft',
    title: 'Loft Industrial Design – Navigli',
    price: '€ 1.350',
    priceNumber: 1350,
    city: 'Milano',
    desc: '95mq open space • Zona Navigli • Mattoni a vista, travi originali, soppalco.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
    rooms: 2, squareMeters: 95, bathrooms: 1,
    features: ['Arredato', 'Aria Condizionata'],
  },
  {
    id: 'pub_9',
    type: 'Appartamento',
    title: 'Quadrilocale Luminoso – Parioli',
    price: '€ 1.800',
    priceNumber: 1800,
    city: 'Roma',
    desc: '130mq • Quartiere Parioli • Ampio terrazzo, doppio bagno, box auto incluso.',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800',
    rooms: 4, squareMeters: 130, bathrooms: 2,
    features: ['Balcone', 'Aria Condizionata', 'Ascensore'],
  },
  {
    id: 'pub_10',
    type: 'Monolocale',
    title: 'Studio Moderno – Università',
    price: '€ 550',
    priceNumber: 550,
    city: 'Bologna',
    desc: '28mq • Zona Universitaria • Ideale per studenti, tutti i servizi vicini.',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800',
    rooms: 1, squareMeters: 28, bathrooms: 1,
    features: ['Arredato'],
  },
  {
    id: 'pub_11',
    type: 'Appartamento',
    title: 'Bilocale Vista Mare – Posillipo',
    price: '€ 900',
    priceNumber: 900,
    city: 'Napoli',
    desc: '60mq • Vista mare mozzafiato • Terrazzo privato, zona esclusiva Posillipo.',
    image: 'https://images.unsplash.com/photo-1520608760-eff2c44d4c8a?auto=format&fit=crop&q=80&w=800',
    rooms: 2, squareMeters: 60, bathrooms: 1,
    features: ['Balcone', 'Animali Ammessi'],
  },
  {
    id: 'pub_12',
    type: 'Villa',
    title: 'Villa Collinare con Piscina',
    price: '€ 3.200',
    priceNumber: 3200,
    city: 'Firenze',
    desc: '300mq • Piscina privata • Panorama sulle colline toscane, 10 min dal centro.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
    rooms: 6, squareMeters: 300, bathrooms: 4,
    features: ['Animali Ammessi', 'Aria Condizionata'],
  },
];

export const LISTING_CITIES = [...new Set(listings.map(l => l.city))].sort();
export const LISTING_TYPES  = [...new Set(listings.map(l => l.type))].sort();
