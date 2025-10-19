import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  onRefresh: () => void;
  refreshing: boolean;
}

export function DashboardHeader({ title, subtitle, onRefresh, refreshing }: DashboardHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white mb-2"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-300 text-lg"
          >
            {subtitle}
          </motion.p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg font-semibold text-white hover:bg-slate-600/50 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
        </motion.button>
      </div>
    </div>
  );
}