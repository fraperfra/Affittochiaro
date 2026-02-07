import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Listing } from '../../types';
import { CITY_COORDINATES } from '../../data/cityCoordinates';

interface MapBoundsControllerProps {
  listings: Listing[];
  activeCity?: string;
}

export default function MapBoundsController({ listings, activeCity }: MapBoundsControllerProps) {
  const map = useMap();

  useEffect(() => {
    // Se c'e' una citta attiva, centra su quella
    if (activeCity && CITY_COORDINATES[activeCity]) {
      const { lat, lng } = CITY_COORDINATES[activeCity];
      map.setView([lat, lng], 13, { animate: true });
      return;
    }

    // Altrimenti adatta ai marker visibili
    const withCoords = listings.filter(l => l.coordinates);
    if (withCoords.length === 0) {
      map.setView([42.5, 12.5], 6); // Vista Italia
      return;
    }

    const bounds = new L.LatLngBounds(
      withCoords.map(l => new L.LatLng(l.coordinates!.lat, l.coordinates!.lng))
    );
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
  }, [listings, activeCity, map]);

  return null;
}
