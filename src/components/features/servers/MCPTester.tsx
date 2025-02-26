import React, { useState } from 'react';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import { useTranslation } from 'react-i18next';
import { Server } from '../../../types/server';

interface MCPTesterProps {
  server: Server;
}

interface TestResult {
  success: boolean;
  response?: any;
  error?: string;
  duration?: number;
}

export const MCPTester: React.FC<MCPTesterProps> = ({ server }) => {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);

  const handleTest = async () => {
    setLoading(true);
    setResult(null);
    const startTime = Date.now();

    try {
      const response = await fetch(server.endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: input,
        }),
      });

      const data = await response.json();
      const duration = Date.now() - startTime;

      if (!response.ok) {
        throw new Error(data.error || 'Failed to test MCP');
      }

      setResult({
        success: true,
        response: data,
        duration,
      });
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        duration: Date.now() - startTime,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200">
          <h3 className="text-sm font-medium text-neutral-900">
            {t('servers.tester.title')}
          </h3>
          <p className="mt-1 text-sm text-neutral-600">
            {t('servers.tester.description')}
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Input Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-700">
              {t('servers.tester.input')}
            </label>
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('servers.tester.inputPlaceholder')}
                className="flex-1"
              />
              <Button
                variant="primary"
                onClick={handleTest}
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
              >
                {loading ? t('servers.tester.testing') : t('servers.tester.test')}
              </Button>
            </div>
          </div>

          {/* Results Section */}
          {result && (
            <div className={`mt-4 rounded-xl border ${result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'} p-4`}>
              <div className="flex items-start">
                <div className={`mr-3 ${result.success ? 'text-green-500' : 'text-red-500'}`}>
                  {result.success ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                    {result.success ? t('servers.tester.success') : t('servers.tester.error')}
                  </h4>
                  <div className="mt-2 space-y-2">
                    {result.success ? (
                      <pre className="text-sm text-green-700 bg-green-100 rounded-lg p-3 overflow-auto">
                        {JSON.stringify(result.response, null, 2)}
                      </pre>
                    ) : (
                      <p className="text-sm text-red-700">{result.error}</p>
                    )}
                    <p className="text-xs text-neutral-500">
                      {t('servers.tester.duration', { duration: result.duration })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
