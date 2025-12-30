import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Zap, RefreshCw } from 'lucide-react';
import { useUser, useNotifications } from '../contexts/NobleContext';

interface UpgradePromptProps {
    feature: string;
    description?: string;
    plan?: 'growth' | 'enterprise';
}

const UpgradePrompt: React.FC<UpgradePromptProps> = ({
    feature,
    description = "Unlock this advanced feature to take your financial clarity to the next level.",
    plan = 'growth'
}) => {
    const navigate = useNavigate();
    const { userProfile, refreshProfile } = useUser();
    const { addNotification } = useNotifications();
    const [isSyncing, setIsSyncing] = React.useState(false);

    const handleSync = async () => {
        setIsSyncing(true);
        await refreshProfile();
        setIsSyncing(false);
        addNotification({ title: 'Profile Synced', msg: 'Your plan status has been updated.', type: 'info' });
    };

    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center animate-fade-in min-h-[400px]">
            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 relative group">
                <div className="absolute inset-0 bg-noble-blue/20 rounded-full blur-xl group-hover:bg-noble-blue/30 transition-all"></div>
                <Lock className="w-10 h-10 text-noble-blue relative z-10" />
                <div className="absolute -top-1 -right-1 bg-gradient-to-br from-noble-blue to-purple-500 w-8 h-8 rounded-full flex items-center justify-center border-4 border-slate-950">
                    <Zap className="w-4 h-4 text-white fill-white" />
                </div>
            </div>

            <h2 className="text-2xl font-bold text-white font-display mb-3">
                {feature} is Locked
            </h2>

            <p className="text-slate-400 max-w-md mb-8 leading-relaxed">
                {description}
                <br />
                <span className="text-slate-500 text-sm mt-2 block">Available on the <span className="text-noble-blue font-bold capitalize">{plan}</span> plan and above.</span>
            </p>

            <div className="flex gap-4">
                <button
                    onClick={() => navigate('/pricing')}
                    className="px-8 py-3 bg-noble-blue hover:bg-noble-blue/90 text-white font-bold rounded-xl shadow-lg shadow-noble-blue/20 transition-all hover:scale-105 flex items-center gap-2"
                >
                    <Zap className="w-4 h-4" />
                    Upgrade to {plan === 'growth' ? 'Growth' : 'Enterprise'}
                </button>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-3 text-slate-400 font-bold hover:text-white transition-colors"
                >
                    Go Back
                </button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/50 w-full max-w-xs flex flex-col gap-2 items-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Detected Plan: <span className="text-white">{userProfile.plan}</span></p>
                <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="text-xs text-slate-400 hover:text-noble-blue transition-colors flex items-center gap-1.5"
                >
                    <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'Syncing...' : 'Already upgraded? Sync Profile'}
                </button>
            </div>
        </div>
    );
};

export default UpgradePrompt;
