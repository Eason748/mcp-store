import { supabase } from './supabase';

export const authService = {
  signInWithGithub: async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        scopes: 'read:user user:email'
      }
    });
  },

  signInWithEmail: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password
    });
  },

  signUpWithEmail: async (email: string, password: string) => {
    return await supabase.auth.signUp({
      email,
      password
    });
  },

  resetPassword: async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
  },

  updatePassword: async (password: string) => {
    return await supabase.auth.updateUser({
      password
    });
  },

  signOut: async () => {
    return await supabase.auth.signOut();
  },

  getCurrentUser: async () => {
    return await supabase.auth.getUser();
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};
