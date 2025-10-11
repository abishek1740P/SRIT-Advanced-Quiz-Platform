// src/app/quiz/[quizId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress"; // Add this import
import QuestionCard from "@/components/QuestionCard";
import Timer from "@/components/Timer"; // Add this import
import ViolationIndicator from "@/components/ViolationIndicator"; // Add this import
import { useToast } from "@/hooks/use-toast";
import { studentAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Quiz } from "@/types";
import { QuizLoadingState, QuizErrorState } from "@/components/quiz/QuizStates";
import { QuizInstructions } from "@/components/quiz/QuizInstructions";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { QuizNavigation } from "@/components/quiz/QuizNavigation";
import { SubmitConfirmationDialog } from "@/components/quiz/SubmitConfirmationDialog";
import { useQuizSecurity } from "@/hooks/useQuizSecurity";
import { useFullscreen } from "@/hooks/useFullscreen";
import { Smartphone, Zap } from "lucide-react";

export default function QuizAttemptPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user, logout } = useAuth();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [autoSubmitTriggered, setAutoSubmitTriggered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const quizId = params.quizId as string;
  const secretCode = searchParams.get("code");

  const { isMobile } = useMobileDetection();
  const { isFullscreen, enterFullscreen, exitFullscreen } =
    useFullscreen(isMobile);

  // In your quiz page component - CORRECTED VERSION
  const { violations, incrementViolations } = useQuizSecurity({
    quizStarted,
    isMobile,
    autoSubmitTriggered,
    onAutoSubmit: () => {
      setAutoSubmitTriggered(true);
      handleSubmit(true);
    },
    // Remove onViolation or pass an empty function
    // onViolation: () => {} // Optional - only if you need side effects
  });

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
        handleQuizFetchError(error);
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchQuizData();
    }
  }, [quizId, secretCode, router, toast, logout]);

  const handleQuizFetchError = (error: any) => {
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
  };

  const handleAnswerChange = (choiceIndex: number) => {
    if (!quiz) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion]: choiceIndex }));
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
        handleSubmitSuccess(isAutoSubmit);
      }
    } catch (error: any) {
      handleSubmitError(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitSuccess = (isAutoSubmit: boolean) => {
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
        description: "Your answers have been recorded and sent for evaluation",
      });
    }

    if (!isMobile) {
      exitFullscreen();
    }

    setTimeout(() => router.push("/dashboard/student"), 1500);
  };

  const handleSubmitError = (error: any) => {
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

  const handleExit = () => {
    if (
      confirm(
        "Are you sure you want to exit? This will count as a violation and may affect your score."
      )
    ) {
      incrementViolations();
      router.push("/dashboard/student");
    }
  };

  const handleTimeUp = () => {
    toast({
      title: "Time Up!",
      description: "Auto-submitting quiz...",
      variant: "destructive",
    });
    setTimeout(() => handleSubmit(true), 1500);
  };

  if (loading) return <QuizLoadingState />;
  if (!quiz)
    return <QuizErrorState onBack={() => router.push("/dashboard/student")} />;

  const progress =
    quiz.questions.length > 0
      ? ((currentQuestion + 1) / quiz.questions.length) * 100
      : 0;
  const answeredCount = Object.keys(answers).length;

  if (!quizStarted) {
    return (
      <QuizLandingPage
        quiz={quiz}
        isMobile={isMobile}
        onStartQuiz={handleStartQuiz}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white z-50 flex flex-col">
      <BackgroundElements />

      <QuizHeader
        quiz={quiz}
        violations={violations}
        isMobile={isMobile}
        isFullscreen={isFullscreen}
        progress={progress}
        onEnterFullscreen={enterFullscreen}
        onExit={handleExit}
        onTimeUp={handleTimeUp}
      />

      {/* Question Content */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 md:px-6 py-4 md:py-8">
          {quiz.questions.length > 0 && (
            <QuestionDisplay
              quiz={quiz}
              currentQuestion={currentQuestion}
              answers={answers}
              onAnswerChange={handleAnswerChange}
            />
          )}
        </div>
      </div>

      <QuizNavigation
        currentQuestion={currentQuestion}
        totalQuestions={quiz.questions.length}
        answeredCount={answeredCount}
        isMobile={isMobile}
        submitting={submitting}
        onPrevious={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
        onNext={() =>
          setCurrentQuestion((prev) =>
            Math.min(quiz.questions.length - 1, prev + 1)
          )
        }
        onSubmit={() => setShowSubmitDialog(true)}
      />

      <SubmitConfirmationDialog
        open={showSubmitDialog}
        onOpenChange={setShowSubmitDialog}
        answeredCount={answeredCount}
        totalQuestions={quiz.questions.length}
        violations={violations}
        isMobile={isMobile}
        submitting={submitting}
        onSubmit={() => handleSubmit(false)}
      />
    </div>
  );
}

// Additional reusable components and hooks
function BackgroundElements() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
    </div>
  );
}

function QuizLandingPage({
  quiz,
  isMobile,
  onStartQuiz,
}: {
  quiz: Quiz;
  isMobile: boolean;
  onStartQuiz: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
      <BackgroundElements />

      <div className="relative z-10 mx-auto max-w-4xl p-4 md:p-6 space-y-6 md:space-y-8">
        <QuizLandingHeader quiz={quiz} isMobile={isMobile} />
        <QuizInstructions
          quiz={quiz}
          isMobile={isMobile}
          onStartQuiz={onStartQuiz}
        />
      </div>
    </div>
  );
}

function QuizLandingHeader({
  quiz,
  isMobile,
}: {
  quiz: Quiz;
  isMobile: boolean;
}) {
  return (
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
              {" Quiz"}
            </span>
          </h1>
          <p className="text-base md:text-xl text-slate-300 max-w-2xl">
            {quiz.description ||
              "Get ready to test your knowledge. Make sure you have a stable internet connection."}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function QuestionDisplay({
  quiz,
  currentQuestion,
  answers,
  onAnswerChange,
}: {
  quiz: Quiz;
  currentQuestion: number;
  answers: Record<number, number>;
  onAnswerChange: (choiceIndex: number) => void;
}) {
  return (
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
        onAnswerChange={onAnswerChange}
        points={quiz.questions[currentQuestion].points}
        isMobile={false}
      />
    </motion.div>
  );
}

// Custom hook for mobile detection
function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return { isMobile };
}
