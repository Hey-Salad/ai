import { useState } from 'react';
import { 
  Key, 
  Zap, 
  BarChart3, 
  DollarSign, 
  Plus,
  TrendingUp,
  Activity,
  Clock,
  Copy,
  Eye,
  EyeOff,
  Trash2
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatCard from '../components/dashboard/StatCard';
import ChartCard from '../components/dashboard/ChartCard';

interface APIKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  requests: number;
}

export default function AIDashboard() {
  const [apiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Production API',
      key: 'sk_live_abc123...xyz789',
      created: '2026-02-15',
      lastUsed: '2 hours ago',
      requests: 15420
    },
    {
      id: '2',
      name: 'Development API',
      key: 'sk_test_def456...uvw012',
      created: '2026-02-10',
      lastUsed: '5 minutes ago',
      requests: 8932
    }
  ]);

  const [showKey, setShowKey] = useState<{ [key: string]: boolean }>({});

  // Mock data - replace with real API calls
  const stats = [
    {
      label: 'Total Requests',
      value: '24,352',
      change: '+12.5% from last month',
      icon: Activity,
      color: 'bg-[#E01D1D]',
      trend: 'up' as const
    },
    {
      label: 'Active API Keys',
      value: apiKeys.length.toString(),
      change: `${apiKeys.length} keys configured`,
      icon: Key,
      color: 'bg-blue-500',
      trend: 'neutral' as const
    },
    {
      label: 'Avg Response Time',
      value: '245ms',
      change: '-15ms from last week',
      icon: Zap,
      color: 'bg-green-500',
      trend: 'up' as const
    },
    {
      label: 'Monthly Cost',
      value: '$127.50',
      change: '+$23.50 this month',
      icon: DollarSign,
      color: 'bg-purple-500',
      trend: 'down' as const
    }
  ];

  const usageByProvider = [
    { name: 'OpenAI', value: 45, color: '#10B981' },
    { name: 'Anthropic', value: 30, color: '#E01D1D' },
    { name: 'Gemini', value: 20, color: '#3B82F6' },
    { name: 'HuggingFace', value: 5, color: '#F59E0B' }
  ];

  const requestsOverTime = [
    { date: 'Feb 14', requests: 1200, cost: 18.5 },
    { date: 'Feb 15', requests: 1450, cost: 22.3 },
    { date: 'Feb 16', requests: 1100, cost: 16.8 },
    { date: 'Feb 17', requests: 1680, cost: 25.7 },
    { date: 'Feb 18', requests: 1920, cost: 29.4 },
    { date: 'Feb 19', requests: 1750, cost: 26.8 },
    { date: 'Feb 20', requests: 2100, cost: 32.1 }
  ];

  const modelUsage = [
    { model: 'GPT-4', requests: 8500 },
    { model: 'Claude 3 Opus', requests: 6200 },
    { model: 'Gemini Pro', requests: 4800 },
    { model: 'GPT-3.5', requests: 3200 },
    { model: 'Llama 2', requests: 1652 }
  ];

  const toggleKeyVisibility = (keyId: string) => {
    setShowKey(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">AI API Dashboard</h1>
          <p className="text-zinc-400 mt-1">Monitor your API usage and manage providers</p>
        </div>
        <button className="bg-[#E01D1D] hover:bg-[#c91919] text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create API Key
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requests Over Time */}
        <ChartCard 
          title="API Requests" 
          description="Daily request volume and cost"
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={requestsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#999" fontSize={12} />
              <YAxis stroke="#999" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="requests" 
                stroke="#E01D1D" 
                strokeWidth={2}
                dot={{ fill: '#E01D1D', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Provider Distribution */}
        <ChartCard 
          title="Usage by Provider" 
          description="Request distribution across AI providers"
        >
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={usageByProvider}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {usageByProvider.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {usageByProvider.map((provider, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: provider.color }}
                />
                <span className="text-sm text-zinc-300">{provider.name}</span>
                <span className="text-sm text-zinc-500 ml-auto">{provider.value}%</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Model Usage */}
      <ChartCard 
        title="Top Models" 
        description="Most used AI models this month"
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={modelUsage} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis type="number" stroke="#999" fontSize={12} />
            <YAxis dataKey="model" type="category" stroke="#999" fontSize={12} width={120} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Bar dataKey="requests" fill="#E01D1D" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* API Keys Management */}
      <div className="bg-[#1a1a1a] rounded-2xl shadow-sm border border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">API Keys</h3>
            <p className="text-sm text-zinc-400 mt-1">Manage your API keys and monitor usage</p>
          </div>
          <button className="text-[#E01D1D] hover:text-[#c91919] font-semibold text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Key
          </button>
        </div>

        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <div 
              key={apiKey.id}
              className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-white font-semibold">{apiKey.name}</h4>
                    <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs font-medium rounded">
                      Active
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <code className="text-sm text-zinc-400 font-mono bg-zinc-900 px-3 py-1 rounded">
                      {showKey[apiKey.id] ? apiKey.key : apiKey.key.replace(/./g, '•')}
                    </code>
                    <button
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                      className="p-1 hover:bg-zinc-800 rounded transition-colors"
                    >
                      {showKey[apiKey.id] ? (
                        <EyeOff className="w-4 h-4 text-zinc-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-zinc-400" />
                      )}
                    </button>
                    <button
                      onClick={() => copyToClipboard(apiKey.key)}
                      className="p-1 hover:bg-zinc-800 rounded transition-colors"
                    >
                      <Copy className="w-4 h-4 text-zinc-400" />
                    </button>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Created {apiKey.created}
                    </span>
                    <span className="flex items-center gap-1">
                      <Activity className="w-4 h-4" />
                      Last used {apiKey.lastUsed}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {apiKey.requests.toLocaleString()} requests
                    </span>
                  </div>
                </div>

                <button className="p-2 hover:bg-red-900/20 text-zinc-400 hover:text-red-400 rounded transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1a1a1a] rounded-xl border border-zinc-800 p-6 hover:border-[#E01D1D]/30 transition-all cursor-pointer">
          <div className="w-12 h-12 bg-[#E01D1D]/10 rounded-lg flex items-center justify-center mb-4">
            <Key className="w-6 h-6 text-[#E01D1D]" />
          </div>
          <h3 className="text-white font-semibold mb-2">Configure Providers</h3>
          <p className="text-sm text-zinc-400">Add or update your AI provider API keys</p>
        </div>

        <div className="bg-[#1a1a1a] rounded-xl border border-zinc-800 p-6 hover:border-[#E01D1D]/30 transition-all cursor-pointer">
          <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
            <BarChart3 className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="text-white font-semibold mb-2">View Analytics</h3>
          <p className="text-sm text-zinc-400">Detailed usage reports and insights</p>
        </div>

        <div className="bg-[#1a1a1a] rounded-xl border border-zinc-800 p-6 hover:border-[#E01D1D]/30 transition-all cursor-pointer">
          <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
            <DollarSign className="w-6 h-6 text-purple-500" />
          </div>
          <h3 className="text-white font-semibold mb-2">Billing & Usage</h3>
          <p className="text-sm text-zinc-400">Manage your subscription and billing</p>
        </div>
      </div>
    </div>
  );
}
