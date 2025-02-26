import { supabase } from '../supabaseClient';
import { Server, ServerUpdateInput } from '../types/server';

export const serverService = {
  async getServer(id: string) {
    const { data, error } = await supabase
      .from('mcp_servers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data: data as Server };
  },

  async updateServer(id: string, updates: ServerUpdateInput) {
    const { data, error } = await supabase
      .from('mcp_servers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: data as Server };
  },

  async listServers() {
    const { data, error } = await supabase
      .from('mcp_servers')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return { data: data as Server[] };
  }
};
