import React, { useState, useEffect } from 'react';
import { Settings, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { getCurrentApiUrl, updateApiUrl } from '../config/api';
import { ApiService } from '../services/api';

interface ApiDebuggerProps {
  isVisible: boolean;
  onToggle: () => void;
}

export const ApiDebugger: React.FC<ApiDebuggerProps> = ({ isVisible, onToggle }) => {
  const [apiUrl, setApiUrl] = useState(getCurrentApiUrl());
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [lastTestResult, setLastTestResult] = useState<string>('');

  const testConnection = async () => {
    setIsTesting(true);
    setLastTestResult('');
    
    try {
      const isHealthy = await ApiService.checkHealth();
      setIsConnected(isHealthy);
      setLastTestResult(isHealthy ? '✅ Connection successful!' : '❌ Connection failed');
    } catch (error) {
      setIsConnected(false);
      setLastTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsTesting(false);
    }
  };

  const updateUrl = () => {
    updateApiUrl(apiUrl);
    setLastTestResult('🔧 API URL updated. Test connection to verify.');
  };

  useEffect(() => {
    if (isVisible) {
      testConnection();
    }
  }, [isVisible]);

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
        title="API Debugger"
      >
        <Settings size={20} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-xl p-4 w-80 max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">API Debugger</h3>
        <button
          onClick={onToggle}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      <div className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center gap-2">
          {isConnected === null ? (
            <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
          ) : isConnected ? (
            <Wifi size={16} className="text-green-500" />
          ) : (
            <WifiOff size={16} className="text-red-500" />
          )}
          <span className="text-sm font-medium">
            {isConnected === null ? 'Unknown' : isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {/* API URL Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API URL
          </label>
          <input
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="http://localhost:3001/api"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={updateUrl}
            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
          >
            Update URL
          </button>
          <button
            onClick={testConnection}
            disabled={isTesting}
            className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md text-sm hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
          >
            {isTesting ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              'Test'
            )}
          </button>
        </div>

        {/* Test Result */}
        {lastTestResult && (
          <div className="text-sm p-2 bg-gray-100 rounded-md">
            {lastTestResult}
          </div>
        )}

        {/* Help Text */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• For Cursor port forwarding, the backend URL should be similar to the frontend URL but with port 3001</p>
          <p>• Example: If frontend is <code>vkgx2916-5173.asse.devtunnels.ms</code>, backend should be <code>vkgx2916-3001.asse.devtunnels.ms</code></p>
        </div>
      </div>
    </div>
  );
}; 