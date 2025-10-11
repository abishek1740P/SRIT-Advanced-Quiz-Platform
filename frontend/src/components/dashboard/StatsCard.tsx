// components/dashboard/StatsCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users } from "lucide-react";
import { motion } from "framer-motion";

interface StatsCardProps {
  stat: {
    label: string;
    value: string | number;
  };
  index: number;
}

export function StatsCard({ stat, index }: StatsCardProps) {
  const Icon = stat.label.includes("Quizzes") ? FileText : Users;
  const iconColor = stat.label.includes("Quizzes") ? "text-blue-400" : "text-green-400";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 * index }}
    >
      <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 transition-all h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-sm font-medium text-slate-300">
            {stat.label}
          </CardTitle>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </CardHeader>
        <CardContent>
          <div
            className="text-2xl font-bold text-white"
            data-testid={`stat-${stat.label.toLowerCase().replace(" ", "-")}`}
          >
            {stat.value}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}