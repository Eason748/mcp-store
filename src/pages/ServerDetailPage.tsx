import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import MDEditor from '@uiw/react-md-editor';
import { serverService } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { IMcpServer } from '../types';
import { useTranslation } from 'react-i18next';

export const ServerDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [server, setServer] = useState<IMcpServer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState<Partial<IMcpServer>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    fetchServerDetails();
  }, [id]);

  useEffect(() => {
    if (server && user) {
      const ownershipStatus = server.ownerId === user.id;
      setIsOwner(ownershipStatus);
      console.log(`Ownership check: Server ownerId=${server.ownerId}, User id=${user.id}, isOwner=${ownershipStatus}`);
    }
  }, [server, user]);

  const fetchServerDetails = async () => {
    if (!id) {
      setError('Server ID is required');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const { data, error } = await serverService.getServer(id);
      
      if (error) {
        console.error('Error fetching server:', error);
        throw new Error((error as any).message || 'Failed to fetch server details');
      }

      if (!data) {
        throw new Error('Server not found');
      }

      setServer(data);
    } catch (err) {
      console.error('Error in fetchServerDetails:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch server details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (!server) return;
    setEditForm({
      name: server.name,
      description: server.description,
      endpointUrl: server.endpointUrl,
      protocolVersion: server.protocolVersion,
      documentation: server.documentation,
      status: server.status,
      tags: [...(server.tags || [])],
    });
    setIsEditing(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!editForm.name?.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!editForm.description?.trim()) {
      errors.description = 'Description is required';
    }
    
    if (editForm.endpointUrl && !isValidUrl(editForm.endpointUrl)) {
      errors.endpointUrl = 'Please enter a valid URL';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSave = async () => {
    if (!server || !id) return;
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSaving(true);
      const { error } = await serverService.updateServer(id, editForm);
      if (error) {
        throw error;
      }
      
      setServer(prev => prev ? { ...prev, ...editForm } : null);
      setIsEditing(false);
      setEditForm({});
      setFormErrors({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update server');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({});
    setFormErrors({});
  };

  const handleDelete = async () => {
    if (!server || !window.confirm('Are you sure you want to delete this server?')) {
      return;
    }

    try {
      setIsDeleting(true);
      const { error } = await serverService.deleteServer(server.id);
      if (error) {
        throw error;
      }
      navigate('/servers');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete server');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button
          onClick={() => navigate('/servers')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Back to Servers
        </button>
      </div>
    );
  }

  if (!server) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-gray-500 text-xl mb-4">Server not found</div>
        <button
          onClick={() => navigate('/servers')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Back to Servers
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm">
          {/* Top Bar */}
          <div className="px-6 py-4 border-b border-gray-100 bg-white rounded-t-xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <span className="font-medium">{server.protocolVersion || '1.0.0'}</span>
                </div>

                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                  server.status === 'active' ? 'bg-green-50 text-green-700' :
                  server.status === 'inactive' ? 'bg-gray-50 text-gray-600' :
                  'bg-red-50 text-red-700'
                }`}>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {server.status}
                </div>

                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  <span>Created {new Date(server.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="h-4 w-px bg-gray-200" />

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    <span className="font-medium">{server.metrics?.users || 0}</span>
                    <span>users</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                    <span className="font-medium">{server.metrics?.rating || 0}</span>
                    <span>rating</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                    </svg>
                    <span className="font-medium">{server.metrics?.uptime || 0}%</span>
                    <span>uptime</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                {isOwner && !isEditing && (
                  <>
                    <button onClick={handleEdit} 
                      className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors">
                      Edit
                    </button>
                    <button onClick={handleDelete} disabled={isDeleting} 
                      className="px-3 py-1.5 text-sm bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 hover:border-red-200 disabled:opacity-50 transition-colors">
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </>
                )}
                {isEditing && (
                  <>
                    <button onClick={handleCancel} 
                      className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleSave} disabled={isSaving}
                      className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-100 hover:border-blue-200 disabled:opacity-50 transition-colors">
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-6">
            {/* Title and Description */}
            <div className="space-y-2">
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className={`text-3xl font-bold border rounded-lg p-3 w-full bg-white ${formErrors.name ? 'border-red-500' : 'border-gray-200 focus:border-blue-300'} focus:outline-none focus:ring-2 focus:ring-blue-100 transition-shadow`}
                />
              ) : (
                <h1 className="text-3xl font-bold text-gray-900">{server.name}</h1>
              )}
              {isEditing ? (
                <textarea
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  className={`w-full text-gray-600 border rounded-lg p-3 text-sm bg-white ${formErrors.description ? 'border-red-500' : 'border-gray-200 focus:border-blue-300'} focus:outline-none focus:ring-2 focus:ring-blue-100 transition-shadow`}
                  rows={3}
                />
              ) : (
                <p className="text-gray-600 text-sm leading-relaxed">{server.description}</p>
              )}
            </div>

            {/* Endpoint URL and Tags */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <h2 className="text-sm font-medium text-gray-900">Endpoint URL</h2>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={editForm.endpointUrl || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, endpointUrl: e.target.value }))}
                      className={`w-full text-sm border rounded-lg p-3 font-mono bg-white ${formErrors.endpointUrl ? 'border-red-500' : 'border-gray-200 focus:border-blue-300'} focus:outline-none focus:ring-2 focus:ring-blue-100 transition-shadow`}
                      placeholder="https://..."
                    />
                    {formErrors.endpointUrl && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.endpointUrl}</p>
                    )}
                  </div>
                ) : (
                  <a href={server.endpointUrl} target="_blank" rel="noopener noreferrer" 
                    className="text-sm text-blue-600 hover:text-blue-700 break-all font-mono">
                    {server.endpointUrl || 'Not specified'}
                  </a>
                )}
              </div>

              <div className="space-y-2">
                <h2 className="text-sm font-medium text-gray-900">Tags</h2>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <div className="w-full border border-gray-200 rounded-lg bg-white focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-shadow">
                      <div className="flex flex-wrap items-center gap-2 p-2">
                        {(editForm.tags || []).map((tag) => (
                          <span 
                            key={tag}
                            className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-sm flex items-center gap-1"
                          >
                            {tag}
                            <button
                              onClick={() => {
                                setEditForm(prev => ({
                                  ...prev,
                                  tags: prev.tags?.filter(t => t !== tag) || []
                                }));
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                        <input
                          type="text"
                          placeholder="Add a tag and press Enter"
                          className="flex-1 min-w-[120px] text-sm bg-transparent border-none focus:outline-none p-1"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const input = e.currentTarget;
                              const newTag = input.value.trim();
                              if (newTag && !editForm.tags?.includes(newTag)) {
                                setEditForm(prev => ({
                                  ...prev,
                                  tags: [...(prev.tags || []), newTag]
                                }));
                                input.value = '';
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {(server.tags || []).map((tag) => (
                        <span 
                          key={tag}
                          className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                      {!(server.tags || []).length && (
                        <span className="text-sm text-gray-500">No tags</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Documentation */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-medium text-gray-900">Documentation</h2>
                {!isEditing && <div className="h-px flex-1 bg-gray-100 ml-4" />}
              </div>
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                {isEditing ? (
                  <div data-color-mode="light">
                    <MDEditor
                      value={editForm.documentation || ''}
                      onChange={(value) => setEditForm(prev => ({ ...prev, documentation: value || '' }))}
                      preview="edit"
                      height={500}
                    />
                  </div>
                ) : (
                  <div data-color-mode="light" className="p-8 min-h-[600px] prose max-w-none">
                    <MDEditor.Markdown source={server.documentation || 'No documentation available'} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
