
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import {
    FileText, Plus, Search, Edit3, Trash2, Eye, Send, Calendar, Tag,
    Image as ImageIcon, ChevronDown, X, Loader2, Bold, Italic, Link as LinkIcon,
    Heading1, Heading2, Heading3, List, Quote, ExternalLink, Info, ShieldCheck,
    BarChart3, Settings, Globe, MoreVertical, Video, MousePointer2, Layout,
    MessageSquare, Sparkles, CheckCircle2, ChevronRight
} from 'lucide-react';
import { db } from '../../firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { useNotifications } from '../../contexts/NobleContext';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    author: string;
    date: string;
    status: 'published' | 'draft';
    category: string;
    tags: string[];
    image: string; // Featured Image
    imageAlt?: string;
    imageTitle?: string;
    readTime: string;
    // SEO Fields
    seoTitle?: string;
    metaDescription?: string;
    focusKeywords?: string;
    relatedKeywords?: string;
}

const BlogConsole: React.FunctionComponent = () => {
    const [posts, setPosts] = React.useState<BlogPost[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState<'content' | 'preview' | 'seo' | 'settings'>('content');
    const { addNotification } = useNotifications();
    const location = useLocation();

    // Media Prompt State
    const [showMediaPrompt, setShowMediaPrompt] = React.useState<{ type: 'image' | 'video' | 'link' | 'cta', active: boolean }>({ type: 'image', active: false });
    const [mediaValue, setMediaValue] = React.useState('');
    const [mediaAlt, setMediaAlt] = React.useState('');

    // Form State
    const [editingPost, setEditingPost] = React.useState<BlogPost | null>(null);
    const [formData, setFormData] = React.useState<Partial<BlogPost>>({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        author: 'Noble Admin',
        status: 'draft',
        category: 'Strategy',
        tags: [],
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        imageAlt: '',
        imageTitle: '',
        readTime: '5 min read',
        seoTitle: '',
        metaDescription: '',
        focusKeywords: '',
        relatedKeywords: ''
    });

    const contentRef = React.useRef<HTMLTextAreaElement>(null);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const blogCol = collection(db, 'articles');
            const blogQuery = query(blogCol, orderBy('date', 'desc'));
            const blogSnapshot = await getDocs(blogQuery);
            const blogList = blogSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as BlogPost[];
            setPosts(blogList);
        } catch (error) {
            console.error("Error fetching blog posts:", error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchPosts();
        if (location.state?.openModal) {
            setIsModalOpen(true);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleTitleChange = (val: string) => {
        const slug = val.toLowerCase().trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
        setFormData({ ...formData, title: val, slug, seoTitle: val.substring(0, 60) });
    };

    const injectTag = (tag: string, value = "", alt = "") => {
        if (!contentRef.current) return;
        const textarea = contentRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const before = text.substring(0, start);
        const after = text.substring(end);
        const selected = text.substring(start, end);

        let newContent = "";
        if (tag === 'h2') newContent = `\n<h2>${selected || 'Subheading'}</h2>\n`;
        else if (tag === 'h3') newContent = `\n<h3>${selected || 'Minor Heading'}</h3>\n`;
        else if (tag === 'p') newContent = `\n<p>${selected || 'New paragraph text...'}</p>\n`;
        else if (tag === 'b') newContent = `<strong>${selected || 'bold text'}</strong>`;
        else if (tag === 'i') newContent = `<em>${selected || 'italic text'}</em>`;
        else if (tag === 'a') newContent = `<a href="${value || 'https://'}" class="text-noble-blue hover:underline" target="_blank">${selected || 'link text'}</a>`;
        else if (tag === 'quote') newContent = `\n<blockquote class="border-l-4 border-rose-500 pl-6 my-8 italic text-xl text-slate-300">\n  "${selected || 'Significant insight goes here...'}"\n</blockquote>\n`;
        else if (tag === 'ul') newContent = `\n<ul class="list-disc pl-6 space-y-2 my-6">\n  <li>${selected || 'List item'}</li>\n</ul>\n`;
        else if (tag === 'img') newContent = `\n<figure class="my-10 group">\n  <img src="${value}" alt="${alt}" class="w-full rounded-[2rem] border border-white/10 shadow-2xl" loading="lazy" />\n  ${alt ? `<figcaption class="text-center text-[10px] uppercase tracking-widest text-slate-500 mt-4">${alt}</figcaption>` : ''}\n</figure>\n`;
        else if (tag === 'video') newContent = `\n<div class="my-10 aspect-video rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">\n  <iframe src="${value}" className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>\n</div>\n`;
        else if (tag === 'cta') newContent = `\n<div class="my-12 p-10 bg-gradient-to-br from-rose-600 to-rose-900 rounded-[2.5rem] border border-white/20 text-center shadow-2xl">\n  <h3 class="text-2xl font-bold text-white mb-4">Ready to Master Financial Clarity?</h3>\n  <p class="text-rose-100 text-sm mb-8 max-w-md mx-auto">Join founders who are swapping spreadsheets for strategic intelligence.</p>\n  <a href="/pricing" class="inline-flex items-center gap-2 bg-white text-rose-600 px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform">Get Started Free <ChevronRight size={18} /></a>\n</div>\n`;
        else if (tag === 'toc') newContent = `\n<div class="bg-slate-900/50 border border-white/5 p-8 rounded-3xl my-8">\n  <h4 class="text-white font-bold mb-4 flex items-center gap-2"><Layout size={18} className="text-rose-500" /> Table of Contents</h4>\n  <ul class="space-y-2 text-sm text-slate-400 font-medium">\n    <li><a href="#section-1" class="hover:text-rose-400">1. Historical Context</a></li>\n    <li><a href="#section-2" class="hover:text-rose-400">2. Technical Methodology</a></li>\n    <li><a href="#section-3" class="hover:text-rose-400">3. Strategic Implementation</a></li>\n  </ul>\n</div>\n`;

        const finalValue = before + newContent + after;
        setFormData({ ...formData, content: finalValue });

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + newContent.length, start + newContent.length);
        }, 10);
    };

    const handleMediaSubmit = () => {
        if (!mediaValue) return;
        if (showMediaPrompt.type === 'image') injectTag('img', mediaValue, mediaAlt);
        else if (showMediaPrompt.type === 'video') {
            // Convert Youtube watch link to embed link if needed
            let finalUrl = mediaValue;
            if (mediaValue.includes('youtube.com/watch?v=')) {
                finalUrl = mediaValue.replace('watch?v=', 'embed/');
            }
            injectTag('video', finalUrl);
        }
        else if (showMediaPrompt.type === 'link') injectTag('a', mediaValue);

        setShowMediaPrompt({ ...showMediaPrompt, active: false });
        setMediaValue('');
        setMediaAlt('');
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const postData = {
            ...formData,
            date: editingPost ? editingPost.date : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        };

        try {
            if (editingPost) {
                await updateDoc(doc(db, 'articles', editingPost.id), postData as any);
                addNotification({ title: 'Insight Refined', msg: 'Article updated successfully.', type: 'success' });
            } else {
                await addDoc(collection(db, 'articles'), postData as any);
                addNotification({ title: 'Engine Primed', msg: 'New article is now live.', type: 'success' });
            }
            setIsModalOpen(false);
            setEditingPost(null);
            fetchPosts();
        } catch (error: any) {
            addNotification({ title: 'Transmission Error', msg: error.message, type: 'alert' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (postId: string) => {
        if (!window.confirm("Purge this article from knowledge base?")) return;
        try {
            await deleteDoc(doc(db, 'articles', postId));
            addNotification({ title: 'Article Purged', msg: 'Content successfully removed.', type: 'info' });
            fetchPosts();
        } catch (error: any) {
            addNotification({ title: 'Purge Failed', msg: error.message, type: 'alert' });
        }
    };

    const openEdit = (post: BlogPost) => {
        setEditingPost(post);
        setFormData(post);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-right-5 duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <FileText className="text-rose-500" /> Content Laboratory
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Orchestrating financial intelligence through strategic content architecture.</p>
                </div>
                <button
                    onClick={() => { setEditingPost(null); setFormData({ title: '', content: '', status: 'draft', category: 'Strategy', author: 'Noble Admin', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80' }); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-sm font-bold shadow-xl shadow-rose-600/20 transition-all active:scale-95"
                >
                    <Plus size={18} /> Compose New Insight
                </button>
            </div>

            {/* Post Management Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map(post => (
                    <div key={post.id} className="bg-slate-900/50 border border-white/5 rounded-[2rem] overflow-hidden group hover:bg-slate-900 hover:border-rose-500/30 transition-all duration-500">
                        <div className="h-44 bg-slate-950 relative overflow-hidden">
                            <img src={post.image} alt="" className="w-full h-full object-cover opacity-40 group-hover:opacity-70 group-hover:scale-110 transition-all duration-700" />
                            <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md ${post.status === 'published' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/20 text-slate-400 border border-slate-500/20'}`}>
                                {post.status}
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">{post.category}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                <span className="text-[10px] text-slate-500 font-bold">{post.date}</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-rose-400 transition-colors">{post.title}</h3>
                            <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5">
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">By {post.author}</div>
                                <div className="flex gap-2">
                                    <button onClick={() => openEdit(post)} className="p-2.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all">
                                        <Edit3 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(post.id)} className="p-2.5 text-slate-400 hover:text-rose-500 bg-white/5 hover:bg-rose-500/10 rounded-xl transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* HIGH FIDELITY WP-LIKE CMS MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-[#050608]/95 backdrop-blur-2xl animate-in fade-in duration-500">
                    <div className="bg-[#0b0e14] border border-white/10 w-full max-w-7xl h-full max-h-[90vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-700 shadow-rose-500/5">

                        {/* Media Inserter Overlay */}
                        {showMediaPrompt.active && (
                            <div className="absolute inset-0 z-[110] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
                                <div className="bg-[#12161e] border border-white/10 w-full max-w-md p-8 rounded-[2rem] shadow-2xl space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-lg font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                            {showMediaPrompt.type === 'image' && <ImageIcon size={20} className="text-rose-500" />}
                                            {showMediaPrompt.type === 'video' && <Video size={20} className="text-rose-500" />}
                                            {showMediaPrompt.type === 'link' && <LinkIcon size={20} className="text-rose-500" />}
                                            Insert {showMediaPrompt.type}
                                        </h4>
                                        <button onClick={() => setShowMediaPrompt({ ...showMediaPrompt, active: false })} className="text-slate-500 hover:text-white"><X size={20} /></button>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Source URL</label>
                                            <input
                                                autoFocus
                                                value={mediaValue}
                                                onChange={e => setMediaValue(e.target.value)}
                                                placeholder={showMediaPrompt.type === 'video' ? 'https://youtube.com/embed/...' : 'https://images.unsplash.com/...'}
                                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-rose-500 outline-none"
                                            />
                                        </div>
                                        {showMediaPrompt.type === 'image' && (
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Alt Text / Caption</label>
                                                <input
                                                    value={mediaAlt}
                                                    onChange={e => setMediaAlt(e.target.value)}
                                                    placeholder="Describe this image for search engines..."
                                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-rose-500 outline-none"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleMediaSubmit}
                                        className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-rose-600/20"
                                    >
                                        Insert into Intelligence
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Modal Header */}
                        <div className="px-10 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 bg-rose-600/10 rounded-2xl flex items-center justify-center border border-rose-600/20">
                                    <Edit3 className="text-rose-500" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white tracking-tight">
                                        {editingPost ? 'Refine Knowledge Protocol' : 'Initialize New Intelligence'}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Slug:</span>
                                        <span className="text-[10px] text-rose-500/70 font-mono">/blog/{formData.slug || 'untitled-node'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleSave}
                                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 active:scale-95"
                                >
                                    <Send size={16} /> {editingPost ? 'Sync Changes' : 'Publish Protocol'}
                                </button>
                                <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 rounded-full transition-all">
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Dual Pane Layout */}
                        <div className="flex-1 flex overflow-hidden">
                            {/* Main Content Area (Left) */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-10">
                                {/* Tab Navigation */}
                                <div className="flex gap-8 border-b border-white/5 mb-8">
                                    {[
                                        { id: 'content', icon: <FileText size={14} />, label: 'Content' },
                                        { id: 'preview', icon: <Eye size={14} />, label: 'Live Preview' },
                                        { id: 'seo', icon: <Sparkles size={14} />, label: 'Search Engine Hub' },
                                        { id: 'settings', icon: <Settings size={14} />, label: 'Node Settings' },
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as any)}
                                            className={`pb-4 text-[10px] font-bold uppercase tracking-widest transition-all relative flex items-center gap-2 ${activeTab === tab.id ? 'text-rose-500' : 'text-slate-500 hover:text-white'}`}
                                        >
                                            {tab.icon} {tab.label}
                                            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500 rounded-full"></div>}
                                        </button>
                                    ))}
                                </div>

                                {activeTab === 'content' && (
                                    <div className="space-y-8 animate-in slide-in-from-left-2 duration-300">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Article Headline</label>
                                            <input
                                                value={formData.title}
                                                onChange={e => handleTitleChange(e.target.value)}
                                                className="w-full bg-transparent text-4xl font-bold text-white placeholder:text-slate-800 outline-none border-none p-0 focus:ring-0"
                                                placeholder="Enter Intelligence Subject..."
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Knowledge Body</label>
                                                {/* Advanced Modular Toolbar */}
                                                <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1.5 rounded-2xl border border-white/5">
                                                    <div className="flex items-center gap-1 px-1 border-r border-white/5 mr-1">
                                                        <button type="button" onClick={() => injectTag('h2')} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg" title="H2 Headline"><Heading2 size={16} /></button>
                                                        <button type="button" onClick={() => injectTag('h3')} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg" title="H3 Subheadline"><Heading3 size={16} /></button>
                                                    </div>
                                                    <div className="flex items-center gap-1 px-1 border-r border-white/5 mr-1">
                                                        <button type="button" onClick={() => injectTag('b')} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg" title="Bold Text"><Bold size={16} /></button>
                                                        <button type="button" onClick={() => injectTag('i')} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg" title="Italic Text"><Italic size={16} /></button>
                                                        <button type="button" onClick={() => setShowMediaPrompt({ type: 'link', active: true })} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg" title="Hyperlink"><LinkIcon size={16} /></button>
                                                    </div>
                                                    <div className="flex items-center gap-1 px-1 border-r border-white/5 mr-1">
                                                        <button type="button" onClick={() => injectTag('ul')} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg" title="Bulleted List"><List size={16} /></button>
                                                        <button type="button" onClick={() => injectTag('quote')} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg" title="Blockquote"><Quote size={16} /></button>
                                                    </div>
                                                    <div className="flex items-center gap-1 px-1 border-r border-white/5 mr-1">
                                                        <button type="button" onClick={() => setShowMediaPrompt({ type: 'image', active: true })} className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg" title="Image Node"><ImageIcon size={16} /></button>
                                                        <button type="button" onClick={() => setShowMediaPrompt({ type: 'video', active: true })} className="p-2 text-amber-400 hover:bg-amber-500/10 rounded-lg" title="Video Node"><Video size={16} /></button>
                                                    </div>
                                                    <div className="flex items-center gap-1 px-1">
                                                        <button type="button" onClick={() => injectTag('cta')} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg" title="Viral CTA Block"><MousePointer2 size={16} /></button>
                                                        <button type="button" onClick={() => injectTag('toc')} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg" title="Table of Contents"><Layout size={16} /></button>
                                                    </div>
                                                </div>
                                            </div>
                                            <textarea
                                                ref={contentRef}
                                                required
                                                value={formData.content}
                                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                                className="w-full bg-slate-950/50 border border-white/5 rounded-3xl px-8 py-8 text-slate-300 focus:border-rose-600 focus:bg-slate-950 outline-none transition-all h-[450px] font-mono text-sm leading-relaxed"
                                                placeholder="Begin synthesizing high-conversion insights... Use the laboratory tools to inject rich media."
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Executive Summary (Excerpt)</label>
                                            <textarea
                                                value={formData.excerpt}
                                                onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                                                className="w-full bg-slate-950/50 border border-white/5 rounded-3xl px-8 py-6 text-slate-300 focus:border-rose-600 focus:bg-slate-950 outline-none transition-all h-24 text-sm"
                                                placeholder="Brief capsule of the content for index views..."
                                            />
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'preview' && (
                                    <div className="animate-in fade-in zoom-in-95 duration-500 prose prose-invert max-w-none">
                                        <div className="p-10 border border-white/10 rounded-[3rem] bg-slate-950/40 min-h-[500px]">
                                            <h1 className="text-4xl font-bold text-white mb-8">{formData.title || 'Draft Article Headline'}</h1>
                                            {formData.content ? (
                                                <div
                                                    className="blog-content-body space-y-6 text-slate-400 leading-relaxed text-lg"
                                                    dangerouslySetInnerHTML={{ __html: formData.content }}
                                                />
                                            ) : (
                                                <div className="py-20 text-center text-slate-600 italic">
                                                    Empty content detected. Use the editorial canvas to begin.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'seo' && (
                                    <div className="space-y-10 animate-in slide-in-from-bottom-2 duration-300">
                                        <div className="p-8 bg-rose-600/5 border border-rose-500/10 rounded-3xl flex items-start gap-4">
                                            <BarChart3 className="text-rose-500 shrink-0" size={24} />
                                            <div>
                                                <h4 className="text-white font-bold mb-1">Search Engine Optimization Hub</h4>
                                                <p className="text-xs text-slate-500">Maximize your digital footprint with precision metadata and keyword density mapping.</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-6">
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-end">
                                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">SEO Meta Title</label>
                                                        <span className={`text-[10px] font-bold ${(formData.seoTitle?.length || 0) > 60 ? 'text-rose-500' : 'text-emerald-500'}`}>{formData.seoTitle?.length || 0}/60</span>
                                                    </div>
                                                    <input
                                                        value={formData.seoTitle}
                                                        onChange={e => setFormData({ ...formData, seoTitle: e.target.value })}
                                                        className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-white focus:border-rose-600 outline-none transition-all"
                                                        placeholder="Noble Clarity | Strategic Finance..."
                                                    />
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-end">
                                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Meta Description</label>
                                                        <span className={`text-[10px] font-bold ${(formData.metaDescription?.length || 0) > 160 ? 'text-rose-500' : 'text-emerald-500'}`}>{formData.metaDescription?.length || 0}/160</span>
                                                    </div>
                                                    <textarea
                                                        value={formData.metaDescription}
                                                        onChange={e => setFormData({ ...formData, metaDescription: e.target.value })}
                                                        className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-white focus:border-rose-600 outline-none transition-all h-32 text-sm"
                                                        placeholder="Discover how Noble Clarity transforms financial data..."
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Primary Focus Keyword</label>
                                                    <input
                                                        value={formData.focusKeywords}
                                                        onChange={e => setFormData({ ...formData, focusKeywords: e.target.value })}
                                                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-rose-500 font-bold focus:border-rose-600 focus:bg-slate-950 outline-none transition-all"
                                                        placeholder="e.g. Financial Intelligence"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Related Semantic Clusters</label>
                                                    <textarea
                                                        value={formData.relatedKeywords}
                                                        onChange={e => setFormData({ ...formData, relatedKeywords: e.target.value })}
                                                        className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-slate-400 focus:border-rose-600 outline-none transition-all h-32 text-xs"
                                                        placeholder="SaaS Finance, Burn Rate Analysis, CFO Automation..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'settings' && (
                                    <div className="grid grid-cols-2 gap-10 animate-in fade-in duration-300">
                                        <div className="space-y-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Editorial Authority (Author)</label>
                                                <input
                                                    value={formData.author}
                                                    onChange={e => setFormData({ ...formData, author: e.target.value })}
                                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-white focus:border-rose-600 outline-none"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Discovery Tags</label>
                                                <input
                                                    value={formData.tags?.join(', ')}
                                                    onChange={e => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })}
                                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-white focus:border-rose-600 outline-none"
                                                    placeholder="Finance, AI, Startup..."
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-8">
                                            <div className="p-8 bg-slate-950/80 border border-white/5 rounded-3xl space-y-4 shadow-xl">
                                                <div className="flex items-center gap-3 text-emerald-500 mb-2">
                                                    <Globe size={18} />
                                                    <span className="text-xs font-bold uppercase tracking-widest">Visibility Controls</span>
                                                </div>
                                                <p className="text-xs text-slate-500">Define the global availability of this knowledge node.</p>
                                                <select
                                                    value={formData.status}
                                                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-rose-600 outline-none appearance-none"
                                                >
                                                    <option value="draft">Draft (System Only)</option>
                                                    <option value="published">Published (Live Network)</option>
                                                </select>
                                                <div className="flex items-center gap-2 mt-4 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                                    <ShieldCheck size={14} className="text-emerald-500" />
                                                    <span className="text-[10px] font-bold text-emerald-500 uppercase">Secure Node Protocol Active</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar Area (Right) */}
                            <div className="w-80 border-l border-white/5 bg-white/[0.01] overflow-y-auto custom-scrollbar p-8 space-y-10">
                                {/* Featured Image Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Featured Media</label>
                                        <CheckCircle2 size={12} className="text-emerald-500" />
                                    </div>
                                    <div className="aspect-video bg-slate-950 rounded-2xl border border-white/5 overflow-hidden group relative shadow-2xl">
                                        <img src={formData.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 hover:opacity-80 cursor-pointer" />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            <ImageIcon className="text-white" size={32} />
                                        </div>
                                    </div>
                                    <input
                                        value={formData.image}
                                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-3 py-3 text-[10px] text-slate-500 font-mono focus:border-rose-500 outline-none transition-all"
                                        placeholder="Featured Image URL..."
                                    />
                                    <div className="space-y-4 pt-2 border-t border-white/5">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Image Alt Tag (SEO)</label>
                                            <input
                                                value={formData.imageAlt}
                                                onChange={e => setFormData({ ...formData, imageAlt: e.target.value })}
                                                className="w-full bg-slate-950/30 border border-white/5 rounded-lg px-3 py-2 text-[10px] text-slate-400 focus:border-rose-500/50 outline-none transition-all"
                                                placeholder="Describe for search engines..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Image Title (SEO)</label>
                                            <input
                                                value={formData.imageTitle}
                                                onChange={e => setFormData({ ...formData, imageTitle: e.target.value })}
                                                className="w-full bg-slate-950/30 border border-white/5 rounded-lg px-3 py-2 text-[10px] text-slate-400 focus:border-rose-500/50 outline-none transition-all"
                                                placeholder="Secondary SEO title..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Category Section */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Intelligence Category</label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {['Strategy', 'AI & Finance', 'Growth', 'Tech Stack'].map(cat => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, category: cat })}
                                                className={`px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${formData.category === cat ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' : 'bg-slate-950 text-slate-500 hover:text-white border border-white/5'}`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Node Metrics */}
                                <div className="p-6 bg-slate-950/50 border border-white/5 rounded-3xl space-y-4">
                                    <div className="flex items-center gap-2 text-rose-500 mb-2">
                                        <BarChart3 size={16} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Network Vital Signs</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span className="text-slate-500 font-bold uppercase">Word Count:</span>
                                        <span className="text-white">{(formData.content?.split(/\s+/).filter(w => w.length > 0).length || 0)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span className="text-slate-500 font-bold uppercase">Complexity:</span>
                                        <span className="text-emerald-400 font-bold">Standard</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span className="text-slate-500 font-bold uppercase">Read Velocity:</span>
                                        <input
                                            value={formData.readTime}
                                            onChange={e => setFormData({ ...formData, readTime: e.target.value })}
                                            className="w-20 bg-transparent text-right text-rose-500 outline-none border-none p-0 focus:ring-0 font-bold"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogConsole;
