import { useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { createRoot } from 'react-dom/client';
import type { Listing } from '../../types';
import MapBoundsController from './MapBoundsController';
import ListingPopupCard from './ListingPopupCard';

// Stili custom per marker prezzo e popup
const MARKER_STYLES = `
  .price-marker {
    background: #004832;
    color: white;
    font-weight: 700;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 8px;
    white-space: nowrap;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    border: 2px solid white;
    cursor: pointer;
    transition: transform 0.15s;
  }
  .price-marker:hover {
    transform: scale(1.1);
    z-index: 1000 !important;
  }
  .price-marker--active {
    background: #00D094;
    color: #004832;
    transform: scale(1.15);
    z-index: 1000 !important;
  }
  .leaflet-popup-content-wrapper {
    border-radius: 16px !important;
    padding: 0 !important;
    overflow: hidden;
  }
  .leaflet-popup-content {
    margin: 0 !important;
    line-height: 1.4 !important;
  }
  .leaflet-popup-close-button {
    right: 8px !important;
    top: 8px !important;
    color: #666 !important;
    font-size: 18px !important;
    z-index: 10;
  }
  .marker-cluster-small {
    background-color: rgba(0, 72, 50, 0.2) !important;
  }
  .marker-cluster-small div {
    background-color: #004832 !important;
    color: white !important;
    font-weight: 700;
  }
  .marker-cluster-medium {
    background-color: rgba(0, 208, 148, 0.3) !important;
  }
  .marker-cluster-medium div {
    background-color: #00D094 !important;
    color: #004832 !important;
    font-weight: 700;
  }
  .marker-cluster-large {
    background-color: rgba(0, 72, 50, 0.3) !important;
  }
  .marker-cluster-large div {
    background-color: #004832 !important;
    color: white !important;
    font-weight: 700;
  }
`;

function formatPrice(price: number): string {
  if (price >= 1000) return `${(price / 1000).toFixed(price % 1000 === 0 ? 0 : 1)}k`;
  return `${price}`;
}

function createPriceIcon(price: number): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<div class="price-marker">${formatPrice(price)}&euro;</div>`,
    iconSize: [60, 28],
    iconAnchor: [30, 28],
  });
}

interface ListingMapViewProps {
  listings: Listing[];
  activeCity?: string;
  onListingClick: (listing: Listing) => void;
  onApply: (listing: Listing) => void;
  isApplied: (listingId: string) => boolean;
}

function ClusterLayer({
  listings,
  onListingClick,
  onApply,
  isApplied,
}: Omit<ListingMapViewProps, 'activeCity'>) {
  const map = useMap();
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);

  const listingsWithCoords = useMemo(
    () => listings.filter((l) => l.coordinates),
    [listings]
  );

  useEffect(() => {
    // Rimuovi cluster precedente
    if (clusterRef.current) {
      map.removeLayer(clusterRef.current);
    }

    // Crea nuovo cluster group
    const cluster = (L as any).markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      disableClusteringAtZoom: 16,
    });

    listingsWithCoords.forEach((listing) => {
      const marker = L.marker(
        [listing.coordinates!.lat, listing.coordinates!.lng],
        { icon: createPriceIcon(listing.price) }
      );

      marker.on('click', () => {
        const container = document.createElement('div');
        const root = createRoot(container);
        root.render(
          <ListingPopupCard
            listing={listing}
            onApply={() => onApply(listing)}
            isApplied={isApplied(listing.id)}
            onClick={() => {
              map.closePopup();
              onListingClick(listing);
            }}
          />
        );

        const popup = L.popup({
          offset: [0, -10],
          closeButton: true,
          minWidth: 270,
          maxWidth: 270,
        })
          .setLatLng([listing.coordinates!.lat, listing.coordinates!.lng])
          .setContent(container);

        popup.on('remove', () => {
          setTimeout(() => root.unmount(), 0);
        });

        popup.openOn(map);
      });

      cluster.addLayer(marker);
    });

    map.addLayer(cluster);
    clusterRef.current = cluster;

    return () => {
      if (clusterRef.current) {
        map.removeLayer(clusterRef.current);
      }
    };
  }, [listingsWithCoords, map, onListingClick, onApply, isApplied]);

  return null;
}

export default function ListingMapView({
  listings,
  activeCity,
  onListingClick,
  onApply,
  isApplied,
}: ListingMapViewProps) {
  // Inietta stili custom
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = MARKER_STYLES;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <MapContainer
      center={[42.5, 12.5]}
      zoom={6}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapBoundsController listings={listings} activeCity={activeCity} />
      <ClusterLayer
        listings={listings}
        onListingClick={onListingClick}
        onApply={onApply}
        isApplied={isApplied}
      />
    </MapContainer>
  );
}
