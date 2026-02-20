import type { MetaFunction } from '@remix-run/cloudflare';
import { Navigation } from '~/components/Navigation';

export const meta: MetaFunction = () => [
  { title: 'HeySalad AI – Multi-Provider AI Platform' },
  {
    name: 'description',
    content:
      'Unified AI API with OpenAI, Anthropic, Gemini 3, Bedrock, and more. Edge-first, cost-optimized, OpenClaw-ready.',
  },
];

const PROVIDERS = [
  'OpenAI', 'Anthropic', 'Gemini', 'AWS Bedrock', 'Groq',
  'Hugging Face', 'DeepSeek', 'Mistral',
];

const FEATURES = [
  {
    icon: '⚡',
    title: 'Multi-Provider Routing',
    desc: 'Unified interface across OpenAI, Anthropic, Gemini, Bedrock, and more — swap providers with a single config change.',
  },
  {
    icon: '🧠',
    title: 'Gemini 3 + Extended Thinking',
    desc: 'First-class support for Gemini 3.1 Pro with extended thinking for advanced multi-step reasoning tasks.',
  },
  {
    icon: '🔧',
    title: 'Workflow Automation',
    desc: 'Build complex AI pipelines with our action system, human-in-the-loop verification, and conditional routing.',
  },
  {
    icon: '🌐',
    title: 'Edge-First Deployment',
    desc: 'Running on Cloudflare Workers for <50ms global latency. No cold starts, no regions to worry about.',
  },
  {
    icon: '💸',
    title: 'Cost Optimization',
    desc: 'Intelligent routing minimizes spend — automatically select the cheapest model that meets your quality bar.',
  },
  {
    icon: '📦',
    title: 'TypeScript SDK',
    desc: 'Install @heysalad/ai from npm. Fully typed, tree-shakable, works in Node, Deno, and the browser.',
  },
];

export default function Index() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Navigation />

      {/* Hero */}
      <section className="container" style={{ padding: '6rem 2rem 4rem', textAlign: 'center' }}>
        <div className="badge badge-success" style={{ marginBottom: '1.5rem' }}>
          NOW WITH GEMINI 3 EXTENDED THINKING
        </div>
        <h1 style={{ margin: '0 0 1.5rem' }}>
          One API for{' '}
          <span className="accent-gradient">
            every AI model
          </span>
        </h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: '1.7' }}>
          HeySalad AI gives you a single, unified API to access OpenAI, Anthropic,
          Gemini, Bedrock, and more — with intelligent routing, workflow automation,
          and edge-native performance.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/auth/login" className="btn btn-primary">
            Get Started →
          </a>
          <a href="/api/v1" className="btn btn-secondary">
            View API Docs
          </a>
        </div>
      </section>

      {/* Providers strip */}
      <section
        style={{
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          padding: '1.25rem 2rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', alignSelf: 'center' }}>
          SUPPORTED PROVIDERS
        </span>
        {PROVIDERS.map((p) => (
          <span key={p} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>
            {p}
          </span>
        ))}
      </section>

      {/* Features */}
      <section className="container" style={{ padding: '5rem 2rem' }}>
        <h2 className="text-center mb-1">Everything you need</h2>
        <p className="text-center mb-4" style={{ color: 'var(--text-secondary)' }}>
          Production-ready AI infrastructure, out of the box.
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} className="card">
              <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{icon}</div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6', margin: 0 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Gemini 3 callout */}
      <section className="container" style={{ padding: '0 2rem 5rem' }}>
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, rgba(110,231,183,0.08), rgba(59,130,246,0.08))',
            border: '1px solid rgba(110,231,183,0.2)',
            textAlign: 'center',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          <div className="badge badge-success" style={{ marginBottom: '1rem' }}>
            FEATURED MODEL
          </div>
          <h2 style={{ marginBottom: '0.75rem' }}>
            Gemini 3.1 Pro with Extended Thinking
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.7' }}>
            Access Google's most advanced model via a single API call. Extended thinking lets
            Gemini 3.1 Pro reason step-by-step before producing an answer — ideal for math,
            code generation, and complex analysis.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['gemini-3.1-pro-preview', 'gemini-3-flash-preview', 'gemini-2.5-pro'].map((m) => (
              <code key={m}>{m}</code>
            ))}
          </div>
        </div>
      </section>

      {/* Quick start */}
      <section className="container" style={{ padding: '0 2rem 5rem' }}>
        <h2 className="text-center mb-4">Quick Start</h2>
        <pre style={{ maxWidth: '800px', margin: '0 auto' }}>
          <code>{`npm install @heysalad/ai

import { createClient } from '@heysalad/ai';

const ai = createClient({ apiKey: 'hsk_live_...' });

const response = await ai.chat({
  model: 'gemini-3.1-pro-preview',
  messages: [{ role: 'user', content: 'Explain quantum entanglement.' }],
  thinkingBudget: 10000,  // extended thinking
});`}</code>
        </pre>
      </section>

      {/* CTA */}
      <section className="text-center" style={{ padding: '5rem 2rem', borderTop: '1px solid var(--border)' }}>
        <h2 className="mb-2">Ready to build?</h2>
        <p className="mb-3" style={{ color: 'var(--text-secondary)' }}>
          Generate your API key and start in minutes.
        </p>
        <a href="/auth/login" className="btn btn-primary" style={{ padding: '0.9rem 2.5rem' }}>
          Open Dashboard →
        </a>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border)',
          padding: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          color: 'var(--text-tertiary)',
          fontSize: '0.85rem',
        }}
      >
        <span>© 2026 HeySalad AI · MIT License</span>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="https://github.com/Hey-Salad/ai" style={{ color: 'var(--text-tertiary)', textDecoration: 'none' }}>
            GitHub
          </a>
          <a href="https://www.npmjs.com/package/@heysalad/ai" style={{ color: 'var(--text-tertiary)', textDecoration: 'none' }}>
            npm
          </a>
          <a href="/api/v1" style={{ color: 'var(--text-tertiary)', textDecoration: 'none' }}>
            API
          </a>
          <a href="/models" style={{ color: 'var(--text-tertiary)', textDecoration: 'none' }}>
            Models
          </a>
        </div>
      </footer>
    </div>
  );
}
