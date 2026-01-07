
import * as React from 'react';
import {
    Users,
    Search,
    Filter,
    Mail,
    UserPlus,
    MoreVertical,
    Globe,
    CreditCard,
    UserCheck,
    TrendingUp,
    Loader2
} from 'lucide-react';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { UserProfile, AIProvider } from '../../types';
import { useNotifications } from '../../contexts/NobleContext';
import { Send, X, ShieldAlert } from 'lucide-react';

const UserDirectory: React.FunctionComponent = () => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [users, setUsers] = React.useState<(UserProfile & { id: string })[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [stats, setStats] = React.useState({
        total: 0,
        enterprise: 0,
        growth: 0,
        starter: 0,
        lost: 0
    });
    const [activeTab, setActiveTab] = React.useState<'all' | 'active' | 'lost'>('all');
    const [showInviteModal, setShowInviteModal] = React.useState(false);
    const [inviteEmail, setInviteEmail] = React.useState('');
    const [inviting, setInviting] = React.useState(false);
    const { addNotification } = useNotifications();

    React.useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCol = collection(db, 'users');
                const userSnapshot = await getDocs(usersCol);

                // Fix: De-duplicate by email to handle Firestore sync glitches
                const uniqueMap = new Map();
                userSnapshot.docs.forEach(doc => {
                    const data = doc.data();
                    if (!uniqueMap.has(data.email)) {
                        uniqueMap.set(data.email, { id: doc.id, ...data });
                    }
                });

                const userList = Array.from(uniqueMap.values()) as (UserProfile & { id: string, lastLogin?: string })[];

                setUsers(userList);

                // Calculate stats
                const total = userList.length;
                const enterprise = userList.filter(u => u.plan === 'enterprise').length;
                const growth = userList.filter(u => u.plan === 'growth').length;
                const starter = userList.filter(u => u.plan === 'starter' || !u.plan).length;

                // Logic for "Lost" users (e.g., no activity for 30 days or marked inactive)
                // Since we don't have hard activity data, we'll simulate 'lost' as anyone registered before 2026 but without a plan
                const lost = userList.filter(u => !u.plan || u.plan === 'starter').length; // Demonstration logic

                setStats({ total, enterprise, growth, starter, lost });
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.role?.toLowerCase().includes(searchTerm.toLowerCase());

        if (activeTab === 'lost') return matchesSearch && (!u.plan || u.plan === 'starter');
        if (activeTab === 'active') return matchesSearch && (u.plan === 'growth' || u.plan === 'enterprise');
        return matchesSearch;
    });

    const handleInviteAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setInviting(true);
        try {
            const PROXY_URL = import.meta.env.VITE_PROXY_URL || '';
            const response = await fetch(`${PROXY_URL}/blast-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipients: [inviteEmail],
                    subject: 'Invitation to join Noble Clarity as Admin',
                    html: `
                        <div style="font-family: sans-serif; padding: 30px; border: 1px solid #eee; border-radius: 12px; max-width: 500px;">
                            <h2 style="color: #e11d48;">Admin Invitation 🛡️</h2>
                            <p>You have been invited to join the <strong>Noble Clarity Command Center</strong>.</p>
                            <p>Please use your email code to elevate your account once registered.</p>
                            <a href="https://clarity.noblesworld.com.ng" style="display: inline-block; padding: 10px 20px; background: #e11d48; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Access Portal</a>
                        </div>
                    `
                })
            });

            if (!response.ok) throw new Error("Could not send invitation email.");

            addNotification({
                title: 'Invitation Sent',
                msg: `Formal admin invitation dispatched to ${inviteEmail}`,
                type: 'success'
            });
            setShowInviteModal(false);
            setInviteEmail('');
        } catch (error: any) {
            addNotification({ title: 'Invite Failed', msg: error.message, type: 'alert' });
        } finally {
            setInviting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">User Management</h2>
                    <p className="text-slate-400 text-sm mt-1">Manage all platform users, monitor plans, and provide support.</p>
                </div>
                <button
                    onClick={() => setShowInviteModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-rose-600/20 transition-all active:scale-95"
                >
                    <UserPlus size={18} /> Invite Admin
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Users', val: stats.total.toLocaleString(), icon: Users, color: 'text-blue-500' },
                    { label: 'Enterprise', val: stats.enterprise.toLocaleString(), icon: CreditCard, color: 'text-rose-500' },
                    { label: 'Starter', val: stats.starter.toLocaleString(), icon: UserCheck, color: 'text-emerald-500' },
                    { label: 'Growth Plan', val: stats.growth.toLocaleString(), icon: TrendingUp, color: 'text-amber-500' }
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl">
                        <div className="flex items-center justify-between mb-2">
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Live</span>
                        </div>
                        <p className="text-xl font-bold text-white">{stat.val}</p>
                        <p className="text-xs text-slate-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters & Tabs */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800">
                    {['all', 'active', 'lost'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === tab ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            {tab === 'all' ? 'All Users' : tab === 'active' ? 'Active Paid' : 'Loss/Churn'}
                        </button>
                    ))}
                </div>

                <div className="flex-1 w-full max-w-md relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Filter by name, email..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:border-rose-600 outline-none transition-all"
                    />
                </div>
            </div>

            {/* User Table */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative min-h-[400px]">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm z-10">
                        <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
                    </div>
                ) : null}

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-950/50 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role & Team</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Plan Status</th>
                                <th className="px-6 py-4">Registration</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredUsers.length > 0 ? filteredUsers.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={u.avatarUrl || `https://ui-avatars.com/api/?name=${u.name || 'User'}`} alt="" className="w-10 h-10 rounded-full border border-slate-700" />
                                            <div>
                                                <p className="text-sm font-bold text-white">{u.name || 'Noble User'}</p>
                                                <p className="text-xs text-slate-500">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-white">{u.role || 'Founder'}</span>
                                            <span className="text-[10px] text-slate-500 lowercase first-letter:uppercase">{u.systemRole || 'user'} Access</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <Globe size={14} className="text-slate-500" />
                                            <span className="text-xs">{u.country || 'Global'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${u.plan === 'enterprise' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                                            u.plan === 'growth' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                                u.plan === 'starter' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                                                    'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                                            }`}>
                                            {u.plan || 'Free'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-slate-400 font-mono">{u.registrationDate || '2026-01-01'}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all" title="Email User" onClick={() => window.location.href = `mailto:${u.email}`}>
                                                <Mail size={16} />
                                            </button>
                                            <button className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-slate-500 text-sm">
                                        {searchTerm ? 'No users matching your search criteria.' : 'No users registered on the platform yet.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-white/10 w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <ShieldAlert size={20} className="text-rose-500" /> Invite New Admin
                            </h3>
                            <button onClick={() => setShowInviteModal(false)} className="text-slate-500 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleInviteAdmin} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Target Email</label>
                                <input
                                    type="email"
                                    required
                                    value={inviteEmail}
                                    onChange={e => setInviteEmail(e.target.value)}
                                    placeholder="admin@noblesworld.com.ng"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-rose-600 outline-none transition-all"
                                />
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed italic border-l-2 border-rose-500/50 pl-3">
                                Invited admins must use the Elevation Portal with a secret key after registration to gain access.
                            </p>
                            <button
                                disabled={inviting}
                                className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold shadow-xl shadow-rose-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {inviting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                {inviting ? 'Dispatching...' : 'Send Formal Invite'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDirectory;
