import { useState } from 'react';
import { Check, X } from 'lucide-react';

interface Provider {
  id: string;
  name: string;
  logo: string;
  description: string;
  configured: boolean;
  apiKey?: string;
}

export default function Providers() {
  const [providers, setProviders] = useState<Provider[]>([
    {
      id: 'openai',
      name: 'OpenAI',
      logo: '🤖',
      description: 'GPT-4, GPT-3.5, and DALL-E models',
      configured: true,
      apiKey: 'sk-...xyz789'
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      logo: '🧠',
      description: 'Claude 3 Opus, Sonnet, and Haiku',
      configured: true,
      apiKey: 'sk-ant-...abc123'
    },
    {
      id: 'gemini',
      name: 'Google Gemini',
      logo: '✨',
      description: 'Gemini Pro and Ultra models',
      configured: false
    },
    {
      id: 'huggingface',
      name: 'HuggingFace',
      logo: '🤗',
      description: 'Open-source models and inference',
      configured: false
    }
  ]);

  const [editingProvider, setEditingProvider] = useState<string | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');

  const saveProvider = (providerId: string) => {
    setProviders(providers.map(p => 
      p.id === providerId 
        ? { ...p, configured: true, apiKey: apiKeyInput.substring(0, 10) + '...' }
        : p
    ));
    setEditingProvider(null);
    setApiKeyInput('');
  };

  const removeProvider = (providerId: string) => {
    setProviders(providers.map(p => 
      p.id === providerId 
        ? { ...p, configured: false, apiKey: undefined }
        : p
    ));
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold text-white">AI Providers</h1>
        <p className="text-sm text-zinc-400 mt-1">Configure your AI provider API keys</p>
      </div>

      {/* Providers Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="bg-[#1a1a1a] rounded-lg p-6 border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{provider.logo}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{provider.name}</h3>
                    <p className="text-sm text-zinc-400">{provider.description}</p>
                  </div>
                </div>
                {provider.configured && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-900/30 text-green-400 text-xs font-medium rounded">
                    <Check className="w-3 h-3" />
                    Active
                  </div>
                )}
              </div>

              {editingProvider === provider.id ? (
                <div className="space-y-3">
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="Enter API key"
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-zinc-700 rounded-lg text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#E01D1D] focus:border-transparent"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingProvider(null);
                        setApiKeyInput('');
                      }}
                      className="flex-1 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveProvider(provider.id)}
                      disabled={!apiKeyInput.trim()}
                      className="flex-1 px-3 py-2 bg-[#E01D1D] hover:bg-[#c91919] text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {provider.configured && provider.apiKey && (
                    <div className="px-3 py-2 bg-[#0a0a0a] rounded-lg">
                      <code className="text-xs text-zinc-400 font-mono">{provider.apiKey}</code>
                    </div>
                  )}
                  <div className="flex gap-2">
                    {provider.configured ? (
                      <>
                        <button
                          onClick={() => {
                            setEditingProvider(provider.id);
                            setApiKeyInput('');
                          }}
                          className="flex-1 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-semibold transition-colors"
                        >
                          Update Key
                        </button>
                        <button
                          onClick={() => removeProvider(provider.id)}
                          className="px-3 py-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded-lg text-sm font-semibold transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEditingProvider(provider.id)}
                        className="w-full px-3 py-2 bg-[#E01D1D] hover:bg-[#c91919] text-white rounded-lg text-sm font-semibold transition-colors"
                      >
                        Configure
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
