"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  PlusCircle,
  FileText,
  Zap,
  Loader2,
  Users,
  ToggleLeft,
  ToggleRight,
  Lock,
  Unlock,
  History,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { teacherAPI, authAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { StatItem, RecentQuiz } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { Copy } from "lucide-react";

export default function TeacherDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<StatItem[]>([]);
  const [recentQuizzes, setRecentQuizzes] = useState<RecentQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [updatingQuiz, setUpdatingQuiz] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null); // Add this line

  // Check authentication first
  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token || !user) {
        router.push("/auth/login");
        return;
      }

      // Verify the token is valid by calling getMe
      await authAPI.getMe();
      setAuthChecked(true);
      fetchDashboardData();
    } catch (error) {
      toast({
        title: "Session Expired",
        description: "Please log in again",
        variant: "destructive",
      });
      logout();
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const response = await teacherAPI.getDashboardStats();

      if (response.data.success) {
        setStats(response.data.data.stats);
        setRecentQuizzes(response.data.data.recentQuizzes);

        // Debug: Check if secret codes are present
      }
    } catch (error: any) {
      // Check if it's an authentication error
      if (error.response?.status === 401) {
        toast({
          title: "Session Expired",
          description: "Please log in again",
          variant: "destructive",
        });
        logout();
        return;
      }

      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // const handleQuizClick = (quizId: string) => {
  //   router.push(`/dashboard/teacher/analytics/${quizId}`);
  // };

  const toggleQuizStatus = async (quizId: string, currentStatus: boolean) => {
    try {
      setUpdatingQuiz(quizId);

      const response = await teacherAPI.toggleQuizStatus(
        quizId,
        !currentStatus
      );

      if (response.data.success) {
        // Update local state
        setRecentQuizzes((prevQuizzes) =>
          prevQuizzes.map((quiz) =>
            quiz.id === quizId ? { ...quiz, isActive: !currentStatus } : quiz
          )
        );

        toast({
          title: "Success",
          description: `Quiz ${
            !currentStatus ? "enabled" : "disabled"
          } successfully`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update quiz status",
        variant: "destructive",
      });
    } finally {
      setUpdatingQuiz(null);
    }
  };

  // Show loading until auth is checked
  if (!authChecked || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // If user is not a teacher, show error
  if (user?.role !== "teacher") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">
            Access Denied
          </h1>
          <p className="text-slate-300 mb-4">
            You don't have permission to access the teacher dashboard.
          </p>
          <Button onClick={logout}>Go to Student Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl p-6 space-y-8">
        {/* Header Section - Fixed for mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Top section with badge and title */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
            >
              <Zap className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-sm font-medium text-slate-300">
                Teacher Dashboard
              </span>
            </motion.div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-2 flex-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                  Welcome to Your
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {" "}
                    Teacher Dashboard
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-slate-300 max-w-2xl">
                  Manage quizzes and track student performance with detailed
                  analytics
                </p>
              </div>

              {/* Buttons Section - Stack on mobile, row on larger screens */}
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 sm:flex-none"
                >
                  <Button
                    onClick={() =>
                      router.push("/dashboard/teacher/create-quiz")
                    }
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 sm:px-6 rounded-xl transition-all shadow-lg shadow-blue-500/25 w-full"
                    data-testid="button-create-quiz"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Create New Quiz
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 sm:flex-none"
                >
                  <Button
                    onClick={() =>
                      router.push("/dashboard/teacher/choose-quiz")
                    }
                    className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold py-3 px-4 sm:px-6 rounded-xl transition-all shadow-lg shadow-green-500/25 w-full"
                    data-testid="button-choose-quiz"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Use Quiz Templates
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Rest of the dashboard component remains the same */}
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 transition-all h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-sm font-medium text-slate-300">
                    {stat.label}
                  </CardTitle>
                  {stat.label.includes("Quizzes") ? (
                    <FileText className="h-5 w-5 text-blue-400" />
                  ) : (
                    <Users className="h-5 w-5 text-green-400" />
                  )}
                </CardHeader>
                <CardContent>
                  <div
                    className="text-2xl font-bold text-white"
                    data-testid={`stat-${stat.label
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Quizzes Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 transition-all">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Recent Quizzes</CardTitle>
                    <CardDescription className="text-slate-400">
                      View and manage your conducted quizzes
                    </CardDescription>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    className="bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-600/50 hover:text-white transition-all w-full sm:w-auto"
                    onClick={() => router.push("/dashboard/teacher/history")}
                    data-testid="button-view-all"
                  >
                    View All
                  </Button>
                </motion.div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentQuizzes.length > 0 ? (
                  recentQuizzes.map((quiz, index) => (
                    <motion.div
                      key={quiz.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-700/30 border border-slate-600/30 hover:border-slate-500/50 hover:bg-slate-700/50 transition-all cursor-pointer group"
                      data-testid={`quiz-card-${quiz.id}`}
                    >
                      <div className="space-y-2 flex-1 mb-4 sm:mb-0">
                        <div className="flex items-center gap-2">
                          <h4
                            className="font-semibold text-white group-hover:text-blue-300 transition-colors text-lg sm:text-base cursor-pointer"
                            // onClick={() => handleQuizClick(quiz.id)}
                          >
                            {quiz.title}
                          </h4>
                          <div
                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                              quiz.isActive
                                ? "bg-green-500/20 text-green-300"
                                : "bg-red-500/20 text-red-300"
                            }`}
                          >
                            {quiz.isActive ? (
                              <>
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                Active
                              </>
                            ) : (
                              <>
                                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                Inactive
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {new Date(quiz.date).toLocaleDateString()}
                          </span>
                          {/* Add secret code display */}
                          {quiz.secretCode && (
                            <span
                              className={`flex items-center gap-1 px-2 py-1 rounded text-xs cursor-pointer transition-all duration-200 ${
                                copiedCode === quiz.secretCode
                                  ? "bg-green-500/20 text-green-300 scale-105"
                                  : "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (quiz.secretCode) {
                                  navigator.clipboard.writeText(
                                    quiz.secretCode
                                  );
                                  setCopiedCode(quiz.secretCode);
                                  toast({
                                    title: "Code Copied!",
                                    description:
                                      "Quiz code has been copied to clipboard",
                                  });

                                  setTimeout(() => setCopiedCode(null), 2000);
                                }
                              }}
                            >
                              {copiedCode === quiz.secretCode ? (
                                <>
                                  <svg
                                    className="w-3 h-3"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Lock className="h-3 w-3" />
                                  Code: {quiz.secretCode}
                                </>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                        <div className="text-left sm:text-right">
                          <p className="text-sm text-slate-400">Students</p>
                          <p className="text-lg font-bold text-green-400">
                            {quiz.students}
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-sm text-slate-400">Avg Score</p>
                          <p className="text-lg font-bold text-blue-400">
                            {quiz.avgScore}%
                          </p>
                        </div>
                        {/* Toggle Button */}
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleQuizStatus(quiz.id, quiz.isActive);
                            }}
                            disabled={updatingQuiz === quiz.id}
                            className={`flex items-center gap-2 ${
                              quiz.isActive
                                ? "bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30"
                                : "bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30"
                            } transition-all`}
                          >
                            {updatingQuiz === quiz.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : quiz.isActive ? (
                              <>
                                <ToggleLeft className="h-4 w-4" />
                                Disable
                              </>
                            ) : (
                              <>
                                <ToggleRight className="h-4 w-4" />
                                Enable
                              </>
                            )}
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {/* <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuizClick(quiz.id)}
                            className="bg-slate-600/50 border-slate-500/50 text-slate-300 hover:bg-slate-500/50 hover:text-white transition-all"
                          >
                            Analytics
                          </Button> */}
                        </motion.div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No quizzes created yet</p>
                    <Button
                      onClick={() =>
                        router.push("/dashboard/teacher/create-quiz")
                      }
                      className="mt-4"
                    >
                      Create Your First Quiz
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
