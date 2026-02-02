import React, { useState } from 'react';
import { listings } from '../data';
import { ApplicationModal, ApplicationData } from './ApplicationModal';

interface ListingsProps {
  activeCityName: string;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onApplicationSubmit?: (data: ApplicationData) => void;
}

export const Listings: React.FC<ListingsProps> = ({
  activeCityName,
  activeFilter,
  onFilterChange,
  onApplicationSubmit
}) => {
  const filters = ['Tutti', 'Appartamento', 'Attico', 'Villa'];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<{
    id: number;
    title: string;
    price: string;
    type: string;
    image: string;
  } | null>(null);

  const filteredListings = activeFilter === 'Tutti'
    ? listings
    : listings.filter(item => item.type === activeFilter);

  const handleApplyClick = (listing: typeof listings[0]) => {
    setSelectedListing({
      id: listing.id,
      title: listing.title,
      price: listing.price,
      type: listing.type,
      image: listing.image,
    });
    setIsModalOpen(true);
  };

  const handleApplicationSubmit = (data: ApplicationData) => {
    // Store the application in localStorage for now (will be used by agency dashboard)
    const existingApplications = JSON.parse(localStorage.getItem('affittochiaro_applications') || '[]');
    const newApplication = {
      ...data,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      status: 'pending',
      agencyId: 'agency_1', // Default agency for demo
    };
    localStorage.setItem('affittochiaro_applications', JSON.stringify([...existingApplications, newApplication]));

    // Create a notification for the agency
    const existingNotifications = JSON.parse(localStorage.getItem('affittochiaro_agency_notifications') || '[]');
    const newNotification = {
      id: Date.now().toString(),
      type: 'new_application',
      title: 'Nuova Candidatura',
      message: `${data.firstName} ${data.lastName} si e candidato per "${data.listingTitle}"`,
      applicantName: `${data.firstName} ${data.lastName}`,
      listingTitle: data.listingTitle,
      listingId: data.listingId,
      applicationId: newApplication.id,
      createdAt: new Date().toISOString(),
      read: false,
    };
    localStorage.setItem('affittochiaro_agency_notifications', JSON.stringify([newNotification, ...existingNotifications]));

    // Call the optional callback
    if (onApplicationSubmit) {
      onApplicationSubmit(data);
    }
  };

  return (
    <>
      <section id="annunci" className="py-16 bg-[#F8F9FA] px-4">
        <div className="max-w-full lg:px-20 mx-auto text-center">
          <div className="inline-block bg-trust-blue/10 text-trust-blue px-5 py-2 rounded-full font-bold text-[10px] mb-8 uppercase tracking-[0.2em]">ANNUNCI SELEZIONATI</div>
          <h2 className="text-3xl md:text-5xl font-bold text-brand-green mb-6 leading-tight font-poppins">Scegli la Tua Prossima Casa</h2>
          <p className="text-lg text-medium-gray mb-12 max-w-2xl mx-auto">Sfoglia le migliori opportunità immobiliari aggiornate in tempo reale dai portali e dai social a <span className="font-bold text-brand-green">{activeCityName}</span> e dintorni.</p>

          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => onFilterChange(f)}
                className={`px-8 py-3 rounded-2xl font-bold text-sm border transition-all ${activeFilter === f ? 'bg-brand-green text-white border-brand-green shadow-xl shadow-brand-green/20' : 'bg-white text-brand-green border-gray-100 hover:border-brand-green/20'}`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredListings.map((item) => (
              <div key={item.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-black/5 border border-gray-50 flex flex-col group hover:-translate-y-2 transition-all duration-500">
                <div className="relative aspect-[16/10] overflow-hidden rounded-t-[2.5rem]">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute top-6 right-6 bg-brand-green/10 backdrop-blur-md text-brand-green px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-brand-green/10">
                    {item.type}
                  </div>
                </div>
                <div className="p-8 flex-grow flex flex-col text-left">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-brand-green leading-snug group-hover:text-action-green transition-colors">{item.title}</h3>
                    <div className="text-action-green font-black text-xl tabular-nums tracking-tighter shrink-0">{item.price}<span className="text-xs font-bold text-medium-gray">/mese</span></div>
                  </div>
                  <p className="text-medium-gray text-sm leading-relaxed mb-8">{item.desc}</p>
                  <button
                    onClick={() => handleApplyClick(item)}
                    className="mt-auto w-full py-4 bg-brand-green text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-brand-green/10 hover:bg-black transition-colors"
                  >
                    Candidati ora
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 group">
            <a href="#" className="inline-flex items-center gap-3 text-brand-green font-bold text-lg hover:text-action-green transition-all">
              <span>Vedi tutti gli annunci disponibili a {activeCityName}</span>
              <div className="w-10 h-10 bg-brand-green/5 rounded-full flex items-center justify-center group-hover:bg-action-green group-hover:text-white transition-all">
                <svg className="w-5 h-5 translate-x-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        listing={selectedListing}
        onSubmit={handleApplicationSubmit}
      />
    </>
  );
};
