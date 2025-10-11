// components/quiz/QuizHeader.tsx
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Timer from "@/components/Timer";
import ViolationIndicator from "@/components/ViolationIndicator";
import { Maximize2, X } from "lucide-react";
import { Quiz } from "@/types";

interface QuizHeaderProps {
  quiz: Quiz;
  violations: number;
  isMobile: boolean;
  isFullscreen: boolean;
  progress: number;
  onEnterFullscreen: () => void;
  onExit: () => void;
  onTimeUp: () => void;
}

export function QuizHeader({
  quiz,
  violations,
  isMobile,
  isFullscreen,
  progress,
  onEnterFullscreen,
  onExit,
  onTimeUp,
}: QuizHeaderProps) {
  return (
    <div className="relative z-10 border-b border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-3 md:py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0">
          <div className="flex items-center justify-between md:justify-start gap-4">
            <Timer
              initialSeconds={quiz.duration * 60}
              size={isMobile ? "sm" : "lg"}
              onTimeUp={onTimeUp}
            />
            <QuizTitle title={quiz.title} isMobile={isMobile} />
          </div>
          <QuizHeaderActions
            violations={violations}
            isMobile={isMobile}
            isFullscreen={isFullscreen}
            onEnterFullscreen={onEnterFullscreen}
            onExit={onExit}
          />
        </div>
        <Progress
          value={progress}
          className="mt-3 md:mt-4 h-1.5 md:h-2 bg-slate-700/50"
        />
      </div>
    </div>
  );
}

function QuizTitle({ title, isMobile }: { title: string; isMobile: boolean }) {
  return (
    <div className="text-sm md:text-lg font-medium">
      <span className="text-slate-300 hidden md:inline">Quiz:</span>{" "}
      <span className="font-mono text-white bg-slate-700/50 px-2 py-1 md:px-3 md:py-1 rounded-lg text-xs md:text-sm">
        {title}
      </span>
    </div>
  );
}

function QuizHeaderActions({
  violations,
  isMobile,
  isFullscreen,
  onEnterFullscreen,
  onExit,
}: {
  violations: number;
  isMobile: boolean;
  isFullscreen: boolean;
  onEnterFullscreen: () => void;
  onExit: () => void;
}) {
  return (
    <div className="flex items-center justify-between md:justify-end gap-2 md:gap-4">
      <ViolationIndicator count={violations} isMobile={isMobile} />
      {!isMobile && !isFullscreen && (
        <FullscreenButton onEnterFullscreen={onEnterFullscreen} />
      )}
      <ExitButton onExit={onExit} isMobile={isMobile} />
    </div>
  );
}

function FullscreenButton({ onEnterFullscreen }: { onEnterFullscreen: () => void }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant="outline"
        size="sm"
        onClick={onEnterFullscreen}
        className="bg-yellow-500/20 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30 text-xs"
      >
        <Maximize2 className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
        Fullscreen
      </Button>
    </motion.div>
  );
}

function ExitButton({ onExit, isMobile }: { onExit: () => void; isMobile: boolean }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant="outline"
        size={isMobile ? "sm" : "icon"}
        onClick={onExit}
        className={`${
          isMobile
            ? "bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 text-xs px-3"
            : "bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400"
        }`}
        data-testid="button-exit"
      >
        {isMobile ? "Exit" : <X className="h-4 w-4" />}
      </Button>
    </motion.div>
  );
}