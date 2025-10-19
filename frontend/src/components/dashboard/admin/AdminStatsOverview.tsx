import { motion } from "framer-motion";
import { Users, GraduationCap, BarChart3 } from "lucide-react";
import { StatsCard } from "../admin/AdminStatsCard";

interface DashboardStats {
  totalTeachers: number;
  totalStudents: number;
  totalQuizzes: number;
  activeQuizzes: number;
}

interface StatsOverviewProps {
  stats: DashboardStats;
  loading: boolean;
}

export function StatsOverview({ stats, loading }: StatsOverviewProps) {
  const statCards = [
    {
      id: "teachers",
      title: "Total Teachers",
      value: stats.totalTeachers,
      description: "Registered faculty members",
      icon: GraduationCap,
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
    },
    {
      id: "students",
      title: "Total Students",
      value: stats.totalStudents.toLocaleString(),
      description: "Enrolled students",
      icon: Users,
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-400",
    },
    {
      id: "quizzes",
      title: "Total Quizzes",
      value: stats.totalQuizzes,
      description: "All quizzes created",
      icon: BarChart3,
      iconBg: "bg-green-500/20",
      iconColor: "text-green-400",
    },
    {
      id: "active-quizzes",
      title: "Active Quizzes",
      value: stats.activeQuizzes,
      description: "Currently running quizzes",
      icon: BarChart3,
      iconBg: "bg-orange-500/20",
      iconColor: "text-orange-400",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {statCards.map((card) => (
        <StatsCard
          key={card.id}
          title={card.title}
          value={card.value}
          description={card.description}
          icon={card.icon}
          iconBg={card.iconBg}
          iconColor={card.iconColor}
          loading={loading}
        />
      ))}
    </motion.div>
  );
}