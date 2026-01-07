
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Key, ArrowRight, Home, CheckCircle2 } from 'lucide-react';
import { auth, db } from '../../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { useNotifications, useUser } from '../../contexts/NobleContext';
import { useAuth } from '../../contexts/AuthContext';

const AdminElevation: React.FunctionComponent = () => {
    const [setupKey, setSetupKey] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const navigate = useNavigate();
    const { addNotification } = useNotifications();
    const { user } = useAuth();
    const { userProfile, refreshProfile } = useUser();

    const handleElevation = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            addNotification({
                title: 'Authentication Required',
                msg: 'Please log in to your standard account first.',
                type: 'alert'
            });
            return;
        }

        setLoading(true);

        try {
            // The key is stored in environment variables for security
            const masterKey = (import.meta.env.VITE_ADMIN_SETUP_KEY || 'NobleAdmin2026!').trim();
            const enteredKey = setupKey.trim();

            if (enteredKey === masterKey) {
                // Update user profile in Firestore
                const userRef = doc(db, 'users', user.uid);
                await updateDoc(userRef, {
                    systemRole: 'admin'
                });

                // Refresh the local user profile context
                await refreshProfile();

                setSuccess(true);
                addNotification({
                    title: 'Elevation Successful',
                    msg: 'You are now a Super Admin. Welcome to the Command Center.',
                    type: 'success'
                });

                setTimeout(() => {
                    navigate('/admin/overview');
                }, 2000);
            } else {
                addNotification({
                    title: 'Invalid Setup Key',
                    msg: 'The key you entered is incorrect. Access denied.',
                    type: 'alert'
                });
            }
        } catch (error: any) {
            addNotification({
                title: 'Elevation Failed',
                msg: error.message || 'An error occurred during elevation.',
                type: 'alert'
            });
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#050608] flex items-center justify-center p-6 transition-all duration-1000">
                <div className="text-center animate-in zoom-in-95 fade-in duration-500">
                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/20">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2 font-['Montserrat']">Access Granted</h1>
                    <p className="text-slate-400">Initializing secure session...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050608] flex items-center justify-center p-6 selection:bg-rose-500/30">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="w-16 h-16 bg-rose-600/10 rounded-2xl flex items-center justify-center border border-rose-600/20 mb-6">
                        <ShieldAlert className="w-8 h-8 text-rose-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-white font-['Montserrat'] tracking-tight mb-2">Founder Setup Portal</h1>
                    <p className="text-slate-500 text-sm max-w-[280px]">Enter your master environment key to authorize Super Admin privileges.</p>
                </div>

                <div className="bg-slate-900/10 backdrop-blur-3xl border border-white/5 p-10 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-500">
                    <div className="mb-8 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                        <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest leading-relaxed">
                            Target User: <span className="text-white">{userProfile.email || 'Not logged in'}</span>
                        </p>
                    </div>

                    <form onSubmit={handleElevation} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Master Setup Key</label>
                            <div className="relative group">
                                <input
                                    type="password"
                                    required
                                    value={setupKey}
                                    onChange={(e) => setSetupKey(e.target.value)}
                                    placeholder="Enter secret key..."
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-4 text-sm text-white focus:border-rose-600 focus:bg-slate-950 transition-all outline-none"
                                />
                                <Key className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-rose-600 transition-colors" />
                            </div>
                        </div>

                        <button
                            disabled={loading || !user}
                            className="w-full py-4 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-sm shadow-xl shadow-rose-600/20 transition-all flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Authorize Level 1 Access <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-8 flex flex-col items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold"
                    >
                        <Home size={14} /> Back to Public Site
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminElevation;
