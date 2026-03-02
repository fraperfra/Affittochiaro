/**
 * InlineEditor
 * Wraps text content to make it editable in CMS edit mode.
 * Click to edit, saves on blur or Enter.
 */
import React, { useState, useRef, useEffect, createElement } from 'react';
import { useCMSStore } from './cms-store';
import { useCMSText, useCMSEditMode } from './cms-hooks';

interface InlineEditorProps {
    id: string;
    as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'label' | 'li';
    className?: string;
    children?: React.ReactNode;
    multiline?: boolean;
}

export const InlineEditor: React.FC<InlineEditorProps> = ({
    id,
    as = 'span',
    className = '',
    children,
    multiline = false,
}) => {
    const isEditMode = useCMSEditMode();
    const cmsText = useCMSText(id);
    const updateContent = useCMSStore((s) => s.updateContent);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState('');
    const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

    const displayText = cmsText || (typeof children === 'string' ? children : '');

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    if (!isEditMode) {
        // In view mode, just render the CMS text or fallback children
        if (cmsText) {
            return createElement(as, { className }, cmsText);
        }
        return <>{children}</>;
    }

    // Edit mode
    if (isEditing) {
        const handleSave = () => {
            updateContent(id, editValue);
            setIsEditing(false);
        };

        const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' && !multiline) {
                e.preventDefault();
                handleSave();
            }
            if (e.key === 'Escape') {
                setIsEditing(false);
            }
        };

        return (
            <div className="relative inline-block w-full">
                {multiline ? (
                    <textarea
                        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyDown}
                        className={`${className} w-full min-h-[80px] bg-yellow-50 border-2 border-yellow-400 rounded-lg p-2 outline-none resize-y`}
                        style={{ font: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', lineHeight: 'inherit' }}
                    />
                ) : (
                    <input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyDown}
                        className={`${className} w-full bg-yellow-50 border-2 border-yellow-400 rounded-lg px-2 py-1 outline-none`}
                        style={{ font: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', lineHeight: 'inherit' }}
                    />
                )}
                <div className="absolute -top-6 left-0 bg-yellow-400 text-xs text-black px-2 py-0.5 rounded-t font-mono whitespace-nowrap z-50">
                    {id}
                </div>
            </div>
        );
    }

    // Edit mode but not currently editing — show clickable text with border
    return createElement(
        as,
        {
            className: `${className} cursor-pointer outline-dashed outline-2 outline-blue-400/50 outline-offset-2 hover:outline-blue-500 hover:bg-blue-50/30 transition-all relative group`,
            onClick: () => {
                setEditValue(displayText);
                setIsEditing(true);
            },
        },
        <>
            {displayText || children}
            <span className="absolute -top-5 left-0 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                ✏️ {id}
            </span>
        </>
    );
};

export default InlineEditor;
