// frontend/src/app/dashboard/admin/analytics/components/SystemSummary.tsx
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { SystemAnalytics, DashboardStats } from "../../../../types/index";

interface SystemSummaryProps {
  stats: DashboardStats | null;
  analytics: SystemAnalytics | null;
}

export default function SystemSummary({ stats, analytics }: SystemSummaryProps) {
  const summaryItems = [
    {
      label: "Total Quizzes",
      value: stats?.totalQuizzes || 0,
      valueColor: "text-white",
    },
    {
      label: "Active Quizzes",
      value: stats?.activeQuizzes || 0,
      valueColor: "text-green-400",
    },
    {
      label: "Quiz Activity Rate",
      value: stats && stats.totalQuizzes > 0
        ? `${Math.round((stats.activeQuizzes / stats.totalQuizzes) * 100)}%`
        : '0%',
      valueColor: "text-white",
    },
    {
      label: "Avg Responses per Quiz",
      value: analytics && stats && stats.totalQuizzes > 0
        ? Math.round(analytics.responsesLast30Days / stats.totalQuizzes)
        : 0,
      valueColor: "text-white",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">System Summary</h3>
        <BarChart3 className="w-5 h-5 text-blue-400" />
      </div>

      <div className="space-y-4">
        {summaryItems.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg"
          >
            <span className="text-slate-300">{item.label}</span>
            <span className={`font-bold ${item.valueColor}`}>{item.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-700/50">
        <p className="text-slate-400 text-sm">
          Last updated: {analytics?.generatedAt ? new Date(analytics.generatedAt).toLocaleString() : 'N/A'}
        </p>
      </div>
    </motion.div>
  );
}