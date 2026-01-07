import * as React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
    Calendar,
    Clock,
    ChevronLeft,
    Share2,
    Twitter,
    Linkedin,
    TrendingUp,
    ArrowRight,
    Zap,
    Bookmark,
    ShieldCheck
} from 'lucide-react';
import { getArticleBySlug, getAllArticles, Article } from '../data/articles';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import Navbar from './Navbar';

const BlogPost: React.FunctionComponent = () => {
    const { slug } = useParams();
    const [article, setArticle] = React.useState<Article | undefined>(undefined);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchArticle = async () => {
            if (!slug) return;
            try {
                // 1. Check Firestore
                const blogCol = collection(db, 'articles');
                const q = query(blogCol, where('slug', '==', slug), limit(1));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const data = querySnapshot.docs[0].data() as Article;
                    setArticle(data);
                    document.title = data.seoTitle || data.title;
                } else {
                    // 2. Check Static Fallback
                    const staticArticle = getArticleBySlug(slug);
                    setArticle(staticArticle);
                    if (staticArticle) document.title = staticArticle.seoTitle || staticArticle.title;
                }
            } catch (error) {
                console.error("Error fetching article:", error);
                const staticArticle = getArticleBySlug(slug);
                setArticle(staticArticle);
                if (staticArticle) document.title = staticArticle.seoTitle || staticArticle.title;
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();

        return () => {
            document.title = "Noble Clarity Engine";
        };
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // If article not found, redirect to blog archive
    if (!article) {
        return <Navigate to="/blog" replace />;
    }

    return (
        <div className="min-h-screen bg-background-dark text-slate-300 font-display selection:bg-primary/30">
            <Navbar />
            {/* Header / Hero */}
            <div className="relative pt-32 pb-20 overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 bg-hero-glow opacity-40"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <Link to="/blog" className="inline-flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-[0.2em] mb-12 hover:gap-3 transition-all group">
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Knowledge Engine
                    </Link>

                    <div className="max-w-4xl mx-auto text-center lg:text-left">
                        <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 mb-8">
                            <span className="px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest rounded-lg">
                                {article.category}
                            </span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                <Clock size={12} /> {article.readTime}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-8 animate-fade-in-up">
                            {article.title}
                        </h1>

                        <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 mt-12 pt-8 border-t border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                    <span className="material-symbols-outlined text-sm">diamond</span>
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-bold text-white uppercase tracking-wider">{article.author}</p>
                                    <p className="text-[10px] text-slate-500 font-medium">Strategic Analyst</p>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-white/5 hidden sm:block"></div>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                <Calendar size={12} className="text-primary" /> {article.date}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto px-6 py-20">
                <div className="flex flex-col lg:flex-row gap-16 max-w-7xl mx-auto">
                    {/* Sidebar / Sharing */}
                    <aside className="lg:w-20 flex lg:flex-col items-center gap-6 order-2 lg:order-1">
                        <div className="sticky top-32 flex lg:flex-col gap-4">
                            <button className="w-12 h-12 rounded-xl bg-card-dark border border-white/5 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 transition-all shadow-xl" title="Share on Twitter">
                                <Twitter size={18} />
                            </button>
                            <button className="w-12 h-12 rounded-xl bg-card-dark border border-white/5 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 transition-all shadow-xl" title="Share on LinkedIn">
                                <Linkedin size={18} />
                            </button>
                            <button className="w-12 h-12 rounded-xl bg-card-dark border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all shadow-xl" title="Bookmark Insight">
                                <Bookmark size={18} />
                            </button>
                            <div className="h-12 w-px bg-white/5 mx-auto hidden lg:block"></div>
                            <button className="w-12 h-12 rounded-xl bg-card-dark border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-xl">
                                <Share2 size={18} />
                            </button>
                        </div>
                    </aside>

                    {/* Article Body */}
                    <article className="flex-1 order-1 lg:order-2 max-w-4xl">
                        {/* Primary SEO Asset */}
                        <div className="relative group mb-16">
                            <img
                                src={article.image}
                                alt={article.imageAlt || article.title}
                                title={article.imageTitle}
                                className="w-full h-[500px] object-cover rounded-[3rem] shadow-2xl transition-all duration-700 group-hover:scale-[1.02] border border-white/10"
                            />
                            <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-t from-background-dark/80 via-transparent to-transparent opacity-60"></div>
                        </div>

                        {/* Viral Focus Tags */}
                        {article.focusKeywords && (
                            <div className="flex flex-wrap gap-2 mb-10">
                                {article.focusKeywords.split(',').map((kw, i) => (
                                    <span key={i} className="px-4 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-bold uppercase tracking-widest rounded-full">
                                        # {kw.trim()}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div
                            className="prose prose-invert prose-rose max-w-none 
                                prose-headings:text-white prose-headings:font-extrabold prose-headings:tracking-tight
                                prose-p:text-slate-300 prose-p:leading-[1.8] prose-p:text-xl prose-p:mb-12
                                prose-strong:text-white prose-strong:font-bold
                                prose-li:text-slate-400 prose-li:text-lg prose-li:mb-4
                                prose-h2:text-5xl prose-h2:mt-24 prose-h2:mb-10 prose-h2:text-white prose-h2:leading-tight
                                prose-h3:text-3xl prose-h3:mt-16 prose-h3:mb-8 prose-h3:text-slate-100 prose-h3:leading-snug
                                prose-blockquote:border-l-[6px] prose-blockquote:border-rose-500 prose-blockquote:bg-gradient-to-r prose-blockquote:from-rose-500/10 prose-blockquote:to-transparent prose-blockquote:p-12 prose-blockquote:rounded-r-[3rem] prose-blockquote:italic prose-blockquote:text-3xl prose-blockquote:text-slate-100 prose-blockquote:my-16 prose-blockquote:font-medium
                                prose-a:text-rose-500 prose-a:font-bold prose-a:no-underline hover:prose-a:underline hover:prose-a:text-rose-400 transition-colors
                                prose-img:rounded-[3rem] prose-img:border prose-img:border-white/10 prose-img:shadow-2xl
                                [&_figure]:my-20 [&_figcaption]:text-center [&_figcaption]:text-sm [&_figcaption]:text-slate-500 [&_figcaption]:mt-6 [&_figcaption]:italic [&_figcaption]:tracking-wide
                                [&_iframe]:rounded-[3rem] [&_iframe]:shadow-2xl [&_iframe]:border [&_iframe]:border-white/10"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />

                        {/* Article Footer */}
                        <div className="mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 bg-white/[0.02] p-12 rounded-[3rem]">
                            <div>
                                <h4 className="text-2xl font-bold text-white mb-2">Architecting Your Financial Future?</h4>
                                <p className="text-slate-500 text-sm">Join the 1,500+ founders receiving our weekly intelligence protocols.</p>
                            </div>
                            <div className="flex gap-4">
                                <Link to="/signup" className="px-10 py-5 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-rose-600/20 active:scale-95 flex items-center gap-3">
                                    Start Analysis <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    </article>

                    {/* Right Sidebar - Contextual Actions */}
                    <aside className="hidden xl:block w-80 shrink-0 order-3">
                        <div className="sticky top-32 space-y-8">
                            <div className="p-8 rounded-[2rem] bg-gradient-to-br from-indigo-900/50 to-slate-900 border border-white/10 relative overflow-hidden group shadow-2xl">
                                <div className="absolute inset-0 bg-noise opacity-20"></div>
                                <h3 className="text-xl font-bold text-white mb-4 relative z-10 font-display">AI Deployment Ready</h3>
                                <p className="text-indigo-200 text-sm leading-relaxed mb-8 relative z-10">
                                    The predictive models discussed in this article are available for immediate deployment in your dashboard. Activate this logic on your live financial data today.
                                </p>
                                <ul className="space-y-4 mb-8 relative z-10">
                                    {[
                                        { text: 'Deploy ROI Model', icon: <TrendingUp size={14} /> },
                                        { text: 'Run Health Audit', icon: <ShieldCheck size={14} /> },
                                        { text: 'Sync Live Telemetry', icon: <Zap size={14} /> }
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-[10px] font-bold text-white uppercase tracking-widest group/item">
                                            <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover/item:scale-110 transition-transform shadow-glow shadow-indigo-500/20">
                                                {item.icon}
                                            </div>
                                            {item.text}
                                        </li>
                                    ))}
                                </ul>
                                <Link to="/signup" className="flex items-center justify-center gap-2 w-full py-5 bg-white text-indigo-900 hover:bg-indigo-50 rounded-2xl font-bold text-xs shadow-xl transition-all hover:-translate-y-1 active:scale-95">
                                    Initialize Model <ArrowRight size={14} />
                                </Link>
                            </div>

                            <div className="p-8 rounded-[2rem] bg-card-dark border border-white/5 relative overflow-hidden group">
                                <h3 className="text-white font-bold mb-6 relative z-10">Recent Posts</h3>
                                <div className="space-y-4 relative z-10">
                                    {getArticleBySlug && getAllArticles().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5).map((post, i) => (
                                        <Link to={`/blog/${post.slug}`} key={i} className="block group/link">
                                            <h4 className="text-[13px] font-bold text-slate-300 group-hover/link:text-primary transition-colors leading-snug mb-1">
                                                {post.title}
                                            </h4>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                                                <span>{post.date}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                                <span>{post.readTime}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div >

            {/* Related - Bottom Ticker or back CTA */}
            < div className="py-20 bg-card-dark/30 border-t border-white/5" >
                <div className="container mx-auto px-6 text-center">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mb-4">Continue Reading</p>
                    <Link to="/blog" className="text-2xl font-bold text-white hover:text-primary transition-colors inline-flex items-center gap-3 group">
                        Browse the Full Knowledge Engine <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>
            </div >
        </div >
    );
};

export default BlogPost;
