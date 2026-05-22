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
  { icon: "ShieldCheck", title: "Dati Verificati", description: "Certifica la tua identità e solvibilità per rassicurare ogni proprietario fin dal primo contatto." },
  { icon: "Video", title: "Video Presentazione", description: "Raccontati in <b>60 secondi</b>. Il <b>78% dei proprietari</b> preferisce profili con video.", highlight: true },
  { icon: "Briefcase", title: "Lavoro Trasparente", description: "Mostra la tua stabilità con certificazioni sul <b>contratto</b> e settore professionale." },
  { icon: "PenLine", title: "La Tua Storia", description: "Una biografia curata per spiegare <b>perché sei l'inquilino perfetto</b>." },
];

export interface Problem {
  icon: string;
  title: string;
  description: string;
}

export const problems: Problem[] = [
  {
    icon: "EyeOff",
    title: "Il proprietario non sa chi sei",
    description: "Ogni giorno riceve decine di messaggi. Il tuo viene ignorato perché non ha modo di distinguerti dagli altri candidati.",
  },
  {
    icon: "FileX",
    title: "Non hai strumenti per mostrarti",
    description: "Un nome e un numero di telefono non bastano. Senza una storia credibile, resti uno dei tanti candidati anonimi.",
  },
  {
    icon: "Clock",
    title: "Mesi di ricerca, zero risultati",
    description: "Senza il profilo giusto la ricerca si allunga per mesi. Ogni settimana persa è stress e costi che si accumulano.",
  },
];
