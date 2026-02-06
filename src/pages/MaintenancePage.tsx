import { Wrench, Clock, Mail } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#004832] to-[#00261a] flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center">
        {/* Logo */}
        <img
          src="/assets/logoaffittochiaro_pic.webp"
          alt="Affittochiaro"
          className="h-16 mx-auto mb-10 brightness-0 invert"
        />

        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-8">
          <Wrench size={36} className="text-[#00D094]" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Stiamo migliorando il sito
        </h1>
        <p className="text-lg text-white/70 mb-10 leading-relaxed">
          Affittochiaro e in manutenzione programmata per offrirti
          un'esperienza ancora migliore. Torneremo online a breve.
        </p>

        {/* Info cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
            <Clock size={24} className="text-[#00D094] mx-auto mb-3" />
            <p className="text-white font-medium text-sm">Durata stimata</p>
            <p className="text-white/60 text-sm mt-1">Poche ore</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
            <Mail size={24} className="text-[#00D094] mx-auto mb-3" />
            <p className="text-white font-medium text-sm">Contattaci</p>
            <a
              href="mailto:supporto@affittochiaro.it"
              className="text-[#00D094] text-sm mt-1 inline-block hover:underline"
            >
              supporto@affittochiaro.it
            </a>
          </div>
        </div>

        {/* Progress bar animation */}
        <div className="w-full max-w-xs mx-auto">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#00D094] rounded-full animate-pulse w-2/3" />
          </div>
          <p className="text-white/40 text-xs mt-3">Lavori in corso...</p>
        </div>
      </div>
    </div>
  );
}
