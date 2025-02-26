interface IMcpToolResult {
  content?: {
    markdown?: string;
    html?: string;
    rawHtml?: string;
    screenshot?: string;
    links?: string[];
  };
  error?: string;
}

interface IMcpToolRequest {
  server_name: string;
  tool_name: string;
  arguments: Record<string, any>;
}

declare global {
  interface Window {
    use_mcp_tool: (request: IMcpToolRequest) => Promise<IMcpToolResult>;
  }
}

export {};
