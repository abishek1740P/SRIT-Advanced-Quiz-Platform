// frontend/src/app/dashboard/admin/analytics/components/ActivityTrends.tsx
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

export default function ActivityTrends() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50"
    >
      <h3 className="text-lg font-semibold text-white mb-4">Activity Trends</h3>
      <div className="text-center py-12 text-slate-400">
        <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg mb-2">Advanced Analytics Coming Soon</p>
        <p className="text-sm">
          Interactive charts and detailed trend analysis will be available in the next update.
        </p>
      </div>
    </motion.div>
  );
}