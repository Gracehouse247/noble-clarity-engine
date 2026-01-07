
import * as React from 'react';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Target,
  TrendingUp,
  Wallet,
  Megaphone,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Plus,
  ChevronDown,
  Check,
  User,
  Upload,
  ShieldCheck,
  HelpCircle,
  ExternalLink,
  Key,
  Eye,
  EyeOff,
  AlertTriangle,
  Building2,
  FileText,
  Bot,
  MessageSquare,
  Sparkles,
  Maximize2,
  Minimize2,
  Crown,
  Layers,
  Code2,
  Lock,
  Star,
  Save,
  Globe,
  Share2,
  Mail, // Added Mail icon
  CheckCircle2,
  Info
} from 'lucide-react';
import { TabType, FinancialData, Notification, UserProfile, AIProvider } from '../types';
import { useUser, useBusiness, useNotifications } from '../contexts/NobleContext';
import { CURRENCY_SYMBOLS, INITIAL_DATA } from '../constants';

// Sub-components
import Overview from './Overview';
import ScenarioPlanner from './ScenarioPlanner';
import CashFlow from './CashFlow';
import MarketingROI from './MarketingROI';
import SocialMediaROI from './SocialMediaROI';
import EmailMarketingROI from './EmailMarketingROI'; // Import new component
import FinancialGoals from './FinancialGoals';
import AICoach from './AICoach';
import DataEntryModal from './DataEntryModal';
import ReportModal from './ReportModal';
import BusinessProfileModal from './BusinessProfileModal';
import ConsolidationView from './ConsolidationView';
import ReviewModal from './ReviewModal';
import BusinessProfile from './BusinessProfile';
import UpgradePrompt from './UpgradePrompt';
import ImageSEO from './ImageSEO';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FunctionComponent<DashboardProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile, updateUserProfile, apiKeys, updateApiKeys, logout } = useUser();
  const {
    profiles,
    activeProfile,
    activeProfileData,
    activeProfileId,
    switchProfile,
    createProfile,
    deleteProfile,
    updateFinancialData,
    saveSnapshot,
    deleteSnapshot,
    loadSnapshot,
    clearHistory,
    updateGoals,
    updateProfile,
    resetProfile,
    wipeAppData
  } = useBusiness();
  const { notifications, markAsRead, clearAllNotifications, addNotification } = useNotifications();

  // Navigation Helper
  const getTabFromPath = (path: string): TabType => {
    if (path.includes('goals')) return TabType.GOALS;
    if (path.includes('scenario')) return TabType.SCENARIO;
    if (path.includes('cashflow')) return TabType.CASHFLOW;
    if (path.includes('marketing')) return TabType.MARKETING;
    if (path.includes('social')) return TabType.SOCIAL;
    if (path.includes('email')) return TabType.EMAIL;
    if (path.includes('consolidation')) return TabType.CONSOLIDATION;
    if (path.includes('profile')) return 'Profile & Benchmarking' as TabType;
    return TabType.OVERVIEW;
  };

  const activeTab = getTabFromPath(location.pathname);

  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const [isAICoachOpen, setIsAICoachOpen] = React.useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = React.useState(false);

  // Modals State
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [isDataEntryOpen, setIsDataEntryOpen] = React.useState(false);
  const [isReportOpen, setIsReportOpen] = React.useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = React.useState(false);

  // Settings Local State
  const [settingsTab, setSettingsTab] = React.useState<'profile' | 'api' | 'data'>('profile');
  const [tempProfile, setTempProfile] = React.useState<UserProfile>(userProfile);
  const [tempApiKey, setTempApiKey] = React.useState(apiKeys.google);
  const [tempOpenAIKey, setTempOpenAIKey] = React.useState(apiKeys.openai);
  const [showGoogleKey, setShowGoogleKey] = React.useState(false);
  const [showOpenAIKey, setShowOpenAIKey] = React.useState(false);
  const [rememberKeys, setRememberKeys] = React.useState(false);

  // Sync settings state when opening modal
  React.useEffect(() => {
    if (isSettingsOpen) {
      setTempProfile(userProfile);
      setTempApiKey(apiKeys.google);
      setTempOpenAIKey(apiKeys.openai);
      setRememberKeys(!!localStorage.getItem('nobleClarityApiKeys'));
    }
  }, [isSettingsOpen, userProfile, apiKeys]);

  // One-time Notification for New Features
  React.useEffect(() => {
    const hasSeenNewSettings = localStorage.getItem('nobleClarity_seen_new_settings_v1');
    if (!hasSeenNewSettings) {
      setTimeout(() => {
        addNotification({
          title: '🚀 Upgrade: Command Center 2.0',
          msg: 'We have completely overhauled the Settings experience. Manage AI providers, secure your account with 2FA, and integrate your favorite financial tools in one place.',
          type: 'info',
          link: '/settings',
          actionLabel: 'Explore Settings'
        });
        localStorage.setItem('nobleClarity_seen_new_settings_v1', 'true');
      }, 2000);
    }
  }, [addNotification]);

  const handleSaveSettings = () => {
    updateUserProfile(tempProfile);
    updateApiKeys({ google: tempApiKey, openai: tempOpenAIKey }, rememberKeys);
    setIsSettingsOpen(false);
    addNotification({ title: 'Settings Saved', msg: 'Your preferences and AI provider have been updated.', type: 'success' });
  };

  const handleSaveSnapshot = () => {
    if (activeProfileData?.current) {
      saveSnapshot(activeProfileData.current);
      addNotification({
        title: 'Snapshot Saved',
        msg: `Data for ${activeProfileData.current.period} has been saved to history.`,
        type: 'success'
      });
    }
  };

  const menuItems = [
    { id: TabType.OVERVIEW, icon: LayoutDashboard, label: 'Overview', path: 'overview' },
    { id: 'Business Profile', icon: Building2, label: 'Profile & Benchmarking', path: 'profile' },
    { id: TabType.GOALS, icon: Target, label: 'Financial Goals', path: 'goals' },
    { id: TabType.SCENARIO, icon: TrendingUp, label: 'Scenario Planner', path: 'scenario' },
    { id: TabType.CASHFLOW, icon: Wallet, label: 'Cash Flow', path: 'cashflow' },
    { id: TabType.MARKETING, icon: Megaphone, label: 'Marketing ROI', path: 'marketing' },
    { id: TabType.SOCIAL, icon: Share2, label: 'Social ROI', path: 'social' },
    { id: TabType.EMAIL, icon: Mail, label: 'Email ROI', path: 'email' },
  ];

  menuItems.push({ id: TabType.CONSOLIDATION, icon: Layers, label: 'Consolidation', path: 'consolidation' });

  return (
    <div className="flex h-screen bg-[#0b0e14] text-slate-200 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Desktop & Mobile) */}
      <aside className={`fixed inset-y-0 left-0 w-72 md:w-64 bg-slate-950/95 backdrop-blur-2xl border-r border-slate-800 z-[110] transform transition-transform duration-500 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-noble-blue rounded-lg flex items-center justify-center shadow-lg shadow-noble-blue/20">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white font-['Montserrat'] tracking-tight">NOBLE CLARITY</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="px-4 mb-6">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="w-full flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-all group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-noble-blue shrink-0 group-hover:scale-110 transition-transform">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-sm font-bold text-white truncate">{activeProfile?.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{activeProfile?.industry}</p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => { navigate(item.path); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === item.id ? 'bg-noble-blue text-white shadow-xl shadow-noble-blue/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-slate-500'}`} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-white/5 space-y-4">
            <button
              onClick={() => { setIsReviewModalOpen(true); setIsSidebarOpen(false); }}
              className="w-full flex items-center justify-center gap-2 p-3.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 rounded-2xl text-xs font-black uppercase tracking-widest transition-all group"
            >
              <Star className="w-4 h-4 group-hover:fill-current" /> Post a Review
            </button>

            <button
              onClick={() => { setIsAICoachOpen(true); setIsSidebarOpen(false); }}
              className="w-full flex flex-col items-start gap-1 p-4 bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-2xl transition-all group"
            >
              <span className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                <Bot size={12} /> AI Financial Coach
              </span>
              <p className="text-[10px] text-slate-500 font-medium">Click to chat with the engine</p>
            </button>

            <div className="flex items-center gap-2">
              <button onClick={() => { navigate('/settings'); setIsSidebarOpen(false); }} className="flex-1 flex items-center justify-center gap-2 p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl border border-transparent hover:border-white/5 transition-all">
                <Settings className="w-5 h-5" />
                <span className="text-xs font-bold">Settings</span>
              </button>
              <button onClick={onLogout} className="flex-1 flex items-center justify-center gap-2 p-3 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all">
                <LogOut className="w-5 h-5" />
                <span className="text-xs font-bold">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="h-16 md:h-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 shrink-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-slate-400 hover:text-white bg-slate-800/50 rounded-xl border border-white/5"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg md:text-xl font-black font-display text-white uppercase tracking-tighter hidden sm:block">{activeTab}</h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden lg:flex items-center gap-3 mr-2">
              <button onClick={() => setIsDataEntryOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs font-bold transition-all">
                <Plus className="w-4 h-4 text-primary" /> Data Entry
              </button>
              <button onClick={handleSaveSnapshot} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold transition-all">
                <Save className="w-4 h-4" /> Snapshot
              </button>
            </div>

            <button onClick={() => setIsReportOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 transition-all">
              <FileText className="w-4 h-4" /> <span className="hidden sm:inline">Export Report</span>
            </button>

            <div className="flex items-center gap-2 md:gap-4 pl-2 md:pl-4 border-l border-white/5">
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-white/5 relative transition-all"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-slate-950 animate-pulse" />
                  )}
                </button>
              </div>

              <ImageSEO
                src={userProfile.avatarUrl}
                altText="Authenticated User"
                className="w-10 h-10 rounded-2xl bg-slate-800 border border-white/10 overflow-hidden cursor-pointer hover:border-primary transition-all p-0.5"
                onClick={() => navigate('/settings')}
              />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#0b0e14] custom-scrollbar">
          {activeProfileData ? (
            <Routes>
              <Route path="overview" element={<Overview profileName={activeProfile?.name || ''} data={activeProfileData.current} history={activeProfileData.history} keys={apiKeys} provider={userProfile.preferredProvider} onClearHistory={clearHistory} onDeleteSnapshot={deleteSnapshot} onLoadSnapshot={loadSnapshot} onAddNotification={addNotification} />} />
              <Route path="profile" element={<BusinessProfile />} />
              <Route path="goals" element={<FinancialGoals currentData={activeProfileData.current} goals={activeProfileData.goals} onAddGoal={(g) => updateGoals([...activeProfileData.goals, g])} onUpdateGoal={(updatedGoal) => updateGoals(activeProfileData.goals.map(g => g.id === updatedGoal.id ? updatedGoal : g))} onDeleteGoal={(id) => updateGoals(activeProfileData.goals.filter(g => g.id !== id))} allowAdd={true} />} />
              <Route path="scenario" element={<ScenarioPlanner initialData={activeProfileData.current} />} />
              <Route path="cashflow" element={<CashFlow currentData={activeProfileData.current} history={activeProfileData.history} />} />
              <Route path="marketing" element={<MarketingROI currentData={activeProfileData.current} history={activeProfileData.history} keys={apiKeys} provider={userProfile.preferredProvider} />} />
              <Route path="social" element={<SocialMediaROI keys={apiKeys} provider={userProfile.preferredProvider} />} />
              <Route path="email" element={<EmailMarketingROI keys={apiKeys} provider={userProfile.preferredProvider} />} />
              <Route path="consolidation" element={<ConsolidationView />} />
              <Route path="*" element={<Navigate to="overview" replace />} />
            </Routes>
          ) : <div className="p-12 text-center text-slate-500">Loading business profile...</div>}
        </div>

        {isAICoachOpen && (
          <div className="fixed bottom-6 right-6 z-50 w-full max-w-[400px] h-fit max-h-[85vh] animate-slide-up flex flex-col pointer-events-auto">
            <AICoach
              data={activeProfileData?.current || INITIAL_DATA}
              keys={apiKeys}
              provider={userProfile.preferredProvider}
              onClose={() => setIsAICoachOpen(false)}
            />
          </div>
        )}
      </main>

      <ReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} />
      <DataEntryModal
        isOpen={isDataEntryOpen}
        onClose={() => setIsDataEntryOpen(false)}
        currentData={activeProfileData?.current || INITIAL_DATA}
        onSave={updateFinancialData}
        onImportCsv={() => { }}
        businessName={activeProfile?.name || ''}
        activeCurrency={activeProfile?.currency || 'USD'}
        onCurrencyChange={(curr) => activeProfileId && updateProfile(activeProfileId, { currency: curr })}
      />
      <ReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} data={activeProfileData?.current || INITIAL_DATA} history={activeProfileData?.history || []} keys={apiKeys} provider={userProfile.preferredProvider} businessName={activeProfile?.name || ''} />
    </div>
  );
};

export default Dashboard;
