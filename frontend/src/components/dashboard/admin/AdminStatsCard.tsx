import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  loading?: boolean;
}

export function StatsCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  iconBg, 
  iconColor, 
  loading = false 
}: StatsCardProps) {
  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm">{title}</p>
          {loading ? (
            <div className="h-8 flex items-center">
              <div className="animate-pulse bg-slate-700 rounded h-6 w-16"></div>
            </div>
          ) : (
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
          )}
        </div>
        <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-slate-700/50">
        <p className="text-xs text-slate-400">{description}</p>
      </div>
    </div>
  );
}