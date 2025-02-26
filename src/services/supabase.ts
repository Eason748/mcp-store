import { createClient } from '@supabase/supabase-js';
import type { IMcpServer } from '../types';

// 环境变量类型声明
declare global {
  interface ImportMetaEnv {
    VITE_SUPABASE_URL: string
    VITE_SUPABASE_ANON_KEY: string
  }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 在开发环境中提前检查环境变量
if (import.meta.env.DEV && (!supabaseUrl || !supabaseKey)) {
  console.error(`
    Missing required environment variables:
    ${!supabaseUrl ? '- VITE_SUPABASE_URL' : ''}
    ${!supabaseKey ? '- VITE_SUPABASE_ANON_KEY' : ''}
    
    Please check your .env file and ensure all required variables are set.
  `);
}

// 创建一个包装函数来处理环境变量缺失的情况
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseKey) {
    // 在生产环境中使用更友好的错误处理
    const error = new Error('Application configuration error');
    // 触发错误监控，但不暴露敏感信息
    console.error('Failed to initialize Supabase client: Missing configuration');
    throw error;
  }
  return createClient(supabaseUrl, supabaseKey);
};

export const supabase = createSupabaseClient();

export const userService = {
  async getProfile(userId: string) {
    // First try to get all profiles matching the user ID
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId);
    
    if (error) {
      return { data: null, error };
    }
    
    // If no profiles found
    if (!data || data.length === 0) {
      return { data: null, error: null };
    }
    
    // If multiple profiles found (shouldn't happen with proper constraints)
    if (data.length > 1) {
      console.warn(`Multiple profiles found for user ID: ${userId}. Using the first one.`);
    }
    
    // Return the first profile found
    return { data: data[0], error: null };
  }
};

export const serverService = {
  async listServers() {
    try {
      console.log('Listing servers...');
      const { data, error } = await supabase
        .from('servers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error listing servers:', error);
        return { data: null, error };
      }
      
      if (data) {
        // 转换字段名称从下划线命名法到驼峰命名法
        const convertedData = data.map(server => ({
          id: server.id,
          name: server.name,
          description: server.description,
          endpointUrl: server.endpoint_url,
          protocolVersion: server.protocol_version,
          ownerId: server.owner_id,
          tags: server.tags,
          documentation: server.documentation,
          status: server.status,
          metrics: server.metrics,
          createdAt: server.created_at,
          updatedAt: server.updated_at
        }));
        
        console.log('Converted server list data:', convertedData);
        return { data: convertedData, error: null };
      }
      
      return { data, error };
    } catch (e) {
      console.error('Exception when listing servers:', e);
      return { data: null, error: e };
    }
  },

  async getServer(id: string) {
    try {
      console.log('Fetching server with ID:', id);
      const { data, error } = await supabase
        .from('servers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching server:', error);
        return { data: null, error };
      }

      if (data) {
        // 转换字段名称从下划线命名法到驼峰命名法
        const convertedData = {
          id: data.id,
          name: data.name,
          description: data.description,
          endpointUrl: data.endpoint_url,
          protocolVersion: data.protocol_version,
          ownerId: data.owner_id,
          tags: data.tags,
          documentation: data.documentation,
          status: data.status,
          metrics: data.metrics,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
        
        console.log('Converted server data:', convertedData);
        return { data: convertedData, error: null };
      }
      
      return { data, error };
    } catch (e) {
      console.error('Exception when fetching server:', e);
      return { data: null, error: e };
    }
  },

  async createServer(server: Partial<IMcpServer>) {
    console.log('Creating server with data:', server);
    try {
      // 转换字段名称从驼峰命名法到下划线命名法
      const convertedData = {
        name: server.name,
        description: server.description,
        endpoint_url: server.endpointUrl,
        protocol_version: server.protocolVersion,
        owner_id: server.ownerId,
        tags: server.tags,
        documentation: server.documentation,
        status: server.status,
        metrics: server.metrics
      };
      
      console.log('Converted data for database:', convertedData);
      
      const { data, error } = await supabase
        .from('servers')
        .insert([convertedData])
        .select()
        .single();

      if (error) {
        console.error('Failed to create server:', error);
      }
      return { data, error };
    } catch (e) {
      console.error('Exception when creating server:', e);
      return { data: null, error: e };
    }
  },

  async updateServer(id: string, updates: Partial<IMcpServer>) {
    console.log('Updating server with ID:', id, 'and data:', updates);
    try {
      // 转换字段名称从驼峰命名法到下划线命名法
      const convertedData: Record<string, any> = {};
      
      if (updates.name !== undefined) convertedData.name = updates.name;
      if (updates.description !== undefined) convertedData.description = updates.description;
      if (updates.endpointUrl !== undefined) convertedData.endpoint_url = updates.endpointUrl;
      if (updates.protocolVersion !== undefined) convertedData.protocol_version = updates.protocolVersion;
      if (updates.ownerId !== undefined) convertedData.owner_id = updates.ownerId;
      if (updates.tags !== undefined) convertedData.tags = updates.tags;
      if (updates.documentation !== undefined) convertedData.documentation = updates.documentation;
      if (updates.status !== undefined) convertedData.status = updates.status;
      if (updates.metrics !== undefined) convertedData.metrics = updates.metrics;
      
      console.log('Converted data for database update:', convertedData);
      
      const { data, error } = await supabase
        .from('servers')
        .update(convertedData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Failed to update server:', error);
      }
      return { data, error };
    } catch (e) {
      console.error('Exception when updating server:', e);
      return { data: null, error: e };
    }
  },

  async deleteServer(id: string) {
    console.log('Deleting server with ID:', id);
    try {
      const { error } = await supabase
        .from('servers')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Failed to delete server:', error);
      }
      return { error };
    } catch (e) {
      console.error('Exception when deleting server:', e);
      return { error: e };
    }
  }
};
