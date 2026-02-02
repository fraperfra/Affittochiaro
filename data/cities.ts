export interface CityDetails {
  ads: string;
  newToday: string;
  tenants: string;
  pos: { top: string; left: string };
  marker: { cx: number; cy: number };
}

export const cityDetails: Record<string, CityDetails> = {
  // Città principali (con card)
  'Milano': { ads: '1.240', newToday: '+120', tenants: '12.4k', pos: { top: '15%', left: '0%' }, marker: { cx: 450, cy: 280 } },
  'Roma': { ads: '980', newToday: '+85', tenants: '9.8k', pos: { top: '52%', left: '55%' }, marker: { cx: 560, cy: 700 } },
  'Torino': { ads: '450', newToday: '+32', tenants: '4.5k', pos: { top: '12%', left: '0%' }, marker: { cx: 340, cy: 280 } },
  'Bologna': { ads: '320', newToday: '+18', tenants: '3.2k', pos: { top: '28%', left: '50%' }, marker: { cx: 530, cy: 400 } },
  'Reggio Emilia': { ads: '210', newToday: '+12', tenants: '2.1k', pos: { top: '25%', left: '38%' }, marker: { cx: 490, cy: 380 } },
  'Napoli': { ads: '180', newToday: '+25', tenants: '5.8k', pos: { top: '68%', left: '55%' }, marker: { cx: 630, cy: 850 } },
  // Altre regioni (solo marker)
  'Aosta': { ads: '45', newToday: '+3', tenants: '0.4k', pos: { top: '10%', left: '0%' }, marker: { cx: 310, cy: 240 } },
  'Genova': { ads: '180', newToday: '+15', tenants: '1.8k', pos: { top: '22%', left: '0%' }, marker: { cx: 390, cy: 360 } },
  'Trento': { ads: '95', newToday: '+8', tenants: '0.9k', pos: { top: '8%', left: '45%' }, marker: { cx: 530, cy: 200 } },
  'Venezia': { ads: '290', newToday: '+22', tenants: '2.9k', pos: { top: '12%', left: '55%' }, marker: { cx: 600, cy: 280 } },
  'Trieste': { ads: '85', newToday: '+6', tenants: '0.8k', pos: { top: '10%', left: '65%' }, marker: { cx: 680, cy: 260 } },
  'Firenze': { ads: '380', newToday: '+28', tenants: '3.8k', pos: { top: '35%', left: '48%' }, marker: { cx: 530, cy: 500 } },
  'Perugia': { ads: '120', newToday: '+9', tenants: '1.2k', pos: { top: '42%', left: '50%' }, marker: { cx: 560, cy: 580 } },
  'Ancona': { ads: '95', newToday: '+7', tenants: '0.9k', pos: { top: '38%', left: '58%' }, marker: { cx: 620, cy: 540 } },
  'L\'Aquila': { ads: '65', newToday: '+5', tenants: '0.6k', pos: { top: '48%', left: '55%' }, marker: { cx: 600, cy: 660 } },
  'Campobasso': { ads: '35', newToday: '+2', tenants: '0.3k', pos: { top: '55%', left: '58%' }, marker: { cx: 640, cy: 760 } },
  'Bari': { ads: '210', newToday: '+18', tenants: '2.1k', pos: { top: '62%', left: '70%' }, marker: { cx: 750, cy: 830 } },
  'Potenza': { ads: '55', newToday: '+4', tenants: '0.5k', pos: { top: '65%', left: '62%' }, marker: { cx: 680, cy: 880 } },
  'Catanzaro': { ads: '75', newToday: '+5', tenants: '0.7k', pos: { top: '78%', left: '58%' }, marker: { cx: 660, cy: 1020 } },
  'Palermo': { ads: '195', newToday: '+16', tenants: '1.9k', pos: { top: '85%', left: '45%' }, marker: { cx: 520, cy: 1150 } },
  'Cagliari': { ads: '140', newToday: '+11', tenants: '1.4k', pos: { top: '70%', left: '15%' }, marker: { cx: 280, cy: 950 } },
};

export const nearbyCities = [
  { name: 'Milano' },
  { name: 'Roma' },
  { name: 'Torino' },
  { name: 'Bologna' },
  { name: 'Reggio Emilia' },
  { name: 'Napoli' },
];
