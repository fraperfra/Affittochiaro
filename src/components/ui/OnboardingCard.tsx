import React from 'react';

interface OnboardingCardProps {
    icon: React.ReactNode;
    title: string;
    description?: string;
    selected: boolean;
    onClick: () => void;
}

export default function OnboardingCard({ icon, title, description, selected, onClick }: OnboardingCardProps) {
    return (
        <button
            onClick={onClick}
            className={`relative w-full p-6 bg-white rounded-2xl border-2 transition-all duration-200 text-left flex flex-col items-center justify-center gap-4 group
        ${selected
                    ? 'border-primary-500 bg-primary-50/50 shadow-sm'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 hover:shadow-sm'
                }
      `}
        >
            {/* Checkbox Icon */}
            <div className={`absolute top-4 right-4 w-5 h-5 rounded flex items-center justify-center border transition-colors
        ${selected ? 'bg-primary-500 border-primary-500' : 'border-gray-300 group-hover:border-gray-400'}
      `}>
                {selected && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>

            <div className={`p-4 rounded-full transition-colors flex items-center justify-center
        ${selected ? 'bg-white text-primary-600 shadow-sm' : 'bg-gray-50 text-gray-600'}
      `}>
                {icon}
            </div>

            <div className="text-center">
                <h3 className={`font-semibold ${selected ? 'text-primary-900' : 'text-gray-900'}`}>
                    {title}
                </h3>
                {description && (
                    <p className="mt-1 text-sm text-gray-500">{description}</p>
                )}
            </div>
        </button>
    );
}
