import type { MetaFunction } from '@remix-run/cloudflare';

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
    <div
      style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: '#0a0a0f',
        color: '#e0e0f0',
        minHeight: '100vh',
      }}
    >
      {/* Nav */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: 'rgba(10,10,15,0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #1a1a28',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '60px',
        }}
      >
        <span
          style={{
            fontSize: '1.2rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #6ee7b7, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          HeySalad AI
        </span>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <a href="/api/v1" style={{ color: '#8888aa', textDecoration: 'none', fontSize: '0.9rem' }}>
            API Docs
          </a>
          <a href="/models" style={{ color: '#8888aa', textDecoration: 'none', fontSize: '0.9rem' }}>
            Models
          </a>
          <a
            href="/auth/login"
            style={{
              padding: '0.45rem 1.1rem',
              background: 'linear-gradient(135deg, #10b981, #3b82f6)',
              borderRadius: '8px',
              color: '#fff',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: '600',
            }}
          >
            Dashboard
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '6rem 2rem 4rem',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            padding: '0.3rem 1rem',
            background: 'rgba(110,231,183,0.1)',
            border: '1px solid rgba(110,231,183,0.3)',
            borderRadius: '999px',
            color: '#6ee7b7',
            fontSize: '0.8rem',
            fontWeight: '600',
            letterSpacing: '0.05em',
            marginBottom: '1.5rem',
          }}
        >
          NOW WITH GEMINI 3 EXTENDED THINKING
        </div>
        <h1
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: '800',
            lineHeight: '1.1',
            margin: '0 0 1.5rem',
          }}
        >
          One API for{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #6ee7b7, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            every AI model
          </span>
        </h1>
        <p
          style={{
            fontSize: '1.2rem',
            color: '#8888aa',
            maxWidth: '600px',
            margin: '0 auto 2.5rem',
            lineHeight: '1.7',
          }}
        >
          HeySalad AI gives you a single, unified API to access OpenAI, Anthropic,
          Gemini, Bedrock, and more — with intelligent routing, workflow automation,
          and edge-native performance.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="/auth/login"
            style={{
              padding: '0.85rem 2rem',
              background: 'linear-gradient(135deg, #10b981, #3b82f6)',
              borderRadius: '10px',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '1rem',
            }}
          >
            Get Started →
          </a>
          <a
            href="/api/v1"
            style={{
              padding: '0.85rem 2rem',
              background: 'none',
              border: '1px solid #222230',
              borderRadius: '10px',
              color: '#ccccdd',
              textDecoration: 'none',
              fontSize: '1rem',
            }}
          >
            View API Docs
          </a>
        </div>
      </section>

      {/* Providers strip */}
      <section
        style={{
          borderTop: '1px solid #1a1a28',
          borderBottom: '1px solid #1a1a28',
          padding: '1.25rem 2rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ color: '#444455', fontSize: '0.8rem', alignSelf: 'center' }}>
          SUPPORTED PROVIDERS
        </span>
        {PROVIDERS.map((p) => (
          <span key={p} style={{ color: '#8888aa', fontSize: '0.9rem', fontWeight: '500' }}>
            {p}
          </span>
        ))}
      </section>

      {/* Features */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 2rem' }}>
        <h2
          style={{
            textAlign: 'center',
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '0.75rem',
          }}
        >
          Everything you need
        </h2>
        <p
          style={{
            textAlign: 'center',
            color: '#8888aa',
            marginBottom: '3rem',
            fontSize: '1rem',
          }}
        >
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
            <div
              key={title}
              style={{
                background: '#111118',
                border: '1px solid #1a1a28',
                borderRadius: '10px',
                padding: '1.5rem',
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{icon}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                {title}
              </h3>
              <p style={{ color: '#8888aa', fontSize: '0.875rem', lineHeight: '1.6', margin: 0 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Gemini 3 callout */}
      <section
        style={{
          maxWidth: '800px',
          margin: '0 auto 5rem',
          padding: '0 2rem',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(110,231,183,0.08), rgba(59,130,246,0.08))',
            border: '1px solid rgba(110,231,183,0.2)',
            borderRadius: '16px',
            padding: '2.5rem',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: '#6ee7b7', letterSpacing: '0.1em', marginBottom: '1rem' }}>
            FEATURED MODEL
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.75rem' }}>
            Gemini 3.1 Pro with Extended Thinking
          </h2>
          <p style={{ color: '#8888aa', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Access Google's most advanced model via a single API call. Extended thinking lets
            Gemini 3.1 Pro reason step-by-step before producing an answer — ideal for math,
            code generation, and complex analysis.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['gemini-3.1-pro-preview', 'gemini-3-flash-preview', 'gemini-2.5-pro'].map((m) => (
              <code
                key={m}
                style={{
                  background: '#0a0a0f',
                  border: '1px solid #222230',
                  borderRadius: '6px',
                  padding: '0.3rem 0.75rem',
                  fontSize: '0.8rem',
                  color: '#6ee7b7',
                }}
              >
                {m}
              </code>
            ))}
          </div>
        </div>
      </section>

      {/* Quick start */}
      <section
        style={{
          maxWidth: '800px',
          margin: '0 auto 5rem',
          padding: '0 2rem',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            fontSize: '1.75rem',
            fontWeight: '700',
            marginBottom: '2rem',
          }}
        >
          Quick Start
        </h2>
        <pre
          style={{
            background: '#111118',
            border: '1px solid #1a1a28',
            borderRadius: '10px',
            padding: '1.5rem',
            overflow: 'auto',
            fontSize: '0.85rem',
            lineHeight: '1.7',
            color: '#ccccdd',
          }}
        >
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
      <section
        style={{
          textAlign: 'center',
          padding: '5rem 2rem',
          borderTop: '1px solid #1a1a28',
        }}
      >
        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem' }}>
          Ready to build?
        </h2>
        <p style={{ color: '#8888aa', marginBottom: '2rem', fontSize: '1rem' }}>
          Generate your API key and start in minutes.
        </p>
        <a
          href="/auth/login"
          style={{
            padding: '0.9rem 2.5rem',
            background: 'linear-gradient(135deg, #10b981, #3b82f6)',
            borderRadius: '10px',
            color: '#fff',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '1rem',
          }}
        >
          Open Dashboard →
        </a>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid #1a1a28',
          padding: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          color: '#444455',
          fontSize: '0.85rem',
        }}
      >
        <span>© 2026 HeySalad AI · MIT License</span>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="https://github.com/Hey-Salad/ai" style={{ color: '#555566', textDecoration: 'none' }}>
            GitHub
          </a>
          <a href="https://www.npmjs.com/package/@heysalad/ai" style={{ color: '#555566', textDecoration: 'none' }}>
            npm
          </a>
          <a href="/api/v1" style={{ color: '#555566', textDecoration: 'none' }}>
            API
          </a>
          <a href="/models" style={{ color: '#555566', textDecoration: 'none' }}>
            Models
          </a>
        </div>
      </footer>
    </div>
  );
}
