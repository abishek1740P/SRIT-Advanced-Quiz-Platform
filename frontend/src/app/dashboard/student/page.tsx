"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  KeyRound,
  History,
  Clock,
  Zap,
  Play,
  BookOpen,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
          .map((quizResponse: QuizResponse) => {
           

            // Safely handle quiz data
            const quiz =
              typeof quizResponse.quiz === "object" ? quizResponse.quiz : {};
            const teacher = (quiz as any).teacher || {};

            // Calculate time taken safely
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

            // Format date properly
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
    router.push(`/student/quiz/${quizId}/review`);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return "1 day ago";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Unknown date";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        <span className="ml-2">Loading your quizzes...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
      {/* Background Elements - Fixed for mobile */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl sm:-top-40 sm:-right-40 sm:w-80 sm:h-80"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl sm:-bottom-40 sm:-left-40 sm:w-80 sm:h-80"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl sm:w-96 sm:h-96"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex flex-col space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm self-start"
            >
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 mr-2" />
              <span className="text-xs sm:text-sm font-medium text-slate-300">
                Student Dashboard
              </span>
            </motion.div>

            <div className="space-y-2 sm:space-y-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight">
                Welcome to Your
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block sm:inline">
                  {" "}
                  Dashboard
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl">
                Enter quiz codes and track your learning progress with detailed
                analytics
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-6 sm:gap-8">
          {/* Join Quiz Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 transition-all mx-auto w-full">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <KeyRound className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  Join Quiz
                </CardTitle>
                <CardDescription className="text-slate-400 text-sm sm:text-base">
                  Enter the secret code provided by your teacher
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="space-y-2 sm:space-y-3">
                  <Label
                    htmlFor="quiz-code"
                    className="text-slate-300 text-sm sm:text-base"
                  >
                    Quiz Code
                  </Label>
                  <Input
                    id="quiz-code"
                    placeholder="e.g., XYZ123"
                    value={quizCode}
                    onChange={(e) => setQuizCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && handleJoinQuiz()}
                    className="font-mono text-base sm:text-lg bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-500/50 transition-all h-12 sm:h-14"
                    data-testid="input-quiz-code"
                  />
                </div>
                <motion.div
                  whileHover={{ scale: joiningQuiz ? 1 : 1.02 }}
                  whileTap={{ scale: joiningQuiz ? 1 : 0.98 }}
                >
                  <Button
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 sm:py-4 rounded-xl transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base h-12 sm:h-14"
                    onClick={handleJoinQuiz}
                    disabled={joiningQuiz || !quizCode.trim()}
                    data-testid="button-join-quiz"
                  >
                    {joiningQuiz ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start Quiz
                      </>
                    )}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Past Quizzes Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 transition-all mx-auto w-full">
            <CardHeader className="pb-4 sm:pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <History className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg sm:text-xl">
                      Recent Quizzes
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-sm sm:text-base">
                      Your recent quiz attempts and performance
                    </CardDescription>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto mt-2 sm:mt-0"
                >
                  <Button
                    variant="outline"
                    className="bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-600/50 hover:text-white transition-all w-full sm:w-auto text-sm sm:text-base h-9 sm:h-10"
                    onClick={() => router.push("/dashboard/student/history")}
                    data-testid="button-view-history"
                  >
                    View All
                  </Button>
                </motion.div>
              </div>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <div className="space-y-3 sm:space-y-4">
                {pastQuizzes.length > 0 ? (
                  pastQuizzes.slice(0, 5).map(
                    (
                      quiz,
                      index // Show only last 5 quizzes
                    ) => (
                      <motion.div
                        key={quiz.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex flex-col p-3 sm:p-4 rounded-lg sm:rounded-xl bg-slate-700/30 border border-slate-600/30 hover:border-slate-500/50 hover:bg-slate-700/50 transition-all"
                        data-testid={`past-quiz-${quiz.id}`}
                      >
                        <div className="space-y-2 flex-1 mb-3 sm:mb-0">
                          <h4 className="font-semibold text-white text-base sm:text-lg line-clamp-2">
                            {quiz.title}
                          </h4>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs sm:text-sm text-slate-400">
                            <span className="truncate">{quiz.teacher}</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDate(quiz.date)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                          <div className="text-left sm:text-right min-w-[80px]">
                            <p className="text-xs sm:text-sm text-slate-400">
                              Score
                            </p>
                            <p
                              className={`text-base sm:text-lg font-bold ${
                                quiz.score >= 80
                                  ? "text-green-400"
                                  : quiz.score >= 60
                                  ? "text-yellow-400"
                                  : "text-red-400"
                              }`}
                            >
                              {quiz.score}/{quiz.maxScore}
                            </p>
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-slate-600/50 border-slate-500/50 text-slate-300 hover:bg-slate-500/50 hover:text-white transition-all h-8 sm:h-9 text-xs sm:text-sm"
                              onClick={() => handleReviewQuiz(quiz.quizId)}
                            >
                              <BookOpen className="w-3 h-3 mr-1 sm:mr-2" />
                              <span>Review</span>
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>
                    )
                  )
                ) : (
                  <div className="text-center py-8 sm:py-12 text-slate-400">
                    <History className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                    <p className="text-sm sm:text-base">No quiz attempts yet</p>
                    <p className="text-xs sm:text-sm mt-1 sm:mt-2">
                      Join a quiz using a code from your teacher
                    </p>
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
