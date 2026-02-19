import type { MetaFunction } from '@remix-run/cloudflare';

export const meta: MetaFunction = () => {
  return [
    { title: 'HeySalad AI - Home' },
    { name: 'description', content: 'Welcome to HeySalad AI workflow automation platform' },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            HeySalad AI
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#666' }}>
            AI-Powered Workflow Automation Platform
          </p>
        </header>

        <main>
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              Features
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <FeatureCard
                title="Multi-Provider Support"
                description="Unified interface for OpenAI, Anthropic, AWS Bedrock, Google Vertex, and more"
              />
              <FeatureCard
                title="Workflow Automation"
                description="Build complex AI workflows with our action system and human-in-the-loop verification"
              />
              <FeatureCard
                title="OpenClaw Ready"
                description="First-class support for OpenClaw and other automation platforms"
              />
              <FeatureCard
                title="Type-Safe SDK"
                description="Full TypeScript support with @heysalad/ai npm package"
              />
              <FeatureCard
                title="REST API"
                description="RESTful API at ai.heysalad.app/api/v1 for easy integration"
              />
              <FeatureCard
                title="Edge-First"
                description="Deployed on Cloudflare Workers for global low-latency access"
              />
            </div>
          </section>

          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              Quick Start
            </h2>
            <pre style={{
              background: '#f5f5f5',
              padding: '1.5rem',
              borderRadius: '8px',
              overflow: 'auto'
            }}>
              <code>{`npm install @heysalad/ai

import { createClient } from '@heysalad/ai';

const ai = createClient();
ai.configureProvider('openai', {
  apiKey: process.env.OPENAI_API_KEY
});

const response = await ai.chat({
  model: 'gpt-4-turbo',
  messages: [{ role: 'user', content: 'Hello!' }]
});`}</code>
            </pre>
          </section>

          <section>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              Links
            </h2>
            <ul style={{ fontSize: '1.1rem', listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="https://github.com/Hey-Salad/ai" style={{ color: '#0066cc' }}>
                  GitHub Repository
                </a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="https://www.npmjs.com/package/@heysalad/ai" style={{ color: '#0066cc' }}>
                  npm Package
                </a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="/dashboard" style={{ color: '#0066cc' }}>
                  Dashboard (Coming Soon)
                </a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="/api/v1" style={{ color: '#0066cc' }}>
                  API Documentation (Coming Soon)
                </a>
              </li>
            </ul>
          </section>
        </main>

        <footer style={{ marginTop: '4rem', textAlign: 'center', color: '#666', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
          <p>Built with React + Remix + Cloudflare Workers</p>
          <p>MIT License | HeySalad 2026</p>
        </footer>
      </div>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '1.5rem',
      background: '#fafafa'
    }}>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: '#666', margin: 0 }}>{description}</p>
    </div>
  );
}
