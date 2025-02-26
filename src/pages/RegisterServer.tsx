import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { serverService } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';
import MDEditor from '@uiw/react-md-editor';
import { fetchGitHubReadme } from '../utils/github';

export const RegisterServer: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingReadme, setIsLoadingReadme] = useState(false);
  const [readmeSuccess, setReadmeSuccess] = useState(false);
  const previousUrlRef = useRef('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    endpointUrl: '',
    protocolVersion: '1.0.0',
    tags: ['mcp'],
    documentation: '',
  });

  useEffect(() => {
    const fetchReadme = async () => {
      // 只有当 URL 发生变化且不为空时才获取 README
      if (formData.endpointUrl && formData.endpointUrl !== previousUrlRef.current) {
        try {
          setIsLoadingReadme(true);
          setReadmeSuccess(false);
          console.log('Fetching README from:', formData.endpointUrl);
          const readme = await fetchGitHubReadme(formData.endpointUrl);
          if (readme) {
            setFormData(prev => ({ ...prev, documentation: readme || '' }));
            console.log('README fetched successfully');
            setReadmeSuccess(true);
            // 5秒后自动隐藏成功消息
            setTimeout(() => setReadmeSuccess(false), 5000);
          } else {
            console.log('No README found or failed to fetch');
          }
        } catch (err) {
          console.error('Error fetching README:', err);
        } finally {
          setIsLoadingReadme(false);
          previousUrlRef.current = formData.endpointUrl;
        }
      }
    };
    fetchReadme();
  }, [formData.endpointUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('用户未登录，请先登录');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // 确保所有必填字段都已设置
      const serverData: Partial<IMcpServer> = {
        name: formData.name,
        description: formData.description,
        endpointUrl: formData.endpointUrl || 'https://github.com/placeholder/repo',
        protocolVersion: formData.protocolVersion,
        ownerId: user.id,
        tags: formData.tags,
        documentation: formData.documentation,
        status: 'active' as const,
        metrics: {
          users: 0,
          rating: 0,
          uptime: 100,
        }
      };
      
      console.log('Submitting server data:', serverData);
      const { error } = await serverService.createServer(serverData);

      if (error) {
        console.error('Server registration error:', error);
        throw error;
      }
      navigate('/servers');
    } catch (err) {
      console.error('Failed to register server:', err);
      setError(err instanceof Error ? err.message : 'Failed to register server');
      setIsSubmitting(false);
    }
  };

  const handleGitHubUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setFormData(prev => ({ ...prev, endpointUrl: newUrl }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          {t('servers.add')}
        </h1>
        <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
          Register your MCP server to share with the community.
        </p>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden backdrop-blur-sm">
        <form onSubmit={handleSubmit}>
          {/* Basic Info Section */}
          <div className="px-8 py-6 bg-gradient-to-r from-primary-500/5 via-secondary-500/5 to-primary-500/5 border-b border-neutral-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
                  {t('servers.name')}
                </label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-10"
                  placeholder="Enter your server name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="endpointUrl" className="block text-sm font-medium text-neutral-700">
                  GitHub URL
                </label>
                <Input
                  id="endpointUrl"
                  type="url"
                  value={formData.endpointUrl}
                  onChange={handleGitHubUrlChange}
                  required
                  className="h-10"
                  placeholder="https://github.com/username/repo"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-neutral-700">
                  {t('servers.description')}
                </label>
                <Input
                  id="description"
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="h-10"
                  placeholder="Brief description of your server"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="protocolVersion" className="block text-sm font-medium text-neutral-700">
                  Protocol Version
                </label>
                <div className="relative">
                  <Input
                    id="protocolVersion"
                    type="text"
                    value={formData.protocolVersion}
                    onChange={(e) => setFormData({ ...formData, protocolVersion: e.target.value })}
                    required
                    className="h-10 bg-neutral-50 text-neutral-600 pr-10"
                    readOnly
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="px-8 py-3 bg-red-50 border-b border-red-200 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-red-700">{error}</span>
            </div>
          )}

          {/* Documentation Section */}
          <div className="px-8 py-6">
            <div className="space-y-3">
              <label htmlFor="documentation" className="block text-sm font-medium text-neutral-700 flex items-center">
                Documentation
                {isLoadingReadme && (
                  <span className="ml-2 inline-flex items-center text-xs text-primary-500">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    正在从 GitHub 获取 README...
                  </span>
                )}
                {readmeSuccess && (
                  <span className="ml-2 inline-flex items-center text-xs text-green-500">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    README 已成功获取
                  </span>
                )}
              </label>
              <div data-color-mode="light" className="rounded-xl border border-neutral-200 overflow-hidden">
                <MDEditor
                  value={formData.documentation}
                  onChange={(value) => setFormData({ ...formData, documentation: value || '' })}
                  preview="edit"
                  hideToolbar={false}
                  height={600}
                  className="min-h-[600px]"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="px-8 py-6 bg-neutral-50 border-t border-neutral-100">
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="h-11 px-8 min-w-[120px] bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t('common.submitting', '提交中...')}
                  </div>
                ) : (
                  t('common.submit')
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
