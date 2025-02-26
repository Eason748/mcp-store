import { scrapeGitHubReadme } from '../services/mcp';

/**
 * Extracts owner and repo from a GitHub URL
 * @param url GitHub repository URL
 * @returns Object containing owner and repo, or null if not a valid GitHub URL
 */
export const parseGitHubUrl = (url: string): { owner: string; repo: string } | null => {
  try {
    const urlObj = new URL(url);
    if (!urlObj.hostname.includes('github.com')) {
      return null;
    }

    const parts = urlObj.pathname.split('/').filter(Boolean);
    if (parts.length < 2) {
      return null;
    }

    return {
      owner: parts[0],
      repo: parts[1]
    };
  } catch {
    return null;
  }
};

/**
 * Fetches README content from a GitHub repository
 * @param url GitHub repository URL
 * @returns README content in markdown format
 */
export const fetchGitHubReadme = async (url: string): Promise<string | null> => {
  const githubInfo = parseGitHubUrl(url);
  if (!githubInfo) {
    return null;
  }

  // Try both main and master branches
  const branches = ['main', 'master'];
  
  for (const branch of branches) {
    try {
      // Use raw.githubusercontent.com to fetch the README directly
      const rawUrl = `https://raw.githubusercontent.com/${githubInfo.owner}/${githubInfo.repo}/${branch}/README.md`;
      console.log(`Attempting to fetch README from ${rawUrl}`);
      const content = await scrapeGitHubReadme(rawUrl);
      
      if (content) {
        return content;
      }
    } catch (error) {
      console.error(`Error fetching README from ${branch} branch:`, error);
      // Try next branch
    }
  }

  return null; // No README found in any branch
};
