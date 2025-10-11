// src/components/EmptyQuizHistory.tsx
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

interface EmptyQuizHistoryProps {
  onAction: () => void;
  title?: string;
  description?: string;
  actionText?: string;
}

export function EmptyQuizHistory({ 
  onAction, 
  title = "No Quiz History", 
  description = "You haven't attempted any quizzes yet.",
  actionText = "Join a Quiz"
}: EmptyQuizHistoryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16"
    >
      <div className="w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
        <History className="h-12 w-12 text-slate-400" />
      </div>
      <h3 className="text-2xl font-bold text-slate-300 mb-2">{title}</h3>
      <p className="text-slate-400 mb-6">{description}</p>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={onAction}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold"
        >
          {actionText}
        </Button>
      </motion.div>
    </motion.div>
  );
}