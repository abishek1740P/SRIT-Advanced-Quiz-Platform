// frontend/src/app/dashboard/admin/analytics/components/AnalyticsMetrics.tsx
import { motion } from "framer-motion";
import { Users, GraduationCap, FileText, BarChart3, TrendingUp, Calendar, Clock } from "lucide-react";
import MetricCard from "./MetricCard";
import { SystemAnalytics, DashboardStats } from "../../../../types/index";

interface AnalyticsMetricsProps {
  stats: DashboardStats | null;
  analytics: SystemAnalytics | null;
}

export default function AnalyticsMetrics({ stats, analytics }: AnalyticsMetricsProps) {
  const metrics = [
    {
      title: "Total Teachers",
      value: stats?.totalTeachers || 0,
      icon: GraduationCap,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/20",
      trend: { icon: TrendingUp, text: "Active faculty", color: "text-green-400" },
    },
    {
      title: "Total Students",
      value: stats?.totalStudents?.toLocaleString() || 0,
      icon: Users,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/20",
      trend: { icon: TrendingUp, text: "Enrolled students", color: "text-green-400" },
    },
    {
      title: "Recent Quizzes",
      value: analytics?.quizzesLast30Days || 0,
      icon: FileText,
      iconColor: "text-green-400",
      iconBg: "bg-green-500/20",
      trend: { icon: Calendar, text: "Last 30 days", color: "text-slate-400" },
    },
    {
      title: "Quiz Responses",
      value: analytics?.responsesLast30Days?.toLocaleString() || 0,
      icon: BarChart3,
      iconColor: "text-orange-400",
      iconBg: "bg-orange-500/20",
      trend: { icon: Clock, text: "Last 30 days", color: "text-slate-400" },
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <MetricCard
          key={metric.title}
          metric={metric}
          index={index}
        />
      ))}
    </div>
  );
}