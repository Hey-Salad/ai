import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';

export default function Analytics() {
  const stats = [
    { label: 'Total Requests', value: '24,352', change: '+12.5%', trend: 'up', icon: Activity },
    { label: 'Success Rate', value: '99.2%', change: '+0.3%', trend: 'up', icon: TrendingUp },
    { label: 'Avg Latency', value: '245ms', change: '-15ms', trend: 'up', icon: TrendingDown },
    { label: 'Total Cost', value: '$127.50', change: '+$23.50', trend: 'down', icon: DollarSign }
  ];

  const requestData = [
    { date: 'Feb 14', requests: 1200 },
    { date: 'Feb 15', requests: 1450 },
    { date: 'Feb 16', requests: 1100 },
    { date: 'Feb 17', requests: 1680 },
    { date: 'Feb 18', requests: 1920 },
    { date: 'Feb 19', requests: 1750 },
    { date: 'Feb 20', requests: 2100 }
  ];

  const modelData = [
    { model: 'GPT-4', requests: 8500 },
    { model: 'Claude 3', requests: 6200 },
    { model: 'Gemini', requests: 4800 },
    { model: 'GPT-3.5', requests: 3200 }
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0 p-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-zinc-400 mt-1">Detailed usage insights and metrics</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="bg-[#1a1a1a] rounded-lg p-4 border border-zinc-800">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-xs text-zinc-400">{stat.label}</p>
                  <stat.icon className="w-4 h-4 text-[#E01D1D]" />
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className={`text-xs mt-1 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                </p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#1a1a1a] rounded-lg p-4 border border-zinc-800">
              <h3 className="text-sm font-semibold text-white mb-4">Request Volume</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={requestData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="date" stroke="#999" fontSize={11} />
                  <YAxis stroke="#999" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="requests" stroke="#E01D1D" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-[#1a1a1a] rounded-lg p-4 border border-zinc-800">
              <h3 className="text-sm font-semibold text-white mb-4">Top Models</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={modelData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="model" stroke="#999" fontSize={11} />
                  <YAxis stroke="#999" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }} />
                  <Bar dataKey="requests" fill="#E01D1D" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
