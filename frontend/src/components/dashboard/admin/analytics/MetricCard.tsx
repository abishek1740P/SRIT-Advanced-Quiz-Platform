// frontend/src/app/dashboard/admin/analytics/components/MetricCard.tsx
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  metric: {
    title: string;
    value: string | number;
    icon: LucideIcon;
    iconColor: string;
    iconBg: string;
    trend: {
      icon: LucideIcon;
      text: string;
      color: string;
    };
  };
  index: number;
}

export default function MetricCard({ metric, index }: MetricCardProps) {
  const Icon = metric.icon;
  const TrendIcon = metric.trend.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-slate-400 text-sm">{metric.title}</p>
          <p className="text-2xl font-bold text-white mt-1">
            {metric.value}
          </p>
        </div>
        <div className={`w-10 h-10 ${metric.iconBg} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${metric.iconColor}`} />
        </div>
      </div>
      <div className={`flex items-center ${metric.trend.color} text-sm`}>
        <TrendIcon className="w-4 h-4 mr-1" />
        <span>{metric.trend.text}</span>
      </div>
    </motion.div>
  );
}