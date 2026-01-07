import * as React from 'react';
import { Link } from 'react-router-dom';
import {
    Calendar,
    Clock,
    ArrowRight,
    Search,
    ChevronRight,
    TrendingUp,
    ShieldCheck,
    Zap,
    Tag
} from 'lucide-react';
import { getAllArticles } from '../data/articles';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import Navbar from './Navbar';

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    date: string;
    readTime: string;
    image: string;
    slug: string;
}

const BlogArchive: React.FunctionComponent = () => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [posts, setPosts] = React.useState<BlogPost[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchArticles = async () => {
            try {
                // 1. Fetch from Firestore
                const blogCol = collection(db, 'articles');
                const blogQuery = query(blogCol, where('status', '==', 'published'), orderBy('date', 'desc'));
                const blogSnapshot = await getDocs(blogQuery);
                const firestorePosts = blogSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as BlogPost[];

                // 2. Get hardcoded articles as fallback/base
                const staticArticles = getAllArticles().map((a, i) => ({
                    id: `static-${i}`,
                    ...a
                }));

                // Combine them, prioritizing Firestore if slugs match (though they shouldn't)
                const combined = [...firestorePosts];
                staticArticles.forEach(sa => {
                    if (!combined.find(p => p.slug === sa.slug)) {
                        combined.push(sa);
                    }
                });

                setPosts(combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            } catch (error) {
                console.error("Error fetching articles:", error);
                // Fallback to purely static if Firestore fails
                setPosts(getAllArticles().map((a, i) => ({ id: `static-${i}`, ...a })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const featuredPost = posts[0];
    const remainingPosts = filteredPosts.filter(p => p.slug !== featuredPost.slug);

    return (
        <div className="min-h-screen bg-background-dark text-slate-200 font-display selection:bg-primary/30">
            <Navbar />
            {/* Hero Section */}
            <div className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-hero-glow pointer-events-none opacity-50"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-fit mb-6 animate-fade-in-up">
                        <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Research & Insights</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight animate-fade-in-up delay-100 italic">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Knowledge</span> Engine
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
                        Deep dives into generative finance, predictive business modeling, and the future of strategic clarity for founders.
                    </p>

                    <div className="max-w-2xl mx-auto relative group animate-fade-in-up delay-300">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-600/20 rounded-[2rem] blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                        <div className="relative flex items-center bg-card-dark/50 border border-white/10 rounded-[2rem] backdrop-blur-xl group-focus-within:border-primary/50 transition-all overflow-hidden">
                            <Search className="ml-6 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search the archive..."
                                className="w-full bg-transparent border-none px-6 py-5 text-white outline-none text-lg"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 pb-24">
                {/* Featured Post */}
                {!searchTerm && featuredPost && (
                    <div className="mb-20 animate-fade-in-up delay-500">
                        <Link to={`/blog/${featuredPost.slug}`} className="group relative grid lg:grid-cols-2 gap-0 rounded-[3rem] overflow-hidden bg-card-dark/40 border border-white/5 hover:border-primary/30 transition-all duration-500 shadow-2xl">
                            <div className="relative h-[400px] lg:h-full overflow-hidden">
                                <img
                                    src={featuredPost.image}
                                    alt={featuredPost.title}
                                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-background-dark/80 to-transparent lg:block hidden"></div>
                                <div className="absolute top-8 left-8">
                                    <span className="px-4 py-2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-lg shadow-primary/20">
                                        Featured Article
                                    </span>
                                </div>
                            </div>
                            <div className="p-12 lg:p-16 flex flex-col justify-center relative z-10">
                                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">
                                    <span className="flex items-center gap-1.5"><Tag size={12} className="text-primary" /> {featuredPost.category}</span>
                                    <span className="flex items-center gap-1.5"><Calendar size={12} /> {featuredPost.date}</span>
                                    <span className="flex items-center gap-1.5"><Clock size={12} /> {featuredPost.readTime}</span>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 group-hover:text-primary transition-colors leading-[1.1]">
                                    {featuredPost.title}
                                </h2>
                                <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-xl">
                                    {featuredPost.excerpt}
                                </p>
                                <div className="flex items-center text-primary text-sm font-bold uppercase tracking-widest gap-3 group-hover:gap-5 transition-all">
                                    Read Full Insight <ArrowRight size={18} />
                                </div>
                            </div>
                        </Link>
                    </div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {remainingPosts.map((post, idx) => (
                        <Link
                            to={`/blog/${post.slug}`}
                            key={post.id}
                            className={`group glass-card rounded-[2.5rem] overflow-hidden hover:border-primary/30 transition-all flex flex-col animate-fade-in-up`}
                            style={{ animationDelay: `${(idx + 1) * 100}ms` }}
                        >
                            <div className="relative h-60 overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100 grayscale-[40%] group-hover:grayscale-0"
                                />
                                <div className="absolute bottom-4 left-4">
                                    <span className="px-3 py-1 bg-card-dark/80 backdrop-blur-md border border-white/10 text-primary text-[9px] font-bold uppercase tracking-widest rounded-lg">
                                        {post.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 flex-1 flex flex-col">
                                <div className="flex items-center gap-4 text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-4">
                                    <span className="flex items-center gap-1.5"><Calendar size={12} /> {post.date}</span>
                                    <span className="flex items-center gap-1.5"><Clock size={12} /> {post.readTime}</span>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-primary transition-colors leading-tight">
                                    {post.title}
                                </h3>

                                <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">
                                    {post.excerpt.length > 120 ? post.excerpt.substring(0, 120) + '...' : post.excerpt}
                                </p>

                                <div className="flex items-center text-primary text-xs font-bold uppercase tracking-widest gap-2 group-hover:gap-3 transition-all">
                                    Explore <ArrowRight size={14} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredPosts.length === 0 && (
                    <div className="py-20 text-center">
                        <Search className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No research found</h3>
                        <p className="text-slate-500">Try adjusting your search terms to find what you're looking for.</p>
                    </div>
                )}
            </div>

            {/* Newsletter CTA */}
            <div className="container mx-auto px-6 py-24">
                <div className="relative rounded-[3rem] overflow-hidden p-12 md:p-24 text-center">
                    <div className="absolute inset-0 bg-primary/5 backdrop-blur-3xl border border-white/5 shadow-2xl"></div>
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"></div>
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>

                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mx-auto mb-8 animate-float">
                            <Zap size={32} />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight font-display">
                            Subscribe to <span className="text-primary italic">Clarity</span>
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto mb-12 text-lg leading-relaxed">
                            Join 5,000+ founders receiving weekly deep-dives into predictive finance and market intelligence.
                        </p>

                        <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Enter your work email"
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white outline-none focus:border-primary transition-all backdrop-blur-md"
                            />
                            <button className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95">
                                Join Now
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogArchive;
