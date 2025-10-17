// src/components/QuizCardHeader.tsx
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  FileText,
  Users,
  Award,
  ChevronDown,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

interface QuizAnalytics {
  id: string;
  title: string;
  date: string;
  totalStudents: number;
  avgScore: number;
  totalPoints: number;
  secretCode?: string;
  hasAnalytics: boolean;
  students: any[];
}

interface QuizCardHeaderProps {
  quiz: QuizAnalytics;
  expandedQuiz: string | null;
  copiedCode: string | null;
  onCopyCode: (code: string) => void;
  formatDate: (dateString: string) => string;
  showTapToLoad?: boolean;
}

export function QuizCardHeader({
  quiz,
  expandedQuiz,
  copiedCode,
  onCopyCode,
  formatDate,
  showTapToLoad = false,
}: QuizCardHeaderProps) {
  return (
    <CollapsibleTrigger className="w-full">
      <CardHeader className="cursor-pointer hover:bg-slate-700/20 transition-all rounded-lg p-4 sm:p-6">
        <div className="flex items-start justify-between w-full gap-3">
          {/* Left Content - Quiz Info */}
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-left text-white text-base sm:text-lg lg:text-xl truncate">
                {quiz.title}
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs sm:text-sm mt-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span>{formatDate(quiz.date)}</span>

                  {quiz.secretCode && (
                    <span
                      className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs cursor-pointer transition-all duration-200 ${
                        copiedCode === quiz.secretCode
                          ? "bg-green-500/20 text-green-300 scale-105"
                          : "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onCopyCode(quiz.secretCode!);
                      }}
                    >
                      {copiedCode === quiz.secretCode ? (
                        <>
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        `Code: ${quiz.secretCode}`
                      )}
                    </span>
                  )}

                  {showTapToLoad && (
                    <span className="flex items-center gap-1 bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded text-xs">
                      <AlertCircle className="h-3 w-3" />
                      Tap to load
                    </span>
                  )}
                </div>
              </CardDescription>
            </div>
          </div>

          {/* Right Content - Stats & Chevron */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {/* Desktop: Stats */}
            <div className="hidden xs:flex flex-col items-end gap-1">
              <div className="flex items-center gap-2 text-slate-400">
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">{quiz.totalStudents}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Award className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">
                  {quiz.totalPoints || "N/A"}
                </span>
              </div>
              <div
                className={`text-sm sm:text-lg font-bold ${
                  quiz.avgScore >= 80
                    ? "text-green-400"
                    : quiz.avgScore >= 60
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {quiz.avgScore}%
              </div>
            </div>

            {/* Mobile: Compact stats */}
            <div className="xs:hidden flex flex-col items-end gap-0.5">
              <div className="flex items-center gap-1 text-slate-400">
                <Users className="h-3 w-3" />
                <span className="text-xs">{quiz.totalStudents}</span>
              </div>
              <div
                className={`text-xs font-bold ${
                  quiz.avgScore >= 80
                    ? "text-green-400"
                    : quiz.avgScore >= 60
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {quiz.avgScore}%
              </div>
            </div>

            {/* Chevron icon */}
            <div className="text-slate-400">
              {expandedQuiz === quiz.id ? (
                <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </div>
          </div>
        </div>
      </CardHeader>
    </CollapsibleTrigger>
  );
}
