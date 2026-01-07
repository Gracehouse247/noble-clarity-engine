import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    AlertTriangle,
    Home,
    ArrowLeft,
    Search,
    Compass,
    Activity,
    ArrowRight
} from 'lucide-react';
import Navbar from './Navbar';

const NotFoundPage: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = React.useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/blog?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="min-h-screen bg-background-dark text-slate-300 font-display selection:bg-rose-500/30 overflow-hidden relative">
            <Navbar />

            {/* Ambient Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-[128px] animate-pulse-slow"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-slate-800/20 rounded-full blur-[128px]"></div>
                <div className="absolute inset-0 bg-noise opacity-[0.03]"></div>
            </div>

            <div className="container mx-auto px-6 pt-32 pb-20 relative z-10 flex flex-col items-center justify-center min-h-[85vh]">

                {/* 404 Glitch Effect */}
                <div className="relative mb-8 group">
                    <h1 className="text-[150px] md:text-[220px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-white/0 select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h1 className="text-[150px] md:text-[220px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 mix-blend-overlay opacity-50 blur-sm animate-glitch-1">
                            404
                        </h1>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-rose-500/20 px-6 py-2 rounded-full border border-rose-500/50 backdrop-blur-md flex items-center gap-3 shadow-[0_0_30px_rgba(244,63,94,0.3)] animate-float">
                        <AlertTriangle className="text-rose-500" size={24} />
                        <span className="text-rose-200 font-bold uppercase tracking-widest text-sm">Signal Lost</span>
                    </div>
                </div>

                {/* Content */}
                <div className="text-center max-w-2xl mx-auto space-y-8 animate-fade-in-up">
                    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                        We've ventured off the <span className="text-rose-500">financial map</span>.
                    </h2>
                    <p className="text-lg text-slate-400 leading-relaxed">
                        The page you are looking for has been moved, deleted, or never existed.
                        It seems you've found a gap in the ledger. Let's get you back to clarity.
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="max-w-md mx-auto relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                        <div className="relative flex items-center bg-card-dark border border-white/10 rounded-2xl p-2 transition-all group-focus-within:border-white/20">
                            <Search className="ml-4 text-slate-500" size={20} />
                            <input
                                type="text"
                                placeholder="Search specifically for..."
                                className="w-full bg-transparent border-none px-4 py-3 text-white placeholder:text-slate-600 outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 transition-colors">
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </form>

                    {/* Quick Links Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 w-full max-w-lg mx-auto">
                        <Link to="/" className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 hover:-translate-y-1 transition-all group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                                <Home size={18} />
                            </div>
                            <div className="text-left">
                                <h4 className="text-white font-bold text-sm group-hover:text-indigo-300 transition-colors">Return Home</h4>
                                <p className="text-slate-500 text-xs">Back to the command center</p>
                            </div>
                        </Link>

                        <Link to="/blog" className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 hover:-translate-y-1 transition-all group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
                                <Compass size={18} />
                            </div>
                            <div className="text-left">
                                <h4 className="text-white font-bold text-sm group-hover:text-emerald-300 transition-colors">Knowledge Engine</h4>
                                <p className="text-slate-500 text-xs">Explore financial insights</p>
                            </div>
                        </Link>
                    </div>

                    <div className="pt-12 border-t border-white/5 w-full flex justify-center">
                        <button onClick={() => window.history.back()} className="text-slate-500 hover:text-white text-sm font-bold uppercase tracking-widest flex items-center gap-2 transition-colors">
                            <ArrowLeft size={16} /> Go Back Previous Page
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
