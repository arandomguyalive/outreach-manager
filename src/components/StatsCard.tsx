import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
  subtext?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon: Icon, color, subtext }) => {
  return (
    <div className="glass-panel p-6 rounded-xl border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{label}</p>
          <h3 className="text-3xl font-bold text-white mt-1">{value.toLocaleString()}</h3>
          {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-lg bg-opacity-20`} style={{ backgroundColor: `${color}33` }}>
          <Icon className="w-6 h-6" style={{ color: color }} />
        </div>
      </div>
    </div>
  );
};