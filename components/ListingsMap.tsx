import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import type { PublicListing } from '../src/lib/mock-data';

const customIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/markers/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const selectedIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/markers/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [30, 49],
    iconAnchor: [15, 49],
    popupAnchor: [1, -40],
    shadowSize: [41, 41],
});

interface ListingsMapProps {
    listings: PublicListing[];
    center?: [number, number];
    zoom?: number;
    selectedId?: string | null;
    onMarkerClick?: (listing: PublicListing) => void;
    onMapClick?: () => void;
}

const MapUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, zoom);
    }, [center, zoom, map]);
    return null;
};

const MapClickHandler: React.FC<{ onMapClick?: () => void }> = ({ onMapClick }) => {
    useMapEvents({ click: () => onMapClick?.() });
    return null;
};

export const ListingsMap: React.FC<ListingsMapProps> = ({
    listings,
    center = [45.4642, 9.1900],
    zoom = 13,
    selectedId,
    onMarkerClick,
    onMapClick,
}) => {
    return (
        <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: '100%', width: '100%', zIndex: 0 }}
            zoomControl={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={center} zoom={zoom} />
            <MapClickHandler onMapClick={onMapClick} />
            {listings.map((item) => (
                <Marker
                    key={item.id}
                    position={[item.lat, item.lng]}
                    icon={item.id === selectedId ? selectedIcon : customIcon}
                    eventHandlers={{ click: () => onMarkerClick?.(item) }}
                />
            ))}
        </MapContainer>
    );
};
