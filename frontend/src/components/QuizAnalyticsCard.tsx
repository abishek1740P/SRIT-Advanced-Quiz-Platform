// src/components/QuizAnalyticsCard.tsx
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { QuizCardHeader } from "./QuizCardHeader";
import { StudentPerformanceTable } from "./StudentPerformanceTable";
import { Loader2, AlertCircle } from "lucide-react";

interface QuizAnalytics {
  id: string;
  title: string;
  date: string;
  duration: number;
  totalStudents: number;
  avgScore: number;
  totalPoints: number;
  secretCode?: string;
  students: any[];
  hasAnalytics: boolean;
}

interface QuizAnalyticsCardProps {
  quiz: QuizAnalytics;
  index: number;
  expandedQuiz: string | null;
  exporting: string | null;
  copiedCode: string | null;
  onExpand: (quizId: string) => void;
  onCopyCode: (code: string) => void;
  onExportCSV: (quizId: string, quizTitle: string) => void;
  formatDate: (dateString: string) => string;
}

export function QuizAnalyticsCard({
  quiz,
  index,
  expandedQuiz,
  exporting,
  copiedCode,
  onExpand,
  onCopyCode,
  onExportCSV,
  formatDate,
}: QuizAnalyticsCardProps) {
  const showTapToLoad = !quiz.hasAnalytics && expandedQuiz !== quiz.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
    >
      <Collapsible
        open={expandedQuiz === quiz.id}
        onOpenChange={() => onExpand(quiz.id)}
      >
        <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 transition-all">
          <QuizCardHeader
            quiz={quiz}
            expandedQuiz={expandedQuiz}
            copiedCode={copiedCode}
            onCopyCode={onCopyCode}
            formatDate={formatDate}
            showTapToLoad={showTapToLoad}
          />

          <CollapsibleContent>
            <CardContent className="space-y-4 sm:space-y-6 pt-4">
              {quiz.hasAnalytics ? (
                <StudentPerformanceTable
                  students={quiz.students}
                  quizId={quiz.id}
                  quizTitle={quiz.title}
                  exporting={exporting}
                  onExportCSV={onExportCSV}
                />
              ) : (
                <div className="text-center py-6 sm:py-8 text-slate-400">
                  <Loader2 className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50 animate-spin" />
                  <p className="text-sm sm:text-base">
                    Loading analytics data...
                  </p>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </motion.div>
  );
}
