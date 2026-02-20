import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Key, 
  BarChart3, 
  Settings,
  Menu,
  X,
  LogOut,
  Zap,
  DollarSign,
  FileText,
  Code,
} from 'lucide-react';
import { useAuth } from '../../App';
import { logout } from '../../services/authService';

const Layout = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Key, label: 'API Keys', href: '/api-keys' },
    { icon: Zap, label: 'Providers', href: '/providers' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
    { icon: DollarSign, label: 'Billing', href: '/billing' },
    { icon: FileText, label: 'Documentation', href: '/docs' },
    { icon: Code, label: 'Playground', href: '/playground' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a]">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1a1a1a] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo - HeySalad AI branding */}
        <div className="flex items-center gap-3 p-6">
          <img 
            src="/heysalad-white-logo.svg" 
            alt="HeySalad AI" 
            className="h-10"
          />
        </div>

        {/* Main Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all rounded-lg ${
                isActive(item.href) 
                  ? 'bg-[#E01D1D] text-white' 
                  : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Info at Bottom */}
        <div className="p-4">
          <div className="flex items-center gap-3 px-3 py-3 bg-[#0a0a0a] rounded-lg">
            <div className="w-10 h-10 bg-[#E01D1D] flex items-center justify-center rounded-lg flex-shrink-0">
              <span className="text-white font-bold text-sm">
                {currentUser?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{currentUser?.name}</p>
              <p className="text-xs text-zinc-400 capitalize truncate">{currentUser?.tier} Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-[#0a0a0a] px-6 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-zinc-800 transition-colors rounded-lg">
              {sidebarOpen ? <X className="w-6 h-6 text-zinc-300" /> : <Menu className="w-6 h-6 text-zinc-300" />}
            </button>

            <div className="flex-1"></div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-red-900/20 hover:text-red-400 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 text-zinc-400" />
              <span className="text-sm font-semibold text-zinc-300 hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-[#0a0a0a]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
