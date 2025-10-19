// frontend/src/app/dashboard/admin/analytics/components/AnalyticsContent.tsx
import { motion } from "framer-motion";
import TopTeachers from "./TopTeachers";
import SystemSummary from "./SystemSummary";
import ActivityTrends from "./ActivityTrends";
import { SystemAnalytics, DashboardStats } from "../../../../types/index";

interface AnalyticsContentProps {
  stats: DashboardStats | null;
  analytics: SystemAnalytics | null;
}

export default function AnalyticsContent({ stats, analytics }: AnalyticsContentProps) {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopTeachers teachers={analytics?.topTeachers} />
        <SystemSummary stats={stats} analytics={analytics} />
      </div>
      
      <ActivityTrends />
    </>
  );
}