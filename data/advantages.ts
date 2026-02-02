export interface Advantage {
  icon: string;
  title: string;
  description: string;
  highlight?: boolean;
}

export const advantages: Advantage[] = [
  {
    icon: "⚡",
    title: "Risposte in 24 Ore",
    description: "Basta attese infinite. Il tuo profilo completo e verificato garantisce risposte rapide dai proprietari più seri."
  },
  {
    icon: "🛡️",
    title: "Profilo Verificato",
    description: "Aumenta la tua credibilità. Mostra ai proprietari che sei un inquilino affidabile con documenti già certificati."
  },
  {
    icon: "🛡️",
    title: "Contatto Diretto",
    description: "Parla direttamente con i proprietari. Elimina intermediari e complicazioni burocratiche per un affitto trasparente."
  },
  {
    icon: "🔍",
    title: "Aggregatore Intelligente",
    description: "Troviamo per te tutti gli annunci dai social e dai principali portali, organizzandoli in un'unica piattaforma."
  },
  {
    icon: "🤝",
    title: "Esclusività",
    description: "Accedi ad annunci selezionati prima che diventino pubblici su altri siti, aumentando le tue chance di successo."
  },
  {
    icon: "🏝️",
    title: "Zero Stress",
    description: "Ricevi notifiche personalizzate solo per le case che corrispondono realmente al tuo profilo e budget."
  }
];

export const benefits: Advantage[] = [
  { icon: "📋", title: "Dati Verificati", description: "Certifica la tua identità e solvibilità per rassicurare ogni proprietario fin dal primo contatto." },
  { icon: "🎥", title: "Video Presentazione", description: "Raccontati in <b>60 secondi</b>. Il <b>78% dei proprietari</b> preferisce profili con video.", highlight: true },
  { icon: "💼", title: "Lavoro Trasparente", description: "Mostra la tua stabilità con certificazioni sul <b>contratto</b> e settore professionale." },
  { icon: "⭐", title: "Colleziona testimonianze", description: "Colleziona testimonianze dai tuoi <b>precedenti proprietari</b> per massimizzare la fiducia." },
  { icon: "📸", title: "Galleria Personale", description: "Mostra il tuo <b>stile di vita</b> e i tuoi hobby con una gallery che parla di te." },
  { icon: "✍️", title: "La Tua Storia", description: "Una biografia curata per spiegare <b>perché sei l'inquilino perfetto</b>." }
];

export const problems = [
  { emoji: "📱", text: "Decine di <b>annunci su Facebook</b> pieni di informazioni confuse" },
  { emoji: "📧", text: "Centinaia di <b>email inviate</b> senza mai ricevere risposta" },
  { emoji: "😤", text: "Proprietari che non ti considerano perché <b>non sanno chi sei</b>" },
  { emoji: "⏰", text: "Settimane perse a rincorrere annunci già <b>affittati</b>" }
];
