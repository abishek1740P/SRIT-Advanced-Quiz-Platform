"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import QuestionCard from "@/components/QuestionCard";
import Timer from "@/components/Timer";
import ViolationIndicator from "@/components/ViolationIndicator";
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  X,
  Zap,
  AlertTriangle,
  Maximize2,
  Loader2,
  Smartphone,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { studentAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Quiz, Question } from "@/types";

export default function QuizAttemptPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user, logout } = useAuth();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [violations, setViolations] = useState(0);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoSubmitTriggered, setAutoSubmitTriggered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const quizId = params.quizId as string;
  const secretCode = searchParams.get("code");

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch quiz data
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);

        if (secretCode) {
          const joinResponse = await studentAPI.joinQuiz(secretCode);
          if (joinResponse.data.success) {
            setQuiz(joinResponse.data.data);
          }
        } else {
          toast({
            title: "Error",
            description: "Quiz code is required",
            variant: "destructive",
          });
          router.push("/dashboard/student");
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

        if (error.response?.status === 404) {
          toast({
            title: "Quiz Not Found",
            description: "The quiz you're trying to access doesn't exist",
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
            description: error.response?.data?.message || "Failed to load quiz",
            variant: "destructive",
          });
        }

        router.push("/dashboard/student");
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchQuizData();
    }
  }, [quizId, secretCode, router, toast, logout]);

  // Enter fullscreen function
  const enterFullscreen = async () => {
    if (isMobile) {
      toast({
        title: "Mobile Device Detected",
        description: "Fullscreen is not required on mobile devices",
        variant: "default",
      });
      return;
    }

    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        await (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).msRequestFullscreen) {
        await (elem as any).msRequestFullscreen();
      }
    } catch (error) {
      toast({
        title: "Fullscreen Not Available",
        description:
          "Please enable fullscreen manually for the best experience",
        variant: "default",
      });
    }
  };

  // Exit fullscreen function
  const exitFullscreen = async () => {
    if (isMobile) return;

    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      }
    } catch (error) {
      console.warn("Exit fullscreen error:", error);
    }
  };

  // Check fullscreen state
  useEffect(() => {
    if (isMobile) return;

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange
      );
    };
  }, [isMobile]);

  // Security measures when quiz starts - Mobile-friendly version
  useEffect(() => {
    if (!quizStarted) return;

    // Less restrictive security for mobile devices
    if (isMobile) {
      const handleVisibilityChange = () => {
        if (document.hidden) {
          const newViolations = violations + 1;
          setViolations(newViolations);

          toast({
            title: "Warning!",
            description: `Please stay on the quiz page. Warning ${newViolations}/5`,
            variant: "default",
          });

          if (newViolations >= 5 && !autoSubmitTriggered) {
            setAutoSubmitTriggered(true);
            toast({
              title: "Maximum Warnings Reached!",
              description:
                "Quiz will be auto-submitted due to multiple warnings.",
              variant: "destructive",
            });
            setTimeout(() => handleSubmit(true), 2000);
          }
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      };
    }

    // Desktop security measures (original strict version)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const newViolations = violations + 1;
        setViolations(newViolations);

        toast({
          title: "Violation Detected!",
          description: `Tab switching is not allowed. Violation ${newViolations}/5`,
          variant: "destructive",
        });

        if (newViolations >= 5 && !autoSubmitTriggered) {
          setAutoSubmitTriggered(true);
          toast({
            title: "Maximum Violations Reached!",
            description:
              "Quiz will be auto-submitted due to multiple violations.",
            variant: "destructive",
          });
          setTimeout(() => handleSubmit(true), 2000);
        }
      }
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      const newViolations = violations + 1;
      setViolations(newViolations);
      toast({
        title: "Action Blocked",
        description: `Copying is not allowed during quiz. Violation ${newViolations}/5`,
        variant: "destructive",
      });

      if (newViolations >= 5 && !autoSubmitTriggered) {
        setAutoSubmitTriggered(true);
        setTimeout(() => handleSubmit(true), 2000);
      }
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      const newViolations = violations + 1;
      setViolations(newViolations);
      toast({
        title: "Action Blocked",
        description: `Pasting is not allowed during quiz. Violation ${newViolations}/5`,
        variant: "destructive",
      });

      if (newViolations >= 5 && !autoSubmitTriggered) {
        setAutoSubmitTriggered(true);
        setTimeout(() => handleSubmit(true), 2000);
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      const newViolations = violations + 1;
      setViolations(newViolations);
      toast({
        title: "Action Blocked",
        description: `Right-click is disabled during quiz. Violation ${newViolations}/5`,
        variant: "destructive",
      });

      if (newViolations >= 5 && !autoSubmitTriggered) {
        setAutoSubmitTriggered(true);
        setTimeout(() => handleSubmit(true), 2000);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        ((e.ctrlKey || e.metaKey) &&
          ["c", "v", "x", "a", "s", "p"].includes(e.key.toLowerCase())) ||
        e.key === "PrintScreen" ||
        e.key === "F12" ||
        (e.altKey && e.key === "Tab")
      ) {
        e.preventDefault();
        const newViolations = violations + 1;
        setViolations(newViolations);
        toast({
          title: "Action Blocked",
          description: `Keyboard shortcuts are disabled during quiz. Violation ${newViolations}/5`,
          variant: "destructive",
        });

        if (newViolations >= 5 && !autoSubmitTriggered) {
          setAutoSubmitTriggered(true);
          setTimeout(() => handleSubmit(true), 2000);
        }
      }
    };

    const handleSelectStart = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("selectstart", handleSelectStart);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("selectstart", handleSelectStart);
    };
  }, [quizStarted, violations, autoSubmitTriggered, toast, isMobile]);

  const handleAnswerChange = (choiceIndex: number) => {
    if (!quiz) return;

    setAnswers({
      ...answers,
      [currentQuestion]: choiceIndex,
    });
  };

  const handleSubmit = async (isAutoSubmit = false) => {
    if (!quiz) return;

    try {
      setSubmitting(true);

      const formattedAnswers = Object.entries(answers).map(
        ([questionIndex, selectedAnswer]) => ({
          questionIndex: parseInt(questionIndex),
          selectedAnswer: selectedAnswer,
          timeTaken: 0,
        })
      );

      const response = await studentAPI.submitQuiz(quiz._id, {
        answers: formattedAnswers,
        violations,
      });

      if (response.data.success) {
        if (isAutoSubmit) {
          toast({
            title: "Quiz Auto-Submitted!",
            description: isMobile
              ? "Quiz was submitted due to multiple warnings."
              : "Quiz was submitted due to multiple violations.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Quiz Submitted Successfully!",
            description:
              "Your answers have been recorded and sent for evaluation",
          });
        }

        if (!isMobile) {
          try {
            await exitFullscreen();
          } catch (error) {
            console.warn("Could not exit fullscreen:", error);
          }
        }

        setTimeout(() => router.push("/dashboard/student"), 1500);
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
        title: "Submission Failed",
        description: error.response?.data?.message || "Failed to submit quiz",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartQuiz = async () => {
    if (!quiz) return;

    try {
      if (!isMobile) {
        await enterFullscreen();
      }
      setQuizStarted(true);
    } catch (error) {
      toast({
        title: isMobile ? "Mobile Mode" : "Fullscreen Not Enabled",
        description: isMobile
          ? "Starting quiz in mobile mode"
          : "Please enable fullscreen manually for proper quiz security",
        variant: "default",
      });
      setQuizStarted(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        <span className="ml-2">Loading quiz...</span>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Quiz Not Found</h1>
          <p className="text-slate-400 mb-4">
            The quiz you're looking for doesn't exist or you don't have access.
          </p>
          <Button onClick={() => router.push("/dashboard/student")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const progress =
    quiz.questions.length > 0
      ? ((currentQuestion + 1) / quiz.questions.length) * 100
      : 0;
  const answeredCount = Object.keys(answers).length;

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl p-4 md:p-6 space-y-6 md:space-y-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-4">
              <div className="space-y-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center px-3 py-1 md:px-4 md:py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
                >
                  {isMobile ? (
                    <Smartphone className="w-3 h-3 md:w-4 md:h-4 text-green-400 mr-2" />
                  ) : (
                    <Zap className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 mr-2" />
                  )}
                  <span className="text-xs md:text-sm font-medium text-slate-300">
                    {isMobile ? "Mobile Mode" : "Quiz Ready"}
                  </span>
                </motion.div>

                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  {quiz.title}
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {" "}
                    Quiz
                  </span>
                </h1>
                <p className="text-base md:text-xl text-slate-300 max-w-2xl">
                  {quiz.description ||
                    "Get ready to test your knowledge. Make sure you have a stable internet connection."}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Quiz Instructions Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 transition-all">
              <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 md:h-6 md:w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white">
                      Important Instructions
                    </h3>
                    <p className="text-slate-400 text-sm md:text-base">
                      Please read carefully before starting
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 md:gap-4 text-slate-300 text-sm md:text-base">
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>
                      This quiz contains{" "}
                      <strong>{quiz.questions.length} questions</strong> with a
                      time limit of <strong>{quiz.duration} minutes</strong>
                    </p>
                  </div>

                  {!isMobile && (
                    <>
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p>
                          <strong className="text-red-400">
                            Fullscreen mode is required for this quiz
                          </strong>
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p>
                          <strong>
                            Tab switching, copying, pasting, or using keyboard
                            shortcuts
                          </strong>{" "}
                          will result in violations
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p>
                          <strong className="text-red-400">
                            5 violations will result in automatic quiz
                            submission
                          </strong>
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p>
                          Right-click, text selection, and developer tools are
                          disabled
                        </p>
                      </div>
                    </>
                  )}

                  {isMobile && (
                    <>
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p>
                          <strong className="text-green-400">
                            Mobile-friendly mode enabled
                          </strong>
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p>
                          <strong>Please stay on this app</strong> - switching
                          apps may trigger warnings
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p>
                          <strong className="text-yellow-400">
                            5 warnings will result in automatic submission
                          </strong>
                        </p>
                      </div>
                    </>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>
                      You can navigate between questions using Previous and Next
                      buttons
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Once submitted, you cannot retake the quiz</p>
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="pt-4"
                >
                  <Button
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/25 text-base md:text-lg"
                    onClick={handleStartQuiz}
                    data-testid="button-start-quiz"
                  >
                    {isMobile ? (
                      <Zap className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    ) : (
                      <Maximize2 className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    )}
                    {isMobile ? "Start Quiz" : "Start Quiz in Fullscreen"}
                  </Button>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white z-50 flex flex-col">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 md:px-6 py-3 md:py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0">
            <div className="flex items-center justify-between md:justify-start gap-4">
              <Timer
                initialSeconds={quiz.duration * 60}
                size={isMobile ? "sm" : "lg"}
                onTimeUp={() => {
                  toast({
                    title: "Time Up!",
                    description: "Auto-submitting quiz...",
                    variant: "destructive",
                  });
                  setTimeout(() => handleSubmit(true), 1500);
                }}
              />
              <div className="text-sm md:text-lg font-medium">
                <span className="text-slate-300 hidden md:inline">Quiz:</span>{" "}
                <span className="font-mono text-white bg-slate-700/50 px-2 py-1 md:px-3 md:py-1 rounded-lg text-xs md:text-sm">
                  {quiz.title}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between md:justify-end gap-2 md:gap-4">
              <ViolationIndicator count={violations} isMobile={isMobile} />
              {!isMobile && !isFullscreen && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={enterFullscreen}
                    className="bg-yellow-500/20 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30 text-xs"
                  >
                    <Maximize2 className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                    Fullscreen
                  </Button>
                </motion.div>
              )}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size={isMobile ? "sm" : "icon"}
                  onClick={() => {
                    if (
                      confirm(
                        "Are you sure you want to exit? This will count as a violation and may affect your score."
                      )
                    ) {
                      setViolations((prev) => prev + 1);
                      router.push("/dashboard/student");
                    }
                  }}
                  className={`${
                    isMobile
                      ? "bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 text-xs px-3"
                      : "bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400"
                  }`}
                  data-testid="button-exit"
                >
                  {isMobile ? "Exit" : <X className="h-4 w-4" />}
                </Button>
              </motion.div>
            </div>
          </div>
          <Progress
            value={progress}
            className="mt-3 md:mt-4 h-1.5 md:h-2 bg-slate-700/50"
          />
        </div>
      </div>

      {/* Question Content */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 md:px-6 py-4 md:py-8">
          {quiz.questions.length > 0 && (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <QuestionCard
                questionNumber={currentQuestion + 1}
                totalQuestions={quiz.questions.length}
                questionText={quiz.questions[currentQuestion].questionText}
                choices={quiz.questions[currentQuestion].choices}
                selectedAnswer={answers[currentQuestion]}
                onAnswerChange={handleAnswerChange}
                points={quiz.questions[currentQuestion].points}
                isMobile={isMobile}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="relative z-10 border-t border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 md:px-6 py-4 md:py-6">
          <div className="flex items-center justify-between gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size={isMobile ? "sm" : "default"}
                onClick={() =>
                  setCurrentQuestion((prev) => Math.max(0, prev - 1))
                }
                disabled={currentQuestion === 0}
                className="bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-600/50 hover:text-white disabled:opacity-50"
                data-testid="button-previous"
              >
                <ChevronLeft className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                {isMobile ? "Prev" : "Previous"}
              </Button>
            </motion.div>

            <div className="text-xs md:text-sm text-slate-400 text-center flex-shrink-0">
              <span className="font-medium text-white">{answeredCount}</span> of{" "}
              <span className="font-medium text-white">
                {quiz.questions.length}
              </span>{" "}
              answered
            </div>

            {currentQuestion < quiz.questions.length - 1 ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size={isMobile ? "sm" : "default"}
                  onClick={() =>
                    setCurrentQuestion((prev) =>
                      Math.min(quiz.questions.length - 1, prev + 1)
                    )
                  }
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold"
                  data-testid="button-next"
                >
                  {isMobile ? "Next" : "Next"}
                  <ChevronRight className="h-3 w-3 md:h-4 md:w-4 ml-1 md:ml-2" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size={isMobile ? "sm" : "default"}
                  onClick={() => setShowSubmitDialog(true)}
                  disabled={submitting}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold disabled:opacity-50"
                  data-testid="button-submit"
                >
                  {submitting ? (
                    <Loader2 className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 animate-spin" />
                  ) : (
                    <Flag className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  )}
                  {isMobile
                    ? "Submit"
                    : submitting
                    ? "Submitting..."
                    : "Submit Quiz"}
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent className="bg-slate-800 border-slate-700 text-white max-w-[95vw] md:max-w-md rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg md:text-xl">
              Submit Quiz?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400 text-sm md:text-base">
              You have answered <strong>{answeredCount}</strong> out of{" "}
              <strong>{quiz.questions.length}</strong> questions.
              {answeredCount < quiz.questions.length && (
                <span className="text-yellow-400 block mt-2">
                  ⚠️ Unanswered questions will be marked as incorrect.
                </span>
              )}
              <span className="block mt-2">
                {isMobile ? "Warnings" : "Violations"} detected:{" "}
                <strong
                  className={violations > 0 ? "text-red-400" : "text-green-400"}
                >
                  {violations}
                </strong>
                {violations > 0 && (
                  <span className="text-red-400 block text-xs md:text-sm mt-1">
                    ⚠️ Multiple {isMobile ? "warnings" : "violations"} may
                    affect your final score
                  </span>
                )}
              </span>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col md:flex-row gap-2 md:gap-0">
            <AlertDialogCancel
              className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 mt-0 md:mt-0 order-2 md:order-1"
              disabled={submitting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 order-1 md:order-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Quiz"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
