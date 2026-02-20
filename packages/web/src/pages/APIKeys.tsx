import { useState } from 'react';
import { Key, Plus, Copy, Eye, EyeOff, Trash2, Check } from 'lucide-react';

interface APIKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  requests: number;
}

export default function APIKeys() {
  const [keys, setKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Production API',
      key: 'hsal_prod_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      created: '2026-02-15',
      lastUsed: '2 hours ago',
      requests: 15420
    },
    {
      id: '2',
      name: 'Development API',
      key: 'sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      created: '2026-02-10',
      lastUsed: '5 minutes ago',
      requests: 8932
    }
  ]);

  const [showKey, setShowKey] = useState<{ [key: string]: boolean }>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');

  const toggleKeyVisibility = (keyId: string) => {
    setShowKey(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const copyToClipboard = (keyId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const deleteKey = (keyId: string) => {
    if (confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      setKeys(keys.filter(k => k.id !== keyId));
    }
  };

  const createKey = () => {
    if (!newKeyName.trim()) return;
    
    const newKey: APIKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      requests: 0
    };
    
    setKeys([...keys, newKey]);
    setNewKeyName('');
    setShowCreateModal(false);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-white">API Keys</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage your API keys and access tokens</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#E01D1D] hover:bg-[#c91919] text-white rounded-lg font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Key
        </button>
      </div>

      {/* Keys List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4 max-w-5xl">
          {keys.map((apiKey) => (
            <div
              key={apiKey.id}
              className="bg-[#1a1a1a] rounded-lg p-4 border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#E01D1D]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Key className="w-5 h-5 text-[#E01D1D]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold">{apiKey.name}</h3>
                      <p className="text-xs text-zinc-500">Created {apiKey.created}</p>
                    </div>
                    <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs font-medium rounded flex-shrink-0">
                      Active
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <code className="flex-1 text-sm text-zinc-400 font-mono bg-[#0a0a0a] px-3 py-2 rounded overflow-x-auto">
                      {showKey[apiKey.id] ? apiKey.key : '•'.repeat(50)}
                    </code>
                    <button
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                      className="p-2 hover:bg-zinc-800 rounded transition-colors flex-shrink-0"
                      title={showKey[apiKey.id] ? 'Hide' : 'Show'}
                    >
                      {showKey[apiKey.id] ? (
                        <EyeOff className="w-4 h-4 text-zinc-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-zinc-400" />
                      )}
                    </button>
                    <button
                      onClick={() => copyToClipboard(apiKey.id, apiKey.key)}
                      className="p-2 hover:bg-zinc-800 rounded transition-colors flex-shrink-0"
                      title="Copy"
                    >
                      {copiedKey === apiKey.id ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-zinc-400" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span>Last used: {apiKey.lastUsed}</span>
                    <span>•</span>
                    <span>{apiKey.requests.toLocaleString()} requests</span>
                  </div>
                </div>

                <button
                  onClick={() => deleteKey(apiKey.id)}
                  className="p-2 hover:bg-red-900/20 text-zinc-400 hover:text-red-400 rounded transition-colors flex-shrink-0"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-xl border border-zinc-800 max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-white mb-4">Create API Key</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Key Name
              </label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., Production API"
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#E01D1D] focus:border-transparent"
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createKey}
                disabled={!newKeyName.trim()}
                className="flex-1 px-4 py-2 bg-[#E01D1D] hover:bg-[#c91919] text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
