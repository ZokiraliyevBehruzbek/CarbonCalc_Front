import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useNavigation } from './hooks/useNavigation';
import { RegisterPage } from './components/pages/RegisterPage';
import { LoginPage } from './components/pages/LoginPage';
import { FactorsCreatePage } from './components/pages/FactorsCreatePage';
import { ProfilePage } from './components/pages/ProfilePage';

const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const { currentPage, navigateTo } = useNavigation();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && (currentPage === 'login' || currentPage === 'register')) {
        navigateTo('profile');
      } else if (!isAuthenticated && (currentPage === 'profile' || currentPage === 'factors_create')) {
        navigateTo('login');
      }
    }
  }, [isAuthenticated, loading, currentPage, navigateTo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-600 text-lg font-medium">Loading EcoTracker...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'register':
        return <RegisterPage onNavigate={navigateTo} />;
      case 'login':
        return <LoginPage onNavigate={navigateTo} />;
      case 'factors_create':
        return <FactorsCreatePage onNavigate={navigateTo} />;
      case 'profile':
        return <ProfilePage onNavigate={navigateTo} />;
      default:
        return <LoginPage onNavigate={navigateTo} />;
    }
  };

  return <>{renderPage()}</>;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;