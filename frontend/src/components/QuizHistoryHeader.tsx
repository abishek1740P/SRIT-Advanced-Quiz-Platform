// src/components/QuizHistoryHeader.tsx
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap } from "lucide-react";

interface QuizHistoryHeaderProps {
  onBack: () => void;
  title?: string;
  subtitle?: string;
}

export function QuizHistoryHeader({ 
  onBack, 
  title = "Your Quiz History", 
  subtitle = "Review your past quiz attempts and scores" 
}: QuizHistoryHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="icon"
            onClick={onBack}
            className="bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-white"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </motion.div>
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
          >
            <Zap className="w-4 h-4 text-yellow-400 mr-2" />
            <span className="text-sm font-medium text-slate-300">
              Quiz History
            </span>
          </motion.div>
          <h1 className="text-4xl font-bold leading-tight">
            {title.split(" ")[0]}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {" "}
              {title.split(" ").slice(1).join(" ")}
            </span>
          </h1>
          <p className="text-xl text-slate-300">{subtitle}</p>
        </div>
      </div>
    </motion.div>
  );
}