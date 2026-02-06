/**
 * PDF Export - Genera PDF del CV inquilino
 * Usa jsPDF per creare un PDF strutturato con i dati del CV
 */

import jsPDF from 'jspdf';
import { TenantCV, EMPLOYMENT_TYPE_LABELS, GUARANTOR_TYPE_LABELS } from '../types/cv';
import { DOCUMENT_TYPE_LABELS } from '../types/tenant';

const COLORS = {
  primary: [10, 94, 77] as [number, number, number],     // #0A5E4D
  teal: [0, 196, 140] as [number, number, number],       // #00C48C
  text: [30, 41, 59] as [number, number, number],        // #1E293B
  muted: [100, 116, 139] as [number, number, number],    // #64748B
  border: [226, 232, 240] as [number, number, number],   // #E2E8F0
  white: [255, 255, 255] as [number, number, number],
  bg: [248, 250, 252] as [number, number, number],       // #F8FAFC
  success: [22, 163, 74] as [number, number, number],    // #16A34A
  warning: [217, 119, 6] as [number, number, number],    // #D97706
};

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 20;
const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN;

function formatDateIT(date: Date | string | undefined): string {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatCurrencyIT(amount: number | undefined): string {
  if (!amount) return '-';
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount);
}

/**
 * Genera il PDF del CV
 */
export async function generateCVPdf(cv: TenantCV): Promise<void> {
  const doc = new jsPDF('p', 'mm', 'a4');
  let y = 0;

  // ===== HEADER =====
  // Background gradient header
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, PAGE_WIDTH, 55, 'F');

  // Nome
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(`${cv.personalInfo.firstName} ${cv.personalInfo.lastName}`, MARGIN, 25);

  // Sottotitolo
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const subtitle = [
    cv.employment.occupation,
    cv.personalInfo.city,
  ].filter(Boolean).join(' - ');
  doc.text(subtitle || 'Inquilino', MARGIN, 33);

  // Score badge
  const scoreLabel = cv.reliabilityScore >= 80 ? 'Eccellente'
    : cv.reliabilityScore >= 60 ? 'Buono'
    : cv.reliabilityScore >= 40 ? 'Sufficiente' : 'Da completare';

  doc.setFillColor(...COLORS.teal);
  doc.roundedRect(PAGE_WIDTH - MARGIN - 40, 15, 40, 25, 3, 3, 'F');
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`${cv.reliabilityScore}`, PAGE_WIDTH - MARGIN - 20, 28, { align: 'center' });
  doc.setFontSize(7);
  doc.text(scoreLabel, PAGE_WIDTH - MARGIN - 20, 35, { align: 'center' });

  // Completezza
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Completezza CV: ${cv.completeness.total}%`, MARGIN, 45);

  // Progress bar background
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(MARGIN, 48, 60, 3, 1.5, 1.5, 'F');
  // Progress bar fill
  doc.setFillColor(...COLORS.teal);
  doc.roundedRect(MARGIN, 48, Math.max(2, (cv.completeness.total / 100) * 60), 3, 1.5, 1.5, 'F');

  y = 65;

  // ===== DATI PERSONALI =====
  y = drawSectionTitle(doc, 'DATI PERSONALI', y);

  const personalData: [string, string][] = [];
  if (cv.personalInfo.email) personalData.push(['Email', cv.personalInfo.email]);
  if (cv.personalInfo.phone) personalData.push(['Telefono', cv.personalInfo.phone]);
  if (cv.personalInfo.dateOfBirth) {
    const age = Math.floor((Date.now() - new Date(cv.personalInfo.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    personalData.push(['Data di Nascita', `${formatDateIT(cv.personalInfo.dateOfBirth)} (${age} anni)`]);
  }
  if (cv.personalInfo.city) personalData.push(['Citta', `${cv.personalInfo.city}${cv.personalInfo.province ? ` (${cv.personalInfo.province})` : ''}`]);
  if (cv.personalInfo.nationality) personalData.push(['Nazionalita', cv.personalInfo.nationality]);
  if (cv.personalInfo.fiscalCode) personalData.push(['Codice Fiscale', cv.personalInfo.fiscalCode]);

  y = drawKeyValueGrid(doc, personalData, y, 2);

  if (cv.personalInfo.bio) {
    y += 4;
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.muted);
    doc.text('Presentazione:', MARGIN, y);
    y += 5;
    doc.setTextColor(...COLORS.text);
    const bioLines = doc.splitTextToSize(cv.personalInfo.bio, CONTENT_WIDTH);
    doc.text(bioLines, MARGIN, y);
    y += bioLines.length * 4.5;
  }

  y += 6;

  // ===== SITUAZIONE LAVORATIVA =====
  y = checkPageBreak(doc, y, 40);
  y = drawSectionTitle(doc, 'SITUAZIONE LAVORATIVA', y);

  const employmentData: [string, string][] = [];
  if (cv.employment.occupation) employmentData.push(['Occupazione', cv.employment.occupation]);
  if (cv.employment.employmentType) employmentData.push(['Tipo Contratto', EMPLOYMENT_TYPE_LABELS[cv.employment.employmentType] || cv.employment.employmentType]);
  if (cv.employment.employer) employmentData.push(['Datore di Lavoro', cv.employment.employer]);
  if (cv.employment.annualIncome) employmentData.push(['Reddito Annuale', formatCurrencyIT(cv.employment.annualIncome)]);
  if (cv.employment.employmentStartDate) {
    const years = Math.floor((Date.now() - new Date(cv.employment.employmentStartDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    employmentData.push(['In servizio da', `${formatDateIT(cv.employment.employmentStartDate)} (${years} anni)`]);
  }

  y = drawKeyValueGrid(doc, employmentData, y, 2);
  y += 6;

  // ===== STORIA ABITATIVA =====
  if (cv.rentalHistory.length > 0) {
    y = checkPageBreak(doc, y, 30);
    y = drawSectionTitle(doc, 'STORIA ABITATIVA', y);

    for (const entry of cv.rentalHistory) {
      y = checkPageBreak(doc, y, 25);

      doc.setFillColor(...COLORS.bg);
      doc.roundedRect(MARGIN, y - 2, CONTENT_WIDTH, 20, 2, 2, 'F');

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.text);
      doc.text(entry.address || 'Indirizzo non specificato', MARGIN + 4, y + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.muted);
      const rentalInfo = [
        entry.city,
        `${formatDateIT(entry.startDate)} - ${entry.endDate ? formatDateIT(entry.endDate) : 'Attuale'}`,
        entry.monthlyRent ? `${formatCurrencyIT(entry.monthlyRent)}/mese` : null,
      ].filter(Boolean).join(' | ');
      doc.text(rentalInfo, MARGIN + 4, y + 12);

      y += 24;
    }
    y += 4;
  }

  // ===== DOCUMENTI =====
  if (cv.documents.length > 0) {
    y = checkPageBreak(doc, y, 30);
    y = drawSectionTitle(doc, 'DOCUMENTI', y);

    for (const docItem of cv.documents) {
      y = checkPageBreak(doc, y, 10);

      // Status indicator
      const statusColor = docItem.status === 'verified' ? COLORS.success : COLORS.warning;
      doc.setFillColor(...statusColor);
      doc.circle(MARGIN + 3, y + 2, 1.5, 'F');

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLORS.text);
      const typeLabel = DOCUMENT_TYPE_LABELS[docItem.type] || docItem.type;
      doc.text(typeLabel, MARGIN + 8, y + 3);

      doc.setTextColor(...COLORS.muted);
      doc.setFontSize(8);
      const statusLabel = docItem.status === 'verified' ? 'Verificato' : docItem.status === 'pending' ? 'In attesa' : 'Rifiutato';
      doc.text(statusLabel, MARGIN + 80, y + 3);

      y += 8;
    }
    y += 4;
  }

  // ===== REFERENZE =====
  if (cv.references.length > 0) {
    y = checkPageBreak(doc, y, 30);
    y = drawSectionTitle(doc, 'REFERENZE', y);

    for (const ref of cv.references) {
      y = checkPageBreak(doc, y, 20);

      doc.setFillColor(...COLORS.bg);
      doc.roundedRect(MARGIN, y - 2, CONTENT_WIDTH, 18, 2, 2, 'F');

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.text);
      doc.text(ref.landlordName || 'Referente', MARGIN + 4, y + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.muted);

      const refInfo = [];
      if (ref.propertyAddress) refInfo.push(ref.propertyAddress);
      if (ref.rating) refInfo.push(`Valutazione: ${ref.rating}/5`);
      if (ref.isVerified) refInfo.push('Verificata');
      doc.text(refInfo.join(' | '), MARGIN + 4, y + 12);

      y += 22;
    }
    y += 4;
  }

  // ===== GARANTI =====
  if (cv.guarantors.length > 0) {
    y = checkPageBreak(doc, y, 30);
    y = drawSectionTitle(doc, 'GARANTI', y);

    for (const guarantor of cv.guarantors) {
      y = checkPageBreak(doc, y, 15);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.text);
      doc.text(guarantor.fullName, MARGIN, y + 3);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLORS.muted);
      doc.setFontSize(8);
      const gInfo = [
        GUARANTOR_TYPE_LABELS[guarantor.type],
        guarantor.occupation,
        guarantor.isVerified ? 'Verificato' : 'Non verificato',
      ].filter(Boolean).join(' | ');
      doc.text(gInfo, MARGIN + 60, y + 3);

      y += 10;
    }
  }

  // ===== FOOTER =====
  drawFooter(doc, cv);

  // Salva
  const filename = `CV_${cv.personalInfo.firstName}_${cv.personalInfo.lastName}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}

