import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';
import { Input } from './Input';
import { Card } from './Card';
import { isAuthProviderEnabled } from '../../utils/auth';

interface IAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignInWithGithub: () => void;
  onSignInWithEmail: (email: string, password: string) => Promise<any>;
  onSignUpWithEmail: (email: string, password: string) => Promise<any>;
  onResetPassword: (email: string) => Promise<any>;
  error?: string | null;
}

type AuthMode = 'signin' | 'signup' | 'reset';

export const AuthModal: React.FC<IAuthModalProps> = ({
  isOpen,
  onClose,
  onSignInWithGithub,
  onSignInWithEmail,
  onSignUpWithEmail,
  onResetPassword,
  error,
}) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  if (!isOpen) return null;

  if (signupSuccess) {
    return (
      <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-md animate-fade-in">
          <Card className="w-full p-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-accent-100 text-accent-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold">{t('auth.accountCreated')}</h2>
              <p className="text-neutral-600">
                {t('auth.checkEmail')}
              </p>
              <Button
                variant="accent"
                onClick={onClose}
                className="mt-4"
              >
                {t('auth.close')}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      if (!email.trim()) {
        setFormError(t('auth.errors.emailRequired'));
        return;
      }

      if (mode === 'reset') {
        await onResetPassword(email);
        setFormError(t('auth.errors.resetLinkSent'));
        return;
      }

      if (!password) {
        setFormError(t('auth.errors.passwordRequired'));
        return;
      }

      if (mode === 'signup') {
        if (password.length < 6) {
          setFormError(t('auth.errors.passwordLength'));
          return;
        }

        if (password !== confirmPassword) {
          setFormError(t('auth.errors.passwordsNotMatch'));
          return;
        }

        const result = await onSignUpWithEmail(email, password);
        if (result?.error) {
          setFormError(result.error.message);
        } else {
          setSignupSuccess(true);
        }
      } else {
        const result = await onSignInWithEmail(email, password);
        if (result?.error) {
          setFormError(result.error.message);
        }
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : t('auth.errors.genericError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    setFormError(null);
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {mode === 'signin' && t('auth.signIn')}
              {mode === 'signup' && t('auth.createAccount')}
              {mode === 'reset' && t('auth.resetPassword')}
            </h2>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-700"
              aria-label={t('auth.close')}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('auth.email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />

            {mode !== 'reset' && (
              <Input
                label={t('auth.password')}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            )}

            {mode === 'signup' && (
              <Input
                label={t('auth.confirmPassword')}
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            )}

            {(formError || error) && (
              <div className="text-red-600 text-sm">
                {formError || error}
              </div>
            )}

            <Button 
              type="submit" 
              isFullWidth
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {mode === 'signin' && t('auth.signIn')}
              {mode === 'signup' && t('auth.createAccount')}
              {mode === 'reset' && t('auth.sendResetLink')}
            </Button>
          </form>

          {isAuthProviderEnabled('github') && (
            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-neutral-500">
                    {t('auth.continueWith')}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <Button
                  variant="accent"
                  isFullWidth
                  onClick={onSignInWithGithub}
                  className="flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  GitHub
                </Button>
              </div>
            </div>
          )}

          <div className="mt-4 text-center text-sm">
            {mode === 'signin' ? (
              <div className="space-y-2">
                <p>
                  {t('auth.dontHaveAccount')}{' '}
                  <button
                    type="button"
                    onClick={() => handleModeChange('signup')}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    {t('auth.signUp')}
                  </button>
                </p>
                <p>
                  <button
                    type="button"
                    onClick={() => handleModeChange('reset')}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    {t('auth.forgotPassword')}
                  </button>
                </p>
              </div>
            ) : mode === 'signup' ? (
              <p>
                {t('auth.alreadyHaveAccount')}{' '}
                <button
                  type="button"
                  onClick={() => handleModeChange('signin')}
                  className="text-primary-600 hover:text-primary-700"
                >
                  {t('auth.signIn')}
                </button>
              </p>
            ) : (
              <p>
                {t('auth.rememberPassword')}{' '}
                <button
                  type="button"
                  onClick={() => handleModeChange('signin')}
                  className="text-primary-600 hover:text-primary-700"
                >
                  {t('auth.signIn')}
                </button>
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
