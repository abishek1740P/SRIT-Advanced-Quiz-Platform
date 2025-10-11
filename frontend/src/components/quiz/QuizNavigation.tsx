// components/quiz/QuizNavigation.tsx
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Flag, Loader2 } from "lucide-react";

interface QuizNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredCount: number;
  isMobile: boolean;
  submitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function QuizNavigation({
  currentQuestion,
  totalQuestions,
  answeredCount,
  isMobile,
  submitting,
  onPrevious,
  onNext,
  onSubmit,
}: QuizNavigationProps) {
  const isLastQuestion = currentQuestion === totalQuestions - 1;

  return (
    <div className="relative z-10 border-t border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-4 md:py-6">
        <div className="flex items-center justify-between gap-4">
          <PreviousButton
            currentQuestion={currentQuestion}
            isMobile={isMobile}
            onPrevious={onPrevious}
          />
          
          <AnsweredCounter
            answeredCount={answeredCount}
            totalQuestions={totalQuestions}
            isMobile={isMobile}
          />

          {isLastQuestion ? (
            <SubmitButton
              isMobile={isMobile}
              submitting={submitting}
              onSubmit={onSubmit}
            />
          ) : (
            <NextButton isMobile={isMobile} onNext={onNext} />
          )}
        </div>
      </div>
    </div>
  );
}

function PreviousButton({
  currentQuestion,
  isMobile,
  onPrevious,
}: {
  currentQuestion: number;
  isMobile: boolean;
  onPrevious: () => void;
}) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant="outline"
        size={isMobile ? "sm" : "default"}
        onClick={onPrevious}
        disabled={currentQuestion === 0}
        className="bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-600/50 hover:text-white disabled:opacity-50"
        data-testid="button-previous"
      >
        <ChevronLeft className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
        {isMobile ? "Prev" : "Previous"}
      </Button>
    </motion.div>
  );
}

function AnsweredCounter({
  answeredCount,
  totalQuestions,
  isMobile,
}: {
  answeredCount: number;
  totalQuestions: number;
  isMobile: boolean;
}) {
  return (
    <div className="text-xs md:text-sm text-slate-400 text-center flex-shrink-0">
      <span className="font-medium text-white">{answeredCount}</span> of{" "}
      <span className="font-medium text-white">{totalQuestions}</span> answered
    </div>
  );
}

function NextButton({ isMobile, onNext }: { isMobile: boolean; onNext: () => void }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        size={isMobile ? "sm" : "default"}
        onClick={onNext}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold"
        data-testid="button-next"
      >
        {isMobile ? "Next" : "Next"}
        <ChevronRight className="h-3 w-3 md:h-4 md:w-4 ml-1 md:ml-2" />
      </Button>
    </motion.div>
  );
}

function SubmitButton({
  isMobile,
  submitting,
  onSubmit,
}: {
  isMobile: boolean;
  submitting: boolean;
  onSubmit: () => void;
}) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        size={isMobile ? "sm" : "default"}
        onClick={onSubmit}
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
  );
}