// components/quiz/QuizInstructions.tsx
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Zap, Maximize2 } from "lucide-react";
import { Quiz } from "@/types";

interface QuizInstructionsProps {
  quiz: Quiz;
  isMobile: boolean;
  onStartQuiz: () => void;
}

export function QuizInstructions({
  quiz,
  isMobile,
  onStartQuiz,
}: QuizInstructionsProps) {
  return (
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

          <QuizInstructionsList quiz={quiz} isMobile={isMobile} />

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="pt-4"
          >
            <Button
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/25 text-base md:text-lg"
              onClick={onStartQuiz}
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
  );
}

function QuizInstructionsList({
  quiz,
  isMobile,
}: {
  quiz: Quiz;
  isMobile: boolean;
}) {
  return (
    <div className="grid gap-3 md:gap-4 text-slate-300 text-sm md:text-base">
      <InstructionItem>
        This quiz contains <strong>{quiz.questions.length} questions</strong>{" "}
        with a time limit of <strong>{quiz.duration} minutes</strong>
      </InstructionItem>

      {!isMobile ? (
        <>
          <InstructionItem highlight="red">
            <strong>Fullscreen mode is required for this quiz</strong>
          </InstructionItem>
          <InstructionItem>
            <strong>
              Right-click, copy, paste, and text selection are completely
              disabled
            </strong>
          </InstructionItem>
          <InstructionItem>
            <strong>Tab switching and keyboard shortcuts</strong> will result in
            violations
          </InstructionItem>
          <InstructionItem highlight="red">
            <strong>
              5 violations will result in automatic quiz submission
            </strong>
          </InstructionItem>
        </>
      ) : (
        <>
          <InstructionItem highlight="green">
            <strong>Mobile-friendly mode enabled</strong>
          </InstructionItem>
          <InstructionItem>
            <strong>Right-click, copy, paste are disabled</strong>
          </InstructionItem>
          <InstructionItem>
            <strong>Please stay on this app</strong> — switching apps may
            trigger warnings
          </InstructionItem>
          <InstructionItem highlight="yellow">
            <strong>5 warnings will result in automatic submission</strong>
          </InstructionItem>
        </>
      )}

      <InstructionItem>
        You can navigate between questions using Previous and Next buttons
      </InstructionItem>
      <InstructionItem>
        Once submitted, you cannot retake the quiz
      </InstructionItem>
    </div>
  );
}

function InstructionItem({
  children,
  highlight,
}: {
  children: React.ReactNode;
  highlight?: "red" | "green" | "yellow";
}) {
  const getDotColor = () => {
    switch (highlight) {
      case "red":
        return "bg-red-400";
      case "green":
        return "bg-green-400";
      case "yellow":
        return "bg-yellow-400";
      default:
        return "bg-blue-400";
    }
  };

  return (
    <div className="flex items-start gap-3">
      <div
        className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full mt-2 flex-shrink-0 ${getDotColor()}`}
      ></div>
      <p>{children}</p>
    </div>
  );
}
