import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navbar } from './Navbar';

interface ILayoutProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  userProfile?: {
    name: string;
    avatar?: string;
  };
  onSignIn: () => void;
  onSignOut: () => void;
}

export const Layout: React.FC<ILayoutProps> = ({
  children,
  isAuthenticated,
  userProfile,
  onSignIn,
  onSignOut,
}) => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="absolute inset-0 bg-gradient-diagonal from-primary-50/30 via-transparent to-secondary-50/20 pointer-events-none" aria-hidden="true" />
      
      <Navbar
        isAuthenticated={isAuthenticated}
        userProfile={userProfile}
        onSignIn={onSignIn}
        onSignOut={onSignOut}
      />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative z-10 animate-fade-in">
        {children}
      </main>
      
      <footer className="relative z-10 mt-24 bg-white border-t border-neutral-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-12">
            <div className="flex flex-col gap-8">
              {/* Brand section */}
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-lg">
                    M
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    MCP Store
                  </span>
                </div>
                <p className="mt-6 text-base text-neutral-600 leading-relaxed max-w-2xl">
                  {t('footer.description')}
                </p>
              </div>

              {/* Links and social */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="flex flex-wrap gap-x-8 gap-y-4">
                  <a href="/docs" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">
                    {t('footer.sections.resources.documentation')}
                  </a>
                  <a href="/guides" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">
                    {t('footer.sections.resources.guides')}
                  </a>
                  <a href="/api" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">
                    {t('footer.sections.resources.apiReference')}
                  </a>
                </div>

                <div className="flex items-center gap-4">
                  <a
                    href="https://github.com/modelcontextprotocol"
                    className="group flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
                  >
                    <svg className="h-4 w-4 text-neutral-600 transition-colors group-hover:text-neutral-700" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a
                    href="https://twitter.com/mcprotocol"
                    className="group flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
                  >
                    <svg className="h-4 w-4 text-neutral-600 transition-colors group-hover:text-neutral-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a
                    href="https://discord.gg/mcprotocol"
                    className="group flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
                  >
                    <svg className="h-4 w-4 text-neutral-600 transition-colors group-hover:text-neutral-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 00-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 00-5.487 0 12.36 12.36 0 00-.617-1.23A.077.077 0 008.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 00-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 00.031.055 20.03 20.03 0 005.993 2.98.078.078 0 00.084-.026 13.83 13.83 0 001.226-1.963.074.074 0 00-.041-.104 13.201 13.201 0 01-1.872-.878.075.075 0 01-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 01.078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 01.079.009c.12.098.245.195.372.288a.075.075 0 01-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 00-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 00.084.028 19.963 19.963 0 006.002-2.981.076.076 0 00.032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 00-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-neutral-100 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-neutral-500">
                {t('footer.copyright', { year: currentYear })}
              </p>
              <div className="flex items-center gap-1">
                <span className="text-sm text-neutral-500">{t('footer.builtWith')}</span>
                <span className="text-red-500 animate-pulse">❤</span>
                <span className="text-sm text-neutral-900">by MCP</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
