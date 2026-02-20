import { useState } from 'react';
import { 
  Key,
  Zap,
  BarChart3,
  Code
} from 'lucide-react';
import LoginModal from '../components/LoginModal';

export default function LandingPageSimple() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <>
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="bg-black backdrop-blur sticky top-0 z-50 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/heysalad-white-logo.svg" 
                alt="HeySalad" 
                className="h-12"
              />
            </div>
            
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-5 py-2 bg-[#E01D1D] hover:bg-[#c91919] text-white rounded-md font-medium transition-all duration-200 text-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold mb-6">
              AI API Platform
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Unified API for OpenAI, Anthropic, Gemini, and more. 
              One interface, multiple providers, infinite possibilities.
            </p>
            <div className="flex gap-4 justify-center mt-8">
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-8 py-3 bg-[#E01D1D] hover:bg-[#c91919] text-white rounded-lg font-semibold transition-all duration-200"
              >
                Start Building
              </button>
              <button className="px-8 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg font-semibold transition-all duration-200 border border-zinc-700">
                View Docs
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="p-6 bg-zinc-900/50 backdrop-blur rounded-lg border border-zinc-800 hover:border-[#E01D1D]/30 transition-all duration-300">
              <div className="w-12 h-12 bg-[#E01D1D]/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-[#E01D1D]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multi-Provider</h3>
              <p className="text-zinc-400">
                Switch between OpenAI, Anthropic, Gemini, and HuggingFace with a single API
              </p>
            </div>

            <div className="p-6 bg-zinc-900/50 backdrop-blur rounded-lg border border-zinc-800 hover:border-[#E01D1D]/30 transition-all duration-300">
              <div className="w-12 h-12 bg-[#E01D1D]/10 rounded-lg flex items-center justify-center mb-4">
                <Key className="w-6 h-6 text-[#E01D1D]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">API Key Management</h3>
              <p className="text-zinc-400">
                Secure key storage and rotation with built-in rate limiting
              </p>
            </div>

            <div className="p-6 bg-zinc-900/50 backdrop-blur rounded-lg border border-zinc-800 hover:border-[#E01D1D]/30 transition-all duration-300">
              <div className="w-12 h-12 bg-[#E01D1D]/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-[#E01D1D]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Usage Analytics</h3>
              <p className="text-zinc-400">
                Track API usage, costs, and performance across all providers
              </p>
            </div>
          </div>

          {/* Code Example */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center">Simple. Powerful. Unified.</h2>
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-[#E01D1D]" />
                  <span className="text-sm font-medium">Quick Start</span>
                </div>
                <button className="text-xs px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors">
                  Copy
                </button>
              </div>
              <pre className="p-6 overflow-x-auto">
                <code className="text-sm text-zinc-300">{`import { createClient } from '@heysalad/ai';

const client = createClient();

// Configure providers
client.configureProvider('openai', { apiKey: process.env.OPENAI_API_KEY });
client.configureProvider('anthropic', { apiKey: process.env.ANTHROPIC_API_KEY });
client.configureProvider('gemini', { apiKey: process.env.GEMINI_API_KEY });

// Use any provider
const response = await client.chat({
  messages: [{ role: 'user', content: 'Hello!' }],
  model: 'gpt-4'
}, 'openai');

// Or switch providers instantly
const response2 = await client.chat({
  messages: [{ role: 'user', content: 'Hello!' }],
  model: 'claude-3-opus'
}, 'anthropic');`}</code>
              </pre>
            </div>
          </div>

          {/* Supported Providers */}
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-8">Supported Providers</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['OpenAI', 'Anthropic', 'Google Gemini', 'HuggingFace'].map((provider) => (
                <div
                  key={provider}
                  className="p-4 bg-zinc-900/50 backdrop-blur rounded-lg border border-zinc-800 hover:border-[#E01D1D]/30 transition-all duration-300"
                >
                  <p className="font-semibold">{provider}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-zinc-500 mt-6">
              More providers coming soon: AWS Bedrock, Vertex AI, DeepSeek, Mistral, Groq
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-16 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col items-center gap-8">
            <img 
              src="/heysalad-white-logo.svg" 
              alt="HeySalad AI" 
              className="h-10"
            />
            
            <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="#" className="hover:text-white transition-colors">API Reference</a>
              <a href="#" className="hover:text-white transition-colors">Pricing</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
            
            <div className="text-sm text-slate-500">
              © {new Date().getFullYear()} HeySalad Inc. · AI API Platform
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
