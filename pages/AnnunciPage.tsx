import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  MapPin,
  Home,
  Euro,
  SlidersHorizontal,
  ChevronRight,
  ChevronDown,
  Search,
  Filter,
  Map as MapIcon, // Renamed to avoid conflict with Map component from leaflet if needed (though not imported here)
  List,
  Heart,
  Camera,
  BedDouble,
  Bath,
  Maximize
} from 'lucide-react';
import { CityMap, ApplicationModal, ListingsMap } from '../components'; // Added ListingsMap
import { ApplicationData } from '../components/ApplicationModal';
// Import listings from data file
import { listings } from '../data';

// City coordinates mapping (duplicated for page logic comfort, or could be shared)
const CITY_COORDINATES: Record<string, [number, number]> = {
  'Milano': [45.4642, 9.1900],
  'Roma': [41.9028, 12.4964],
  'Napoli': [40.8518, 14.2681],
  'Torino': [45.0703, 7.6869],
  'Firenze': [43.7696, 11.2558],
  'Bologna': [44.4949, 11.3426],
  // Fallback
  'Italia': [41.8719, 12.5674]
};

export const AnnunciPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCity = searchParams.get('city') || 'Milano';

  const [activeCityName, setActiveCityName] = useState(urlCity);
  const [activeFilter, setActiveFilter] = useState('Tutti');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showMap, setShowMap] = useState(false); // Toggle for Map View

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<{
    id: number;
    title: string;
    price: string;
    type: string;
    image: string;
    desc?: string;
  } | null>(null);

  // Filter Logic
  const filteredListings = useMemo(() => {
    let result = listings;

    if (activeFilter !== 'Tutti') {
      result = result.filter(item => item.type === activeFilter);
    }

    return result;
  }, [activeFilter, activeCityName]);

  const activeCityCoordinates = useMemo(() => {
    // Naive city matching
    const cityKey = Object.keys(CITY_COORDINATES).find(c => activeCityName.includes(c)) || 'Milano';
    return CITY_COORDINATES[cityKey];
  }, [activeCityName]);


  const handleCityChange = (city: string) => {
    setActiveCityName(city);
    setSearchParams({ city });
  };

  const handleApplyClick = (listing: typeof listings[0]) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };

  const handleApplicationSubmit = (data: ApplicationData) => {
    const agencyId = 'agency_1';
    const existingApplications = JSON.parse(localStorage.getItem('affittochiaro_applications') || '[]');
    const newApplication = {
      ...data,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      status: 'pending',
      agencyId,
      viewed: false
    };
    localStorage.setItem('affittochiaro_applications', JSON.stringify([...existingApplications, newApplication]));

    const existingNotifications = JSON.parse(localStorage.getItem('affittochiaro_agency_notifications') || '[]');
    const newNotification = {
      id: Date.now().toString(),
      type: 'new_application',
      title: 'Nuova Candidatura',
      message: `${data.firstName} ${data.lastName} si è candidato per "${data.listingTitle}"`,
      applicantName: `${data.firstName} ${data.lastName}`,
      listingTitle: data.listingTitle,
      listingId: data.listingId,
      applicationId: newApplication.id,
      createdAt: new Date().toISOString(),
      read: false,
      agencyId
    };
    localStorage.setItem('affittochiaro_agency_notifications', JSON.stringify([newNotification, ...existingNotifications]));
  };

  return (
    <div className="pt-16 bg-gray-50 min-h-screen flex flex-col">

      {/* 1. SEARCH BAR STRIP (Sticky) */}
      <div className="bg-white border-b border-gray-200 sticky top-16 md:top-20 z-40 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">

            {/* Search Input */}
            <div className="relative w-full md:w-96 group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500 w-5 h-5 group-focus-within:scale-110 transition-transform" />
              <input
                type="text"
                value={activeCityName}
                onChange={(e) => setActiveCityName(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-medium text-gray-900 placeholder-gray-400 group-hover:bg-white"
                placeholder="Città, zona, via..."
              />
            </div>

            {/* Quick Filters & View Toggle */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide flex-grow md:flex-grow-0">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-sm font-medium whitespace-nowrap text-gray-700">
                  <Home className="w-4 h-4" /> Tipologia
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-sm font-medium whitespace-nowrap text-gray-700">
                  <Euro className="w-4 h-4" /> Prezzo
                </button>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 px-4 py-2 border border-primary-100 bg-primary-50/50 text-primary-700 rounded-lg hover:bg-primary-100 text-sm font-bold whitespace-nowrap"
                >
                  <SlidersHorizontal className="w-4 h-4" /> Filtri
                </button>
              </div>

              {/* View Toggle (List/Map) */}
              <div className="flex items-center bg-gray-200/50 p-1 rounded-lg border border-gray-200">
                <button
                  onClick={() => setShowMap(false)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-all ${!showMap ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <List className="w-4 h-4" /> Elenco
                </button>
                <button
                  onClick={() => setShowMap(true)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-all ${showMap ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <MapIcon className="w-4 h-4" /> Mappa
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="flex-grow max-w-screen-2xl mx-auto w-full px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8 h-full">

          {/* 2. FILTERS SIDEBAR (Left Column) - Stick to "Logica di prima" */}
          <aside className={`hidden lg:block space-y-8 ${showMap ? 'lg:col-span-1' : 'lg:col-span-1'}`}>
            <div className="sticky top-40 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg font-serif">Filtra risultati</h3>
                <button className="text-sm text-primary-600 hover:underline">Reset</button>
              </div>

              {/* Filters Content */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Prezzo (€)</label>
                  <div className="flex gap-2">
                    <input type="number" placeholder="Min" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50" />
                    <input type="number" placeholder="Max" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tipologia</label>
                  <div className="space-y-2.5">
                    {['Appartamento', 'Stanza Singola', 'Monolocale', 'Loft', 'Villa'].map(type => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          checked={activeFilter === type}
                          onChange={() => setActiveFilter(activeFilter === type ? 'Tutti' : type)}
                        />
                        <span className="text-sm text-gray-600 group-hover:text-primary-700 transition-colors">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Caratteristiche</label>
                  <div className="space-y-2.5">
                    {['Arredato', 'Balcone', 'Aria Condizionata', 'Ascensore', 'Animali Ammessi'].map(feat => (
                      <label key={feat} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                        <span className="text-sm text-gray-600 group-hover:text-primary-700 transition-colors">{feat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button className="w-full btn btn-primary py-3 rounded-xl justify-center font-bold shadow-lg shadow-primary-500/20">
                  Applica 5 Filtri
                </button>
              </div>
            </div>

            {/* Banner */}
            <div className="bg-gradient-to-br from-primary-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="font-bold text-lg mb-2 font-serif">Cerchi un inquilino?</h4>
                <p className="text-sm text-primary-100 mb-4">Pubblica gratis e trova persone referenziate.</p>
                <button onClick={() => navigate('/landing-inquilino')} className="bg-white text-primary-700 text-xs font-bold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Inizia Ora
                </button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            </div>
          </aside>

          {/* 3. MAIN CONTENT AREA (Toggleable View) */}
          <main className={`lg:col-span-3 transition-all duration-500 ${showMap ? 'flex h-[calc(100vh-140px)]' : ''}`}>

            {/* Header Info */}
            {!showMap && (
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold font-serif text-gray-900">
                  {filteredListings.length} Case in affitto a <span className="text-primary-600">{activeCityName}</span>
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="cursor-pointer hover:text-gray-900">Ordina per: </span>
                  <select className="bg-transparent font-bold text-gray-900 border-none focus:ring-0 cursor-pointer p-0">
                    <option>Rilevanza</option>
                    <option>Prezzo più basso</option>
                  </select>
                </div>
              </div>
            )}

            {/* Dynamic Content: GRID vs SPLIT MAP */}
            {showMap ? (
              <div className="flex w-full h-full gap-4 relative overflow-hidden rounded-2xl border border-gray-200 bg-white">

                {/* Left: Scrollable List */}
                <div className="w-1/2 h-full overflow-y-auto p-4 space-y-4 bg-gray-50/50 scrollbar-thin scrollbar-thumb-gray-300">
                  <div className="flex justify-between items-center mb-2 px-2">
                    <span className="font-bold text-sm text-gray-500">{filteredListings.length} Annunci</span>
                  </div>
                  {filteredListings.map(item => (
                    <div key={item.id} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all flex gap-3 cursor-pointer group" onClick={() => handleApplyClick(item)}>
                      <img src={item.image} className="w-24 h-24 rounded-xl object-cover" alt={item.title} />
                      <div className="flex-grow flex flex-col justify-between py-1">
                        <h4 className="font-bold text-sm font-serif line-clamp-2 leading-tight group-hover:text-primary-600">{item.title}</h4>
                        <div>
                          <p className="font-black text-primary-600 text-lg">{item.price}</p>
                          <button className="text-[10px] font-bold uppercase tracking-wider bg-primary-50 text-primary-700 px-2 py-1 rounded-md mt-1">Candidati</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right: Sticky Map (using LISTINGS MAP with OSM) */}
                <div className="w-1/2 h-full bg-gray-100 relative">
                  <ListingsMap listings={filteredListings} center={activeCityCoordinates} />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    Mappa Interattiva
                  </div>
                </div>
              </div>
            ) : (
              /* Standard Grid View */
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredListings.map((item) => (
                  <article key={item.id} className="bg-white rounded-[2rem] overflow-hidden shadow-card hover:shadow-card-hover border border-gray-100 flex flex-col group transition-all duration-300">
                    <div className="relative h-64 overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-gray-900 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                        {item.type}
                      </span>
                      <button className="absolute top-4 right-4 w-8 h-8 bg-white/50 hover:bg-white rounded-full flex items-center justify-center text-gray-800 transition-colors backdrop-blur-sm">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="mb-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold font-serif text-gray-900 leading-snug group-hover:text-primary-600 transition-colors cursor-pointer line-clamp-2">{item.title}</h3>
                        </div>
                        <p className="text-2xl font-black text-primary-600 tracking-tight">{item.price}<span className="text-xs text-gray-400 font-bold ml-1">/mese</span></p>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500 font-medium mb-6 border-b border-gray-50 pb-4">
                        <span className="flex items-center gap-1"><BedDouble className="w-4 h-4" /> 2</span>
                        <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> 1</span>
                        <span className="flex items-center gap-1"><Maximize className="w-4 h-4" /> 65 m²</span>
                      </div>

                      <div className="mt-auto flex gap-3">
                        <button onClick={() => handleApplyClick(item)} className="flex-grow btn btn-primary py-3 rounded-xl justify-center text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary-500/10">
                          Candidati
                        </button>
                        <button className="px-3 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-primary-600 transition-colors">
                          <MapIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* SEO Text (Only in Grid View) */}
            {!showMap && (
              <div className="mt-16 pt-8 border-t border-gray-200">
                <h2 className="text-xl font-bold font-serif mb-4">Affitti a {activeCityName} e dintorni</h2>
                <p className="text-sm text-gray-500 leading-relaxed max-w-4xl">
                  Scopri la più ampia selezione di case in affitto a {activeCityName} su AffittoChiaro.
                  Aggiorniamo le nostre liste ogni giorno per offrirti solo annunci verificati e disponibili.
                  Usa la mappa per cercare per zona o filtra per tipologia.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        listing={selectedListing}
        onSubmit={handleApplicationSubmit}
      />
    </div>
  );
};
