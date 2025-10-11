// components/dashboard/QuizCard.tsx
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, FileText } from "lucide-react";
import { RecentQuiz } from "@/types";
import { ToggleLeft, ToggleRight } from "lucide-react";

interface QuizCardProps {
  quiz: RecentQuiz;
  index: number;
  updatingQuiz: string | null;
  copiedCode: string | null;
  onToggleStatus: (quizId: string, currentStatus: boolean) => void;
  onCopyCode: (code: string) => void;
  // onViewAnalytics: (quizId: string) => void;
}

export function QuizCard({
  quiz,
  index,
  updatingQuiz,
  copiedCode,
  onToggleStatus,
  onCopyCode,
}: // onViewAnalytics,
QuizCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-700/30 border border-slate-600/30 hover:border-slate-500/50 hover:bg-slate-700/50 transition-all cursor-pointer group"
      data-testid={`quiz-card-${quiz.id}`}
    >
      <div className="space-y-2 flex-1 mb-4 sm:mb-0">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-white group-hover:text-blue-300 transition-colors text-lg sm:text-base cursor-pointer">
            {quiz.title}
          </h4>
          <StatusBadge isActive={quiz.isActive} />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-slate-400">
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {new Date(quiz.date).toLocaleDateString()}
          </span>
          {quiz.secretCode && (
            <SecretCode 
              code={quiz.secretCode}
              copiedCode={copiedCode}
              onCopy={onCopyCode}
            />
          )}
        </div>
      </div>
      
      <QuizCardActions
        quiz={quiz}
        updatingQuiz={updatingQuiz}
        onToggleStatus={onToggleStatus}
        // onViewAnalytics={onViewAnalytics}
      />
    </motion.div>
  );
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
        isActive
          ? "bg-green-500/20 text-green-300"
          : "bg-red-500/20 text-red-300"
      }`}
    >
      <div className={`w-2 h-2 rounded-full ${isActive ? "bg-green-400" : "bg-red-400"}`}></div>
      {isActive ? "Active" : "Inactive"}
    </div>
  );
}

function SecretCode({ 
  code, 
  copiedCode, 
  onCopy 
}: { 
  code: string; 
  copiedCode: string | null; 
  onCopy: (code: string) => void;
}) {
  const isCopied = copiedCode === code;
  
  return (
    <span
      className={`flex items-center gap-1 px-2 py-1 rounded text-xs cursor-pointer transition-all duration-200 ${
        isCopied
          ? "bg-green-500/20 text-green-300 scale-105"
          : "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onCopy(code);
      }}
    >
      {isCopied ? (
        <>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <Lock className="h-3 w-3" />
          Code: {code}
        </>
      )}
    </span>
  );
}

function QuizCardActions({ 
  quiz, 
  updatingQuiz, 
  onToggleStatus,
}: // onViewAnalytics 
{ 
  quiz: RecentQuiz; 
  updatingQuiz: string | null;
  onToggleStatus: (quizId: string, currentStatus: boolean) => void;
  // onViewAnalytics: (quizId: string) => void;
}) {
  return (
    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
      <div className="text-left sm:text-right">
        <p className="text-sm text-slate-400">Students</p>
        <p className="text-lg font-bold text-green-400">{quiz.students}</p>
      </div>
      <div className="text-left sm:text-right">
        <p className="text-sm text-slate-400">Avg Score</p>
        <p className="text-lg font-bold text-blue-400">{quiz.avgScore}%</p>
      </div>
      
      <ToggleQuizButton
        quiz={quiz}
        updatingQuiz={updatingQuiz}
        onToggle={onToggleStatus}
      />
      
      {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewAnalytics(quiz.id)}
          className="bg-slate-600/50 border-slate-500/50 text-slate-300 hover:bg-slate-500/50 hover:text-white transition-all"
        >
          Analytics
        </Button>
      </motion.div> */}
    </div>
  );
}

function ToggleQuizButton({ 
  quiz, 
  updatingQuiz, 
  onToggle 
}: { 
  quiz: RecentQuiz; 
  updatingQuiz: string | null;
  onToggle: (quizId: string, currentStatus: boolean) => void;
}) {
  const isActive = quiz.isActive;
  
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onToggle(quiz.id, isActive);
        }}
        disabled={updatingQuiz === quiz.id}
        className={`flex items-center gap-2 ${
          isActive
            ? "bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30"
            : "bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30"
        } transition-all`}
      >
        {updatingQuiz === quiz.id ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : isActive ? (
          <>
            <ToggleLeft className="h-4 w-4" />
            Disable
          </>
        ) : (
          <>
            <ToggleRight className="h-4 w-4" />
            Enable
          </>
        )}
      </Button>
    </motion.div>
  );
}