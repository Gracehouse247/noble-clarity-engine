import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications, useUser } from '../contexts/NobleContext';
import {
    X,
    Bell,
    ShieldCheck,
    CreditCard,
    Link as LinkIcon,
    MoreHorizontal,
    Landmark,
    BarChart2 as BarChart
} from 'lucide-react';

const SettingsPage: React.FC = () => {
    const { user, sendPasswordResetEmail } = useAuth();
    const { userProfile, updateUserProfile } = useUser();
    const { addNotification } = useNotifications();
    const navigate = useNavigate();

    // Form State
    const [name, setName] = useState(userProfile.name);
    const [email] = useState(user?.email || userProfile.email);

    // Notification Toggles
    const [notifications, setNotifications] = useState({
        marketAlerts: userProfile.notifications?.marketAlerts ?? true,
        weeklyDigest: userProfile.notifications?.weeklyDigest ?? true,
        productUpdates: userProfile.notifications?.productUpdates ?? false
    });

    // Handle password reset
    const handlePasswordReset = async () => {
        if (!email) return;
        try {
            await sendPasswordResetEmail(email);
            addNotification({
                title: "Reset Email Sent",
                msg: `A password reset link has been sent to ${email} `,
                type: "success"
            });
        } catch (error) {
            addNotification({
                title: "Reset Failed",
                msg: "Could not send reset email. Please try again later.",
                type: "alert"
            });
        }
    };

    const handleToggle = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        try {
            await updateUserProfile({
                ...userProfile,
                name,
                notifications
            });

            addNotification({
                title: "Settings Saved",
                msg: "Your profile and preferences have been updated successfully.",
                type: "success"
            });

            // Short delay to show notification before redirecting
            setTimeout(() => navigate('/dashboard'), 1000);
        } catch (error) {
            addNotification({
                title: "Save Failed",
                msg: "There was an error saving your changes.",
                type: "alert"
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0E1B] font-roboto text-[#9da4b9] p-4 md:p-8 selection:bg-sky-blue selection:text-white" style={{
            backgroundImage: "radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.05) 0%, transparent 50%)"
        }}>
            <main className="w-full max-w-4xl mx-auto space-y-8">
                <header className="text-center pt-8">
                    <h1 className="font-montserrat text-4xl font-bold text-white tracking-tight mb-2">Profile & Settings</h1>
                    <p className="font-montserrat text-slate-400">Manage your account and preferences</p>
                </header>

                {/* Account Information */}
                <section className="bg-[#161B30]/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl">
                    <h2 className="font-montserrat text-xl font-semibold text-white mb-8">Account Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3" htmlFor="name">Full Name</label>
                            <input
                                className="w-full bg-[#0B0E1B] border border-white/10 rounded-xl text-white px-4 py-3 focus:ring-2 focus:ring-sky-blue/50 focus:border-sky-blue outline-none transition-all duration-300"
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3" htmlFor="email">Email Address</label>
                            <input
                                className="w-full bg-[#0B0E1B] border border-white/10 rounded-xl text-slate-400 px-4 py-3 cursor-not-allowed opacity-75 outline-none"
                                id="email"
                                type="email"
                                value={email}
                                disabled
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Password</label>
                            <div className="flex items-center gap-6 bg-[#0B0E1B] border border-white/10 rounded-xl px-4 py-3">
                                <span className="text-slate-500 tracking-widest pt-1">••••••••••••••</span>
                                <button
                                    onClick={handlePasswordReset}
                                    className="text-sky-blue hover:text-sky-blue/80 font-bold text-sm transition-colors border-l border-white/10 pl-6"
                                >
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Billing & Subscriptions */}
                <section className="bg-[#161B30]/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl">
                    <h2 className="font-montserrat text-xl font-semibold text-white mb-8">Billing & Subscriptions</h2>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-5 bg-[#0B0E1B] border border-white/10 rounded-2xl">
                        <div className="flex items-center gap-4">
                            <div className="bg-sky-blue/10 p-3 rounded-xl">
                                <CreditCard className="w-6 h-6 text-sky-blue" />
                            </div>
                            <div>
                                <p className="text-white font-bold">Enterprise Plan</p>
                                <p className="text-slate-500 text-xs">Next billing date: 28 Nov, 2024</p>
                            </div>
                        </div>
                        <button className="text-sky-blue hover:text-sky-blue/80 font-bold text-sm px-4 py-2 hover:bg-sky-blue/5 rounded-lg transition-all">Manage Subscription</button>
                    </div>
                </section>

                {/* Notification Preferences */}
                <section className="bg-[#161B30]/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl">
                    <h2 className="font-montserrat text-xl font-semibold text-white mb-8">Notification Preferences</h2>
                    <div className="space-y-6">
                        {[
                            { id: 'marketAlerts', title: 'Market Alerts', desc: 'Notify me about significant market shifts.' },
                            { id: 'weeklyDigest', title: 'Weekly Digest', desc: 'Receive a summary of your portfolio performance.' },
                            { id: 'productUpdates', title: 'Product Updates', desc: 'Get notified about new features and improvements.' }
                        ].map((pref) => (
                            <div key={pref.id} className="flex items-center justify-between group">
                                <div className="max-w-md">
                                    <p className="text-white font-bold group-hover:text-sky-blue transition-colors">{pref.title}</p>
                                    <p className="text-slate-500 text-sm mt-1">{pref.desc}</p>
                                </div>
                                <button
                                    onClick={() => handleToggle(pref.id as keyof typeof notifications)}
                                    className={`relative w - 14 h - 7 rounded - full transition - all duration - 500 ${notifications[pref.id as keyof typeof notifications] ? 'bg-sky-blue shadow-[0_0_15px_rgba(56,189,248,0.3)]' : 'bg-slate-800'} `}
                                >
                                    <div className={`absolute top - 1 left - 1 w - 5 h - 5 bg - white rounded - full shadow - lg transition - transform duration - 500 transform ${notifications[pref.id as keyof typeof notifications] ? 'translate-x-7' : 'translate-x-0'} `} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Security Settings */}
                <section className="bg-[#161B30]/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl">
                    <h2 className="font-montserrat text-xl font-semibold text-white mb-8">Security Settings</h2>
                    <div className="flex items-center justify-between p-5 bg-[#0B0E1B] border border-white/10 rounded-2xl">
                        <div className="flex items-center gap-4">
                            <div className="bg-emerald-500/10 p-3 rounded-xl">
                                <ShieldCheck className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-white font-bold">Two-Factor Authentication (2FA)</p>
                                <p className="text-slate-500 text-xs text-emerald-500/80 font-medium">Enabled - Your account is fully protected.</p>
                            </div>
                        </div>
                        <button className="text-sky-blue hover:text-sky-blue/80 font-bold text-sm transition-colors border-l border-white/10 pl-6">Manage 2FA</button>
                    </div>
                </section>

                {/* Integrations */}
                <section className="bg-[#161B30]/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl">
                    <h2 className="font-montserrat text-xl font-semibold text-white mb-8">Integrations</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-5 bg-[#0B0E1B] border border-white/10 rounded-2xl group hover:border-sky-blue/30 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="bg-sky-blue/10 p-3 rounded-xl group-hover:scale-110 transition-transform">
                                    <Landmark className="w-6 h-6 text-sky-blue" />
                                </div>
                                <div>
                                    <p className="text-white font-bold">Fidelity Investments</p>
                                    <p className="text-emerald-500/80 text-[10px] font-bold uppercase tracking-widest mt-0.5">Connected</p>
                                </div>
                            </div>
                            <button className="text-slate-500 hover:text-white transition-colors p-2"><MoreHorizontal className="w-5 h-5" /></button>
                        </div>
                        <div className="flex items-center justify-between p-5 bg-[#0B0E1B] border border-white/10 rounded-2xl group hover:border-purple-500/30 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="bg-purple-500/10 p-3 rounded-xl group-hover:scale-110 transition-transform">
                                    <BarChart className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-white font-bold">Bloomberg Terminal</p>
                                    <p className="text-emerald-500/80 text-[10px] font-bold uppercase tracking-widest mt-0.5">Connected</p>
                                </div>
                            </div>
                            <button className="text-slate-500 hover:text-white transition-colors p-2"><MoreHorizontal className="w-5 h-5" /></button>
                        </div>
                    </div>
                </section>

                <div className="flex flex-col sm:flex-row items-center justify-end gap-6 pt-6 pb-20">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full sm:w-auto text-slate-500 hover:text-white font-bold py-3 px-10 transition-all duration-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="w-full sm:w-auto bg-[#00AEEF] hover:bg-[#009ED9] text-[#0B0E1B] font-bold py-4 px-12 rounded-xl shadow-[0_8px_30px_rgb(0,174,239,0.2)] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Save Changes
                    </button>
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;
