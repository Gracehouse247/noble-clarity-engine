
import * as React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, ArrowRight, LayoutDashboard, Rocket, Zap, Globe, Github } from 'lucide-react';

const Navbar: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [scrolled, setScrolled] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Features', path: '/features', icon: Zap },
        { name: 'Pricing', path: '/pricing', icon: Rocket },
        { name: 'Solutions', path: '/story', icon: Globe },
        { name: 'Resources', path: '/api-docs', icon: LayoutDashboard },
    ];

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ${scrolled
            ? 'bg-background-dark/80 backdrop-blur-xl border-b border-white/5 py-1 shadow-2xl shadow-primary/5'
            : 'bg-transparent border-b-0 py-4 md:py-6'
            }`}>
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                        <div className="size-10 rounded-2xl bg-gradient-to-br from-primary via-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                            <span className="material-symbols-outlined text-[24px]">diamond</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white text-lg font-black tracking-tight leading-none">Noble Clarity</span>
                            <span className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] mt-0.5">Engine</span>
                        </div>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="px-4 py-2 text-[11px] font-bold text-slate-400 hover:text-white transition-all uppercase tracking-[0.2em] hover:bg-white/5 rounded-xl border border-transparent hover:border-white/5"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="hidden sm:flex items-center gap-2 mr-2">
                            <a href="#" className="p-2 text-slate-500 hover:text-white transition-colors"><Github size={18} /></a>
                        </div>

                        {user ? (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="flex items-center justify-center rounded-2xl h-11 px-6 bg-primary hover:bg-primary-dark text-white text-sm font-bold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <LayoutDashboard className="w-4 h-4 mr-2" />
                                <span>Dashboard</span>
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="hidden md:flex text-slate-300 hover:text-white text-sm font-bold px-4 py-2 transition-colors uppercase tracking-widest text-[11px]"
                                >
                                    Log In
                                </button>
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="flex items-center justify-center rounded-2xl h-11 px-6 bg-gradient-to-r from-primary to-blue-600 hover:from-primary-dark hover:to-blue-700 text-white text-sm font-bold transition-all shadow-xl shadow-primary/25 hover:shadow-primary/40 group hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    <span>Get Started</span>
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </>
                        )}

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white transition-all active:scale-95"
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 top-[72px] bg-background-dark z-40 lg:hidden transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                <div className="p-6 flex flex-col gap-2 h-full">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-4 p-5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-[2rem] text-lg font-bold text-white transition-all group"
                        >
                            <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <link.icon size={20} />
                            </div>
                            {link.name}
                            <ArrowRight className="ml-auto w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-primary" />
                        </Link>
                    ))}

                    <div className="mt-auto pb-12 flex flex-col gap-4">
                        {!user && (
                            <button
                                onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                                className="w-full h-14 rounded-2xl bg-slate-900 text-white font-bold border border-white/10 hover:bg-slate-800 transition-all"
                            >
                                Sign In to Account
                            </button>
                        )}
                        <button
                            onClick={() => { navigate(user ? '/dashboard' : '/signup'); setIsMobileMenuOpen(false); }}
                            className="w-full h-16 rounded-[2rem] bg-gradient-to-r from-primary to-blue-700 text-white font-black text-lg shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
                        >
                            {user ? 'Go to Dashboard' : 'Create Free Account'}
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
