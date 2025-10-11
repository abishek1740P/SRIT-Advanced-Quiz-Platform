// src/components/QuizHistoryCard.tsx
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import QuestionCard from "@/components/QuestionCard";
import {
  History,
  Award,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { ProcessedQuizHistory } from "@/types";

interface QuizHistoryCardProps {
  quiz: ProcessedQuizHistory;
  index: number;
  onReview: (quiz: ProcessedQuizHistory) => void;
}

export function QuizHistoryCard({
  quiz,
  index,
  onReview,
}: QuizHistoryCardProps) {
  const percentage = Math.round((quiz.score / quiz.maxScore) * 100);
  const correctCount = quiz.questions.filter(
    (q) => q.userAnswer === q.correctAnswer
  ).length;

  return (
    <motion.div
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
                  <div>{quiz.teacher}</div>
                  <div>Attended on: {quiz.date}</div>
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
                <p className="font-semibold text-white">{percentage}%</p>
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
                <p className="font-semibold text-white">{quiz.timeTaken} min</p>
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
                    quiz.violations > 0 ? "text-red-400" : "text-green-400"
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
                  onClick={() => onReview(quiz)}
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
                {quiz.questions.map((question, idx) => (
                  <div
                    key={question.qId}
                    className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-4"
                  >
                    <QuestionCard
                      questionNumber={idx + 1}
                      totalQuestions={quiz.questions.length}
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
}
