
import * as React from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import FeaturesPage from './components/FeaturesPage';
import PricingPage from './components/PricingPage';
import ApiDocsPage from './components/ApiDocsPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import OnboardingFlow from './components/OnboardingFlow';
import StoryPage from './components/StoryPage';
import SecurityPage from './components/SecurityPage';
import PrivacyPage from './components/PrivacyPage';
import TermsPage from './components/TermsPage';
import SettingsPage from './components/SettingsPage';
import ChangelogPage from './components/ChangelogPage';
import ProtectedRoute from './components/ProtectedRoute';
import { NobleProvider, useNotifications } from './contexts/NobleContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CheckCircle2, AlertCircle, Info, X as XIcon } from 'lucide-react';

const ToastContainer: React.FunctionComponent = () => {
  const { notifications, markAsRead } = useNotifications();
  const [activeToasts, setActiveToasts] = React.useState<number[]>([]);

  React.useEffect(() => {
    // Show only the most recent unread notification as a toast
    const unread = notifications.filter(n => !n.read);
    if (unread.length > 0) {
      const latest = unread[0];
      if (!activeToasts.includes(latest.id)) {
        setActiveToasts(prev => [...prev, latest.id]);
        setTimeout(() => {
          markAsRead(latest.id);
          setActiveToasts(prev => prev.filter(id => id !== latest.id));
        }, 5000);
      }
    }
  }, [notifications, activeToasts, markAsRead]);

  return (
    <div className="fixed bottom-6 left-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {notifications.filter(n => activeToasts.includes(n.id)).map(n => (
        <div
          key={n.id}
          className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-2xl animate-in slide-in-from-left-10 duration-500 pointer-events-auto max-w-sm w-full"
        >
          <div className="mt-0.5">
            {n.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            {n.type === 'alert' && <AlertCircle className="w-5 h-5 text-rose-500" />}
            {n.type === 'info' && <Info className="w-5 h-5 text-sky-blue" />}
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-white mb-1">{n.title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{n.msg}</p>
          </div>
          <button onClick={() => { markAsRead(n.id); setActiveToasts(prev => prev.filter(id => id !== n.id)); }} className="text-slate-500 hover:text-white transition-colors">
            <XIcon size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

const AppContent: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/api-docs" element={<ApiDocsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <OnboardingFlow />
          </ProtectedRoute>
        } />
        <Route path="/story" element={<StoryPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/changelog" element={<ChangelogPage />} />
        <Route path="/dashboard/*" element={
          <ProtectedRoute>
            <Dashboard onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </>
  );
};

const App: React.FunctionComponent = () => {
  return (
    <NobleProvider>
      <AuthProvider>
        <HashRouter>
          <AppContent />
        </HashRouter>
      </AuthProvider>
    </NobleProvider>
  );
};

export default App;
