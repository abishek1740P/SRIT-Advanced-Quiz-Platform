// src/components/DashboardHeader.tsx
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface DashboardHeaderProps {
  badgeText?: string;
  title?: string;
  subtitle?: string;
  gradientText?: string;
}

export function DashboardHeader({
  badgeText = "Student Dashboard",
  title = "Welcome to Your",
  subtitle = "Enter quiz codes and track your learning progress with detailed analytics",
  gradientText = "Dashboard",
}: DashboardHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex flex-col space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm self-start"
        >
          <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 mr-2" />
          <span className="text-xs sm:text-sm font-medium text-slate-300">
            {badgeText}
          </span>
        </motion.div>

        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight">
            {title}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block sm:inline">
              {" "}
              {gradientText}
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl">
            {subtitle}
          </p>
        </div>
      </div>
    </motion.div>
  );
}