// components/quiz/QuizStates.tsx
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuizLoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      <span className="ml-2">Loading quiz...</span>
    </div>
  );
}

export function QuizErrorState({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
      <div className="text-center">
        <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Quiz Not Found</h1>
        <p className="text-slate-400 mb-4">
          The quiz you're looking for doesn't exist or you don't have access.
        </p>
        <Button onClick={onBack}>Back to Dashboard</Button>
      </div>
    </div>
  );
}