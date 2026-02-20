import { CreditCard, Download, Check } from 'lucide-react';

export default function Billing() {
  const plans = [
    { name: 'Free', price: '$0', requests: '1,000', features: ['Basic support', '1 API key', 'Community access'] },
    { name: 'Pro', price: '$29', requests: '100,000', features: ['Priority support', '10 API keys', 'Advanced analytics', 'Custom limits'], current: true },
    { name: 'Max', price: '$99', requests: 'Unlimited', features: ['24/7 support', 'Unlimited keys', 'Custom integrations', 'Dedicated account manager'] }
  ];

  const invoices = [
    { id: 'INV-001', date: '2026-02-01', amount: '$29.00', status: 'Paid' },
    { id: 'INV-002', date: '2026-01-01', amount: '$29.00', status: 'Paid' },
    { id: 'INV-003', date: '2025-12-01', amount: '$29.00', status: 'Paid' }
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0 p-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold text-white">Billing & Usage</h1>
        <p className="text-sm text-zinc-400 mt-1">Manage your subscription and billing</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl space-y-6">
          {/* Current Usage */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-zinc-800">
            <h2 className="text-lg font-semibold text-white mb-4">Current Usage</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-zinc-400">Requests this month</p>
                <p className="text-2xl font-bold text-white mt-1">24,352</p>
                <p className="text-xs text-zinc-500 mt-1">of 100,000 limit</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">Current spend</p>
                <p className="text-2xl font-bold text-white mt-1">$127.50</p>
                <p className="text-xs text-zinc-500 mt-1">Billing cycle: Feb 1-28</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">Active API keys</p>
                <p className="text-2xl font-bold text-white mt-1">2</p>
                <p className="text-xs text-zinc-500 mt-1">of 10 allowed</p>
              </div>
            </div>
          </div>

          {/* Plans */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`bg-[#1a1a1a] rounded-lg p-6 border ${plan.current ? 'border-[#E01D1D]' : 'border-zinc-800'}`}
                >
                  {plan.current && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-[#E01D1D]/20 text-[#E01D1D] text-xs font-medium rounded mb-3">
                      <Check className="w-3 h-3" />
                      Current Plan
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-3xl font-bold text-white mt-2">{plan.price}<span className="text-sm text-zinc-400">/mo</span></p>
                  <p className="text-sm text-zinc-400 mt-1">{plan.requests} requests/mo</p>
                  <ul className="mt-4 space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="text-sm text-zinc-300 flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {!plan.current && (
                    <button className="w-full mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-semibold transition-colors">
                      {plan.price === '$0' ? 'Downgrade' : 'Upgrade'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Invoices */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-zinc-800">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Invoices</h2>
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-zinc-400" />
                    <div>
                      <p className="text-sm font-semibold text-white">{invoice.id}</p>
                      <p className="text-xs text-zinc-500">{invoice.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-white">{invoice.amount}</span>
                    <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs font-medium rounded">{invoice.status}</span>
                    <button className="p-2 hover:bg-zinc-800 rounded transition-colors">
                      <Download className="w-4 h-4 text-zinc-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
