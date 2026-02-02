export interface Listing {
  id: number;
  type: string;
  title: string;
  price: string;
  desc: string;
  image: string;
}

export const listings: Listing[] = [
  {
    id: 1,
    type: 'Appartamento',
    title: 'Bilocale Moderno in Centro',
    price: '€ 850',
    desc: '65mq • 2° Piano con ascensore • Zona residenziale silenziosa e ben servita dai mezzi.',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 2,
    type: 'Attico',
    title: 'Attico Luxury con Terrazza',
    price: '€ 1.400',
    desc: '110mq • Vista Duomo, domotica integrata e finiture di pregio extralusso.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 3,
    type: 'Villa',
    title: 'Villa Unifamiliare Indipendente',
    price: '€ 2.100',
    desc: '180mq • Ampio Giardino Privato • Garage doppio e classe energetica A+.',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800',
  }
];
