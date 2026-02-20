import { useState } from 'react';
import { X } from 'lucide-react';
import { login, signup } from '../services/authService';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = mode === 'login' 
        ? await login(email, password)
        : await signup(email, password, name || undefined);

      if (result.success) {
        window.location.href = '/dashboard';
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-8">
          <img 
            src="/heysalad-white-logo.svg" 
            alt="HeySalad" 
            className="h-10 mb-4"
          />
          <h2 className="text-2xl font-bold text-white mb-2">
            {mode === 'login' ? 'Welcome back' : 'Start building with AI'}
          </h2>
          <p className="text-zinc-400 text-sm">
            {mode === 'login' 
              ? 'Access your unified AI API dashboard' 
              : 'One API for OpenAI, Anthropic, Gemini, and more'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Name (optional)
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#E01D1D] focus:border-transparent"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#E01D1D] focus:border-transparent"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#E01D1D] focus:border-transparent"
              placeholder={mode === 'signup' ? 'At least 8 characters' : 'Your password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <button 
            type="submit"
            className="w-full py-3 bg-[#E01D1D] hover:bg-[#c91919] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>

          <div className="text-center">
            <button 
              type="button"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError('');
              }}
            >
              {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>

        {mode === 'signup' && (
          <div className="mt-6 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <p className="text-xs text-zinc-400 mb-2">What you get:</p>
            <ul className="text-xs text-zinc-300 space-y-1">
              <li>• Unified API for multiple AI providers</li>
              <li>• Secure API key management</li>
              <li>• Usage analytics and monitoring</li>
              <li>• Free tier to get started</li>
            </ul>
          </div>
        )}
        
        <p className="text-center text-xs text-zinc-500 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
