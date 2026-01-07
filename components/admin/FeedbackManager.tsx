
import * as React from 'react';
import {
    MessageSquare,
    Star,
    Trash2,
    CheckCircle2,
    Clock,
    Filter,
    Search,
    User,
    ArrowUpRight,
    Loader2,
    Edit3,
    Reply,
    X,
    Send
} from 'lucide-react';
import { db } from '../../firebaseConfig';
import { collection, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { useNotifications } from '../../contexts/NobleContext';
import { FeedbackStatus, FeedbackSentiment } from '../../types';

interface FeedbackItem {
    id: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
    status: FeedbackStatus;
    sentiment: FeedbackSentiment;
    reply?: string;
    replyDate?: string;
}

const FeedbackManager: React.FunctionComponent = () => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [sentimentFilter, setSentimentFilter] = React.useState<FeedbackSentiment | 'all'>('all');
    const [feedback, setFeedback] = React.useState<FeedbackItem[]>([]);
    const [loading, setLoading] = React.useState(true);
    const { addNotification } = useNotifications();

    // Modal states
    const [selectedItem, setSelectedItem] = React.useState<FeedbackItem | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [isReplyModalOpen, setIsReplyModalOpen] = React.useState(false);

    // Edit Form states
    const [editComment, setEditComment] = React.useState('');
    const [editRating, setEditRating] = React.useState(5);

    // Reply Form states
    const [replyText, setReplyText] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const fetchFeedback = async () => {
        try {
            const feedCol = collection(db, 'feedback');
            const q = query(feedCol, orderBy('date', 'desc'));
            const snapshot = await getDocs(q);
            const list = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as FeedbackItem[];
            setFeedback(list);
        } catch (error) {
            console.error("Error fetching feedback:", error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchFeedback();
    }, []);

    const handleStatusChange = async (id: string, status: FeedbackStatus) => {
        try {
            await updateDoc(doc(db, 'feedback', id), { status });
            addNotification({ title: 'Status Updated', msg: `Feedback is now ${status}.`, type: 'success' });
            fetchFeedback();
        } catch (error: any) {
            addNotification({ title: 'Update Failed', msg: error.message, type: 'alert' });
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this feedback?")) return;
        try {
            await deleteDoc(doc(db, 'feedback', id));
            addNotification({ title: 'Feedback Removed', msg: 'The entry has been deleted.', type: 'info' });
            fetchFeedback();
        } catch (error: any) {
            addNotification({ title: 'Delete Failed', msg: error.message, type: 'alert' });
        }
    };

    const handleEditSubmission = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem) return;
        setIsSubmitting(true);
        try {
            const sentiment: FeedbackSentiment = editRating >= 4 ? 'positive' : (editRating <= 2 ? 'negative' : 'neutral');
            await updateDoc(doc(db, 'feedback', selectedItem.id), {
                comment: editComment,
                rating: editRating,
                sentiment
            });
            addNotification({ title: 'Feedback Updated', msg: 'The review has been modified successfully.', type: 'success' });
            setIsEditModalOpen(false);
            fetchFeedback();
        } catch (error: any) {
            addNotification({ title: 'Update Failed', msg: error.message, type: 'alert' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReplySubmission = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem) return;
        setIsSubmitting(true);
        try {
            await updateDoc(doc(db, 'feedback', selectedItem.id), {
                reply: replyText,
                replyDate: new Date().toISOString().split('T')[0]
            });
            addNotification({ title: 'Reply Dispatched', msg: 'Official response added to the feedback.', type: 'success' });
            setIsReplyModalOpen(false);
            fetchFeedback();
        } catch (error: any) {
            addNotification({ title: 'Reply Failed', msg: error.message, type: 'alert' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditModal = (item: FeedbackItem) => {
        setSelectedItem(item);
        setEditComment(item.comment);
        setEditRating(item.rating);
        setIsEditModalOpen(true);
    };

    const openReplyModal = (item: FeedbackItem) => {
        setSelectedItem(item);
        setReplyText(item.reply || '');
        setIsReplyModalOpen(true);
    };

    const avgRating = feedback.length > 0
        ? (feedback.reduce((acc, f) => acc + (Number(f.rating) || 0), 0) / feedback.length).toFixed(1)
        : '0.0';

    const positivePct = feedback.length > 0
        ? Math.round((feedback.filter(f => (Number(f.rating) || 0) >= 4).length / feedback.length) * 100)
        : 0;

    const pendingCount = feedback.filter(f => f.status === 'pending').length;

    const filteredFeedback = feedback.filter(f => {
        const matchesSearch = f.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.userName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSentiment = sentimentFilter === 'all' || f.sentiment === sentimentFilter;
        return matchesSearch && matchesSentiment;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                        <MessageSquare className="text-rose-600" size={24} /> Reviews & Feedback Hub
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Monitor platform sentiment, edit submissions, and manage official responses.</p>
                </div>
            </div>

            {/* Sentiment Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[
                    { label: 'Avg Rating', val: avgRating, icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/5' },
                    { label: 'Positive Sentiment', val: `${positivePct}%`, icon: ArrowUpRight, color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
                    { label: 'Pending Action', val: pendingCount.toString(), icon: Clock, color: 'text-rose-500', bg: 'bg-rose-500/5' }
                ].map((stat, i) => (
                    <div key={i} className={`bg-slate-900/40 border border-slate-800/60 p-5 md:p-6 rounded-3xl backdrop-blur-sm relative overflow-hidden group`}>
                        <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-full blur-3xl -mr-8 -mt-8 opacity-50`}></div>
                        <div className="flex items-center gap-3 mb-3 relative">
                            <div className={`p-2 rounded-xl ${stat.bg} border border-white/5`}>
                                <stat.icon size={16} className={stat.color} />
                            </div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{stat.label}</span>
                        </div>
                        <p className="text-3xl font-black text-white relative">{stat.val}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 bg-white/5 p-3 md:p-4 rounded-[2rem] border border-white/5">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search feedback content..."
                        className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:border-rose-600 outline-none transition-all placeholder:text-slate-600"
                    />
                </div>
                <div className="relative">
                    <select
                        value={sentimentFilter}
                        onChange={(e) => setSentimentFilter(e.target.value as any)}
                        className="w-full md:w-auto appearance-none bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-xs font-bold border border-white/10 px-12 py-3 outline-none cursor-pointer transition-all"
                    >
                        <option value="all">All Sentiments</option>
                        <option value="positive">Positive</option>
                        <option value="neutral">Neutral</option>
                        <option value="negative">Negative</option>
                    </select>
                    <Filter size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
            </div>

            {/* Feedback Feed */}
            <div className="grid grid-cols-1 gap-4 md:gap-6 relative min-h-[400px]">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#0b0e14]/50 backdrop-blur-sm z-10 rounded-3xl">
                        <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
                    </div>
                )}

                {filteredFeedback.length > 0 ? filteredFeedback.map((f) => (
                    <div key={f.id} className="bg-slate-900/30 border border-white/5 p-5 md:p-8 rounded-[2rem] md:rounded-[3rem] hover:bg-white/5 transition-all group relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-1.5 h-full ${f.sentiment === 'positive' ? 'bg-emerald-500' : f.sentiment === 'negative' ? 'bg-rose-500' : 'bg-amber-500'}`} />

                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-white/5 shadow-xl">
                                    <User size={20} className="text-slate-400" />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-white font-black text-base truncate">{f.userName}</h4>
                                    <div className="flex flex-wrap items-center gap-3 mt-1 underline-offset-4">
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={10} className={i < f.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-800'} />
                                            ))}
                                        </div>
                                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1.5">
                                            <Clock size={10} /> {f.date}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-2">
                                <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border ${f.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                    {f.status}
                                </span>

                                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-1.5xl border border-white/5">
                                    {f.status === 'pending' && (
                                        <button onClick={() => handleStatusChange(f.id, 'published')} className="p-2 text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all" title="Approve">
                                            <CheckCircle2 size={16} />
                                        </button>
                                    )}
                                    <button onClick={() => openEditModal(f)} className="p-2 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all" title="Edit">
                                        <Edit3 size={16} />
                                    </button>
                                    <button onClick={() => openReplyModal(f)} className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all" title="Reply">
                                        <Reply size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(f.id)} className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-600/10 rounded-xl transition-all" title="Delete">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 md:pl-16">
                            <div className="relative bg-white/5 p-5 md:p-6 rounded-2xl border border-white/5">
                                <span className="absolute -top-3 left-6 inline-flex bg-[#0b0e14] px-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Review Content</span>
                                <p className="text-slate-200 leading-relaxed font-medium text-base md:text-lg italic">
                                    "{f.comment}"
                                </p>
                            </div>

                            {f.reply && (
                                <div className="mt-6 p-5 bg-rose-500/5 border border-rose-500/10 rounded-2xl relative animate-in fade-in slide-in-from-top-2">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-6 h-6 rounded-lg bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-600/20">
                                            <MessageSquare size={12} className="text-white" />
                                        </div>
                                        <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Official Response</span>
                                        <span className="text-[10px] text-slate-600 ml-auto font-mono italic">{f.replyDate}</span>
                                    </div>
                                    <p className="text-sm text-slate-300 leading-relaxed">
                                        {f.reply}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )) : !loading && (
                    <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/5">
                        <MessageSquare className="w-16 h-16 mx-auto mb-6 opacity-10 text-primary" />
                        <h3 className="text-xl font-black text-slate-400">Hub is Crystalline</h3>
                        <p className="font-bold uppercase tracking-[0.2em] text-[10px] text-slate-600 mt-2">No active feedback entries found</p>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && selectedItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                <Edit3 size={20} className="text-rose-600" /> Edit Submission
                            </h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmission} className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Reviewer Sentiment</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setEditRating(s)}
                                            className="transition-transform active:scale-90"
                                        >
                                            <Star size={32} className={`${editRating >= s ? 'fill-amber-500 text-amber-500' : 'text-slate-800 hover:text-slate-700'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Modify Content</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={editComment}
                                    onChange={e => setEditComment(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-white focus:border-rose-600 outline-none transition-all resize-none"
                                />
                            </div>

                            <button
                                disabled={isSubmitting}
                                className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                            >
                                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                                {isSubmitting ? 'Syncing...' : 'Update Review'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Reply Modal */}
            {isReplyModalOpen && selectedItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                <ArrowUpRight size={20} className="text-emerald-500" /> Dispatch Response
                            </h3>
                            <button onClick={() => setIsReplyModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="mb-8 p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <User size={10} /> {selectedItem.userName}'s Review
                            </p>
                            <p className="text-sm text-slate-400 italic">"{selectedItem.comment}"</p>
                        </div>

                        <form onSubmit={handleReplySubmission} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Official Response</label>
                                <textarea
                                    required
                                    rows={5}
                                    placeholder="Thank you for your feedback! We are implementing..."
                                    value={replyText}
                                    onChange={e => setReplyText(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-white focus:border-emerald-500 outline-none transition-all resize-none"
                                />
                            </div>

                            <button
                                disabled={isSubmitting}
                                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 shadow-xl shadow-emerald-500/10"
                            >
                                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                {isSubmitting ? 'Dispatching...' : 'Dispatch Reply'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedbackManager;
