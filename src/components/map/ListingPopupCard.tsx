import { MapPin, Home, Maximize2, Send, CheckCircle } from 'lucide-react';
import type { Listing } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface ListingPopupCardProps {
  listing: Listing;
  onApply: (listing: Listing) => void;
  isApplied: boolean;
  onClick: () => void;
}

export default function ListingPopupCard({ listing, onApply, isApplied, onClick }: ListingPopupCardProps) {
  return (
    <div className="w-[240px] md:w-[270px] cursor-pointer" onClick={onClick}>
      {/* Image placeholder */}
      <div className="h-32 bg-gradient-to-br from-primary-100 to-teal-100 relative">
        <div className="absolute bottom-2 left-2 bg-white/90 text-primary-600 font-bold text-sm px-2 py-1 rounded-lg">
          {formatCurrency(listing.price)}/mese
        </div>
      </div>

      <div className="p-3">
        <h4 className="font-semibold text-sm text-gray-900 line-clamp-1 mb-1">
          {listing.title}
        </h4>

        <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
          <MapPin size={12} />
          <span>{listing.address.city}</span>
          {listing.zone && <span>- {listing.zone}</span>}
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
          <span className="flex items-center gap-1">
            <Home size={12} />
            {listing.rooms} locali
          </span>
          <span className="flex items-center gap-1">
            <Maximize2 size={12} />
            {listing.squareMeters} m&sup2;
          </span>
          {listing.furnished === 'yes' && (
            <span className="text-primary-600 font-medium">Arredato</span>
          )}
        </div>

        {isApplied ? (
          <button
            disabled
            className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-gray-400 bg-gray-100 rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <CheckCircle size={14} />
            Candidatura Inviata
          </button>
        ) : (
          <button
            className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onApply(listing);
            }}
          >
            <Send size={14} />
            Candidati Ora
          </button>
        )}
      </div>
    </div>
  );
}
