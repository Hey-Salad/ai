import { ThemeToggle } from './ThemeToggle';

interface NavigationProps {
  showDashboard?: boolean;
}

export function Navigation({ showDashboard = true }: NavigationProps) {
  return (
    <nav className="nav">
      <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.5rem' }}>🥗</span>
        <span className="brand-gradient" style={{ fontSize: '1.1rem', fontWeight: '800' }}>
          HeySalad
        </span>
      </a>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <a href="/api/v1" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
          API Docs
        </a>
        <a href="/models" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
          Models
        </a>
        <ThemeToggle />
        {showDashboard && (
          <a href="/auth/login" className="btn btn-primary" style={{ padding: '0.45rem 1.1rem', fontSize: '0.9rem' }}>
            Dashboard
          </a>
        )}
      </div>
    </nav>
  );
}
