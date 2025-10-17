// src/app/dashboard/student/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { JoinQuizCard } from "@/components/Cards/JoinQuizCard";
import { PastQuizzesCard } from "@/components/Cards/PastQuizzesCard";
import { DashboardHeader } from "@/components/DashboardHeader";
import { BackgroundElements } from "@/components/Common/BackgroundElements";
import { LoadingState } from "@/components/Common/LoadingState";
import { useToast } from "@/hooks/use-toast";
import { studentAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { QuizResponse } from "@/types";

interface PastQuiz {
  id: string;
  title: string;
  teacher: string;
  date: string;
  score: number;
  maxScore: number;
  timeTaken: string;
  status: string;
  quizId: string;
}

export default function StudentDashboard() {
  const [quizCode, setQuizCode] = useState("");
  const [pastQuizzes, setPastQuizzes] = useState<PastQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningQuiz, setJoiningQuiz] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchStudentQuizzes();
  }, []);

  const fetchStudentQuizzes = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getStudentQuizzes();

      if (response.data.success) {
        const quizzes = response.data.data
          .filter(
            (quizResponse: QuizResponse) => quizResponse.status === "completed"
          )
          .sort(
            (a: QuizResponse, b: QuizResponse) =>
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
          )
          .slice(0, 5) // Take only the 5 most recent quizzes
          .map((quizResponse: QuizResponse) => {
            const quiz =
              typeof quizResponse.quiz === "object" ? quizResponse.quiz : {};
            const teacher = (quiz as any).teacher || {};

            let timeTaken = "0 min";
            try {
              if (quizResponse.endTime && quizResponse.startTime) {
                const endTime = new Date(quizResponse.endTime).getTime();
                const startTime = new Date(quizResponse.startTime).getTime();
                timeTaken = `${Math.round((endTime - startTime) / 60000)} min`;
              }
            } catch (timeError) {
              console.error("Error calculating time:", timeError);
            }

            let formattedDate = "Unknown Date";
            try {
              const date = quizResponse.createdAt
                ? new Date(quizResponse.createdAt)
                : new Date();
              formattedDate = date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });
            } catch (dateError) {
              formattedDate = new Date().toLocaleDateString();
            }

            return {
              id: quizResponse._id,
              quizId: (quiz as any)._id || quizResponse.quiz,
              title: (quiz as any).title || "Unknown Quiz",
              teacher: teacher.name || "Teacher",
              date: formattedDate,
              score: quizResponse.score || 0,
              maxScore: quizResponse.totalPoints || 100,
              timeTaken: timeTaken,
              status: quizResponse.status || "completed",
            };
          });

        setPastQuizzes(quizzes);
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
          error.response?.data?.message || "Failed to load quiz history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinQuiz = async () => {
    if (!quizCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a quiz code",
        variant: "destructive",
      });
      return;
    }

    try {
      setJoiningQuiz(true);

      const joinResponse = await studentAPI.joinQuiz(quizCode);

      if (joinResponse.data.success) {
        const quiz = joinResponse.data.data;
        router.push(`/quiz/${quiz._id}?code=${quizCode}`);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast({
          title: "Quiz Not Found",
          description:
            "Please check the quiz code and try again. The quiz might be inactive or the code might be incorrect.",
          variant: "destructive",
        });
      } else if (error.response?.status === 400) {
        toast({
          title: "Already Attempted",
          description: "You have already attempted this quiz",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to join quiz",
          variant: "destructive",
        });
      }
    } finally {
      setJoiningQuiz(false);
    }
  };

  const handleReviewQuiz = (quizId: string) => {
    router.push(`/dashboard/student/history`);
  };

  const handleViewAllHistory = () => {
    router.push("/dashboard/student/history");
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
      <BackgroundElements />

      <div className="relative z-10 mx-auto max-w-7xl p-4 sm:p-6 space-y-6 sm:space-y-8">
        <DashboardHeader />

        {/* Main Content Grid */}
        <div className="grid gap-6 sm:gap-8">
          <JoinQuizCard
            quizCode={quizCode}
            onQuizCodeChange={setQuizCode}
            onJoinQuiz={handleJoinQuiz}
            joiningQuiz={joiningQuiz}
          />

          <PastQuizzesCard
            pastQuizzes={pastQuizzes}
            onReviewQuiz={handleReviewQuiz}
            onViewAll={handleViewAllHistory}
          />
        </div>
      </div>
    </div>
  );
}
