export interface Server {
  id: string;
  name: string;
  description: string;
  userId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  host: string;
  port: number;
  version: string;
  tags: string[];
}

export interface ServerUpdateInput {
  name?: string;
  description?: string;
  status?: string;
  host?: string;
  port?: number;
  version?: string;
  tags?: string[];
}
