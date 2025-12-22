import * as React from 'react';
import { LucideIcon, BarChart3, Info } from 'lucide-react';

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    message: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

const EmptyState: React.FunctionComponent<EmptyStateProps> = ({
    icon: Icon = BarChart3,
    title,
    message,
    action,
    className = ""
}) => {
    return (
        <div className={`flex flex-col items-center justify-center p-8 text-center bg-slate-900/50 rounded-2xl border border-dashed border-slate-800 h-full min-h-[300px] ${className}`}>
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 text-slate-500">
                <Icon className="w-8 h-8" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
            <p className="text-slate-400 text-sm max-w-[280px] mb-6">{message}</p>

            {action && (
                <button
                    onClick={action.onClick}
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-purple-900/20 flex items-center gap-2"
                >
                    {action.label}
                </button>
            )}

            {!action && (
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
                    <Info className="w-3 h-3" /> Waiting for data
                </div>
            )}
        </div>
    );
};

export default EmptyState;
