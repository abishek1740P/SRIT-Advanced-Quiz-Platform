// src/components/TeacherHistoryHeader.tsx
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap } from "lucide-react";

interface TeacherHistoryHeaderProps {
  onBack: () => void;
  title?: string;
  subtitle?: string;
  gradientText?: string;
  badgeText?: string;
}

export function TeacherHistoryHeader({
  onBack,
  title = "Quiz History &",
  subtitle = "View detailed performance metrics for all quizzes",
  gradientText = "Analytics",
  badgeText = "Quiz History"
}: TeacherHistoryHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="icon"
            onClick={onBack}
            className="bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-white mt-1 flex-shrink-0"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </motion.div>
        <div className="space-y-2 flex-1 min-w-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
          >
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 mr-2" />
            <span className="text-xs sm:text-sm font-medium text-slate-300">
              {badgeText}
            </span>
          </motion.div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight break-words">
            {title}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block sm:inline">
              {" "}
              {gradientText}
            </span>
          </h1>
          <p className="text-sm sm:text-base lg:text-xl text-slate-300">
            {subtitle}
          </p>
        </div>
      </div>
    </motion.div>
  );
}