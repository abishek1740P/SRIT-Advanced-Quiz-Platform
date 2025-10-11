// src/app/dashboard/student/history/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { QuizHistoryCard } from "@/components/QuizHistoryCard";
import { QuizHistoryHeader } from "@/components/QuizHistoryHeader";
import { EmptyQuizHistory } from "@/components/EmptyQuizHistory";
import { LoadingState } from "@/components/LoadingState";
import { BackgroundElements } from "@/components/BackgroundElements";
import { studentAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { QuizResponse, ProcessedQuizHistory } from "@/types";

export default function StudentHistoryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { logout } = useAuth();
  const [quizHistory, setQuizHistory] = useState<ProcessedQuizHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState<ProcessedQuizHistory | null>(
    null
  );

  useEffect(() => {
    fetchQuizHistory();
  }, []);

  const fetchQuizHistory = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getStudentQuizzes();

      if (response.data.success) {
        const processedHistory = response.data.data
          .filter((quizResponse: QuizResponse) => {
            const isCompleted = quizResponse.status === "completed";
            const hasQuizData =
              quizResponse.quiz &&
              typeof quizResponse.quiz === "object" &&
              "title" in quizResponse.quiz;
            return isCompleted && hasQuizData;
          })
          .map((quizResponse: QuizResponse) => {
            const quiz = quizResponse.quiz as any;

            let timeTaken = 0;
            try {
              if (quizResponse.endTime && quizResponse.startTime) {
                const endTime = new Date(quizResponse.endTime).getTime();
                const startTime = new Date(quizResponse.startTime).getTime();
                timeTaken = Math.max(
                  1,
                  Math.round((endTime - startTime) / 60000)
                );
              }
            } catch (timeError) {
              timeTaken = 1;
            }

            const detailedAnswers =
              (quizResponse as any).detailedAnswers || quizResponse.answers;

            const questions = detailedAnswers.map(
              (answer: any, index: number) => ({
                qId: index + 1,
                questionText: answer.questionText || `Question ${index + 1}`,
                choices: answer.choices || [
                  "Option A",
                  "Option B",
                  "Option C",
                  "Option D",
                ],
                correctAnswer: answer.correctAnswer ?? 0,
                userAnswer: answer.selectedAnswer,
                points: answer.points || 5,
              })
            );

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
              quizId: quiz._id,
              title: quiz.title || "Unknown Quiz",
              teacher: quiz.teacher?.name || "Teacher",
              date: formattedDate,
              score: quizResponse.score || 0,
              maxScore: quizResponse.totalPoints || 100,
              timeTaken: timeTaken,
              violations: quizResponse.violations || 0,
              questions: questions,
            };
          });

        setQuizHistory(processedHistory);
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

  const handleBack = () => router.push("/dashboard/student");
  const handleReview = (quiz: ProcessedQuizHistory) => setSelectedQuiz(quiz);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
      <BackgroundElements />

      <div className="relative z-10 mx-auto max-w-5xl p-6 space-y-8">
        <QuizHistoryHeader onBack={handleBack} />

        {/* Quiz History Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {quizHistory.map((quiz, index) => (
            <QuizHistoryCard
              key={quiz.id}
              quiz={quiz}
              index={index}
              onReview={handleReview}
            />
          ))}
        </motion.div>

        {/* Empty State */}
        {quizHistory.length === 0 && <EmptyQuizHistory onAction={handleBack} />}
      </div>
    </div>
  );
}
