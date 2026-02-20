import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import themeStyles from './styles/theme.css?url';

export function meta() {
  return [
    { title: 'HeySalad AI - Workflow Automation Platform' },
    { name: 'description', content: 'AI-powered workflow automation with multi-provider support. OpenClaw-ready.' },
    { name: 'keywords', content: 'AI, automation, workflow, OpenAI, Anthropic, Claude, GPT, Gemini, OpenClaw' },
    { property: 'og:title', content: 'HeySalad AI' },
    { property: 'og:description', content: 'AI-powered workflow automation platform' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://ai.heysalad.app' },
  ];
}

export function links() {
  return [
    { rel: 'icon', href: '/heysalad-icon.svg' },
    { rel: 'manifest', href: '/manifest.json' },
    { rel: 'stylesheet', href: themeStyles },
  ];
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize theme before page renders to prevent flash
              (function() {
                const stored = localStorage.getItem('theme');
                const theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                document.documentElement.setAttribute('data-theme', theme);
              })();
            `,
          }}
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
