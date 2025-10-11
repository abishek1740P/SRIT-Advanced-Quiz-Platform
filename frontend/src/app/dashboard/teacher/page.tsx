// src/app/dashboard/teacher/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileText, Loader2, ToggleLeft, ToggleRight } from "lucide-react";
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
import { StatsCard } from "@/components/dashboard/StatsCard";
import { QuizCard } from "@/components/dashboard/QuizCard";
import { ActionButtons } from "@/components/dashboard/ActionButtons";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function TeacherDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<StatItem[]>([]);
  const [recentQuizzes, setRecentQuizzes] = useState<RecentQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [updatingQuiz, setUpdatingQuiz] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

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
      }
    } catch (error: any) {
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

  const toggleQuizStatus = async (quizId: string, currentStatus: boolean) => {
    try {
      setUpdatingQuiz(quizId);
      const response = await teacherAPI.toggleQuizStatus(
        quizId,
        !currentStatus
      );

      if (response.data.success) {
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

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast({
      title: "Code Copied!",
      description: "Quiz code has been copied to clipboard",
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // const handleViewAnalytics = (quizId: string) => {
  //   router.push(`/dashboard/teacher/analytics/${quizId}`);
  // };

  if (!authChecked || loading) {
    return <LoadingState />;
  }

  if (user?.role !== "teacher") {
    return <AccessDenied onLogout={logout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
      <BackgroundElements />

      <div className="relative z-10 mx-auto max-w-7xl p-6 space-y-8">
        <DashboardHeader
          title="Welcome to Your"
          subtitle="Manage quizzes and track student performance with detailed analytics"
          badgeText="Teacher Dashboard"
          actionButtons={
            <ActionButtons
              onCreateQuiz={() => router.push("/dashboard/teacher/create-quiz")}
              onUseTemplates={() =>
                router.push("/dashboard/teacher/choose-quiz")
              }
            />
          }
        />

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {stats.map((stat, index) => (
            <StatsCard key={stat.label} stat={stat} index={index} />
          ))}
        </motion.div>

        {/* Recent Quizzes Section */}
        <RecentQuizzesSection
          quizzes={recentQuizzes}
          updatingQuiz={updatingQuiz}
          copiedCode={copiedCode}
          onToggleQuizStatus={toggleQuizStatus}
          onCopyCode={handleCopyCode}
          // onViewAnalytics={handleViewAnalytics}
          onViewAll={() => router.push("/dashboard/teacher/history")}
          onCreateQuiz={() => router.push("/dashboard/teacher/create-quiz")}
        />
      </div>
    </div>
  );
}

// Additional reusable components
function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      <span className="ml-2">Loading...</span>
    </div>
  );
}

function AccessDenied({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h1>
        <p className="text-slate-300 mb-4">
          You don't have permission to access the teacher dashboard.
        </p>
        <Button onClick={onLogout}>Go to Student Dashboard</Button>
      </div>
    </div>
  );
}

function BackgroundElements() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
    </div>
  );
}

function RecentQuizzesSection({
  quizzes,
  updatingQuiz,
  copiedCode,
  onToggleQuizStatus,
  onCopyCode,
  // onViewAnalytics,
  onViewAll,
  onCreateQuiz,
}: {
  quizzes: RecentQuiz[];
  updatingQuiz: string | null;
  copiedCode: string | null;
  onToggleQuizStatus: (quizId: string, currentStatus: boolean) => void;
  onCopyCode: (code: string) => void;
  // onViewAnalytics: (quizId: string) => void;
  onViewAll: () => void;
  onCreateQuiz: () => void;
}) {
  return (
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
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-600/50 hover:text-white transition-all w-full sm:w-auto"
                onClick={onViewAll}
                data-testid="button-view-all"
              >
                View All
              </Button>
            </motion.div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quizzes.length > 0 ? (
              quizzes.map((quiz, index) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  index={index}
                  updatingQuiz={updatingQuiz}
                  copiedCode={copiedCode}
                  onToggleStatus={onToggleQuizStatus}
                  onCopyCode={onCopyCode}
                  // onViewAnalytics={onViewAnalytics}
                />
              ))
            ) : (
              <EmptyQuizzesState onCreateQuiz={onCreateQuiz} />
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function EmptyQuizzesState({ onCreateQuiz }: { onCreateQuiz: () => void }) {
  return (
    <div className="text-center py-8 text-slate-400">
      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
      <p>No quizzes created yet</p>
      <Button onClick={onCreateQuiz} className="mt-4">
        Create Your First Quiz
      </Button>
    </div>
  );
}
