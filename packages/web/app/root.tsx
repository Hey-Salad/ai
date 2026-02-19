import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';

export function meta() {
  return [
    { title: 'HeySalad AI - Workflow Automation Platform' },
    { name: 'description', content: 'AI-powered workflow automation with multi-provider support. OpenClaw-ready.' },
    { name: 'keywords', content: 'AI, automation, workflow, OpenAI, Anthropic, Claude, GPT, OpenClaw' },
    { property: 'og:title', content: 'HeySalad AI' },
    { property: 'og:description', content: 'AI-powered workflow automation platform' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://ai.heysalad.app' },
  ];
}

export function links() {
  return [
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'manifest', href: '/manifest.json' },
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
