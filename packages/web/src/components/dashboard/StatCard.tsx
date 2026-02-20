import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export default function StatCard({ 
  label, 
  value, 
  change, 
  icon: Icon, 
  color = 'bg-[#E01D1D]',
  trend = 'neutral'
}: StatCardProps) {
  const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-zinc-400';
  
  return (
    <div className="bg-[#1a1a1a] rounded-xl shadow-sm border border-zinc-800 p-6 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-zinc-400 font-medium">{label}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          {change && (
            <p className={`text-sm font-medium mt-1 ${trendColor}`}>{change}</p>
          )}
        </div>
        <div className={`${color} p-3 rounded-lg flex-shrink-0`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
