// src/components/StatsSummary.tsx
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users } from "lucide-react";

interface Stat {
  label: string;
  value: string | number;
}

interface StatsSummaryProps {
  stats: Stat[];
  className?: string;
}

export function StatsSummary({ stats, className = "" }: StatsSummaryProps) {
  if (!stats || stats.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={`grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 ${className}`}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 * index }}
          className="col-span-1"
        >
          <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 transition-all h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-4 sm:pb-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-slate-300 truncate">
                {stat.label}
              </CardTitle>
              {stat.label.includes("Quizzes") ? (
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0" />
              ) : (
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0" />
              )}
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}