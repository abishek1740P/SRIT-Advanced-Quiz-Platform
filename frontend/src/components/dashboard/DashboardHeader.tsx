// components/dashboard/DashboardHeader.tsx
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  badgeText: string;
  actionButtons?: React.ReactNode;
}

export function DashboardHeader({ 
  title, 
  subtitle, 
  badgeText, 
  actionButtons 
}: DashboardHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
        >
          <Zap className="w-4 h-4 text-yellow-400 mr-2" />
          <span className="text-sm font-medium text-slate-300">
            {badgeText}
          </span>
        </motion.div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2 flex-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              {title}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" Teacher Dashboard"}
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl">
              {subtitle}
            </p>
          </div>
          {actionButtons}
        </div>
      </div>
    </motion.div>
  );
}