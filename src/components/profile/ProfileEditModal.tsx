/**
 * ProfileEditModal Component
 * Modal wrapper per il form di modifica profilo
 */

import React from 'react';
import { X } from 'lucide-react';
import { ProfileEditForm, ProfileFormData } from './ProfileEditForm';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  initialData?: Partial<ProfileFormData>;
  isLoading?: boolean;
}

export function ProfileEditModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: ProfileEditModalProps) {
  if (!isOpen) return null;

  const handleSubmit = async (data: ProfileFormData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="flex min-h-full items-end md:items-center justify-center p-0 md:p-4"
        style={{ paddingBottom: 'max(88px, calc(76px + env(safe-area-inset-bottom, 0px)))' }}
      >
        <div
          className="relative w-full max-w-2xl bg-white rounded-t-2xl md:rounded-2xl shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Modifica Profilo
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] md:max-h-[70vh] overflow-y-auto overflow-x-hidden">
            <ProfileEditForm
              initialData={initialData}
              onSubmit={handleSubmit}
              onCancel={onClose}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileEditModal;
