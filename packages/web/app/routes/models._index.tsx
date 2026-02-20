import type { MetaFunction } from '@remix-run/cloudflare';

export const meta: MetaFunction = () => {
  return [
    { title: 'Available Models - HeySalad AI' },
    { name: 'description', content: 'Browse all available AI models on HeySalad platform' },
  ];
};

export default function Models() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <header style={{ marginBottom: '3rem' }}>
          <a href="/" style={{ color: '#0066cc', textDecoration: 'none', fontSize: '0.9rem' }}>
            ← Back to Home
          </a>
          <h1 style={{ fontSize: '2.5rem', marginTop: '1rem', marginBottom: '0.5rem' }}>
            Available Models
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#666' }}>
            All AI models available on the HeySalad platform
          </p>
        </header>

        <main>
          <ModelSection
            title="Gemini 3 Series (Latest)"
            description="Google's latest models with extended thinking capabilities"
            models={[
              {
                name: 'gemini-3.1-pro-preview',
                provider: 'Google',
                status: 'Available',
                features: ['Extended Thinking (95 tokens)', 'Balanced performance', 'Latest features'],
                speed: 'Medium (~5s)',
                quality: 'Excellent',
              },
              {
                name: 'gemini-3-flash-preview',
                provider: 'Google',
                status: 'Available',
                features: ['Extended Thinking (65 tokens)', 'Fastest response', 'High efficiency'],
                speed: 'Fast (~3s)',
                quality: 'Very Good',
              },
              {
                name: 'gemini-3-pro-preview',
                provider: 'Google',
                status: 'Available',
                features: ['Extended Thinking (263 tokens)', 'Deep reasoning', 'Best quality'],
                speed: 'Slow (~6s)',
                quality: 'Best',
              },
            ]}
          />

          <ModelSection
            title="Gemini 2.5 Series"
            description="Stable, production-ready Gemini models"
            models={[
              {
                name: 'gemini-2.5-flash',
                provider: 'Google',
                status: 'Available',
                features: ['Fast responses', 'Production ready', 'Balanced cost'],
                speed: 'Fast',
                quality: 'Very Good',
              },
              {
                name: 'gemini-2.5-flash-lite',
                provider: 'Google',
                status: 'Available',
                features: ['Lightest model', 'Cheapest option', 'High throughput'],
                speed: 'Fastest',
                quality: 'Good',
              },
              {
                name: 'gemini-2.5-pro',
                provider: 'Google',
                status: 'Available',
                features: ['Extended thinking', 'High quality', 'Production ready'],
                speed: 'Medium',
                quality: 'Excellent',
              },
              {
                name: 'gemini-2.5-flash-image',
                provider: 'Google',
                status: 'Available',
                features: ['Vision support', 'Image analysis', 'Text generation'],
                speed: 'Fast',
                quality: 'Very Good',
              },
            ]}
          />

          <ModelSection
            title="OpenAI Models"
            description="GPT models from OpenAI"
            models={[
              {
                name: 'gpt-4-turbo',
                provider: 'OpenAI',
                status: 'Available',
                features: ['128K context', 'Vision support', 'Latest GPT-4'],
                speed: 'Medium',
                quality: 'Excellent',
              },
              {
                name: 'gpt-4',
                provider: 'OpenAI',
                status: 'Available',
                features: ['Advanced reasoning', '8K context', 'Reliable'],
                speed: 'Slow',
                quality: 'Excellent',
              },
              {
                name: 'gpt-3.5-turbo',
                provider: 'OpenAI',
                status: 'Available',
                features: ['Fast responses', '16K context', 'Cost effective'],
                speed: 'Fast',
                quality: 'Good',
              },
            ]}
          />

          <ModelSection
            title="Anthropic Models"
            description="Claude models from Anthropic"
            models={[
              {
                name: 'claude-opus-4',
                provider: 'Anthropic',
                status: 'Available',
                features: ['200K context', 'Best reasoning', 'Extended thinking'],
                speed: 'Slow',
                quality: 'Best',
              },
              {
                name: 'claude-sonnet-4',
                provider: 'Anthropic',
                status: 'Available',
                features: ['200K context', 'Balanced', 'Fast and capable'],
                speed: 'Fast',
                quality: 'Excellent',
              },
              {
                name: 'claude-haiku-4',
                provider: 'Anthropic',
                status: 'Available',
                features: ['200K context', 'Fastest', 'Cost optimized'],
                speed: 'Fastest',
                quality: 'Good',
              },
            ]}
          />

          <ModelSection
            title="Hugging Face Models"
            description="Open source models via Hugging Face API"
            models={[
              {
                name: 'meta-llama/Llama-3.2-3B-Instruct',
                provider: 'Hugging Face',
                status: 'Available',
                features: ['Open source', 'Cost effective', 'Self-hostable'],
                speed: 'Fast',
                quality: 'Good',
              },
              {
                name: 'mistralai/Mistral-7B-Instruct',
                provider: 'Hugging Face',
                status: 'Available',
                features: ['Open source', '32K context', 'Efficient'],
                speed: 'Fast',
                quality: 'Very Good',
              },
            ]}
          />
        </main>

        <footer style={{ marginTop: '4rem', textAlign: 'center', color: '#666', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
          <p>Need a custom model? Contact us or check our documentation.</p>
        </footer>
      </div>
    </div>
  );
}

function ModelSection({
  title,
  description,
  models
}: {
  title: string;
  description: string;
  models: Array<{
    name: string;
    provider: string;
    status: string;
    features: string[];
    speed: string;
    quality: string;
  }>;
}) {
  return (
    <section style={{ marginBottom: '3rem' }}>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
        {title}
      </h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        {description}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {models.map((model) => (
          <ModelCard key={model.name} {...model} />
        ))}
      </div>
    </section>
  );
}

function ModelCard({
  name,
  provider,
  status,
  features,
  speed,
  quality
}: {
  name: string;
  provider: string;
  status: string;
  features: string[];
  speed: string;
  quality: string;
}) {
  const statusColor = status === 'Available' ? '#22c55e' : '#eab308';

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '1.5rem',
      background: '#fafafa',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', fontFamily: 'monospace' }}>
            {name}
          </h3>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
            {provider}
          </p>
        </div>
        <span style={{
          background: statusColor,
          color: 'white',
          padding: '0.25rem 0.75rem',
          borderRadius: '12px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
        }}>
          {status}
        </span>
      </div>

      <ul style={{
        listStyle: 'none',
        padding: 0,
        margin: '1rem 0',
        color: '#555',
        fontSize: '0.9rem',
      }}>
        {features.map((feature, idx) => (
          <li key={idx} style={{ marginBottom: '0.5rem', paddingLeft: '1.25rem', position: 'relative' }}>
            <span style={{ position: 'absolute', left: 0 }}>✓</span>
            {feature}
          </li>
        ))}
      </ul>

      <div style={{
        display: 'flex',
        gap: '1rem',
        marginTop: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid #e0e0e0',
      }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.25rem' }}>Speed</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{speed}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.25rem' }}>Quality</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{quality}</div>
        </div>
      </div>
    </div>
  );
}
