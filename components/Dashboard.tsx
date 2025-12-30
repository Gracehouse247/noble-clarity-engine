
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
  Mail // Added Mail icon
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

  if (userProfile.plan === 'enterprise') {
    menuItems.push({ id: TabType.CONSOLIDATION, icon: Layers, label: 'Consolidation', path: 'consolidation' });
  }

  return (
    <div className="flex h-screen bg-[#0b0e14] text-slate-200 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-slate-950/50 backdrop-blur-xl z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-noble-blue rounded-lg flex items-center justify-center shadow-lg shadow-noble-blue/20">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-white font-['Montserrat'] tracking-tight">NOBLE WORLD</span>
        </div>

        <div className="px-4 mb-6">
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="w-full flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors group"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-noble-blue shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-sm font-bold text-white truncate">{activeProfile?.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{activeProfile?.industry}</p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-noble-blue text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 mt-auto">
          {/* Professional Review CTA */}
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="w-full mb-4 flex items-center justify-center gap-2 p-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 rounded-xl text-xs font-bold transition-all group"
          >
            <Star className="w-4 h-4 group-hover:fill-current" /> Post a Review
          </button>

          <div
            onClick={() => {
              if (userProfile.plan === 'starter') {
                if (confirm("AI Financial Coach is a Growth plan feature. Upgrade now?")) {
                  navigate('/pricing');
                }
              } else {
                setIsAICoachOpen(true);
              }
            }}
            className={`cursor-pointer bg-gradient-to-br from-noble-deep to-noble-blue rounded-xl p-4 mb-4 relative overflow-hidden group hover:shadow-lg transition-all ${userProfile.plan === 'starter' ? 'opacity-70 grayscale-[0.5]' : ''}`}
          >
            {userProfile.plan === 'starter' && (
              <div className="absolute top-2 right-2 z-10">
                <Lock className="w-4 h-4 text-white/80" />
              </div>
            )}
            <p className="text-[10px] font-bold text-white/90 uppercase mb-1">AI Financial Coach</p>
            <p className="text-[10px] text-white/60 mb-3">Powered by {userProfile.preferredProvider === 'gemini' ? 'Google Gemini' : 'OpenAI GPT'}.</p>
            <div className="flex items-center gap-2 text-white text-xs font-bold">
              {userProfile.plan === 'starter' ? (
                <>
                  <Sparkles className="w-4 h-4" /> <span>Upgrade to Chat</span>
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4" /> <span>Click to Chat</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/settings')} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
              <Settings className="w-5 h-5" />
            </button>
            <button onClick={onLogout} className="flex px-3 py-2 text-slate-400 hover:text-white hover:bg-rose-500/10 rounded-lg gap-2 transition-colors group w-full">
              <LogOut className="w-5 h-5 group-hover:text-rose-400" />
              <span className="text-sm font-medium group-hover:text-rose-400">Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold font-['Montserrat'] text-white">{activeTab}</h1>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setIsDataEntryOpen(true)} className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold">
              <Plus className="w-3 h-3" /> Add Data
            </button>
            {/* Save Snapshot Button */}
            <button onClick={handleSaveSnapshot} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold transition-all">
              <Save className="w-3 h-3" /> Save Snapshot
            </button>
            <button onClick={() => setIsReportOpen(true)} className="flex items-center gap-2 px-3 py-1.5 bg-noble-blue/10 hover:bg-noble-blue/20 text-noble-blue border border-noble-blue/30 rounded-lg text-xs font-bold">
              <FileText className="w-3 h-3" /> Report
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
              <img src={userProfile.avatarUrl} alt="User" className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 overflow-hidden cursor-pointer hover:border-noble-blue transition-colors" onClick={() => navigate('/settings')} />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 relative">
          {activeProfileData ? (
            <Routes>
              <Route path="overview" element={<Overview profileName={activeProfile?.name || ''} data={activeProfileData.current} history={activeProfileData.history} keys={apiKeys} provider={userProfile.preferredProvider} onClearHistory={clearHistory} onDeleteSnapshot={deleteSnapshot} onLoadSnapshot={loadSnapshot} onAddNotification={addNotification} />} />
              <Route path="profile" element={<BusinessProfile />} />
              <Route path="goals" element={<FinancialGoals currentData={activeProfileData.current} goals={activeProfileData.goals} onAddGoal={(g) => updateGoals([...activeProfileData.goals, g])} onDeleteGoal={(id) => updateGoals(activeProfileData.goals.filter(g => g.id !== id))} allowAdd={userProfile.plan !== 'starter' || activeProfileData.goals.length < 3} />} />
              <Route path="scenario" element={userProfile.plan !== 'starter' ? <ScenarioPlanner initialData={activeProfileData.current} /> : <UpgradePrompt feature="Scenario Planner" description="Model different future outcomes, stress test your business, and plan for growth or recession scenarios." />} />
              <Route path="cashflow" element={userProfile.plan !== 'starter' ? <CashFlow currentData={activeProfileData.current} history={activeProfileData.history} /> : <UpgradePrompt feature="Cash Flow Forecasting" description="Visualize your runway, burn rate, and future cash position to avoid surprises." />} />
              <Route path="marketing" element={userProfile.plan !== 'starter' ? <MarketingROI currentData={activeProfileData.current} history={activeProfileData.history} keys={apiKeys} provider={userProfile.preferredProvider} /> : <UpgradePrompt feature="Marketing ROI" description="Track campaign performance and calculate your exact return on ad spend." />} />
              <Route path="social" element={userProfile.plan !== 'starter' ? <SocialMediaROI keys={apiKeys} provider={userProfile.preferredProvider} /> : <UpgradePrompt feature="Social Media ROI" description="Analyze the financial impact of your social media engagement." />} />
              <Route path="email" element={userProfile.plan !== 'starter' ? <EmailMarketingROI keys={apiKeys} provider={userProfile.preferredProvider} /> : <UpgradePrompt feature="Email Marketing ROI" description="Measure the revenue generated from your email campaigns." />} />
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

      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white font-display">Settings</h3>
              <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex border-b border-slate-800">
              <button onClick={() => setSettingsTab('profile')} className={`flex-1 py-3 text-sm font-medium ${settingsTab === 'profile' ? 'text-noble-blue border-b-2 border-noble-blue' : 'text-slate-400'}`}>Profile</button>
              <button onClick={() => setSettingsTab('api')} className={`flex-1 py-3 text-sm font-medium ${settingsTab === 'api' ? 'text-noble-blue border-b-2 border-noble-blue' : 'text-slate-400'}`}>AI Config</button>
              <button onClick={() => setSettingsTab('data')} className={`flex-1 py-3 text-sm font-medium ${settingsTab === 'data' ? 'text-noble-blue border-b-2 border-noble-blue' : 'text-slate-400'}`}>Data</button>
            </div>
            <div className="p-6">
              {settingsTab === 'profile' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Name</label>
                    <input value={tempProfile.name} onChange={e => setTempProfile({ ...tempProfile, name: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Role</label>
                    <input value={tempProfile.role} onChange={e => setTempProfile({ ...tempProfile, role: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white mt-1" />
                  </div>
                </div>
              )}

              {settingsTab === 'api' && (
                <div className="space-y-6">
                  {/* Preferred Provider Toggle */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-3">Preferred AI Provider</label>
                    <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                      <button
                        onClick={() => setTempProfile({ ...tempProfile, preferredProvider: 'gemini' })}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${tempProfile.preferredProvider === 'gemini' ? 'bg-noble-blue text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        <Bot className="w-3.5 h-3.5" /> GOOGLE GEMINI
                      </button>
                      <button
                        onClick={() => setTempProfile({ ...tempProfile, preferredProvider: 'openai' })}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${tempProfile.preferredProvider === 'openai' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        <Sparkles className="w-3.5 h-3.5" /> OPENAI CHATGPT
                      </button>
                    </div>
                  </div>

                  <div className="min-h-[280px]">
                    {/* Google Gemini Section */}
                    {tempProfile.preferredProvider === 'gemini' && (
                      <div className="space-y-4 p-4 rounded-xl border bg-noble-blue/5 border-noble-blue/30 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <Bot className="w-4 h-4 text-noble-blue" /> Gemini Settings
                          </h4>
                          <button onClick={() => setShowGoogleKey(!showGoogleKey)} className="text-slate-500 hover:text-white transition-colors">
                            {showGoogleKey ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>

                        <div className="space-y-3">
                          <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
                            <p className="text-[10px] text-slate-400 uppercase font-bold mb-2 tracking-widest">How to get your key:</p>
                            <ul className="text-[11px] text-slate-300 space-y-1.5 list-decimal list-inside">
                              <li>Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-noble-blue hover:underline inline-flex items-center gap-0.5 font-bold">Google AI Studio <ExternalLink size={10} /></a></li>
                              <li>Log in with your Google Account</li>
                              <li>Click <strong>"Create API key in vertex AI project"</strong></li>
                              <li>Copy your key and paste it below</li>
                            </ul>
                          </div>
                          <input
                            type={showGoogleKey ? "text" : "password"}
                            value={tempApiKey}
                            onChange={e => setTempApiKey(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white font-mono text-sm focus:border-noble-blue transition-all"
                            placeholder="AIzaSy..."
                          />
                        </div>
                      </div>
                    )}

                    {/* OpenAI Section */}
                    {tempProfile.preferredProvider === 'openai' && (
                      <div className="space-y-4 p-4 rounded-xl border bg-emerald-600/5 border-emerald-600/30 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-emerald-500" /> ChatGPT Settings
                          </h4>
                          <button onClick={() => setShowOpenAIKey(!showOpenAIKey)} className="text-slate-500 hover:text-white transition-colors">
                            {showOpenAIKey ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>

                        <div className="space-y-3">
                          <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
                            <p className="text-[10px] text-slate-400 uppercase font-bold mb-2 tracking-widest">How to get your key:</p>
                            <ul className="text-[11px] text-slate-300 space-y-1.5 list-decimal list-inside">
                              <li>Go to the <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline inline-flex items-center gap-0.5 font-bold">OpenAI Dashboard <ExternalLink size={10} /></a></li>
                              <li>Log in or sign up for an account</li>
                              <li>Click <strong>"+ Create new secret key"</strong></li>
                              <li>Copy and paste it here immediately</li>
                            </ul>
                          </div>
                          <input
                            type={showOpenAIKey ? "text" : "password"}
                            value={tempOpenAIKey}
                            onChange={e => setTempOpenAIKey(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white font-mono text-sm focus:border-emerald-600 transition-all"
                            placeholder="sk-..."
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-slate-800/50 rounded-lg transition-colors border-t border-slate-800/50 pt-4">
                    <input
                      type="checkbox"
                      checked={rememberKeys}
                      onChange={e => setRememberKeys(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-700 text-noble-blue"
                    />
                    <span className="text-xs text-slate-400 font-medium">Remember keys locally for this browser session</span>
                  </label>
                </div>
              )}

              {settingsTab === 'data' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">Danger Zone</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                        <div>
                          <p className="text-sm font-bold text-white">Clear Notifications</p>
                          <p className="text-[10px] text-slate-500">Remove all alerts from your inbox.</p>
                        </div>
                        <button
                          onClick={() => { if (confirm("Clear all notifications?")) { clearAllNotifications(); addNotification({ title: 'Notifications Cleared', msg: 'Your inbox is now empty.', type: 'info' }); } }}
                          className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-white border border-slate-800 rounded-lg transition-colors"
                        >
                          Clear
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-amber-500/30 transition-colors">
                        <div>
                          <p className="text-sm font-bold text-white">Reset Profile</p>
                          <p className="text-[10px] text-slate-500">Wipe financial history for this business.</p>
                        </div>
                        <button
                          onClick={() => { if (confirm("Are you sure you want to reset this profile? This will delete all saved snapshots and goals.")) { resetProfile(); setIsSettingsOpen(false); addNotification({ title: 'Profile Reset', msg: 'All data for this profile has been cleared.', type: 'warning' }); } }}
                          className="px-3 py-1.5 text-xs font-bold text-amber-500 hover:bg-amber-500/10 border border-amber-500/30 rounded-lg transition-colors"
                        >
                          Reset
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-rose-500/20 hover:border-rose-500/40 transition-colors">
                        <div>
                          <p className="text-sm font-bold text-rose-400">Wipe All App Data</p>
                          <p className="text-[10px] text-slate-500">Delete everything and start fresh.</p>
                        </div>
                        <button
                          onClick={wipeAppData}
                          className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-lg shadow-rose-900/20 transition-all font-display"
                        >
                          Wipe
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
              <button onClick={onLogout} className="px-4 py-2 text-rose-400 font-bold text-sm hover:underline mr-auto">Log Out</button>
              <button onClick={() => setIsSettingsOpen(false)} className="px-4 py-2 text-slate-400 font-bold text-sm">Cancel</button>
              <button onClick={handleSaveSettings} className="px-6 py-2 bg-noble-blue text-white rounded-xl font-bold text-sm shadow-lg shadow-noble-blue/20">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
