// src/components/JoinQuizCard.tsx
import { motion } from "framer-motion";
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
import { KeyRound, Play, Loader2 } from "lucide-react";

interface JoinQuizCardProps {
  quizCode: string;
  onQuizCodeChange: (code: string) => void;
  onJoinQuiz: () => void;
  joiningQuiz: boolean;
  disabled?: boolean;
}

export function JoinQuizCard({
  quizCode,
  onQuizCodeChange,
  onJoinQuiz,
  joiningQuiz,
  disabled = false,
}: JoinQuizCardProps) {
  return (
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
              onChange={(e) => onQuizCodeChange(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && onJoinQuiz()}
              className="font-mono text-base sm:text-lg bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-500/50 transition-all h-12 sm:h-14"
              data-testid="input-quiz-code"
              disabled={disabled}
            />
          </div>
          <motion.div
            whileHover={{ scale: joiningQuiz ? 1 : 1.02 }}
            whileTap={{ scale: joiningQuiz ? 1 : 0.98 }}
          >
            <Button
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 sm:py-4 rounded-xl transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base h-12 sm:h-14"
              onClick={onJoinQuiz}
              disabled={joiningQuiz || !quizCode.trim() || disabled}
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
  );
}