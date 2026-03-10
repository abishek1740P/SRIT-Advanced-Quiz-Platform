import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  questionText: string;
  choices: string[];
  selectedAnswer?: number;
  onAnswerChange?: (choiceIndex: number) => void;
  points?: number;
  isReview?: boolean;
  correctAnswer?: number;
  userAnswer?: number;
  isMobile?: boolean;
}

export default function QuestionCard({
  questionNumber,
  totalQuestions,
  questionText,
  choices,
  selectedAnswer,
  onAnswerChange,
  points = 5,
  isReview = false,
  correctAnswer,
  userAnswer,
  isMobile = false,
}: QuestionCardProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Animation variants with proper typing
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.3 },
    },
  };

  const optionVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
    tap: {
      scale: 0.98,
    },
    selected: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 0.3,
      },
    },
  };

  const handleOptionClick = (index: number) => {
    if (!isReview && onAnswerChange) {
      onAnswerChange(index);
    }
  };

  const getOptionClasses = (index: number) => {
    const isSelected = selectedAnswer === index;
    const isCorrect = isReview && correctAnswer === index;
    const isWrong =
      isReview && userAnswer === index && userAnswer !== correctAnswer;

    return cn(
      "relative w-full rounded-xl border-2 transition-all duration-200",
      "cursor-pointer select-none",
      isMobile ? "min-h-[64px]" : "min-h-[72px]",
      // Base styles
      "bg-white dark:bg-slate-900",
      "hover:shadow-lg hover:border-primary/50 hover:bg-primary/5",
      // Selected state
      isSelected &&
        !isReview && [
          "border-primary bg-primary/10",
          "shadow-lg shadow-primary/20",
          "ring-2 ring-primary/20",
        ],
      // Review states
      isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
      isWrong && "border-red-500 bg-red-50 dark:bg-red-950/20",
      // Default border
      !isSelected &&
        !isCorrect &&
        !isWrong &&
        "border-slate-200 dark:border-slate-800",
      // Hover state (non-review mode)
      !isReview &&
        hoveredIndex === index &&
        !isSelected &&
        "border-primary/50 bg-primary/5",
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full"
    >
      <Card
        className={cn(
          "overflow-hidden border-0 shadow-xl",
          "bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950",
          isMobile ? "p-4" : "p-6",
        )}
      >
        <div className="space-y-6">
          {/* Question Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full",
                    "text-sm font-medium",
                    "bg-slate-100 dark:bg-slate-800",
                    "text-slate-700 dark:text-slate-300",
                  )}
                >
                  Question {questionNumber} of {totalQuestions}
                </span>
                <span className="text-sm text-slate-400">•</span>
                <span
                  className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full",
                    "text-sm font-semibold",
                    "bg-primary/10 text-primary",
                  )}
                >
                  {points} {points === 1 ? "point" : "points"}
                </span>
              </div>
            </div>

            <h2
              className={cn(
                "font-bold leading-tight",
                "text-slate-900 dark:text-white",
                isMobile ? "text-xl" : "text-2xl",
                "border-l-4 border-primary pl-4",
              )}
            >
              {questionText}
            </h2>
          </motion.div>

          {/* Options */}
          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={(value) =>
              !isReview && onAnswerChange?.(parseInt(value))
            }
            className="space-y-3"
          >
            <AnimatePresence mode="wait">
              {choices.map((choice, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = isReview && correctAnswer === index;
                const isWrong =
                  isReview &&
                  userAnswer === index &&
                  userAnswer !== correctAnswer;

                return (
                  <motion.div
                    key={index}
                    variants={optionVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={!isReview ? "hover" : undefined}
                    whileTap={!isReview ? "tap" : undefined}
                    onHoverStart={() => setHoveredIndex(index)}
                    onHoverEnd={() => setHoveredIndex(null)}
                    onClick={() => handleOptionClick(index)}
                    className={getOptionClasses(index)}
                    layout
                  >
                    <div
                      className={cn(
                        "absolute inset-0 rounded-xl",
                        "bg-gradient-to-r opacity-0 transition-opacity",
                        isSelected &&
                          !isReview &&
                          "from-primary/5 to-transparent opacity-100",
                        hoveredIndex === index &&
                          !isSelected &&
                          !isReview &&
                          "from-primary/5 to-transparent opacity-50",
                      )}
                    />

                    <div className="relative flex items-center p-4 gap-4">
                      <RadioGroupItem
                        value={index.toString()}
                        id={`choice-${questionNumber}-${index}`}
                        disabled={isReview}
                        className={cn(
                          "transition-transform duration-200",
                          isSelected && !isReview && "scale-110 text-primary",
                          "cursor-pointer",
                        )}
                      />

                      <Label
                        htmlFor={`choice-${questionNumber}-${index}`}
                        className={cn(
                          "flex-1 cursor-pointer font-medium",
                          isMobile ? "text-base" : "text-lg",
                          "text-slate-700 dark:text-slate-300",
                          "leading-relaxed",
                          // Selected text style
                          isSelected &&
                            !isReview &&
                            "text-primary font-semibold",
                          // Review text styles
                          isCorrect && "text-green-600 dark:text-green-400",
                          isWrong && "text-red-600 dark:text-red-400",
                        )}
                      >
                        {choice}
                      </Label>

                      {/* Selection indicator */}
                      <AnimatePresence>
                        {isSelected && !isReview && (
                          <motion.div
                            key="selected-indicator"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          </motion.div>
                        )}

                        {isCorrect && (
                          <motion.span
                            key="correct-indicator"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          >
                            Correct
                          </motion.span>
                        )}

                        {isWrong && (
                          <motion.span
                            key="wrong-indicator"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                          >
                            Your answer
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </RadioGroup>

          {/* Progress indicator for mobile */}
          {isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center gap-1 pt-2"
            >
              {Array.from({ length: totalQuestions }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    i === questionNumber - 1
                      ? "w-6 bg-primary"
                      : i < questionNumber - 1
                        ? "w-2 bg-primary/30"
                        : "w-2 bg-slate-200 dark:bg-slate-700",
                  )}
                />
              ))}
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
