import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ServerList } from '../components/features/servers/ServerList';
import { serverService } from '../services/supabase';
import type { IMcpServer, IServerListFilters } from '../types';
import { Card } from '../components/common/Card';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { Button } from '../components/common/Button';

export const HomePage: React.FC = () => {
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
        // Sort by rating and get top 6 servers
        const featuredServers = [...data]
          .sort((a, b) => b.metrics.rating - a.metrics.rating)
          .slice(0, 6);
        setServers(featuredServers);
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
    // Since this is just featured servers, we'll only sort them
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
    setServers(sortedServers);
  };

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="text-center py-12">
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-radial from-primary-200/50 to-transparent rounded-full blur-xl"></div>
            <div className="w-32 h-32 bg-gradient-radial from-secondary-200/50 to-transparent rounded-full blur-xl -translate-x-10 translate-y-10"></div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-700 to-secondary-700 bg-clip-text text-transparent relative">
            {t('home.welcome')}
          </h1>
        </div>
        <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          {t('home.subtitle')}
          <br />
          {t('home.browse')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card variant="glass" className="p-6 text-center">
          <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">{t('home.discover.title')}</h3>
          <p className="text-neutral-600 text-sm">
            {t('home.discover.description')}
          </p>
        </Card>
        
        <Card variant="glass" className="p-6 text-center">
          <div className="w-12 h-12 bg-secondary-100 text-secondary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">{t('home.integrate.title')}</h3>
          <p className="text-neutral-600 text-sm">
            {t('home.integrate.description')}
          </p>
        </Card>
        
        <Card variant="glass" className="p-6 text-center">
          <div className="w-12 h-12 bg-accent-100 text-accent-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">{t('home.contribute.title')}</h3>
          <p className="text-neutral-600 text-sm">
            {t('home.contribute.description')}
          </p>
        </Card>
      </div>

      <Card variant="elevated" className="p-8 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900">
              {t('home.featuredServers')}
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              {t('common.showingResults', { count: servers.length })}
            </p>
          </div>
          <Link to="/servers">
            <Button variant="outline">
              {t('common.viewAll')}
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </Link>
        </div>
        <ErrorBoundary>
        <ServerList
          servers={servers}
            isLoading={isLoading}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </ErrorBoundary>
      </Card>
    </div>
  );
};
