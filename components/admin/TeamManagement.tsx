
import * as React from 'react';
import {
    UserPlus,
    Shield,
    Trash2,
    Crown,
    ExternalLink,
    Loader2
} from 'lucide-react';
import { db } from '../../firebaseConfig';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { useNotifications } from '../../contexts/NobleContext';

interface TeamMember {
    id: string;
    name: string;
    email: string;
    systemRole: 'admin' | 'super-admin' | 'finance-manager' | 'operations' | 'support';
    registrationDate: string;
}

const ADMIN_ROLES = [
    { id: 'super-admin', label: 'Super Admin', desc: 'Full platform control', color: 'bg-rose-500 text-white' },
    { id: 'finance-manager', label: 'Finance Manager', desc: 'Can view revenue & growth', color: 'bg-[#10B981] text-white' },
    { id: 'operations', label: 'Operations', desc: 'Manage users & content', color: 'bg-blue-600 text-white' },
    { id: 'support', label: 'Support Specialist', desc: 'Basic user management', color: 'bg-amber-500 text-white' },
    { id: 'admin', label: 'Standard Admin', desc: 'General access', color: 'bg-slate-600 text-white' }
];

const TeamManagement: React.FunctionComponent = () => {
    const [team, setTeam] = React.useState<TeamMember[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [showInviteModal, setShowInviteModal] = React.useState(false);
    const [inviteEmail, setInviteEmail] = React.useState('');
    const [selectedRole, setSelectedRole] = React.useState('admin');
    const [inviting, setInviting] = React.useState(false);
    const { addNotification } = useNotifications();

    const fetchAdmins = async () => {
        try {
            const usersCol = collection(db, 'users');
            const q = query(usersCol, where('systemRole', 'in', ['admin', 'super-admin', 'finance-manager', 'operations', 'support']));
            const snapshot = await getDocs(q);
            const list = snapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().name || doc.data().displayName || 'Anonymous Founder',
                email: doc.data().email,
                systemRole: doc.data().systemRole,
                registrationDate: doc.data().registrationDate || '2025-10-01'
            })) as TeamMember[];
            setTeam(list);
        } catch (error) {
            console.error("Error fetching admins:", error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchAdmins();
    }, []);

    const handleUpdateRole = async (userId: string, newRole: string) => {
        try {
            await updateDoc(doc(db, 'users', userId), { systemRole: newRole });
            addNotification({ title: 'Role Updated', msg: `Permissions provisioned for ${newRole}`, type: 'success' });
            fetchAdmins();
        } catch (error: any) {
            addNotification({ title: 'Update Failed', msg: error.message, type: 'alert' });
        }
    };

    const handleRemoveAdmin = async (userId: string) => {
        if (!window.confirm("Are you sure you want to revoke administrative privileges?")) return;
        try {
            await updateDoc(doc(db, 'users', userId), { systemRole: 'user' });
            addNotification({ title: 'Privileges Revoked', msg: 'User reverted to standard access.', type: 'info' });
            fetchAdmins();
        } catch (error: any) {
            addNotification({ title: 'Action Failed', msg: error.message, type: 'alert' });
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setInviting(true);
        try {
            const PROXY_URL = import.meta.env.VITE_PROXY_URL || '';
            const response = await fetch(`${PROXY_URL}/blast-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipients: [inviteEmail],
                    subject: 'Administrative Onboarding Invitation',
                    html: `
                        <div style="font-family: sans-serif; padding: 40px; border: 1px solid #1e293b; background: #0b0e14; color: white; border-radius: 24px; max-width: 500px; margin: auto;">
                            <h2 style="color: #e11d48; margin-top: 0;">Personnel Authorization 🛡️</h2>
                            <p style="color: #94a3b8; line-height: 1.6;">You have been formally invited to the <strong>Noble Clarity Command Center</strong> with assigned role: <span style="color: #fff; font-weight: bold;">${selectedRole.toUpperCase()}</span></p>
                            <p style="color: #64748b; font-size: 12px;">This invitation requires mandatory multi-factor validation using your organizational secret key upon first registration.</p>
                            <a href="https://clarity.noblesworld.com.ng" style="display: inline-block; padding: 14px 28px; background: #e11d48; color: white; text-decoration: none; border-radius: 14px; font-weight: bold; margin-top: 20px;">Access Secure Portal</a>
                        </div>
                    `
                })
            });

            if (!response.ok) throw new Error("Security relay unavailible.");

            addNotification({ title: 'Invite Dispatched', msg: 'Authorization links sent to member.', type: 'success' });
            setShowInviteModal(false);
            setInviteEmail('');
        } catch (error: any) {
            addNotification({ title: 'Invite Failed', msg: error.message, type: 'alert' });
        } finally {
            setInviting(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Shield className="text-rose-600" size={24} /> Admin Team Management
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Control who has access to the Noble Clarity command center.</p>
                </div>
                <button
                    onClick={() => setShowInviteModal(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-sm font-bold shadow-xl shadow-rose-600/20 transition-all active:scale-95"
                >
                    <UserPlus size={18} /> Invite Team Member
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Admin Seats', val: `${team.length}/10`, icon: Crown, color: 'text-amber-500' },
                    { label: 'Active Sessions', val: '1', icon: ExternalLink, color: 'text-emerald-500' },
                    { label: 'Security Level', val: 'Level 1', icon: Shield, color: 'text-rose-500' }
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-3xl backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <stat.icon size={18} className={stat.color} />
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{stat.val}</p>
                    </div>
                ))}
            </div>

            <div className="bg-slate-900/20 border border-slate-800/50 rounded-[2.5rem] overflow-hidden relative min-h-[300px]">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#0b0e14]/50 backdrop-blur-sm z-10">
                        <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] text-slate-500 uppercase font-bold tracking-widest border-b border-slate-800/80 bg-slate-950/20">
                                <th className="px-8 py-5">Team Member</th>
                                <th className="px-8 py-5">Security Role</th>
                                <th className="px-8 py-5">Access Date</th>
                                <th className="px-8 py-5 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {team.map(member => (
                                <tr key={member.id} className="hover:bg-slate-800/30 transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700 text-white font-bold">
                                                {member.name[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white leading-tight">{member.name}</p>
                                                <p className="text-xs text-slate-500">{member.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <select
                                            value={member.systemRole}
                                            onChange={(e) => handleUpdateRole(member.id, e.target.value)}
                                            className="bg-slate-950 border border-slate-800 text-[10px] font-bold text-rose-500 px-3 py-1.5 rounded-xl outline-none focus:border-rose-600 appearance-none cursor-pointer"
                                        >
                                            {ADMIN_ROLES.map(r => (
                                                <option key={r.id} value={r.id}>{r.label.toUpperCase()}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-xs text-slate-400 font-mono tracking-tight">{member.registrationDate}</span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <button
                                            onClick={() => handleRemoveAdmin(member.id)}
                                            className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                                            title="Revoke Admin Access"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-white/10 w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                    <UserPlus size={20} className="text-rose-500" /> Member Provisioning
                                </h3>
                                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">Dispatch Authorization Invite</p>
                            </div>
                            <button onClick={() => setShowInviteModal(false)} className="text-slate-500 hover:text-white transition-colors">
                                <Shield size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleInvite} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Target Email</label>
                                <input
                                    type="email"
                                    required
                                    value={inviteEmail}
                                    onChange={e => setInviteEmail(e.target.value)}
                                    placeholder="admin@noble.com"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3.5 text-sm text-white focus:border-rose-600 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Designated Security Role</label>
                                <select
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3.5 text-sm text-white focus:border-rose-600 outline-none appearance-none cursor-pointer"
                                >
                                    {ADMIN_ROLES.map(r => (
                                        <option key={r.id} value={r.id}>{r.label} - {r.desc}</option>
                                    ))}
                                </select>
                            </div>

                            <p className="text-[10px] text-slate-600 leading-relaxed italic border-l-2 border-rose-500/20 pl-4 py-1">
                                Notice: All administrative invitations require secondary secret key verification upon first login for platform integrity.
                            </p>

                            <button
                                disabled={inviting}
                                className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-bold shadow-2xl shadow-rose-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                            >
                                {inviting ? <Loader2 size={18} className="animate-spin" /> : <Shield size={18} />}
                                {inviting ? 'Encrypting Invite...' : 'Send Formal Invitation'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamManagement;
