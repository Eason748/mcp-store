export interface IUser {
  id: string;
  email: string;
  authProvider: 'github' | 'web3' | 'email';
  profile: {
    name: string;
    avatar?: string;
  };
  createdAt: string | Date;
  updatedAt: string | Date;
}

/**
 * Represents an MCP server in the registry
 */
export interface IMcpServer {
  id: string;
  /** Name of the MCP server */
  name: string;
  /** Description of what the server does */
  description: string;
  /** Optional URL to the server endpoint or GitHub repository */
  endpointUrl?: string;
  /** Optional protocol version, defaults to '1.0.0' */
  protocolVersion?: string;
  /** ID of the server owner */
  ownerId: string;
  /** Optional tags for categorizing the server, defaults to ['mcp'] */
  tags: string[];
  /** Markdown-supported documentation */
  documentation: string;
  /** Current status of the server */
  status: 'active' | 'inactive' | 'deprecated';
  /** Server metrics */
  metrics: {
    users: number;
    rating: number;
    uptime: number;
  };
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IReview {
  id: string;
  serverId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IAuthState {
  user: IUser | null;
  isLoading: boolean;
  error: string | null;
}

export interface IServerListFilters {
  search?: string;
  tags?: string[];
  status?: IMcpServer['status'];
  sortBy?: 'rating' | 'users' | 'created' | 'updated';
  sortOrder?: 'asc' | 'desc';
}
