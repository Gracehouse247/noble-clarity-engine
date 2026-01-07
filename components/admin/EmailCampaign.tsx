
import * as React from 'react';
import {
    Mail,
    Send,
    Users,
    Layout,
    Plus,
    Clock,
    BarChart2,
    ChevronRight,
    Search,
    Filter,
    MoreHorizontal,
    Zap,
    Loader2,
    CheckCircle2,
    X
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { db } from '../../firebaseConfig';
import { collection, getDocs, addDoc, query, orderBy, limit, where } from 'firebase/firestore';
import { useNotifications } from '../../contexts/NobleContext';

interface Campaign {
    id: string;
    subject: string;
    status: 'draft' | 'sending' | 'completed';
    recipients: number;
    sentDate?: string;
    openRate?: string;
    clickRate?: string;
}

const EmailCampaign: React.FunctionComponent = () => {
    const [campaigns, setCampaigns] = React.useState<Campaign[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [isSending, setIsSending] = React.useState(false);
    const [showNewModal, setShowNewModal] = React.useState(false);
    const { addNotification } = useNotifications();
    const location = useLocation();

    // Form State
    const [subject, setSubject] = React.useState('');
    const [content, setContent] = React.useState('');
    const [targetPlan, setTargetPlan] = React.useState('all');
    const [stats, setStats] = React.useState({
        totalUsers: 0,
        paidUsers: 0,
        activeCampaigns: 0
    });

    const fetchCampaigns = async () => {
        try {
            // Fetch Campaigns
            const campCol = collection(db, 'campaigns');
            const q = query(campCol, orderBy('sentDate', 'desc'), limit(10));
            const snapshot = await getDocs(q);
            const list = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Campaign[];
            setCampaigns(list);

            // Fetch Real-Time Stats
            const usersCol = collection(db, 'users');
            const userSnap = await getDocs(usersCol);
            const allUsers = userSnap.docs.map(d => d.data());

            setStats({
                totalUsers: userSnap.size,
                paidUsers: allUsers.filter(u => ['growth', 'enterprise'].includes(u.plan)).length,
                activeCampaigns: list.filter(c => c.status === 'completed').length
            });
        } catch (error) {
            console.error("Error fetching campaigns data:", error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchCampaigns();

        // Check if we should open the modal from rapid action
        if (location.state?.openCampaign) {
            setShowNewModal(true);
            // Clear state
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleLaunch = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);

        try {
            // 1. Fetch relevant users based on segment
            const usersCol = collection(db, 'users');
            let q = query(usersCol);

            if (targetPlan === 'paid') {
                q = query(usersCol, where('plan', 'in', ['growth', 'enterprise']));
            } else if (targetPlan === 'growth') {
                q = query(usersCol, where('plan', '==', 'growth'));
            } else if (targetPlan === 'starter') {
                q = query(usersCol, where('plan', '==', 'starter'));
            }

            const userSnapshot = await getDocs(q);
            // Fix: Unique email check to prevent "12 vs 3" discrepancy
            const rawEmails = userSnapshot.docs.map(doc => doc.data().email).filter(email => !!email);
            const recipients = Array.from(new Set(rawEmails));

            if (recipients.length === 0) {
                throw new Error("No users found in the selected target segment.");
            }

            // 2. Call Platform API
            const PROXY_URL = import.meta.env.VITE_PROXY_URL || '';
            const targetUrl = `${PROXY_URL}/blast-email`;
            console.log("Transmission Target:", targetUrl);

            const response = await fetch(targetUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipients,
                    subject,
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 40px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 20px;">
                            <h2 style="color: #e11d48; margin-bottom: 20px;">Platform Update: Noble Clarity</h2>
                            <div style="line-height: 1.6; font-size: 16px;">
                                ${content.replace(/\n/g, '<br>')}
                            </div>
                            <hr style="margin: 30px 0; border: 0; border-top: 1px solid #eee;">
                            <p style="font-size: 12px; color: #64748b; text-align: center;">
                                You are receiving this because you are a valued member of Noble Clarity.<br>
                                <a href="https://clarity.noblesworld.com.ng" style="color: #e11d48; text-decoration: none; font-weight: bold;">Return to Dashboard</a>
                            </p>
                        </div>
                    `
                })
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await response.text();
                console.error("Non-JSON Server Response:", text.substring(0, 200));
                throw new Error(`Server configuration error: Received ${response.status} ${response.statusText}. Please verify the backend server is running at ${targetUrl}`);
            }

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Transmission failed');

            // 3. Save to history
            const newCampaign = {
                subject,
                content,
                targetPlan,
                recipients: recipients.length,
                status: 'completed',
                sentDate: new Date().toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                }),
                openRate: '0%',
                clickRate: '0%'
            };

            await addDoc(collection(db, 'campaigns'), newCampaign);

            addNotification({
                title: 'Campaign Complete',
                msg: `Transmission finished. Success: ${result.results?.success || 0}, Failed: ${result.results?.failed || 0}`,
                type: result.results?.failed > 0 ? 'alert' : 'success'
            });

            setShowNewModal(false);
            setSubject('');
            setContent('');
            fetchCampaigns();
        } catch (error: any) {
            console.error("Transmission Error:", error);
            addNotification({ title: 'Transmission Failed', msg: error.message, type: 'alert' });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-5 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Mail className="text-rose-600" size={24} /> Blast Engine
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Deploy massive, segmented email campaigns to your entire user base.</p>
                </div>
                <button
                    onClick={() => setShowNewModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-sm font-bold shadow-xl shadow-rose-600/20 transition-all active:scale-95"
                >
                    <Plus size={18} /> Design New Campaign
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Recipients', val: stats.totalUsers.toLocaleString(), icon: Send, color: 'text-blue-500' },
                    { label: 'Paid Subscribers', val: stats.paidUsers.toLocaleString(), icon: Layout, color: 'text-emerald-500' },
                    { label: 'Blasts Deployed', val: stats.activeCampaigns.toLocaleString(), icon: Clock, color: 'text-amber-500' },
                    { label: 'Platform Health', val: '98%', icon: Zap, color: 'text-rose-500' }
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-3xl backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <stat.icon size={16} className={stat.color} />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{stat.val}</p>
                    </div>
                ))}
            </div>

            {/* Campaign History */}
            <div className="bg-slate-900/20 border border-slate-800/50 rounded-[2.5rem] overflow-hidden">
                <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                        <BarChart2 size={16} className="text-rose-500" /> Transmission History
                    </h3>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                            <input className="bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-[10px] text-white outline-none w-48 focus:border-rose-600 transition-all" placeholder="Search campaigns..." />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans">
                        <thead className="bg-slate-950/20 text-[10px] text-slate-500 font-bold uppercase tracking-widest border-b border-slate-800/50">
                            <tr>
                                <th className="px-8 py-5">Campaign Subject</th>
                                <th className="px-8 py-5">Recipients</th>
                                <th className="px-8 py-5">Performance</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5">Date Sent</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/30">
                            {campaigns.length > 0 ? campaigns.map(camp => (
                                <tr key={camp.id} className="hover:bg-white/[0.02] transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white">{camp.subject}</span>
                                            <span className="text-[10px] text-slate-500 mt-0.5">Blast ID: {camp.id.slice(0, 8)}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <Users size={14} className="text-slate-600" />
                                            <span className="text-xs font-medium text-slate-300">{camp.recipients.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Open Rate</span>
                                                <span className="text-xs font-bold text-emerald-500">{camp.openRate || '24%'}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">CTR</span>
                                                <span className="text-xs font-bold text-blue-500">{camp.clickRate || '4.2%'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${camp.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                                            camp.status === 'sending' ? 'bg-blue-500/10 text-blue-500' :
                                                'bg-slate-500/10 text-slate-500'
                                            }`}>
                                            {camp.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-xs text-slate-400 font-mono">
                                        {camp.sentDate}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        {loading ? (
                                            <Loader2 className="w-8 h-8 mx-auto text-rose-500 animate-spin" />
                                        ) : (
                                            <div className="opacity-20 flex flex-col items-center">
                                                <Mail size={40} className="mb-4" />
                                                <p className="text-xs font-bold uppercase tracking-widest">No campaign history</p>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Launch Modal */}
            {showNewModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="bg-[#0b0e14] border border-white/10 w-full max-w-3xl max-h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-500">
                        {/* Fixed Header */}
                        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02] shrink-0">
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight">Targeted Platform Blast</h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Transmission Protocol: Secure SMTP</p>
                            </div>
                            <button
                                onClick={() => setShowNewModal(false)}
                                className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 rounded-full transition-all"
                                title="Dismiss Interface"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Scrollable Form Body */}
                        <form onSubmit={handleLaunch} className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Target Segment</label>
                                    <select
                                        value={targetPlan}
                                        onChange={e => setTargetPlan(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-rose-600 outline-none transition-all appearance-none"
                                    >
                                        <option value="all">All Registered Users</option>
                                        <option value="paid">Paid Subscribers Only</option>
                                        <option value="growth">Enterprise & Growth Only</option>
                                        <option value="starter">Free Tier Only</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Campaign Type</label>
                                    <div className="bg-slate-900/30 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-slate-300 flex items-center gap-2">
                                        <Zap size={14} className="text-amber-500" /> High-Priority Transmission
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Subject Line</label>
                                <input
                                    required
                                    value={subject}
                                    onChange={e => setSubject(e.target.value)}
                                    placeholder="Enter compelling announcement..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-rose-600 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Message Content (HTML Allowed)</label>
                                <textarea
                                    required
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    placeholder="Draft your platform wide message here..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-6 text-white focus:border-rose-600 outline-none transition-all h-80 font-mono text-sm resize-none"
                                />
                            </div>

                            <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-end gap-4 pb-4">
                                <button
                                    type="button"
                                    onClick={() => setShowNewModal(false)}
                                    className="px-8 py-4 text-slate-400 font-bold hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={isSending}
                                    className="px-10 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-bold shadow-xl shadow-rose-600/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send size={18} />}
                                    {isSending ? 'Transmitting Data...' : 'Launch Campaign'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmailCampaign;
