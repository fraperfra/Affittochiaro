import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { listings } from '../data'; // Assuming listings are available here
import { ChevronRight } from 'lucide-react';

// Fix for default marker icon in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = new Icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

interface ListingsMapProps {
    listings: typeof listings;
    center?: [number, number]; // Lat, Lng
    zoom?: number;
}

// City coordinates mapping
const CITY_COORDINATES: Record<string, [number, number]> = {
    'Milano': [45.4642, 9.1900],
    'Roma': [41.9028, 12.4964],
    'Napoli': [40.8518, 14.2681],
    'Torino': [45.0703, 7.6869],
    'Firenze': [43.7696, 11.2558],
    'Bologna': [44.4949, 11.3426],
};

// Component to handle map movement
const MapUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, zoom);
    }, [center, zoom, map]);
    return null;
};

export const ListingsMap: React.FC<ListingsMapProps> = ({ listings, center = [45.4642, 9.1900], zoom = 13 }) => {

    // Custom Icon for listings
    const customIcon = new Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/markers/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

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

            {listings.map((item) => {
                // Generate pseudo-random coordinates around the center for demo purposes
                // In a real app, item would have lat/lng
                const offsetLat = (Math.random() - 0.5) * 0.04;
                const offsetLng = (Math.random() - 0.5) * 0.04;
                const position: [number, number] = [center[0] + offsetLat, center[1] + offsetLng];

                return (
                    <Marker key={item.id} position={position} icon={customIcon}>
                        <Popup className="custom-popup">
                            <div className="w-48 p-0 overflow-hidden rounded-lg font-sans">
                                <div className="h-24 relative">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-gray-900">
                                        {item.price}
                                    </div>
                                </div>
                                <div className="p-3">
                                    <h4 className="font-bold text-sm text-gray-800 leading-tight mb-1 truncate">{item.title}</h4>
                                    <p className="text-xs text-gray-500 mb-2">{item.type}</p>
                                    <button className="w-full bg-primary-600 text-white text-xs font-bold py-1.5 rounded flex items-center justify-center gap-1 hover:bg-primary-700 transition">
                                        Vedi <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
};
