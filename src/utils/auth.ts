/**
 * Utility functions for authentication
 */

/**
 * Get the enabled authentication providers from environment variables
 * @returns An object with boolean flags for each provider
 */
export const getEnabledAuthProviders = (): { github: boolean; email: boolean } => {
  const authProviders = import.meta.env.VITE_AUTH_PROVIDERS || '';
  const providers = authProviders.split(',').map((p: string) => p.trim().toLowerCase());
  
  return {
    github: providers.includes('github'),
    email: providers.includes('email'),
  };
};

/**
 * Check if a specific authentication provider is enabled
 * @param provider The provider to check
 * @returns True if the provider is enabled, false otherwise
 */
export const isAuthProviderEnabled = (provider: 'github' | 'email'): boolean => {
  const enabledProviders = getEnabledAuthProviders();
  return enabledProviders[provider];
};
