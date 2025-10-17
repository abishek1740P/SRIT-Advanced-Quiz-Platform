import { motion } from "framer-motion";
import { QuizHistoryCard } from "@/components/Cards/QuizHistoryCard";
import { ProcessedQuizHistory } from "@/types";

interface QuizHistoryListProps {
  quizzes: ProcessedQuizHistory[];
  onReview: (quiz: ProcessedQuizHistory) => void;
  className?: string;
}

export const QuizHistoryList: React.FC<QuizHistoryListProps> = ({
  quizzes,
  onReview,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`space-y-6 ${className}`}
    >
      {quizzes.map((quiz, index) => (
        <QuizHistoryCard
          key={quiz.id}
          quiz={quiz}
          index={index}
          onReview={onReview}
        />
      ))}
    </motion.div>
  );
};