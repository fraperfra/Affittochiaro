/**
 * CMS Edit Toggle
 * Floating button (bottom-right) for admins to enable/disable inline CMS editing.
 */
import React from 'react';
import { useCMSStore } from './cms-store';
import { Pencil, Eye, Save } from 'lucide-react';
import { useAuthStore } from '../store';
import { useNavigate } from 'react-router-dom';

export const CMSEditToggle: React.FC = () => {
    const { user } = useAuthStore();
    const isEditMode = useCMSStore((s) => s.isEditMode);
    const isDirty = useCMSStore((s) => s.isDirty);
    const toggleEditMode = useCMSStore((s) => s.toggleEditMode);
    const publish = useCMSStore((s) => s.publish);
    const navigate = useNavigate();

    // Only show for admin users
    if (!user || user.role !== 'admin') return null;

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 items-end">
            {/* CMS Panel link */}
            {isEditMode && (
                <>
                    {isDirty && (
                        <button
                            onClick={() => publish()}
                            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl shadow-lg transition-all text-sm font-medium"
                        >
                            <Save size={16} />
                            Pubblica
                        </button>
                    )}
                    <button
                        onClick={() => navigate('/admin/cms')}
                        className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl shadow-lg transition-all text-sm font-medium"
                    >
                        ⚙️ Pannello CMS
                    </button>
                </>
            )}

            {/* Toggle button */}
            <button
                onClick={toggleEditMode}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl shadow-xl transition-all text-sm font-bold ${isEditMode
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                    }`}
            >
                {isEditMode ? (
                    <>
                        <Eye size={18} />
                        Esci da Edit Mode
                    </>
                ) : (
                    <>
                        <Pencil size={18} />
                        Modifica Sito
                    </>
                )}
            </button>
        </div>
    );
};

export default CMSEditToggle;
