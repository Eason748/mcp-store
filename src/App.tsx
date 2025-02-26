import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { AuthCallback } from './pages/AuthCallback';
import { ServersPage } from './pages/ServersPage';
import { ServerDetailPage } from './pages/ServerDetailPage';
import { EditServerPage } from './pages/EditServerPage';
import { RegisterServer } from './pages/RegisterServer';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const AppContent: React.FC = () => {
  const { user, isLoading, signInWithGithub, signOut } = useAuth();

  return (
    <Layout
      isAuthenticated={!!user}
      userProfile={user?.profile}
      onSignIn={signInWithGithub}
      onSignOut={signOut}
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/servers" element={<ServersPage />} />
        <Route path="/servers/new" element={<RegisterServer />} />
        <Route path="/servers/:id" element={<ServerDetailPage />} />
        <Route path="/servers/:id/edit" element={<EditServerPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </Layout>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};
