// frontend/src/app/dashboard/admin/analytics/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  GraduationCap,
  TrendingUp,
  Calendar,
  Download,
  RefreshCw,
  FileText,
  Clock,
  Award,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { adminAPI } from "@/lib/api";
import Link from "next/link";

interface SystemAnalytics {
  quizzesLast30Days: number;
  responsesLast30Days: number;
  topTeachers: Array<{
    _id: string;
    name: string;
    email: string;
    quizCount: number;
  }>;
  generatedAt: string;
}

interface DashboardStats {
  totalTeachers: number;
  totalStudents: number;
  totalQuizzes: number;
  activeQuizzes: number;
}

export default function AnalyticsPage() {
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<SystemAnalytics | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<"7days" | "30days" | "90days">("30days");

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [analyticsResponse, statsResponse] = await Promise.all([
        adminAPI.getSystemAnalytics(),
        adminAPI.getDashboardStats(),
      ]);

      if (analyticsResponse.data.success) {
        setAnalytics(analyticsResponse.data.data);
      }

      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch analytics:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnalyticsData();
  };

  const handleExportData = async () => {
    try {
      // This would be implemented based on your export API
      toast({
        title: "Export Started",
        description: "Your analytics data is being prepared for download.",
      });
    } catch (error: any) {
      toast({
        title: "Export Failed",
        description: error.response?.data?.message || "Failed to export data",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-700 rounded w-64 mb-2"></div>
            <div className="h-4 bg-slate-700 rounded w-96 mb-8"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
                  <div className="h-6 bg-slate-700 rounded w-32 mb-2"></div>
                  <div className="h-8 bg-slate-700 rounded w-20 mb-4"></div>
                  <div className="h-4 bg-slate-700 rounded w-24"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
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
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
              </select>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg font-semibold flex items-center space-x-2 hover:bg-slate-600/50 transition-all text-sm"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExportData}
                className="px-3 py-2 bg-blue-600 rounded-lg font-semibold flex items-center space-x-2 hover:bg-blue-700 transition-all text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </motion.button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-slate-400 text-sm">Total Teachers</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {stats?.totalTeachers || 0}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <div className="flex items-center text-green-400 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>Active faculty</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-slate-400 text-sm">Total Students</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {stats?.totalStudents?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <div className="flex items-center text-green-400 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>Enrolled students</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-slate-400 text-sm">Recent Quizzes</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {analytics?.quizzesLast30Days || 0}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-green-400" />
                </div>
              </div>
              <div className="flex items-center text-slate-400 text-sm">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Last 30 days</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-slate-400 text-sm">Quiz Responses</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {analytics?.responsesLast30Days?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-orange-400" />
                </div>
              </div>
              <div className="flex items-center text-slate-400 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                <span>Last 30 days</span>
              </div>
            </motion.div>
          </div>

          {/* Top Teachers and Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Teachers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Top Teachers</h3>
                <Award className="w-5 h-5 text-yellow-400" />
              </div>

              <div className="space-y-4">
                {analytics?.topTeachers && analytics.topTeachers.length > 0 ? (
                  analytics.topTeachers.map((teacher, index) => (
                    <div
                      key={teacher._id}
                      className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-white">
                            {teacher.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">
                            {teacher.name}
                          </p>
                          <p className="text-slate-400 text-xs">
                            {teacher.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">
                          {teacher.quizCount}
                        </p>
                        <p className="text-slate-400 text-xs">Quizzes</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No teacher data available</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* System Summary */}
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
                <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-slate-300">Total Quizzes</span>
                  <span className="text-white font-bold">{stats?.totalQuizzes || 0}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-slate-300">Active Quizzes</span>
                  <span className="text-green-400 font-bold">{stats?.activeQuizzes || 0}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-slate-300">Quiz Activity Rate</span>
                  <span className="text-white font-bold">
                    {stats && stats.totalQuizzes > 0
                      ? `${Math.round((stats.activeQuizzes / stats.totalQuizzes) * 100)}%`
                      : '0%'
                    }
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-slate-300">Avg Responses per Quiz</span>
                  <span className="text-white font-bold">
                    {analytics && stats && stats.totalQuizzes > 0
                      ? Math.round(analytics.responsesLast30Days / stats.totalQuizzes)
                      : 0
                    }
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700/50">
                <p className="text-slate-400 text-sm">
                  Last updated: {analytics?.generatedAt ? new Date(analytics.generatedAt).toLocaleString() : 'N/A'}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Additional Charts Section - Placeholder for future implementation */}
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
        </div>
      </div>
    </div>
  );
}