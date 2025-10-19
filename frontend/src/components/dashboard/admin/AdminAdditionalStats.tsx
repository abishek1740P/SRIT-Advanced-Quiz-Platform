import { motion } from "framer-motion";

interface DashboardStats {
  totalTeachers: number;
  totalStudents: number;
  totalQuizzes: number;
  activeQuizzes: number;
}

interface AdditionalStatsProps {
  stats: DashboardStats;
  loading: boolean;
}

export function AdditionalStats({ stats, loading }: AdditionalStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {/* Quiz Activity */}
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Quiz Activity</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Active Rate</span>
            {loading ? (
              <div className="animate-pulse bg-slate-700 rounded h-4 w-16"></div>
            ) : (
              <span className="text-white font-medium">
                {stats.totalQuizzes > 0
                  ? `${Math.round(
                      (stats.activeQuizzes / stats.totalQuizzes) * 100
                    )}%`
                  : "0%"}
              </span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Inactive Quizzes</span>
            {loading ? (
              <div className="animate-pulse bg-slate-700 rounded h-4 w-16"></div>
            ) : (
              <span className="text-white font-medium">
                {stats.totalQuizzes - stats.activeQuizzes}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}