import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { studentAPI } from "@/lib/api";
import { QuizResponse, ProcessedQuizHistory } from "@/types";

export const useQuizHistory = () => {
  const { toast } = useToast();
  const { logout } = useAuth();
  const [quizHistory, setQuizHistory] = useState<ProcessedQuizHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuizHistory = useCallback(async () => {
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

            const questions =
              detailedAnswers?.map((answer: any, index: number) => ({
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
              })) || [];

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
              createdAt: quizResponse.createdAt,
              percentage: Math.round(
                ((quizResponse.score || 0) /
                  (quizResponse.totalPoints || 100)) *
                  100
              ),
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
  }, [toast, logout]);

  useEffect(() => {
    fetchQuizHistory();
  }, [fetchQuizHistory]);

  return {
    quizHistory,
    loading,
    refetch: fetchQuizHistory,
  };
};