import { Book, Code, Zap, Shield } from 'lucide-react';

export default function Documentation() {
  const sections = [
    {
      title: 'Quick Start',
      icon: Zap,
      items: [
        { name: 'Installation', desc: 'Get started with HeySalad AI SDK' },
        { name: 'Authentication', desc: 'Configure your API keys' },
        { name: 'First Request', desc: 'Make your first API call' }
      ]
    },
    {
      title: 'API Reference',
      icon: Code,
      items: [
        { name: 'Chat Completions', desc: 'Generate text with AI models' },
        { name: 'Streaming', desc: 'Real-time response streaming' },
        { name: 'Error Handling', desc: 'Handle errors gracefully' }
      ]
    },
    {
      title: 'Guides',
      icon: Book,
      items: [
        { name: 'Best Practices', desc: 'Optimize your API usage' },
        { name: 'Rate Limiting', desc: 'Understand rate limits' },
        { name: 'Cost Optimization', desc: 'Reduce API costs' }
      ]
    },
    {
      title: 'Security',
      icon: Shield,
      items: [
        { name: 'API Key Management', desc: 'Secure your keys' },
        { name: 'Access Control', desc: 'Manage permissions' },
        { name: 'Compliance', desc: 'Data privacy and compliance' }
      ]
    }
  ];

  const codeExample = `import { createClient } from '@heysalad/ai';

const client = createClient();

// Configure providers
client.configureProvider('openai', { 
  apiKey: process.env.OPENAI_API_KEY 
});

// Make a request
const response = await client.chat({
  messages: [{ role: 'user', content: 'Hello!' }],
  model: 'gpt-4'
}, 'openai');

console.log(response.content);`;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0 p-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold text-white">Documentation</h1>
        <p className="text-sm text-zinc-400 mt-1">API reference and guides</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl space-y-6">
          {/* Quick Example */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-zinc-800">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Example</h2>
            <pre className="bg-[#0a0a0a] rounded-lg p-4 overflow-x-auto">
              <code className="text-sm text-zinc-300">{codeExample}</code>
            </pre>
          </div>

          {/* Documentation Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.map((section) => (
              <div key={section.title} className="bg-[#1a1a1a] rounded-lg p-6 border border-zinc-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#E01D1D]/10 rounded-lg flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-[#E01D1D]" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                </div>
                <div className="space-y-3">
                  {section.items.map((item) => (
                    <button
                      key={item.name}
                      className="w-full text-left p-3 bg-[#0a0a0a] hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                      <p className="text-sm font-semibold text-white">{item.name}</p>
                      <p className="text-xs text-zinc-400 mt-1">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
