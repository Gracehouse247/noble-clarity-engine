import * as React from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { NobleProvider, useNotifications } from './contexts/NobleContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SEOManager from './components/SEOManager';
import SchemaMarkup from './components/SchemaMarkup';
import { CheckCircle2, AlertCircle, Info, X as XIcon } from 'lucide-react';

// Eager load Landing Page for immediate LCP
import LandingPage from './components/LandingPage';

// Lazy load all other routes for performance
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const FeaturesPage = React.lazy(() => import('./components/FeaturesPage'));
const PricingPage = React.lazy(() => import('./components/PricingPage'));
const ApiDocsPage = React.lazy(() => import('./components/ApiDocsPage'));
const LoginPage = React.lazy(() => import('./components/LoginPage'));
const SignupPage = React.lazy(() => import('./components/SignupPage'));
const OnboardingFlow = React.lazy(() => import('./components/OnboardingFlow'));
const StoryPage = React.lazy(() => import('./components/StoryPage'));
const SecurityPage = React.lazy(() => import('./components/SecurityPage'));
const PrivacyPage = React.lazy(() => import('./components/PrivacyPage'));
const TermsPage = React.lazy(() => import('./components/TermsPage'));
const DeletionPage = React.lazy(() => import('./components/DeletionPage'));
const SettingsPage = React.lazy(() => import('./components/SettingsPage'));
const ChangelogPage = React.lazy(() => import('./components/ChangelogPage'));
const ProtectedRoute = React.lazy(() => import('./components/ProtectedRoute'));
const AdminProtectedRoute = React.lazy(() => import('./components/AdminProtectedRoute'));
const AdminDashboard = React.lazy(() => import('./components/admin/AdminDashboard'));
const AdminLoginPage = React.lazy(() => import('./components/admin/AdminLoginPage'));
const AdminElevation = React.lazy(() => import('./components/admin/AdminElevation'));
const BlogArchive = React.lazy(() => import('./components/BlogArchive'));
const BlogPost = React.lazy(() => import('./components/BlogPost'));
const NotFoundPage = React.lazy(() => import('./components/NotFoundPage'));

const LoadingSpinner = () => (
  <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
    <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const ToastContainer: React.FunctionComponent = () => {
  const { notifications, markAsRead } = useNotifications();
  const [activeToasts, setActiveToasts] = React.useState<number[]>([]);

  React.useEffect(() => {
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
      <SEOManager />
      <SchemaMarkup />
      <React.Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<Navigate to="/signup" replace />} />
          <Route path="/api-docs" element={<ApiDocsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/elevate" element={<AdminElevation />} />
          <Route path="/blog" element={<BlogArchive />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
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
          <Route path="/data-deletion" element={<DeletionPage />} />
          <Route path="/changelog" element={<ChangelogPage />} />
          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <Dashboard onLogout={handleLogout} />
            </ProtectedRoute>
          } />
          <Route path="/admin/*" element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />
          {/* 404 Monitoring & Redirection */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </React.Suspense>
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

// Build timestamp: 2026-01-15T02:30:00Z
export default App;
