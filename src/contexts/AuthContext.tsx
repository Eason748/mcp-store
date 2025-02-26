import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth';
import { userService, supabase } from '../services/supabase';
import type { IUser, IAuthState } from '../types';

interface IAuthContext extends IAuthState {
  signInWithGithub: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<any>;
  signUpWithEmail: (email: string, password: string) => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<IAuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await authService.getCurrentUser();
      if (user) {
        // Determine auth provider
        let authProvider: 'github' | 'web3' | 'email' = 'email';
        if (user.app_metadata?.provider === 'github') {
          authProvider = 'github';
        } else if (user.app_metadata?.provider === 'web3') {
          authProvider = 'web3';
        }
        
        // Set user state
        setState({
          user: {
            id: user.id,
            email: user.email || '',
            authProvider,
            profile: {
              name: authProvider === 'github' 
                ? user.user_metadata?.user_name || user.email?.split('@')[0] || 'Anonymous'
                : user.email?.split('@')[0] || 'Anonymous',
              avatar: user.user_metadata?.avatar_url,
            },
            createdAt: user.created_at ? new Date(user.created_at) : new Date(),
            updatedAt: user.updated_at ? new Date(user.updated_at) : new Date(),
          },
          isLoading: false,
          error: null,
        });

        // After setting initial state, try to ensure profile exists
        const setupProfile = async () => {
          try {
            // First check if profile exists without using .single() to avoid the error
            const { data: profiles, error: fetchError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id);
            
            if (fetchError) {
              console.error('Failed to fetch profile:', fetchError);
              setState(prev => ({
                ...prev,
                error: 'Failed to setup user profile'
              }));
              return;
            }

            // If no profile or multiple profiles found, handle accordingly
            if (!profiles || profiles.length === 0) {
              console.log('No profile found, creating new profile');
              // Create new profile
              const { error: insertError } = await supabase.from('profiles').upsert({
                id: user.id,
                email: user.email || '',
                auth_provider: authProvider,
                name: authProvider === 'github'
                  ? user.user_metadata?.user_name || user.email?.split('@')[0] || 'Anonymous'
                  : user.email?.split('@')[0] || 'Anonymous',
                avatar_url: user.user_metadata?.avatar_url
              }, {
                onConflict: 'id'
              });
              
              if (insertError) {
                console.error('Failed to create profile:', insertError);
                setState(prev => ({
                  ...prev,
                  error: 'Failed to create user profile'
                }));
                return;
              }
            } else if (profiles.length > 1) {
              // Handle multiple profiles case (shouldn't happen with proper constraints)
              console.error('Multiple profiles found for user:', user.id);
              // Keep the first profile and log the issue
              console.log('Using the first profile found');
            }
          } catch (error) {
            console.error('Failed to setup profile:', error);
            setState(prev => ({
              ...prev,
              error: 'An unexpected error occurred while setting up your profile'
            }));
          }
        };
        
        // Wait for profile setup to complete before proceeding
        await setupProfile();
      } else {
        setState({
          user: null,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      setState({
        user: null,
        isLoading: false,
        error: 'Failed to fetch user',
      });
    }
  };

  const handleAuthError = (error: any) => {
    setState(prev => ({
      ...prev,
      error: error.message || 'Authentication failed',
      isLoading: false,
    }));
  };

  const signInWithGithub = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      console.log('Starting GitHub authentication flow');
      
      const { data, error } = await authService.signInWithGithub();
      
      if (error) {
        console.error('GitHub authentication error:', error);
        throw error;
      }
      
      console.log('GitHub authentication successful, checking user');
      await checkUser();
    } catch (error: any) {
      console.error('GitHub sign in failed:', error);
      handleAuthError(error);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const result = await authService.signInWithEmail(email, password);
      if (result.error) {
        handleAuthError(result.error);
        return result;
      }
      await checkUser();
      return result;
    } catch (error: any) {
      handleAuthError(error);
      return { error };
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const result = await authService.signUpWithEmail(email, password);
      if (result.error) {
        handleAuthError(result.error);
        return result;
      }
      await checkUser();
      return result;
    } catch (error: any) {
      handleAuthError(error);
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const result = await authService.resetPassword(email);
      if (result.error) {
        handleAuthError(result.error);
        return result;
      }
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
      }));
      return result;
    } catch (error: any) {
      handleAuthError(error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const { error } = await authService.signOut();
      if (error) throw error;
      setState({
        user: null,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  const value = {
    ...state,
    signInWithGithub,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
