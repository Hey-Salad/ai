import { User, Bell, Shield, CreditCard } from 'lucide-react';
import { useAuth } from '../App';

export default function Settings() {
  const { currentUser } = useAuth();

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0 p-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-zinc-400 mt-1">Manage your account preferences</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl space-y-6">
          {/* Profile */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-zinc-800">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-[#E01D1D]" />
              <h2 className="text-lg font-semibold text-white">Profile</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Name</label>
                <input
                  type="text"
                  defaultValue={currentUser?.name}
                  className="w-full px-4 py-2 bg-[#0a0a0a] border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#E01D1D]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={currentUser?.email}
                  className="w-full px-4 py-2 bg-[#0a0a0a] border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#E01D1D]"
                />
              </div>
              <button className="px-4 py-2 bg-[#E01D1D] hover:bg-[#c91919] text-white rounded-lg font-semibold transition-colors">
                Save Changes
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-zinc-800">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-5 h-5 text-[#E01D1D]" />
              <h2 className="text-lg font-semibold text-white">Notifications</h2>
            </div>
            <div className="space-y-4">
              {['Usage alerts', 'Billing updates', 'Product updates'].map((item) => (
                <label key={item} className="flex items-center justify-between">
                  <span className="text-sm text-zinc-300">{item}</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-[#E01D1D] rounded" />
                </label>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-zinc-800">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-[#E01D1D]" />
              <h2 className="text-lg font-semibold text-white">Security</h2>
            </div>
            <div className="space-y-4">
              <button className="w-full text-left px-4 py-3 bg-[#0a0a0a] hover:bg-zinc-800 rounded-lg transition-colors">
                <p className="text-sm font-semibold text-white">Change Password</p>
                <p className="text-xs text-zinc-400 mt-1">Update your password</p>
              </button>
              <button className="w-full text-left px-4 py-3 bg-[#0a0a0a] hover:bg-zinc-800 rounded-lg transition-colors">
                <p className="text-sm font-semibold text-white">Two-Factor Authentication</p>
                <p className="text-xs text-zinc-400 mt-1">Add an extra layer of security</p>
              </button>
            </div>
          </div>

          {/* Billing */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-zinc-800">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-5 h-5 text-[#E01D1D]" />
              <h2 className="text-lg font-semibold text-white">Billing</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Current Plan</p>
                  <p className="text-xs text-zinc-400 mt-1 capitalize">{currentUser?.tier} Plan</p>
                </div>
                <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-semibold transition-colors">
                  Upgrade
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
