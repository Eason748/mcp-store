import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { IMcpServer } from '../../../types';

interface IServerCardProps {
  server: IMcpServer;
}

export const ServerCard: React.FC<IServerCardProps> = ({ server }) => {
  const { t } = useTranslation();

  const statusColors = {
    active: 'bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 text-emerald-700',
    inactive: 'bg-gradient-to-r from-amber-500/10 to-amber-500/5 text-amber-700',
    deprecated: 'bg-gradient-to-r from-red-500/10 to-red-500/5 text-red-700',
  };

  const formatDate = (date: string | Date) => {
    return new Intl.DateTimeFormat('default', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(typeof date === 'string' ? new Date(date) : date);
  };

  return (
    <Link
      to={`/servers/${server.id}`}
      className="group relative block bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-neutral-100"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary-100/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-3">
              <h3 className="text-xl font-semibold text-neutral-800 group-hover:text-primary-600 transition-colors">
                {server.name}
              </h3>
              <div className="flex items-center">
                <div className="flex items-center px-3 py-1 rounded-lg bg-amber-50">
                  <svg
                    className="w-4 h-4 text-amber-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 font-medium text-amber-700">
                    {server.metrics.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium ${
                  statusColors[server.status]
                }`}
              >
                {t(`servers.statusTypes.${server.status}`, {
                  defaultValue: server.status
                })}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-neutral-600">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a.5.5 0 01-.285.63l-15 5a.5.5 0 01-.285-.63l3.5-10.5a.5.5 0 01.63-.285L6.5 4.923V3a1 1 0 00-1-1h4zM7.5 7.827L4.875 15.5l8.25-2.75-2.375-7.373L7.5 7.827z" clipRule="evenodd" />
                </svg>
                {server.protocolVersion || '1.0.0'}
              </span>
            </div>
          </div>
        </div>

        <p className="text-neutral-600 text-sm leading-relaxed line-clamp-2 mb-4 group-hover:text-neutral-700">
          {server.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {server.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-100/80 text-neutral-700 group-hover:bg-primary-100/50 group-hover:text-primary-800 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center text-neutral-600 group-hover:text-primary-600 transition-colors">
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              {server.metrics.users}
            </div>
            <div className="flex items-center text-neutral-600 group-hover:text-primary-600 transition-colors">
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {formatDate(server.updatedAt)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
