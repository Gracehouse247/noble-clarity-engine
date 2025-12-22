
import * as React from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import FeaturesPage from './components/FeaturesPage';
import PricingPage from './components/PricingPage';
import ApiDocsPage from './components/ApiDocsPage';
import StoryPage from './components/StoryPage';
import SecurityPage from './components/SecurityPage';
import PrivacyPage from './components/PrivacyPage';
import TermsPage from './components/TermsPage';
import { NobleProvider, useUser } from './contexts/NobleContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const AppContent: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/api-docs" element={<ApiDocsPage />} />
      <Route path="/story" element={<StoryPage />} />
      <Route path="/security" element={<SecurityPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/dashboard/*" element={
        <ProtectedRoute>
          <Dashboard onLogout={handleLogout} />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
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
