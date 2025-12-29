
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, GitCommit, Zap, Shield, Sparkles, Layout } from 'lucide-react';

const ChangelogPage: React.FunctionComponent = () => {
    const navigate = useNavigate();

    const versions = [
        {
            version: "v2.5",
            date: "December 27, 2025",
            title: "The Gemini Era",
            description: "A complete overhaul of the intelligence layer. We've migrated from standard rule-based logic to a hybrid system powered by Google Gemini 3.0 Flash.",
            isLatest: true,
            changes: [
                { icon: Sparkles, text: "Integrated Google Gemini 3.0 Flash for 'AI Financial Coach'." },
                { icon: Layout, text: "New 'Glassmorphism' UI Design System with unified dark mode." },
                { icon: Zap, text: "Scenario Planner v1.0: Monte Carlo simulations for revenue forecasting." },
                { icon: Shield, text: "Enhanced Security: SOC 2 compliant data handling protocols." }
            ]
        },
        {
            version: "v2.0",
            date: "November 15, 2025",
            title: "Foundations",
            description: "The major migration from the legacy WordPress plugin to a standalone React application.",
            isLatest: false,
            changes: [
                { icon: Layout, text: "Full migration to React + Vite architecture." },
                { icon: Zap, text: "Performance improvements: 10x faster load times." },
                { icon: Shield, text: "Firebase Authentication integration." }
            ]
        },
        {
            version: "v1.0",
            date: "August 01, 2025",
            title: "Genesis",
            description: "The initial MVP release for beta testers.",
            isLatest: false,
            changes: [
                { icon: GitCommit, text: "Basic P&L Dashboard." },
                { icon: GitCommit, text: "Manual CSV Upload." }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#0b0e14] text-white font-sans selection:bg-noble-blue/30 selection:text-white">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-[#0b0e14]/80 backdrop-blur-md border-b border-white/5 px-4 md:px-8 h-20 flex items-center justify-between">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-10 h-10 bg-noble-blue rounded-xl flex items-center justify-center shadow-lg shadow-noble-blue/20">
                        <span className="material-symbols-outlined text-white">diamond</span>
                    </div>
                    <span className="font-['Montserrat'] font-extrabold text-xl tracking-tight hidden sm:block">NOBLE WORLD</span>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
                <div className="mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-noble-blue/10 border border-noble-blue/20 text-noble-blue text-xs font-bold uppercase tracking-widest mb-6">
                        <GitCommit className="w-3 h-3" /> Changelog
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold font-['Montserrat'] mb-6">
                        Product Updates
                    </h1>
                    <p className="text-xl text-slate-400 leading-relaxed max-w-2xl">
                        We move fast. Here is a timeline of the latest improvements, features, and fixes shipped to the Noble Clarity Engine.
                    </p>
                </div>

                <div className="relative border-l border-slate-800 ml-3 md:ml-6 space-y-16">
                    {versions.map((ver, i) => (
                        <div key={i} className="relative pl-8 md:pl-12 group">
                            {/* Timeline Node */}
                            <div className={`absolute -left-[5px] md:-left-[5px] top-2 w-2.5 h-2.5 rounded-full border-2 ${ver.isLatest ? 'bg-noble-blue border-noble-blue shadow-[0_0_10px_rgba(15,59,189,0.5)]' : 'bg-[#0b0e14] border-slate-600'}`}></div>

                            <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-4">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    {ver.version}
                                    {ver.isLatest && <span className="px-2 py-0.5 bg-noble-blue text-white text-[10px] rounded-full uppercase tracking-wider font-bold">Latest</span>}
                                </h2>
                                <span className="text-sm font-mono text-slate-500">{ver.date}</span>
                            </div>

                            <div className="bg-[#131720] border border-slate-800 rounded-2xl p-6 md:p-8 hover:border-slate-700 transition-all">
                                <h3 className="text-lg font-bold text-white mb-2">{ver.title}</h3>
                                <p className="text-slate-400 mb-8 leading-relaxed text-sm">{ver.description}</p>

                                <ul className="space-y-4">
                                    {ver.changes.map((change, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm">
                                            <div className="p-1.5 rounded bg-slate-800/50 text-slate-400 mt-0.5">
                                                <change.icon className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="leading-relaxed">{change.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-900 text-center text-slate-600 text-sm">
                <p>Subscribe to our newsletter to get notified of new updates.</p>
            </footer>
        </div>
    );
};

export default ChangelogPage;
