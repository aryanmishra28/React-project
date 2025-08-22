import React, { useState, createContext, useContext } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { HackathonIdeas } from './components/HackathonIdeas';
import { ResumeAnalyzer } from './components/ResumeAnalyzer';
import { JobsAndUpdates } from './components/JobsAndUpdates';
import { MentorConnect } from './components/MentorConnect';
import { AuthModal } from './components/AuthModal';

// Simplified Auth Context
const AuthContext = createContext({
  user: null,
  login: (email: string, password: string) => Promise.resolve(),
  logout: () => {},
  loading: false
});

export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({ email, name: email.split('@')[0] });
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#6A0DAD] to-[#9B4DFF] flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center mx-auto animate-pulse">
            <span className="text-white text-3xl font-bold">NS</span>
          </div>
          <div className="space-y-2">
            <p className="text-white text-xl font-medium">NEXT STEP</p>
            <p className="text-white/70">Loading your career dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onTabChange={setActiveTab} />;
      case 'hackathons':
        return <HackathonIdeas />;
      case 'resume':
        return <ResumeAnalyzer />;
      case 'jobs':
        return <JobsAndUpdates />;
      case 'mentors':
        return <MentorConnect />;
      default:
        return <Dashboard onTabChange={setActiveTab} />;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onAuthClick={() => setShowAuthModal(true)}
        />
        <main className="pb-20 md:pb-0">
          {renderContent()}
        </main>
      </div>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}