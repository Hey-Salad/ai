import { useState } from 'react';
import { Play, Copy, Check } from 'lucide-react';

export default function Playground() {
  const [provider, setProvider] = useState('openai');
  const [model, setModel] = useState('gpt-4');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const providers = [
    { id: 'openai', name: 'OpenAI', models: ['gpt-4', 'gpt-3.5-turbo'] },
    { id: 'anthropic', name: 'Anthropic', models: ['claude-3-opus', 'claude-3-sonnet'] },
    { id: 'gemini', name: 'Gemini', models: ['gemini-pro', 'gemini-ultra'] }
  ];

  const handleRun = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setResponse(`Response from ${model}:\n\nThis is a simulated response to your prompt. In production, this would call the actual AI API and return the model's response.`);
      setLoading(false);
    }, 1500);
  };

  const copyResponse = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0 p-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold text-white">API Playground</h1>
        <p className="text-sm text-zinc-400 mt-1">Test AI models in real-time</p>
      </div>

      <div className="flex-1 overflow-hidden p-6">
        <div className="h-full max-w-5xl flex flex-col gap-4">
          {/* Controls */}
          <div className="flex-shrink-0 flex gap-4">
            <select
              value={provider}
              onChange={(e) => {
                setProvider(e.target.value);
                const newProvider = providers.find(p => p.id === e.target.value);
                if (newProvider) setModel(newProvider.models[0]);
              }}
              className="px-4 py-2 bg-[#1a1a1a] border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E01D1D]"
            >
              {providers.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="px-4 py-2 bg-[#1a1a1a] border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E01D1D]"
            >
              {providers.find(p => p.id === provider)?.models.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <button
              onClick={handleRun}
              disabled={!prompt.trim() || loading}
              className="ml-auto flex items-center gap-2 px-6 py-2 bg-[#E01D1D] hover:bg-[#c91919] text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4" />
              {loading ? 'Running...' : 'Run'}
            </button>
          </div>

          {/* Input/Output */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
            {/* Input */}
            <div className="flex flex-col min-h-0">
              <label className="text-sm font-semibold text-white mb-2">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here..."
                className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-zinc-800 rounded-lg text-white placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-[#E01D1D] focus:border-transparent"
              />
            </div>

            {/* Output */}
            <div className="flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-white">Response</label>
                {response && (
                  <button
                    onClick={copyResponse}
                    className="p-1 hover:bg-zinc-800 rounded transition-colors"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-zinc-400" />
                    )}
                  </button>
                )}
              </div>
              <div className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-zinc-800 rounded-lg overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="w-8 h-8 border-4 border-[#E01D1D] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : response ? (
                  <pre className="text-sm text-zinc-300 whitespace-pre-wrap">{response}</pre>
                ) : (
                  <p className="text-sm text-zinc-500">Response will appear here...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
