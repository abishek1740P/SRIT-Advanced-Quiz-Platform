// src/components/PublishSuccessCard.tsx
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Copy, Hash } from "lucide-react";

interface PublishSuccessCardProps {
  secretCode: string;
  copied: boolean;
  onCopy: (text: string) => void;
  onBack: () => void;
  onCreateAnother: () => void;
  title?: string;
  description?: string;
  backButtonText?: string;
  createAnotherText?: string;
}

export function PublishSuccessCard({
  secretCode,
  copied,
  onCopy,
  onBack,
  onCreateAnother,
  title = "Quiz Published Successfully!",
  description = "Share this secret code with your students to join the quiz",
  backButtonText = "Back to Dashboard",
  createAnotherText = "Create Another Quiz",
}: PublishSuccessCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 backdrop-blur-sm"
    >
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
          <Check className="h-10 w-10 text-green-400" />
        </div>

        <div className="space-y-2">
          <h3 className="text-3xl font-bold text-green-400">{title}</h3>
          <p className="text-slate-300 text-lg">{description}</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 max-w-md mx-auto">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Hash className="h-5 w-5 text-blue-400" />
            <p className="text-slate-400 font-medium">Secret Code</p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <code className="text-4xl font-bold text-white bg-slate-700/50 px-6 py-4 rounded-xl tracking-wider font-mono">
              {secretCode}
            </code>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCopy(secretCode)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-4 rounded-xl transition-all shadow-lg shadow-blue-500/25"
            >
              {copied ? (
                <Check className="h-6 w-6" />
              ) : (
                <Copy className="h-6 w-6" />
              )}
            </motion.button>
          </div>
          <p className="text-slate-400 text-sm mt-4">
            Students can join using this code at the student dashboard
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={onBack}
              className="bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-600/50 hover:text-white backdrop-blur-sm w-full sm:w-auto"
            >
              {backButtonText}
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={onCreateAnother}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold backdrop-blur-sm w-full sm:w-auto"
            >
              {createAnotherText}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}