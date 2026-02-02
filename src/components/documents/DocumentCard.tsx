/**
 * DocumentCard Component
 * Card per visualizzare un singolo documento caricato
 */

import React, { useState } from 'react';
import {
  FileText,
  Download,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  MoreVertical,
  AlertTriangle,
} from 'lucide-react';
import { TenantDocument, DOCUMENT_TYPE_LABELS, DocumentType } from '@/types/tenant';
import { formatFileSize } from '@/utils/fileValidation';

interface DocumentCardProps {
  document: TenantDocument;
  onDelete?: (id: string) => void;
  onView?: (document: TenantDocument) => void;
  onDownload?: (document: TenantDocument) => void;
  isDeleting?: boolean;
}

export function DocumentCard({
  document,
  onDelete,
  onView,
  onDownload,
  isDeleting = false,
}: DocumentCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusBadge = () => {
    switch (document.status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" />
            Verificato
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            <Clock className="w-3 h-3" />
            In verifica
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <XCircle className="w-3 h-3" />
            Rifiutato
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getFileIcon = () => {
    const type = document.file?.type || '';
    if (type.includes('pdf')) {
      return <FileText className="w-10 h-10 text-red-500" />;
    }
    if (type.includes('image')) {
      return <FileText className="w-10 h-10 text-blue-500" />;
    }
    return <FileText className="w-10 h-10 text-gray-500" />;
  };

  return (
    <div
      className={`
        relative bg-white border rounded-xl p-4
        transition-all duration-200
        ${isDeleting ? 'opacity-50' : 'hover:shadow-md hover:border-gray-300'}
        ${document.status === 'rejected' ? 'border-red-200 bg-red-50/30' : 'border-gray-200'}
      `}
    >
      <div className="flex items-start gap-4">
        {/* Icona documento */}
        <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center">
          {getFileIcon()}
        </div>

        {/* Info documento */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="font-medium text-gray-900 truncate">
                {DOCUMENT_TYPE_LABELS[document.type as DocumentType] || document.type}
              </h4>
              <p className="text-sm text-gray-500 truncate mt-0.5">
                {document.name}
              </p>
            </div>

            {/* Menu azioni */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                disabled={isDeleting}
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-8 z-20 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                    {onView && (
                      <button
                        onClick={() => {
                          onView(document);
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Eye className="w-4 h-4" />
                        Visualizza
                      </button>
                    )}
                    {onDownload && (
                      <button
                        onClick={() => {
                          onDownload(document);
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Download className="w-4 h-4" />
                        Scarica
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => {
                          onDelete(document.id);
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Elimina
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Meta info */}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {getStatusBadge()}
            <span className="text-xs text-gray-400">
              {formatFileSize(document.file?.size || 0)}
            </span>
            <span className="text-xs text-gray-400">
              {formatDate(document.uploadedAt)}
            </span>
          </div>

          {/* Motivo rifiuto */}
          {document.status === 'rejected' && document.rejectionReason && (
            <div className="mt-3 flex items-start gap-2 p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">{document.rejectionReason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DocumentCard;
