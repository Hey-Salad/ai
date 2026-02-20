import { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}

export default function ChartCard({ title, description, children, action }: ChartCardProps) {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl shadow-sm border border-zinc-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {description && (
            <p className="text-sm text-zinc-400 mt-1">{description}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </div>
  );
}
