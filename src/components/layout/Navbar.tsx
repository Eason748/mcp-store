import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../common/Button';
import { AuthModal } from '../common/AuthModal';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { useAuth } from '../../contexts/AuthContext';
import { isAuthProviderEnabled } from '../../utils/auth';

interface INavbarProps {
  isAuthenticated: boolean;
  userProfile?: {
    name: string;
    avatar?: string;
  };
  onSignIn: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<INavbarProps> = ({
  isAuthenticated,
  userProfile,
  onSignIn: onSignInWithGithub,
  onSignOut,
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { signInWithEmail, signUpWithEmail, resetPassword, error } = useAuth();

  // Mock user MCP statistics
  const userStats = {
    serversRegistered: 3,
    serversUsed: 8,
    apiCalls: 256,
    lastActive: '2025/2/24'
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };
  
  // Close user menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isUserMenuOpen && !target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <nav className="bg-white shadow-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-lg">
                  M
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  MCP Store
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  location.pathname === '/' 
                    ? 'border-primary-500 text-neutral-900' 
                    : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
                } text-sm font-medium transition-colors`}
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/servers"
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  location.pathname === '/servers'
                    ? 'border-primary-500 text-neutral-900'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
                } text-sm font-medium transition-colors`}
              >
                MCP Servers
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/servers/new"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 transition-colors"
                  >
                    Add Server
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="relative user-menu-container">
                  <button 
                    className="flex items-center space-x-2 rounded-full hover:bg-neutral-100 p-1 transition-colors"
                    onClick={toggleUserMenu}
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                  >
                    {userProfile?.avatar ? (
                      <img
                        className="h-8 w-8 rounded-full ring-2 ring-white"
                        src={userProfile.avatar}
                        alt={userProfile.name}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center font-medium">
                        {userProfile?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                    <span className="text-sm font-medium text-neutral-700 hidden md:block">
                      {userProfile?.name}
                    </span>
                    <svg 
                      className="w-4 h-4 text-neutral-500 hidden md:block" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* User dropdown menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50 animate-fade-in border border-neutral-200">
                      <div className="px-4 py-3 border-b border-neutral-200">
                        <p className="text-sm font-medium text-neutral-900">{userProfile?.name}</p>
                        <p className="text-xs text-neutral-500 truncate">User ID: {userProfile?.name}</p>
                      </div>
                      
                      <div className="px-4 py-2">
                        <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                          {t('dashboard.statistics')}
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-neutral-50 p-2 rounded">
                            <p className="text-xs text-neutral-500">{t('servers.title')}</p>
                            <p className="text-lg font-semibold text-primary-600">{userStats.serversRegistered}</p>
                          </div>
                          <div className="bg-neutral-50 p-2 rounded">
                            <p className="text-xs text-neutral-500">{t('servers.status')}</p>
                            <p className="text-lg font-semibold text-primary-600">{userStats.serversUsed}</p>
                          </div>
                          <div className="bg-neutral-50 p-2 rounded">
                            <p className="text-xs text-neutral-500">{t('dashboard.apiCalls')}</p>
                            <p className="text-lg font-semibold text-primary-600">{userStats.apiCalls}</p>
                          </div>
                          <div className="bg-neutral-50 p-2 rounded">
                            <p className="text-xs text-neutral-500">{t('dashboard.lastActive')}</p>
                            <p className="text-sm font-semibold text-primary-600">{userStats.lastActive}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-neutral-200 mt-2">
                        <button
                          onClick={() => {
                            onSignOut();
                            setIsUserMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-neutral-100"
                        >
                          {t('auth.signOut')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                {isAuthProviderEnabled('email') && (
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={openAuthModal}
                    className="flex items-center space-x-2 shadow-sm"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88a9.947 9.947 0 0112.28 0C16.43 19.18 14.03 20 12 20z"
                      />
                    </svg>
                    <span>{t('auth.signIn')}</span>
                  </Button>
                )}
                
                {isAuthProviderEnabled('github') && !isAuthProviderEnabled('email') && (
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={onSignInWithGithub}
                    className="flex items-center space-x-2 shadow-sm"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{t('auth.signIn')} with GitHub</span>
                  </Button>
                )}
              </>
            )}
            
            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden ml-4">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
                onClick={toggleMobileMenu}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white border-t border-neutral-200 animate-slide-down" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                location.pathname === '/'
                  ? 'border-primary-500 text-primary-700 bg-primary-50'
                  : 'border-transparent text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-800'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/servers"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                location.pathname === '/servers'
                  ? 'border-primary-500 text-primary-700 bg-primary-50'
                  : 'border-transparent text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-800'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              MCP Servers
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/servers/new"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Add Server
                </Link>
                <div className="pt-4 pb-3 border-t border-neutral-200">
                  <div className="flex items-center px-4">
                    {userProfile?.avatar ? (
                      <img
                        className="h-10 w-10 rounded-full"
                        src={userProfile.avatar}
                        alt={userProfile.name}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center font-medium">
                        {userProfile?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div className="ml-3">
                      <div className="text-base font-medium text-neutral-800">
                        {userProfile?.name}
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile user statistics */}
                  <div className="px-4 py-2 mt-2">
                    <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                      {t('dashboard.statistics')}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-neutral-50 p-2 rounded">
                        <p className="text-xs text-neutral-500">{t('servers.title')}</p>
                        <p className="text-lg font-semibold text-primary-600">{userStats.serversRegistered}</p>
                      </div>
                      <div className="bg-neutral-50 p-2 rounded">
                        <p className="text-xs text-neutral-500">{t('servers.status')}</p>
                        <p className="text-lg font-semibold text-primary-600">{userStats.serversUsed}</p>
                      </div>
                      <div className="bg-neutral-50 p-2 rounded">
                        <p className="text-xs text-neutral-500">{t('dashboard.apiCalls')}</p>
                        <p className="text-lg font-semibold text-primary-600">{userStats.apiCalls}</p>
                      </div>
                      <div className="bg-neutral-50 p-2 rounded">
                        <p className="text-xs text-neutral-500">{t('dashboard.lastActive')}</p>
                        <p className="text-sm font-semibold text-primary-600">{userStats.lastActive}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 space-y-1 border-t border-neutral-200 pt-2">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-base font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('nav.profile')}
                    </Link>
                    <button
                      onClick={() => {
                        onSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:bg-neutral-50"
                    >
                      {t('auth.signOut')}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        onSignInWithGithub={onSignInWithGithub}
        onSignInWithEmail={signInWithEmail}
        onSignUpWithEmail={signUpWithEmail}
        onResetPassword={resetPassword}
        error={error}
      />
    </nav>
  );
};