// ===== HELPER FUNCTIONS =====

function drawSectionTitle(doc: jsPDF, title: string, y: number): number {
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primary);
  doc.text(title, MARGIN, y);

  // Underline
  doc.setDrawColor(...COLORS.teal);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y + 2, MARGIN + CONTENT_WIDTH, y + 2);

  return y + 8;
}

function drawKeyValueGrid(doc: jsPDF, data: [string, string][], y: number, cols: number): number {
  const colWidth = CONTENT_WIDTH / cols;

  for (let i = 0; i < data.length; i += cols) {
    for (let j = 0; j < cols && i + j < data.length; j++) {
      const [key, value] = data[i + j];
      const x = MARGIN + j * colWidth;

      doc.setFontSize(8);
      doc.setTextColor(...COLORS.muted);
      doc.text(key, x, y);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.text);
      doc.text(value, x, y + 5);
      doc.setFont('helvetica', 'normal');
    }
    y += 12;
  }

  return y;
}

function checkPageBreak(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > PAGE_HEIGHT - 25) {
    doc.addPage();
    drawFooter(doc);
    return 20;
  }
  return y;
}

function drawFooter(doc: jsPDF, cv?: TenantCV): void {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Linea
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, PAGE_HEIGHT - 15, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 15);

    // Testo footer
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.muted);
    doc.text(
      `CV generato su Affittochiaro${cv ? ` - Ultimo aggiornamento: ${formatDateIT(cv.lastUpdated)}` : ''}`,
      MARGIN,
      PAGE_HEIGHT - 10
    );
    doc.text(
      `Pagina ${i} di ${pageCount}`,
      PAGE_WIDTH - MARGIN,
      PAGE_HEIGHT - 10,
      { align: 'right' }
    );
  }
}
