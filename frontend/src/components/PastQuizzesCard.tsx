// src/components/PastQuizzesCard.tsx
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Clock, BookOpen } from "lucide-react";

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

interface PastQuizzesCardProps {
  pastQuizzes: PastQuiz[];
  onReviewQuiz: (quizId: string) => void;
  onViewAll: () => void;
  title?: string;
  description?: string;
  viewAllText?: string;
  maxDisplay?: number;
}

export function PastQuizzesCard({
  pastQuizzes,
  onReviewQuiz,
  onViewAll,
  title = "Recent Quizzes",
  description = "Your recent quiz attempts and performance",
  viewAllText = "View All",
  maxDisplay = 5,
}: PastQuizzesCardProps) {
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

  return (
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
                <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
                <CardDescription className="text-slate-400 text-sm sm:text-base">
                  {description}
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
                onClick={onViewAll}
                data-testid="button-view-history"
              >
                {viewAllText}
              </Button>
            </motion.div>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <div className="space-y-3 sm:space-y-4">
            {pastQuizzes.length > 0 ? (
              pastQuizzes.slice(0, maxDisplay).map((quiz, index) => (
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
                      <p className="text-xs sm:text-sm text-slate-400">Score</p>
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
                        onClick={() => onReviewQuiz(quiz.quizId)}
                      >
                        <BookOpen className="w-3 h-3 mr-1 sm:mr-2" />
                        <span>Review</span>
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ))
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
  );
}