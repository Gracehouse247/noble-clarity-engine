
import * as React from 'react';
import { Routes, Route, useNavigate, Link, useLocation } from 'react-router-dom';
import {
    Users,
    LayoutDashboard,
    FileText,
    Settings,
    LogOut,
    Globe,
    TrendingUp,
    MessageSquare,
    ShieldAlert,
    Menu,
    X,
    PlusCircle,
    Mail,
    Search,
    Filter,
    MoreVertical,
    ChevronRight,
    UserPlus
} from 'lucide-react';
import { useUser, useNotifications } from '../../contexts/NobleContext';
import { db } from '../../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import ImageSEO from '../ImageSEO';

// Placeholder modules (will be implemented next)
const UserDirectory = React.lazy(() => import('./UserDirectory'));
const RevenueAnalytics = React.lazy(() => import('./RevenueAnalytics'));
const BlogConsole = React.lazy(() => import('./BlogConsole'));
const SEOHub = React.lazy(() => import('./SEOHub'));
const TeamManagement = React.lazy(() => import('./TeamManagement'));
const FeedbackManager = React.lazy(() => import('./FeedbackManager'));
const EmailCampaign = React.lazy(() => import('./EmailCampaign'));

const AdminOverview: React.FunctionComponent = () => {
    const [stats, setStats] = React.useState({
        activeUsers: 0,
        revenue: 0,
        pendingReviews: 0,
        loading: true
    });

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const usersCol = collection(db, 'users');
                const userSnapshot = await getDocs(usersCol);
                const userList = userSnapshot.docs.map(doc => doc.data());

                const activeUsers = userList.filter(u => u.plan && u.plan !== 'starter').length;

                // Simplified revenue calculation based on plan pricing
                const revenue = userList.reduce((acc, u) => {
                    if (u.plan === 'enterprise') return acc + 499;
                    if (u.plan === 'growth') return acc + 199;
                    return acc;
                }, 0);

                const reviewsCol = collection(db, 'feedback');
                const reviewSnapshot = await getDocs(reviewsCol);
                const pendingReviews = reviewSnapshot.size;

                setStats({
                    activeUsers,
                    revenue,
                    pendingReviews,
                    loading: false
                });
            } catch (error) {
                console.error("Error fetching admin stats:", error);
                setStats(prev => ({ ...prev, loading: false }));
            }
        };

        fetchStats();
    }, []);

    const { userProfile } = useUser();
    const canSeeFinance = ['super-admin', 'finance-manager'].includes(userProfile?.systemRole || '');

    const cards = [
        { label: 'Active Subscriptions', val: stats.loading ? '...' : stats.activeUsers.toLocaleString(), trend: '+12%', color: 'text-emerald-500', visible: true },
        { label: 'Estimated MRR', val: stats.loading ? '...' : `$${stats.revenue.toLocaleString()}`, trend: '+8%', color: 'text-rose-500', visible: canSeeFinance },
        { label: 'System Health', val: '99.9%', trend: 'Stable', color: 'text-blue-500', visible: true },
        { label: 'Pending Reviews', val: stats.loading ? '...' : stats.pendingReviews.toString(), trend: 'New', color: 'text-amber-500', visible: true }
    ];

    const navigate = useNavigate();

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {cards.filter(c => c.visible).map((stat, i) => (
                    <div key={i} className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-3xl backdrop-blur-sm">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{stat.label}</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-2xl font-bold text-white">{stat.val}</h3>
                            <span className={`text-[10px] font-bold ${stat.color}`}>{stat.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900/20 border border-slate-800/50 p-8 rounded-[2.5rem]">
                    <h3 className="text-lg font-bold text-white mb-6">Founder's Rapid Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => navigate('/admin/email', { state: { openCampaign: true } })}
                            className="flex items-center gap-3 p-4 bg-slate-950/50 border border-slate-800 rounded-2xl hover:border-rose-600 transition-all text-sm font-medium"
                        >
                            <Mail className="w-4 h-4 text-rose-500" /> Blast Email Campaign
                        </button>
                        <button
                            onClick={() => navigate('/admin/blog', { state: { openModal: true } })}
                            className="flex items-center gap-3 p-4 bg-slate-950/50 border border-slate-800 rounded-2xl hover:border-rose-600 transition-all text-sm font-medium"
                        >
                            <PlusCircle className="w-4 h-4 text-rose-500" /> New Blog Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminDashboard: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userProfile, logout } = useUser();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    const menuItems = [
        { id: 'overview', icon: LayoutDashboard, label: 'Control Center', path: '/admin/overview', roles: ['super-admin', 'admin', 'finance-manager', 'operations', 'support'] },
        { id: 'users', icon: Users, label: 'User Directory', path: '/admin/users', roles: ['super-admin', 'operations', 'support', 'admin'] },
        { id: 'revenue', icon: TrendingUp, label: 'Revenue & Growth', path: '/admin/revenue', roles: ['super-admin', 'finance-manager'] },
        { id: 'blog', icon: FileText, label: 'Content Console', path: '/admin/blog', roles: ['super-admin', 'operations', 'admin'] },
        { id: 'seo', icon: Globe, label: 'SEO Hub', path: '/admin/seo', roles: ['super-admin', 'operations', 'admin'] },
        { id: 'team', icon: ShieldAlert, label: 'Team Security', path: '/admin/team', roles: ['super-admin'] },
        { id: 'feedback', icon: MessageSquare, label: 'Reviews & Feedback', path: '/admin/feedback', roles: ['super-admin', 'operations', 'support', 'admin'] },
        { id: 'email', icon: Mail, label: 'Email Campaigns', path: '/admin/email', roles: ['super-admin', 'finance-manager', 'admin'] },
    ];

    const currentRole = userProfile?.systemRole || 'admin';
    const visibleMenuItems = menuItems.filter(item => item.roles.includes(currentRole as any));

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="flex h-screen bg-[#0b0e14] text-slate-200 overflow-hidden font-sans">
            {/* Mobile Sidebar Overlay */}
            {!isSidebarOpen && window.innerWidth < 768 && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(true)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 ${isSidebarOpen ? 'w-64' : 'w-0 md:w-20'} flex flex-col border-r border-slate-800 bg-slate-950/80 backdrop-blur-xl transition-all duration-300 z-50 overflow-hidden md:relative`}>
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center shadow-lg shadow-rose-600/20">
                            <ShieldAlert className="w-5 h-5 text-white" />
                        </div>
                        {isSidebarOpen && <span className="font-bold text-lg text-white font-['Montserrat'] tracking-tight">ADMIN</span>}
                    </div>
                    {window.innerWidth < 768 && (
                        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1 text-slate-400">
                            <X size={20} />
                        </button>
                    )}
                </div>

                <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto custom-scrollbar">
                    {visibleMenuItems.map(item => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.id}
                                to={item.path}
                                onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                            >
                                <item.icon className="w-5 h-5" />
                                {isSidebarOpen && <span className="truncate">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800 space-y-2">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden md:flex w-full items-center gap-3 px-3 py-2 text-slate-400 hover:text-white rounded-xl text-sm transition-all">
                        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        {isSidebarOpen && <span>Collapse</span>}
                    </button>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-rose-400 rounded-xl text-sm transition-all">
                        <LogOut className="w-5 h-5" />
                        {isSidebarOpen && <span>Log Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 md:h-20 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-4 md:px-8 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="md:hidden p-2 text-slate-400 hover:text-white bg-slate-800/50 rounded-xl"
                        >
                            <Menu size={20} />
                        </button>
                        <h1 className="text-lg md:text-xl font-bold font-['Montserrat'] text-white truncate">
                            {menuItems.find(i => i.path === location.pathname)?.label || 'Overview'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 md:gap-6">
                        <div className="relative hidden lg:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input placeholder="Search platform..." className="bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white focus:border-rose-600 outline-none w-48 xl:w-64" />
                        </div>
                        <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-slate-800">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold text-white line-clamp-1">{userProfile.name}</p>
                                <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest leading-none mt-0.5">{userProfile.systemRole === 'super-admin' ? 'Super Admin' : userProfile.systemRole.replace('-', ' ')}</p>
                            </div>
                            <ImageSEO src={userProfile.avatarUrl} altText="Administrator Profile" className="w-9 h-9 rounded-xl border border-slate-700 bg-slate-900 overflow-hidden" />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-[#0b0e14]">
                    <React.Suspense fallback={<div className="flex items-center justify-center h-full text-slate-500">Loading module...</div>}>
                        <Routes>
                            <Route path="overview" element={<AdminOverview />} />
                            <Route path="users" element={<UserDirectory />} />
                            <Route path="revenue" element={<RevenueAnalytics />} />
                            <Route path="blog" element={<BlogConsole />} />
                            <Route path="seo" element={<SEOHub />} />
                            <Route path="team" element={<TeamManagement />} />
                            <Route path="feedback" element={<FeedbackManager />} />
                            <Route path="email" element={<EmailCampaign />} />
                            <Route path="*" element={<Link to="overview" />} />
                        </Routes>
                    </React.Suspense>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
