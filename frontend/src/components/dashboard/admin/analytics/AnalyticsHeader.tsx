// frontend/src/app/dashboard/admin/analytics/components/AnalyticsHeader.tsx
import { motion } from "framer-motion";
import { RefreshCw, Download } from "lucide-react";
import Link from "next/link";
import { TimeRange } from "../../../../types/index";

interface AnalyticsHeaderProps {
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  onRefresh: () => void;
  onExport: () => void;
  refreshing: boolean;
}

export default function AnalyticsHeader({
  timeRange,
  onTimeRangeChange,
  onRefresh,
  onExport,
  refreshing,
}: AnalyticsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link
          href="/dashboard/admin"
          className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-arrow-left w-5 h-5 text-slate-300"
          >
            <path d="m12 19-7-7 7-7"></path>
            <path d="M19 12H5"></path>
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            System Analytics
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Comprehensive insights and performance metrics
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <select
          value={timeRange}
          onChange={(e) => onTimeRangeChange(e.target.value as TimeRange)}
          className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
        </select>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRefresh}
          disabled={refreshing}
          className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg font-semibold flex items-center space-x-2 hover:bg-slate-600/50 transition-all text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onExport}
          className="px-3 py-2 bg-blue-600 rounded-lg font-semibold flex items-center space-x-2 hover:bg-blue-700 transition-all text-sm"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </motion.button>
      </div>
    </div>
  );
}