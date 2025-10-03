"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Download,
  TrendingUp,
  Users,
  AlertTriangle,
  Zap,
  FileText,
  Loader2,
  Award,
  Clock,
  AlertCircle,
  MoreVertical,
} from "lucide-react";
import { teacherAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { RecentQuiz } from "@/types";

interface StudentPerformance {
  name: string;
  email: string;
  score: number;
  totalPoints: number;
  scorePercentage: number;
  violations: number;
  timeTaken: number;
  status: string;
}

interface QuizAnalytics {
  id: string;
  title: string;
  date: string;
  duration: number;
  totalStudents: number;
  avgScore: number;
  totalPoints: number;
  secretCode?: string;
  students: StudentPerformance[];
  hasAnalytics: boolean;
}

export default function TeacherHistoryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);
  const [quizHistory, setQuizHistory] = useState<QuizAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<string | null>(null);
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  useEffect(() => {
    fetchQuizHistory();
  }, []);

  const fetchQuizHistory = async () => {
    try {
      setLoading(true);

      // First get dashboard stats which contains the quiz data we need
      const dashboardResponse = await teacherAPI.getDashboardStats();
      console.log("Dashboard stats response:", dashboardResponse);

      if (dashboardResponse.data.success) {
        setDashboardStats(dashboardResponse.data.data);

        const recentQuizzes = dashboardResponse.data.data.recentQuizzes;
        console.log("Recent quizzes from dashboard:", recentQuizzes);

        // Convert RecentQuiz[] to QuizAnalytics[]
        const quizHistoryData: QuizAnalytics[] = recentQuizzes.map(
          (quiz: RecentQuiz) => ({
            id: quiz.id,
            title: quiz.title,
            date: quiz.date,
            duration: 0, // Not available in dashboard stats
            totalStudents: quiz.students,
            avgScore: quiz.avgScore,
            totalPoints: 0, // Will fetch from analytics if needed
            secretCode: quiz.secretCode,
            students: [], // Will fetch from analytics if expanded
            hasAnalytics: false, // Will fetch on demand
          })
        );

        console.log("Quiz history data:", quizHistoryData);
        setQuizHistory(quizHistoryData);
      }
    } catch (error: any) {
      console.error("Error fetching quiz history:", error);

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
          error.response?.data?.message || "Failed to load quiz history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch detailed analytics when a quiz is expanded
  const fetchQuizAnalytics = async (quizId: string) => {
    try {
      console.log(`Fetching detailed analytics for quiz: ${quizId}`);
      const analyticsResponse = await teacherAPI.getQuizAnalytics(quizId);

      if (analyticsResponse.data.success) {
        const analyticsData = analyticsResponse.data.data;
        console.log(`Analytics data for ${quizId}:`, analyticsData);

        // Update the quiz with detailed analytics data
        setQuizHistory((prev) =>
          prev.map((quiz) => {
            if (quiz.id === quizId) {
              return {
                ...quiz,
                totalPoints: analyticsData.quiz?.totalPoints || 0,
                students: analyticsData.students || [],
                hasAnalytics: true,
              };
            }
            return quiz;
          })
        );
      } else {
        console.warn(
          `Analytics failed for quiz ${quizId}:`,
          analyticsResponse.data.message
        );
        // Mark as no analytics available
        setQuizHistory((prev) =>
          prev.map((quiz) => {
            if (quiz.id === quizId) {
              return {
                ...quiz,
                hasAnalytics: false,
              };
            }
            return quiz;
          })
        );
      }
    } catch (error) {
      console.error(`Error fetching analytics for quiz ${quizId}:`, error);
      // Mark as no analytics available
      setQuizHistory((prev) =>
        prev.map((quiz) => {
          if (quiz.id === quizId) {
            return {
              ...quiz,
              hasAnalytics: false,
            };
          }
          return quiz;
        })
      );
    }
  };

  const handleExpandQuiz = (quizId: string) => {
    const isExpanding = expandedQuiz !== quizId;
    setExpandedQuiz(isExpanding ? quizId : null);

    // Fetch detailed analytics when expanding
    if (isExpanding) {
      const quiz = quizHistory.find((q) => q.id === quizId);
      if (quiz && !quiz.hasAnalytics && quiz.students.length === 0) {
        fetchQuizAnalytics(quizId);
      }
    }
  };

  const handleExportCSV = async (quizId: string, quizTitle: string) => {
    try {
      setExporting(quizId);

      // Find the quiz data
      const quiz = quizHistory.find((q) => q.id === quizId);
      if (!quiz || !quiz.hasAnalytics || quiz.students.length === 0) {
        toast({
          title: "Export Failed",
          description: "No student data available to export",
          variant: "destructive",
        });
        return;
      }

      // Create CSV content
      const headers = [
        "Name",
        "Email",
        "Score",
        "Max Score",
        "Percentage",
        "Violations",
        "Time Taken (min)",
        "Status",
      ];
      const studentData = quiz.students.map((student) => [
        student.name,
        student.email,
        student.score.toString(),
        student.totalPoints.toString(),
        student.scorePercentage.toString() + "%",
        student.violations.toString(),
        student.timeTaken.toString(),
        student.status,
      ]);

      const csvContent = [
        headers.join(","),
        ...studentData.map((row) => row.join(",")),
      ].join("\n");

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${quizTitle.replace(/[^a-z0-9]/gi, "_")}_results.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `Quiz results exported as CSV`,
      });
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export quiz results",
        variant: "destructive",
      });
    } finally {
      setExporting(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        <span className="ml-2">Loading quiz history...</span>
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

      <div className="relative z-10 mx-auto max-w-7xl p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Header Section - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push("/dashboard/teacher")}
                className="bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-white mt-1 flex-shrink-0"
                data-testid="button-back"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </motion.div>
            <div className="space-y-2 flex-1 min-w-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
              >
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 mr-2" />
                <span className="text-xs sm:text-sm font-medium text-slate-300">
                  Quiz History
                </span>
              </motion.div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight break-words">
                Quiz History &
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block sm:inline">
                  {" "}
                  Analytics
                </span>
              </h1>
              <p className="text-sm sm:text-base lg:text-xl text-slate-300">
                View detailed performance metrics for all quizzes
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Summary - Mobile Grid */}
        {dashboardStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6"
          >
            {dashboardStats.stats.map((stat: any, index: number) => (
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
        )}

        {/* Quiz History Section - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 sm:space-y-6"
        >
          {quizHistory.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Collapsible
                open={expandedQuiz === quiz.id}
                onOpenChange={() => handleExpandQuiz(quiz.id)}
              >
                <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 transition-all">
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="cursor-pointer hover:bg-slate-700/20 transition-all rounded-lg p-4 sm:p-6">
                      <div className="flex items-start justify-between w-full gap-3">
                        {/* Left Content - Quiz Info */}
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-left text-white text-base sm:text-lg lg:text-xl truncate">
                              {quiz.title}
                            </CardTitle>
                            <CardDescription className="text-slate-400 text-xs sm:text-sm mt-1">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                <span>{formatDate(quiz.date)}</span>
                                {quiz.secretCode && (
                                  <span className="flex items-center gap-1 bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-xs">
                                    Code: {quiz.secretCode}
                                  </span>
                                )}
                                {!quiz.hasAnalytics &&
                                  quiz.students.length === 0 && (
                                    <span className="flex items-center gap-1 bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded text-xs">
                                      <AlertCircle className="h-3 w-3" />
                                      Tap to load
                                    </span>
                                  )}
                              </div>
                            </CardDescription>
                          </div>
                        </div>

                        {/* Right Content - Stats & Chevron */}
                        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                          {/* Mobile: Stacked stats */}
                          <div className="hidden xs:flex flex-col items-end gap-1">
                            <div className="flex items-center gap-2 text-slate-400">
                              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="text-xs sm:text-sm">
                                {quiz.totalStudents}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                              <Award className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="text-xs sm:text-sm">
                                {quiz.totalPoints || "N/A"}
                              </span>
                            </div>
                            <div
                              className={`text-sm sm:text-lg font-bold ${
                                quiz.avgScore >= 80
                                  ? "text-green-400"
                                  : quiz.avgScore >= 60
                                  ? "text-yellow-400"
                                  : "text-red-400"
                              }`}
                            >
                              {quiz.avgScore}%
                            </div>
                          </div>

                          {/* Mobile: Compact stats for very small screens */}
                          <div className="xs:hidden flex flex-col items-end gap-0.5">
                            <div className="flex items-center gap-1 text-slate-400">
                              <Users className="h-3 w-3" />
                              <span className="text-xs">
                                {quiz.totalStudents}
                              </span>
                            </div>
                            <div
                              className={`text-xs font-bold ${
                                quiz.avgScore >= 80
                                  ? "text-green-400"
                                  : quiz.avgScore >= 60
                                  ? "text-yellow-400"
                                  : "text-red-400"
                              }`}
                            >
                              {quiz.avgScore}%
                            </div>
                          </div>

                          <div className="text-slate-400">
                            {expandedQuiz === quiz.id ? (
                              <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
                            ) : (
                              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="space-y-4 sm:space-y-6 pt-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <h4 className="font-semibold text-white text-sm sm:text-base lg:text-lg">
                          Student Performance ({quiz.students.length} students)
                        </h4>
                        {quiz.hasAnalytics && quiz.students.length > 0 && (
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full sm:w-auto"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleExportCSV(quiz.id, quiz.title)
                              }
                              disabled={exporting === quiz.id}
                              className="bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-600/50 hover:text-white transition-all w-full sm:w-auto"
                            >
                              {exporting === quiz.id ? (
                                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                              ) : (
                                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                              )}
                              Export CSV
                            </Button>
                          </motion.div>
                        )}
                      </div>

                      {quiz.hasAnalytics ? (
                        quiz.students.length > 0 ? (
                          <div className="rounded-lg border border-slate-600/50 overflow-hidden">
                            {/* Mobile Student Cards */}
                            <div className="sm:hidden space-y-3 p-2">
                              {quiz.students.map((student, idx) => (
                                <div
                                  key={idx}
                                  className="bg-slate-700/30 rounded-lg p-3 space-y-2 border border-slate-600/30"
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="space-y-1 flex-1 min-w-0">
                                      <h5 className="font-semibold text-white text-sm truncate">
                                        {student.name}
                                      </h5>
                                      <p className="text-xs text-slate-400 truncate">
                                        {student.email}
                                      </p>
                                    </div>
                                    <Badge
                                      className={
                                        student.scorePercentage >= 80
                                          ? "bg-green-500/20 text-green-400 border-green-500/30 text-xs"
                                          : student.scorePercentage >= 60
                                          ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs"
                                          : "bg-red-500/20 text-red-400 border-red-500/30 text-xs"
                                      }
                                    >
                                      {student.scorePercentage}%
                                    </Badge>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                      <span className="text-slate-400">
                                        Score:{" "}
                                      </span>
                                      <span className="font-semibold text-white">
                                        {student.score}/{student.totalPoints}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400">
                                        Time:{" "}
                                      </span>
                                      <span className="font-semibold text-white">
                                        {student.timeTaken}m
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400">
                                        Violations:{" "}
                                      </span>
                                      <span
                                        className={`font-semibold ${
                                          student.violations > 0
                                            ? "text-red-400"
                                            : "text-green-400"
                                        }`}
                                      >
                                        {student.violations}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400">
                                        Status:{" "}
                                      </span>
                                      <Badge
                                        className={
                                          student.status === "completed"
                                            ? "bg-green-500/20 text-green-400 border-green-500/30 text-xs"
                                            : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs"
                                        }
                                      >
                                        {student.status}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Desktop Table */}
                            <div className="hidden sm:block">
                              <Table>
                                <TableHeader className="bg-slate-700/50">
                                  <TableRow className="border-slate-600/50 hover:bg-slate-700/50">
                                    <TableHead className="text-slate-300 font-semibold">
                                      Student
                                    </TableHead>
                                    <TableHead className="text-slate-300 font-semibold">
                                      Email
                                    </TableHead>
                                    <TableHead className="text-slate-300 font-semibold">
                                      Score
                                    </TableHead>
                                    <TableHead className="text-slate-300 font-semibold">
                                      Percentage
                                    </TableHead>
                                    <TableHead className="text-slate-300 font-semibold">
                                      Violations
                                    </TableHead>
                                    <TableHead className="text-slate-300 font-semibold">
                                      Time Taken
                                    </TableHead>
                                    <TableHead className="text-slate-300 font-semibold">
                                      Status
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {quiz.students.map((student, idx) => (
                                    <TableRow
                                      key={idx}
                                      className="border-slate-600/30 hover:bg-slate-700/30 transition-all"
                                    >
                                      <TableCell className="font-medium text-white">
                                        {student.name}
                                      </TableCell>
                                      <TableCell className="text-slate-400">
                                        {student.email}
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex flex-col">
                                          <span className="font-semibold text-white">
                                            {student.score}/
                                            {student.totalPoints}
                                          </span>
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <Badge
                                          className={
                                            student.scorePercentage >= 80
                                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                                              : student.scorePercentage >= 60
                                              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                              : "bg-red-500/20 text-red-400 border-red-500-30"
                                          }
                                        >
                                          {student.scorePercentage}%
                                        </Badge>
                                      </TableCell>
                                      <TableCell>
                                        {student.violations > 0 ? (
                                          <div className="flex items-center gap-2 text-red-400">
                                            <AlertTriangle className="h-4 w-4" />
                                            <span className="font-medium">
                                              {student.violations}
                                            </span>
                                          </div>
                                        ) : (
                                          <span className="text-green-400 font-medium">
                                            0
                                          </span>
                                        )}
                                      </TableCell>
                                      <TableCell className="text-slate-300">
                                        <div className="flex items-center gap-2">
                                          <Clock className="h-4 w-4" />
                                          {student.timeTaken} min
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <Badge
                                          className={
                                            student.status === "completed"
                                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                                              : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                          }
                                        >
                                          {student.status}
                                        </Badge>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-6 sm:py-8 text-slate-400">
                            <Users className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                            <p className="text-sm sm:text-base">
                              No students have attempted this quiz yet.
                            </p>
                          </div>
                        )
                      ) : (
                        <div className="text-center py-6 sm:py-8 text-slate-400">
                          <Loader2 className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50 animate-spin" />
                          <p className="text-sm sm:text-base">
                            Loading analytics data...
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State (if no quizzes) */}
        {quizHistory.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 sm:py-16"
          >
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <FileText className="h-8 w-8 sm:h-12 sm:w-12 text-slate-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-300 mb-2">
              No Quiz History
            </h3>
            <p className="text-slate-400 mb-6 text-sm sm:text-base">
              You haven't conducted any quizzes yet.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => router.push("/dashboard/teacher/create-quiz")}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-sm sm:text-base"
              >
                Create Your First Quiz
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
