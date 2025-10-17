// src/components/PublishActions.tsx
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface PublishActionsProps {
  onPublish: () => void;
  isPublishing: boolean;
  publishText?: string;
  publishingText?: string;
}

export function PublishActions({
  onPublish,
  isPublishing,
  publishText = "Publish Quiz",
  publishingText = "Publishing...",
}: PublishActionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col sm:flex-row gap-3 justify-end sticky bottom-6 bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={onPublish}
          disabled={isPublishing}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg shadow-blue-500/25 backdrop-blur-sm w-full sm:w-auto"
        >
          {isPublishing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {publishingText}
            </>
          ) : (
            publishText
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
}