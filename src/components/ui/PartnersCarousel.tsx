import React from 'react';

const partners = [
    { img: '/assets/678f7ff916334f650a7a969e_Domeo-Servizi-Locazioni-Residenziali-logo-orizzontale (1).png', alt: 'Domeo' },
    { img: '/assets/Logo_Metacasa_V12_Black_09f15d5796.png', alt: 'Metacasa' },
    { img: '/assets/Sky_TV_Logo.png', alt: 'Sky' },
    { img: '/assets/Holidu_Logo_370b2379fe.png', alt: 'Holidu' },
    { img: '/assets/Switcho-Logotype-Green.png', alt: 'Switcho' },
    { img: '/assets/Now_logo.svg.png', alt: 'Now' },
    { img: '/assets/images.png', alt: 'Partner' },
    { img: '/assets/Image_from_iOS_4.png', alt: 'Partner' },
];

export const PartnersCarousel: React.FC = () => {
    return (
        <section className="bg-white py-12 border-b border-gray-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
                <p className="text-sm font-semibold tracking-wide text-gray-500 uppercase mx-auto text-center">
                    I nostri partner
                </p>
            </div>

            <div className="relative flex overflow-x-hidden group">
                <div className="animate-marquee flex whitespace-nowrap items-center min-w-full">
                    {partners.map((partner, index) => (
                        <div
                            key={`logo-1-${index}`}
                            className="flex-shrink-0 mx-8 sm:mx-12 lg:mx-16 flex items-center justify-center opacity-80 hover:opacity-100 transition-all duration-300 w-32 h-16 sm:w-40 sm:h-20"
                        >
                            <img
                                src={partner.img}
                                alt={partner.alt}
                                className="max-h-full max-w-full object-contain"
                                loading="lazy"
                            />
                        </div>
                    ))}
                    {/* Duplicate set for infinite loop scrolling */}
                    {partners.map((partner, index) => (
                        <div
                            key={`logo-2-${index}`}
                            className="flex-shrink-0 mx-8 sm:mx-12 lg:mx-16 flex items-center justify-center opacity-80 hover:opacity-100 transition-all duration-300 w-32 h-16 sm:w-40 sm:h-20"
                        >
                            <img
                                src={partner.img}
                                alt={partner.alt}
                                className="max-h-full max-w-full object-contain"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
