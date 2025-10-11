// src/components/EmptyQuizHistory.tsx
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface EmptyQuizHistoryProps {
  onAction: () => void;
  title?: string;
  description?: string;
  actionText?: string;
}

export function EmptyQuizHistoryTeacher({ 
  onAction, 
  title = "No Quiz History", 
  description = "You haven't conducted any quizzes yet.",
  actionText = "Create Your First Quiz"
}: EmptyQuizHistoryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12 sm:py-16"
    >
      <div className="w-16 h-16 sm:w-24 sm:h-24 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
        <FileText className="h-8 w-8 sm:h-12 sm:w-12 text-slate-400" />
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-slate-300 mb-2">
        {title}
      </h3>
      <p className="text-slate-400 mb-6 text-sm sm:text-base">
        {description}
      </p>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={onAction}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-sm sm:text-base"
        >
          {actionText}
        </Button>
      </motion.div>
    </motion.div>
  );
}