import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ServerList } from '../components/features/servers/ServerList';
import { serverService } from '../services/supabase';
import type { IMcpServer, IServerListFilters } from '../types';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

export const ServersPage: React.FC = () => {
  const { t } = useTranslation();
  const [servers, setServers] = useState<IMcpServer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<IServerListFilters>({
    sortBy: 'rating',
    sortOrder: 'desc',
  });

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await serverService.listServers();
      if (error) throw error;
      
      if (Array.isArray(data)) {
        setServers(data);
      } else {
        setServers([]);
      }
    } catch (error) {
      console.error('Failed to fetch servers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: IServerListFilters) => {
    setFilters(newFilters);
    // In a real application, we would make a new API call with the filters
    // For now, we'll just sort the existing data client-side
    const sortedServers = [...servers].sort((a, b) => {
      if (newFilters.sortBy === 'rating') {
        return b.metrics.rating - a.metrics.rating;
      }
      if (newFilters.sortBy === 'users') {
        return b.metrics.users - a.metrics.users;
      }
      if (newFilters.sortBy === 'created') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (newFilters.sortBy === 'updated') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      return 0;
    });

    if (newFilters.status) {
      const filteredServers = sortedServers.filter(
        server => server.status === newFilters.status
      );
      setServers(filteredServers);
    } else {
      setServers(sortedServers);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            {t('servers.title')}
          </h1>
          <p className="text-neutral-600 mt-1">
            {t('servers.description')}
          </p>
        </div>
        <div className="text-sm text-neutral-500">
          {t('common.showingResults', { count: servers.length })}
        </div>
      </div>

      <ErrorBoundary>
        <ServerList
          servers={servers}
          isLoading={isLoading}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </ErrorBoundary>
    </div>
  );
};
