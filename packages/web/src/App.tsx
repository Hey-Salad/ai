import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, useAuth as useAuthContext } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPageSimple';
import AIDashboard from './pages/AIDashboard';
import APIKeys from './pages/APIKeys';
import Providers from './pages/Providers';
import Analytics from './pages/Analytics';
import Billing from './pages/Billing';
import Documentation from './pages/Documentation';
import Playground from './pages/Playground';
import Settings from './pages/Settings';

// Export useAuth for backward compatibility
export const useAuth = () => {
  const { user } = useAuthContext();
  
  return {
    currentUser: user ? {
      id: user.id,
      email: user.email || '',
      name: user.name || user.email || 'User',
      tier: user.tier || 'free',
      status: 'active' as const,
      createdAt: new Date().toISOString(),
    } : null,
  };
};

function AppContent() {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#E01D1D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400 font-medium">Loading HeySalad AI...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" /> : <LandingPage />}
      />

      {user ? (
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<AIDashboard />} />
          <Route path="/api-keys" element={<APIKeys />} />
          <Route path="/providers" element={<Providers />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/" />} />
      )}
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
