// components/quiz/SubmitConfirmationDialog.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface SubmitConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  answeredCount: number;
  totalQuestions: number;
  violations: number;
  isMobile: boolean;
  submitting: boolean;
  onSubmit: () => void;
}

export function SubmitConfirmationDialog({
  open,
  onOpenChange,
  answeredCount,
  totalQuestions,
  violations,
  isMobile,
  submitting,
  onSubmit,
}: SubmitConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-slate-800 border-slate-700 text-white max-w-[95vw] md:max-w-md rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg md:text-xl">
            Submit Quiz?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400 text-sm md:text-base">
            <SubmissionDetails
              answeredCount={answeredCount}
              totalQuestions={totalQuestions}
              violations={violations}
              isMobile={isMobile}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col md:flex-row gap-2 md:gap-0">
          <AlertDialogCancel
            className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 mt-0 md:mt-0 order-2 md:order-1"
            disabled={submitting}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onSubmit}
            disabled={submitting}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 order-1 md:order-2"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Quiz"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function SubmissionDetails({
  answeredCount,
  totalQuestions,
  violations,
  isMobile,
}: {
  answeredCount: number;
  totalQuestions: number;
  violations: number;
  isMobile: boolean;
}) {
  return (
    <>
      You have answered <strong>{answeredCount}</strong> out of{" "}
      <strong>{totalQuestions}</strong> questions.
      {answeredCount < totalQuestions && (
        <span className="text-yellow-400 block mt-2">
          ⚠️ Unanswered questions will be marked as incorrect.
        </span>
      )}
      <span className="block mt-2">
        {isMobile ? "Warnings" : "Violations"} detected:{" "}
        <strong
          className={violations > 0 ? "text-red-400" : "text-green-400"}
        >
          {violations}
        </strong>
        {violations > 0 && (
          <span className="text-red-400 block text-xs md:text-sm mt-1">
            ⚠️ Multiple {isMobile ? "warnings" : "violations"} may
            affect your final score
          </span>
        )}
      </span>
      This action cannot be undone.
    </>
  );
}