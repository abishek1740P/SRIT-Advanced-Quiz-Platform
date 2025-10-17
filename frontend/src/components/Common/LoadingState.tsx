// src/components/LoadingState.tsx
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ 
  message = "Loading your quizzes...",
  className = ""
}: LoadingStateProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center p-4 ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      <span className="ml-2">{message}</span>
    </div>
  );
}