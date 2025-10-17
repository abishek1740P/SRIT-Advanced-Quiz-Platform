// src/app/dashboard/teacher/history/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { TeacherHistoryHeader } from "@/components/TeacherHistoryHeader";
import { StatsSummary } from "@/components/StatsSummary";
import { QuizAnalyticsCard } from "@/components/CreateQuizRelated/QuizAnalyticsCard";
import { EmptyQuizHistoryTeacher } from "@/components/EmptyQuizHistoryTeacher";
import { BackgroundElements } from "@/components/Common/BackgroundElements";
import { teacherAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { RecentQuiz, DashboardStats } from "@/types";
import { Loader2 } from "lucide-react";

// Use the same interface as in QuizAnalyticsCard
interface StudentPerformance {
  name: string;
  email: string;
  score: number;
  totalPoints: number;
  scorePercentage: number;
  violations: number;
  timeTaken: number;
  status: string;
  startTime: string;
  endTime: string;
  attendedAt: string;
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
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetchQuizHistory();
  }, []);

  const fetchQuizHistory = async () => {
    try {
      setLoading(true);
      const dashboardResponse = await teacherAPI.getDashboardStats();
      console.log("Dashboard response:", dashboardResponse);

      if (dashboardResponse.data.success) {
        const dashboardData: DashboardStats = dashboardResponse.data.data;
        setDashboardStats(dashboardData);

        // Use the correct TypeScript type
        const recentQuizzes = dashboardData.recentQuizzes || [];

        console.log("Recent quizzes:", recentQuizzes);

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

        console.log("Processed quiz history:", quizHistoryData);
        setQuizHistory(quizHistoryData);
      } else {
        console.error(
          "Dashboard API returned unsuccessful:",
          dashboardResponse.data
        );
        toast({
          title: "Error",
          description:
            dashboardResponse.data.message || "Failed to load dashboard data",
          variant: "destructive",
        });
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

  const fetchQuizAnalytics = async (quizId: string) => {
    try {
      console.log(`Fetching detailed analytics for quiz: ${quizId}`);
      const analyticsResponse = await teacherAPI.getQuizAnalytics(quizId);
      console.log(`Analytics response for ${quizId}:`, analyticsResponse);

      if (analyticsResponse.data.success) {
        const analyticsData = analyticsResponse.data.data;

        setQuizHistory((prev) =>
          prev.map((quiz) => {
            if (quiz.id === quizId) {
              const studentsWithAttendance = (analyticsData.students || []).map(
                (student: any) => ({
                  name: student.name || "Unknown",
                  email: student.email || "No email",
                  score: student.score || 0,
                  totalPoints: student.totalPoints || 0,
                  scorePercentage: student.scorePercentage || 0,
                  violations: student.violations || 0,
                  timeTaken: student.timeTaken || 0,
                  status: student.status || "unknown",
                  startTime: student.startTime || "",
                  endTime: student.endTime || "",
                  attendedAt:
                    student.attendedAt ||
                    student.startTime ||
                    student.endTime ||
                    new Date().toISOString(),
                })
              );

              // Debug: Check the student data
              console.log("Processed students:", studentsWithAttendance);

              return {
                ...quiz,
                totalPoints:
                  analyticsData.quiz?.totalPoints || quiz.totalPoints,
                students: studentsWithAttendance,
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
        setQuizHistory((prev) =>
          prev.map((quiz) => {
            if (quiz.id === quizId) {
              return { ...quiz, hasAnalytics: false };
            }
            return quiz;
          })
        );
      }
    } catch (error) {
      console.error(`Error fetching analytics for quiz ${quizId}:`, error);
      setQuizHistory((prev) =>
        prev.map((quiz) => {
          if (quiz.id === quizId) {
            return { ...quiz, hasAnalytics: false };
          }
          return quiz;
        })
      );

      toast({
        title: "Analytics Error",
        description: "Failed to load detailed quiz analytics",
        variant: "destructive",
      });
    }
  };

  const handleExpandQuiz = (quizId: string) => {
    const isExpanding = expandedQuiz !== quizId;
    setExpandedQuiz(isExpanding ? quizId : null);

    if (isExpanding) {
      const quiz = quizHistory.find((q) => q.id === quizId);
      if (quiz && !quiz.hasAnalytics) {
        fetchQuizAnalytics(quizId);
      }
    }
  };

  // In your TeacherHistoryPage component, update the handleExportCSV function:
  const handleExportCSV = async (quizId: string, quizTitle: string) => {
    try {
      setExporting(quizId);

      const quiz = quizHistory.find((q) => q.id === quizId);
      if (!quiz || !quiz.hasAnalytics || quiz.students.length === 0) {
        toast({
          title: "Export Failed",
          description: "No student data available to export",
          variant: "destructive",
        });
        return;
      }

      // Debug: Check the actual student data
      console.log("Raw student data:", quiz.students);

      const headers = [
        "Name",
        "Email",
        "Score",
        "Max Score",
        "Percentage",
        "Violations",
        "Time Taken (min)",
        "Attended Date",
        "Status",
      ];

      const studentData = quiz.students.map((student) => {
        // Debug each student
        console.log("Processing student:", student);

        const formattedDate = formatDate(student.attendedAt);
        console.log("Formatted date:", formattedDate);

        return [
          student.name || "N/A",
          student.email || "N/A",
          student.score?.toString() || "0",
          student.totalPoints?.toString() || "0",
          `${student.scorePercentage?.toString() || "0"}%`,
          student.violations?.toString() || "0",
          student.timeTaken?.toString() || "0",
          formattedDate,
          student.status || "unknown",
        ];
      });

      // Debug the final CSV data
      console.log("Final CSV data sample:", studentData[0]);

      const csvContent = [
        headers.join(","),
        ...studentData.map((row) =>
          row
            .map((field) => `"${field.toString().replace(/"/g, '""')}"`)
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
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

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast({
      title: "Code Copied!",
      description: "Quiz code has been copied to clipboard",
    });

    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "N/A";

      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn("Invalid date string:", dateString);
        return "Invalid Date";
      }

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return "Invalid Date";
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400 mb-2" />
          <span className="text-slate-300">Loading quiz history...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
      <BackgroundElements />

      <div className="relative z-10 mx-auto max-w-7xl p-4 sm:p-6 space-y-6 sm:space-y-8">
        <TeacherHistoryHeader
          onBack={() => router.push("/dashboard/teacher")}
        />

        {dashboardStats && dashboardStats.stats && (
          <StatsSummary stats={dashboardStats.stats} />
        )}

        {/* Quiz History Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 sm:space-y-6"
        >
          {quizHistory.map((quiz, index) => (
            <QuizAnalyticsCard
              key={quiz.id}
              quiz={quiz}
              index={index}
              expandedQuiz={expandedQuiz}
              exporting={exporting}
              copiedCode={copiedCode}
              onExpand={handleExpandQuiz}
              onCopyCode={handleCopyCode}
              onExportCSV={handleExportCSV}
              formatDate={formatDate}
              formatDateTime={formatDateTime}
            />
          ))}
        </motion.div>

        {quizHistory.length === 0 && (
          <EmptyQuizHistoryTeacher
            onAction={() => router.push("/dashboard/teacher/create-quiz")}
          />
        )}
      </div>
    </div>
  );
}
