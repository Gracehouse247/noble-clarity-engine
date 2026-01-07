
import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Lock, ArrowRight, Home } from 'lucide-react';
import { auth, db } from '../../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNotifications } from '../../contexts/NobleContext';

const AdminLoginPage: React.FunctionComponent = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { addNotification } = useNotifications();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Verify Administrative Role
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const userData = userDoc.data();

            if (userData?.systemRole === 'admin') {
                addNotification({
                    title: 'Founder Session Active',
                    msg: 'Welcome back to the command center.',
                    type: 'success'
                });
                const from = (location.state as any)?.from?.pathname || '/admin/overview';
                navigate(from, { replace: true });
            } else {
                await auth.signOut();
                addNotification({
                    title: 'Access Denied',
                    msg: 'This portal is restricted to the platform owner and team.',
                    type: 'alert'
                });
            }
        } catch (error: any) {
            addNotification({
                title: 'Authentication Failed',
                msg: error.message || 'Check your credentials and try again.',
                type: 'alert'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050608] flex items-center justify-center p-6 selection:bg-rose-500/30">
            <div className="w-full max-w-md">
                {/* Branding */}
                <div className="flex flex-col items-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-rose-600/20 mb-6 group">
                        <ShieldCheck className="w-8 h-8 text-white transition-transform group-hover:scale-110" />
                    </div>
                    <h1 className="text-2xl font-bold text-white font-['Montserrat'] tracking-tight mb-2">Noble Command Center</h1>
                    <p className="text-slate-500 text-sm font-medium tracking-wide border-t border-slate-800 pt-2 px-4">FOUNDER & TEAM ACCESS ONLY</p>
                </div>

                {/* Login Card */}
                <div className="bg-slate-900/10 backdrop-blur-3xl border border-white/5 p-10 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-500">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Founder Email</label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@noblesworld.com.ng"
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-4 text-sm text-white focus:border-rose-600 focus:bg-slate-950 transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Security Key</label>
                            <div className="relative group">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-4 text-sm text-white focus:border-rose-600 focus:bg-slate-950 transition-all outline-none"
                                />
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-rose-600 transition-colors" />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full py-4 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-sm shadow-xl shadow-rose-600/20 transition-all flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Auth Active Session <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 flex items-center justify-center gap-4 text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                        <div className="h-px flex-1 bg-slate-800"></div>
                        <span>Encrypted Tunnel Active</span>
                        <div className="h-px flex-1 bg-slate-800"></div>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-between px-2">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold"
                    >
                        <Home size={14} /> Back to Public Site
                    </button>
                    <button
                        onClick={() => navigate('/admin/elevate')}
                        className="text-slate-700 hover:text-slate-500 transition-colors text-[10px] font-bold uppercase tracking-tighter"
                    >
                        Setup Founder Access
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
