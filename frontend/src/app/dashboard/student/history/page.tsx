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
  ArrowLeft,
  Clock,
  Award,
  AlertTriangle,
  CheckCircle2,
  Zap,
  History,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import QuestionCard from "@/components/QuestionCard";
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
            // Only show completed quizzes with valid data
            const isCompleted = quizResponse.status === "completed";
            const hasQuizData =
              quizResponse.quiz &&
              typeof quizResponse.quiz === "object" &&
              "title" in quizResponse.quiz;
            return isCompleted && hasQuizData;
          })
          .map((quizResponse: QuizResponse) => {
            const quiz = quizResponse.quiz as any;

            // Calculate time taken in minutes - FIXED
            let timeTaken = 0;
            try {
              if (quizResponse.endTime && quizResponse.startTime) {
                const endTime = new Date(quizResponse.endTime).getTime();
                const startTime = new Date(quizResponse.startTime).getTime();
                timeTaken = Math.max(
                  1,
                  Math.round((endTime - startTime) / 60000)
                ); // At least 1 minute
              }
            } catch (timeError) {
             
              timeTaken = 1; // Default to 1 minute
            }

            // Use detailedAnswers from backend or fallback to basic answers
            const detailedAnswers =
              (quizResponse as any).detailedAnswers || quizResponse.answers;

            // Create questions with actual data from backend
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
                correctAnswer: answer.correctAnswer ?? 0, // Use actual correct answer from backend
                userAnswer: answer.selectedAnswer,
                points: answer.points || 5,
              })
            );

            // Format date properly - FIXED
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-slate-300">Loading your quiz history...</p>
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

      <div className="relative z-10 mx-auto max-w-5xl p-6 space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push("/dashboard/student")}
                className="bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-white"
                data-testid="button-back"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </motion.div>
            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
              >
                <Zap className="w-4 h-4 text-yellow-400 mr-2" />
                <span className="text-sm font-medium text-slate-300">
                  Quiz History
                </span>
              </motion.div>
              <h1 className="text-4xl font-bold leading-tight">
                Your Quiz
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {" "}
                  History
                </span>
              </h1>
              <p className="text-xl text-slate-300">
                Review your past quiz attempts and scores
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quiz History Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {quizHistory.map((quiz, index) => {
            const percentage = Math.round((quiz.score / quiz.maxScore) * 100);
            const correctCount = quiz.questions.filter(
              (q) => q.userAnswer === q.correctAnswer
            ).length;

            return (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                          <History className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-xl">
                            {quiz.title}
                          </CardTitle>
                          <CardDescription className="text-slate-400">
                            {quiz.teacher} • {quiz.date}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge
                        className={`
                        text-lg px-4 py-2 border-0 font-bold
                        ${
                          percentage >= 80
                            ? "bg-green-500/20 text-green-400"
                            : percentage >= 60
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                        }
                      `}
                      >
                        {quiz.score}/{quiz.maxScore}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/30 border border-slate-600/30">
                        <Award className="h-5 w-5 text-blue-400" />
                        <div>
                          <p className="text-xs text-slate-400">Score</p>
                          <p className="font-semibold text-white">
                            {percentage}%
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/30 border border-slate-600/30">
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                        <div>
                          <p className="text-xs text-slate-400">Correct</p>
                          <p className="font-semibold text-white">
                            {correctCount}/{quiz.questions.length}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/30 border border-slate-600/30">
                        <Clock className="h-5 w-5 text-purple-400" />
                        <div>
                          <p className="text-xs text-slate-400">Time Taken</p>
                          <p className="font-semibold text-white">
                            {quiz.timeTaken} min
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/30 border border-slate-600/30">
                        {quiz.violations > 0 ? (
                          <AlertTriangle className="h-5 w-5 text-red-400" />
                        ) : (
                          <CheckCircle2 className="h-5 w-5 text-green-400" />
                        )}
                        <div>
                          <p className="text-xs text-slate-400">Violations</p>
                          <p
                            className={`font-semibold ${
                              quiz.violations > 0
                                ? "text-red-400"
                                : "text-green-400"
                            }`}
                          >
                            {quiz.violations}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Review Answers Dialog */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant="outline"
                            className="w-full bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-600/50 hover:text-white transition-all"
                            onClick={() => setSelectedQuiz(quiz)}
                          >
                            Review Answers
                          </Button>
                        </motion.div>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-slate-800 border-slate-700 text-white">
                        <DialogHeader>
                          <DialogTitle className="text-2xl text-white">
                            {quiz.title} - Answer Review
                          </DialogTitle>
                          <DialogDescription className="text-slate-400">
                            Your submitted answers and correct solutions
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          {selectedQuiz?.questions.map((question, idx) => (
                            <div
                              key={question.qId}
                              className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-4"
                            >
                              <QuestionCard
                                questionNumber={idx + 1}
                                totalQuestions={selectedQuiz.questions.length}
                                questionText={question.questionText}
                                choices={question.choices}
                                points={question.points}
                                isReview={true}
                                correctAnswer={question.correctAnswer}
                                userAnswer={question.userAnswer}
                              />
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {quizHistory.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <History className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-300 mb-2">
              No Quiz History
            </h3>
            <p className="text-slate-400 mb-6">
              You haven't attempted any quizzes yet.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => router.push("/dashboard/student")}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold"
              >
                Join a Quiz
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
