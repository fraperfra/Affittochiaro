/**
 * Coordinate GPS reali per le citta italiane
 * Usate per geolocalizzare gli annunci sulla mappa
 */

export interface CityCoordinate {
  lat: number;
  lng: number;
  radius: number; // km - raggio per scatter realistico degli annunci
}

export const CITY_COORDINATES: Record<string, CityCoordinate> = {
  'Milano':         { lat: 45.4642, lng: 9.1900, radius: 8 },
  'Roma':           { lat: 41.9028, lng: 12.4964, radius: 10 },
  'Napoli':         { lat: 40.8518, lng: 14.2681, radius: 7 },
  'Torino':         { lat: 45.0703, lng: 7.6869, radius: 7 },
  'Bologna':        { lat: 44.4949, lng: 11.3426, radius: 5 },
  'Firenze':        { lat: 43.7696, lng: 11.2558, radius: 5 },
  'Genova':         { lat: 44.4056, lng: 8.9463, radius: 5 },
  'Venezia':        { lat: 45.4408, lng: 12.3155, radius: 4 },
  'Verona':         { lat: 45.4384, lng: 10.9916, radius: 4 },
  'Padova':         { lat: 45.4064, lng: 11.8768, radius: 4 },
  'Trieste':        { lat: 45.6495, lng: 13.7768, radius: 3 },
  'Brescia':        { lat: 45.5416, lng: 10.2118, radius: 4 },
  'Parma':          { lat: 44.8015, lng: 10.3279, radius: 4 },
  'Modena':         { lat: 44.6471, lng: 10.9252, radius: 4 },
  'Reggio Emilia':  { lat: 44.6989, lng: 10.6310, radius: 4 },
  'Ravenna':        { lat: 44.4184, lng: 12.2035, radius: 3 },
  'Rimini':         { lat: 44.0594, lng: 12.5681, radius: 3 },
  'Ferrara':        { lat: 44.8381, lng: 11.6198, radius: 3 },
  'Piacenza':       { lat: 45.0526, lng: 9.6930, radius: 3 },
  'Bergamo':        { lat: 45.6983, lng: 9.6773, radius: 4 },
  'Monza':          { lat: 45.5845, lng: 9.2745, radius: 3 },
  'Como':           { lat: 45.8080, lng: 9.0852, radius: 3 },
  'Varese':         { lat: 45.8206, lng: 8.8257, radius: 3 },
  'Pavia':          { lat: 45.1847, lng: 9.1582, radius: 3 },
  'Cremona':        { lat: 45.1332, lng: 10.0227, radius: 3 },
  'Mantova':        { lat: 45.1564, lng: 10.7914, radius: 3 },
  'Lecco':          { lat: 45.8566, lng: 9.3976, radius: 3 },
  'Lodi':           { lat: 45.3138, lng: 9.5035, radius: 2 },
  'Bari':           { lat: 41.1171, lng: 16.8719, radius: 6 },
  'Palermo':        { lat: 38.1157, lng: 13.3615, radius: 6 },
  'Catania':        { lat: 37.5079, lng: 15.0830, radius: 5 },
  'Messina':        { lat: 38.1938, lng: 15.5540, radius: 4 },
  'Cagliari':       { lat: 39.2238, lng: 9.1217, radius: 5 },
  'Sassari':        { lat: 40.7259, lng: 8.5560, radius: 3 },
  'Perugia':        { lat: 43.1107, lng: 12.3908, radius: 4 },
  'Ancona':         { lat: 43.6158, lng: 13.5189, radius: 3 },
  'Pescara':        { lat: 42.4618, lng: 14.2161, radius: 3 },
  'Trento':         { lat: 46.0748, lng: 11.1217, radius: 3 },
  'Bolzano':        { lat: 46.4983, lng: 11.3548, radius: 3 },
  'Udine':          { lat: 46.0711, lng: 13.2346, radius: 3 },
  'Aosta':          { lat: 45.7375, lng: 7.3154, radius: 2 },
  // Extra cities from landing page
  "L'Aquila":       { lat: 42.3498, lng: 13.3995, radius: 3 },
  'Campobasso':     { lat: 41.5603, lng: 14.6685, radius: 2 },
  'Potenza':        { lat: 40.6404, lng: 15.8056, radius: 2 },
  'Catanzaro':      { lat: 38.9100, lng: 16.5878, radius: 3 },
};

/**
 * Genera coordinate casuali entro `radius` km dal centro citta.
 * 1 grado lat ~= 111 km, 1 grado lng ~= 111 * cos(lat) km
 */
export function randomCoordinateNear(cityName: string): { lat: number; lng: number } {
  const city = CITY_COORDINATES[cityName];
  if (!city) {
    // Fallback: centro Italia
    return { lat: 41.9 + Math.random() * 0.1, lng: 12.5 + Math.random() * 0.1 };
  }

  const radiusInDegLat = city.radius / 111;
  const radiusInDegLng = city.radius / (111 * Math.cos((city.lat * Math.PI) / 180));

  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.sqrt(Math.random()); // sqrt per distribuzione uniforme nell'area

  return {
    lat: city.lat + distance * radiusInDegLat * Math.sin(angle),
    lng: city.lng + distance * radiusInDegLng * Math.cos(angle),
  };
}
