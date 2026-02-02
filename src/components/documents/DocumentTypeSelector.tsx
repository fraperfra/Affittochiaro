/**
 * DocumentTypeSelector Component
 * Select per scegliere il tipo di documento
 */

import React from 'react';
import { DocumentType, DOCUMENT_TYPE_LABELS } from '@/types/tenant';
import { FileText, CreditCard, Receipt, FileCheck, Building2, Calculator, Shield, Mail, File } from 'lucide-react';

interface DocumentTypeSelectorProps {
  value: DocumentType | '';
  onChange: (type: DocumentType) => void;
  disabled?: boolean;
  error?: string;
}

const DOCUMENT_ICONS: Record<DocumentType, React.ReactNode> = {
  identity_card: <CreditCard className="w-4 h-4" />,
  fiscal_code: <FileText className="w-4 h-4" />,
  payslip: <Receipt className="w-4 h-4" />,
  employment_contract: <FileCheck className="w-4 h-4" />,
  bank_statement: <Building2 className="w-4 h-4" />,
  tax_return: <Calculator className="w-4 h-4" />,
  guarantee: <Shield className="w-4 h-4" />,
  reference_letter: <Mail className="w-4 h-4" />,
  other: <File className="w-4 h-4" />,
};

export function DocumentTypeSelector({
  value,
  onChange,
  disabled = false,
  error,
}: DocumentTypeSelectorProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Tipo di documento
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as DocumentType)}
          disabled={disabled}
          className={`
            w-full px-4 py-2.5 pr-10 rounded-lg border bg-white
            appearance-none cursor-pointer
            transition-colors duration-200
            ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''}
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-action-green focus:border-action-green'}
            focus:outline-none focus:ring-2 focus:ring-offset-0
          `}
        >
          <option value="">Seleziona tipo documento...</option>
          {Object.entries(DOCUMENT_TYPE_LABELS).map(([type, label]) => (
            <option key={type} value={type}>
              {label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}

      {/* Preview tipo selezionato */}
      {value && (
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
          <span className="text-action-green">
            {DOCUMENT_ICONS[value]}
          </span>
          <span>{DOCUMENT_TYPE_LABELS[value]}</span>
        </div>
      )}
    </div>
  );
}

export default DocumentTypeSelector;
