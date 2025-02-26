import React from 'react';
import { useTranslation } from 'react-i18next';
import { ServerCard } from './ServerCard';
import type { IMcpServer, IServerListFilters } from '../../../types';

interface IServerListProps {
  servers: IMcpServer[];
  isLoading: boolean;
  filters?: IServerListFilters;
  onFilterChange?: (filters: IServerListFilters) => void;
}

export const ServerList: React.FC<IServerListProps> = ({
  servers,
  isLoading,
  filters,
  onFilterChange,
}) => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-64"
          >
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
            <div className="mt-6 flex gap-2">
              {[...Array(3)].map((_, j) => (
                <div
                  key={j}
                  className="h-6 bg-gray-200 rounded-full w-16"
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (servers.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          {t('servers.noServers')}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {t('servers.noServersDesc')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      {filters && onFilterChange && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-200">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder={t('servers.searchPlaceholder')}
                className="w-full px-4 py-2 pl-10 bg-white rounded-lg border border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <svg className="w-5 h-5 absolute left-3 top-2.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  className="appearance-none pl-8 pr-10 py-2 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={filters.status}
                  onChange={(e) => onFilterChange({ ...filters, status: e.target.value as IMcpServer['status'] })}
                >
                  <option value="">{t('servers.filters.allStatus')}</option>
                  <option value="active">{t('servers.filters.active')}</option>
                  <option value="inactive">{t('servers.filters.inactive')}</option>
                  <option value="deprecated">{t('servers.filters.deprecated')}</option>
                </select>
                <svg className="w-4 h-4 absolute left-2.5 top-3 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="relative">
                <select
                  className="appearance-none pl-8 pr-10 py-2 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={filters.sortBy}
                  onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as IServerListFilters['sortBy'] })}
                >
                  <option value="rating">{t('servers.filters.sortBy.rating')}</option>
                  <option value="users">{t('servers.filters.sortBy.users')}</option>
                  <option value="created">{t('servers.filters.sortBy.created')}</option>
                  <option value="updated">{t('servers.filters.sortBy.updated')}</option>
                </select>
                <svg className="w-4 h-4 absolute left-2.5 top-3 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-1 bg-neutral-100 rounded-lg ml-auto">
              <button
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-neutral-600 hover:text-neutral-900'}`}
                onClick={() => setViewMode('grid')}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-neutral-600 hover:text-neutral-900'}`}
                onClick={() => setViewMode('list')}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`
        ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}
        animate-fade-in
      `}>
        {servers.map((server) => (
          <ServerCard key={server.id} server={server} />
        ))}
      </div>
    </div>
  );
};
