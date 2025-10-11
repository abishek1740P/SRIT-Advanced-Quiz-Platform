// src/app/dashboard/teacher/history/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { TeacherHistoryHeader } from "@/components/TeacherHistoryHeader";
import { StatsSummary } from "@/components/StatsSummary";
import { QuizAnalyticsCard } from "@/components/QuizAnalyticsCard";
import { EmptyQuizHistoryTeacher } from "@/components/EmptyQuizHistoryTeacher";
import { BackgroundElements } from "@/components/BackgroundElements";
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
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetchQuizHistory();
  }, []);

  const fetchQuizHistory = async () => {
    try {
      setLoading(true);
      const dashboardResponse = await teacherAPI.getDashboardStats();

      if (dashboardResponse.data.success) {
        setDashboardStats(dashboardResponse.data.data);

        const recentQuizzes = dashboardResponse.data.data.recentQuizzes;
        const quizHistoryData: QuizAnalytics[] = recentQuizzes.map(
          (quiz: RecentQuiz) => ({
            id: quiz.id,
            title: quiz.title,
            date: quiz.date,
            duration: 0,
            totalStudents: quiz.students,
            avgScore: quiz.avgScore,
            totalPoints: 0,
            secretCode: quiz.secretCode,
            students: [],
            hasAnalytics: false,
          })
        );

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

  const fetchQuizAnalytics = async (quizId: string) => {
    try {
      const analyticsResponse = await teacherAPI.getQuizAnalytics(quizId);

      if (analyticsResponse.data.success) {
        const analyticsData = analyticsResponse.data.data;
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

      const quiz = quizHistory.find((q) => q.id === quizId);
      if (!quiz || !quiz.hasAnalytics || quiz.students.length === 0) {
        toast({
          title: "Export Failed",
          description: "No student data available to export",
          variant: "destructive",
        });
        return;
      }

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        <span className="ml-2">Loading quiz history...</span>
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

        {dashboardStats && <StatsSummary stats={dashboardStats.stats} />}

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
