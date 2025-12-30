import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Zap } from 'lucide-react';

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
        </div>
    );
};

export default UpgradePrompt;
