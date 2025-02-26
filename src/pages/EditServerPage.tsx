import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { serverService } from '../services/supabase';
import type { IMcpServer } from '../types';
import MDEditor from '@uiw/react-md-editor';
import { fetchGitHubReadme } from '../utils/github';

export const EditServerPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [server, setServer] = useState<IMcpServer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingReadme, setIsLoadingReadme] = useState(false);
  const [readmeSuccess, setReadmeSuccess] = useState(false);
  const previousUrlRef = useRef('');
  const [error, setError] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    fetchServerDetails();
  }, [id]);

  const fetchServerDetails = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const { data, error } = await serverService.getServer(id);
      
      if (error) {
        throw error;
      }

      setServer(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch server details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchReadme = async () => {
      if (!server) return;
      
      // 只有当 URL 发生变化且不为空时才获取 README
      if (server.endpointUrl && server.endpointUrl !== previousUrlRef.current) {
        try {
          setIsLoadingReadme(true);
          setReadmeSuccess(false);
          console.log('Fetching README from:', server.endpointUrl);
          const readme = await fetchGitHubReadme(server.endpointUrl);
          if (readme) {
            setServer(prev => prev ? { ...prev, documentation: readme || '' } : null);
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
          previousUrlRef.current = server.endpointUrl;
        }
      }
    };
    fetchReadme();
  }, [server?.endpointUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!server || !id) return;

    try {
      setIsSaving(true);
      
      // 确保所有必填字段都已设置
      const updatedServer: Partial<IMcpServer> = {
        name: server.name,
        description: server.description,
        endpointUrl: server.endpointUrl || 'https://github.com/placeholder/repo',
        protocolVersion: server.protocolVersion,
        documentation: server.documentation,
        status: server.status
      };
      
      console.log('Updating server with data:', updatedServer);
      const { error } = await serverService.updateServer(id, updatedServer);
      
      if (error) {
        console.error('Server update error:', error);
        throw error;
      }
      
      navigate(`/servers/${id}`);
    } catch (err) {
      console.error('Failed to update server:', err);
      setError(err instanceof Error ? err.message : 'Failed to update server');
      setIsSaving(false);
    }
  };

  const handleGitHubUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!server) return;
    const newUrl = e.target.value;
    setServer({ ...server, endpointUrl: newUrl });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-gray-600">Please wait while we fetch the server details.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Card>
          <div className="text-red-600">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!server) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Card>
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Server Not Found</h2>
            <p className="text-gray-600">The requested server could not be found.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            {/* 标题和基本信息部分 */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex-1">
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                  {t('servers.name')}
                </label>
                <Input
                  id="name"
                  type="text"
                  value={server.name}
                  onChange={(e) => setServer({ ...server, name: e.target.value })}
                  required
                  className="w-full"
                />
              </div>
              
              <div className="flex gap-4">
                <div>
                  <label htmlFor="protocolVersion" className="block text-sm font-medium text-neutral-700 mb-1">
                    Protocol Version
                  </label>
                  <Input
                    id="protocolVersion"
                    type="text"
                    value={server.protocolVersion || '1.0.0'}
                    onChange={(e) => setServer({ ...server, protocolVersion: e.target.value })}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-neutral-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    value={server.status || 'active'}
                    onChange={(e) => setServer({ ...server, status: e.target.value as IMcpServer['status'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="deprecated">Deprecated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 主要内容区域 - 两列布局 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 左侧列 - 基本信息 */}
              <div className="space-y-6">
                {/* Endpoint URL */}
                <div>
                  <label htmlFor="endpointUrl" className="block text-sm font-medium text-neutral-700 mb-1">
                    Endpoint URL
                  </label>
                  <Input
                    id="endpointUrl"
                    type="url"
                    value={server.endpointUrl || ''}
                    onChange={handleGitHubUrlChange}
                    placeholder="https://github.com/username/repo"
                    className="w-full"
                  />
                </div>

                {/* 描述部分 */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
                    {t('servers.description')}
                  </label>
                  <textarea
                    id="description"
                    value={server.description}
                    onChange={(e) => setServer({ ...server, description: e.target.value })}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    rows={5}
                  />
                </div>

                {/* 标签部分 */}
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-neutral-700 mb-1">
                    Tags
                  </label>
                  <div className="mb-2">
                    {server.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800 mr-2 mb-2">
                        {tag}
                        <button
                          type="button"
                          onClick={() => setServer({ 
                            ...server, 
                            tags: server.tags.filter(t => t !== tag) 
                          })}
                          className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                        >
                          <span className="sr-only">Remove tag {tag}</span>
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex">
                    <Input
                      id="tags-input"
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newTag.trim()) {
                            setServer({
                              ...server,
                              tags: [...new Set([...server.tags, newTag.trim()])]
                            });
                            setNewTag('');
                          }
                        }
                      }}
                      placeholder="Add a tag"
                      className="flex-1 rounded-r-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newTag.trim()) {
                          setServer({
                            ...server,
                            tags: [...new Set([...server.tags, newTag.trim()])]
                          });
                          setNewTag('');
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* 右侧列 - 额外信息 */}
              <div className="space-y-6">
                {/* 这里可以放置其他编辑字段或帮助信息 */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-medium text-blue-900 mb-2">提示</h3>
                  <ul className="text-sm text-blue-700 space-y-2">
                    <li>• 确保填写正确的 GitHub 仓库地址，系统会自动获取 README 作为文档</li>
                    <li>• 添加相关标签可以帮助其他用户更容易找到您的服务器</li>
                    <li>• 详细的描述和文档将帮助用户理解您的服务器功能</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 文档部分 - 占据全宽 */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center">
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
              <div data-color-mode="light" className="border border-gray-300 rounded-md overflow-hidden">
                <MDEditor
                  value={server.documentation}
                  onChange={(value) => setServer({ ...server, documentation: value || '' })}
                  preview="edit"
                  height={400}
                />
              </div>
            </div>

            {/* 按钮部分 */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/servers/${id}`)}
                disabled={isSaving}
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSaving}
              >
                {isSaving ? t('common.saving') : t('common.save')}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};
