// src/components/StudentPerformanceTable.tsx
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Download,
  Loader2,
  Users,
  AlertTriangle,
  Clock,
  Calendar,
} from "lucide-react";

interface StudentPerformance {
  name: string;
  email: string;
  score: number;
  totalPoints: number;
  scorePercentage: number;
  violations: number;
  timeTaken: number;
  status: string;
  startTime: string;
  endTime: string;
  attendedAt: string;
}

interface StudentPerformanceTableProps {
  students: StudentPerformance[];
  quizId: string;
  quizTitle: string;
  exporting: string | null;
  onExportCSV: (quizId: string, quizTitle: string) => void;
  formatDate: (dateString: string) => string;
}

export function StudentPerformanceTable({
  students,
  quizId,
  quizTitle,
  exporting,
  onExportCSV,
  formatDate,
}: StudentPerformanceTableProps) {
  if (students.length === 0) {
    return (
      <div className="text-center py-6 sm:py-8 text-slate-400">
        <Users className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
        <p className="text-sm sm:text-base">
          No students have attempted this quiz yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h4 className="font-semibold text-white text-sm sm:text-base lg:text-lg">
          Student Performance ({students.length} students)
        </h4>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full sm:w-auto"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExportCSV(quizId, quizTitle)}
            disabled={exporting === quizId}
            className="bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-600/50 hover:text-white transition-all w-full sm:w-auto"
          >
            {exporting === quizId ? (
              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            )}
            Export CSV
          </Button>
        </motion.div>
      </div>

      <div className="rounded-lg border border-slate-600/50 overflow-hidden">
        {/* Mobile Student Cards */}
        <div className="sm:hidden space-y-3 p-2">
          {students.map((student, idx) => (
            <StudentMobileCard
              key={idx}
              student={student}
              formatDate={formatDate}
            />
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block">
          <Table>
            <TableHeader className="bg-slate-700/50">
              <TableRow className="border-slate-600/50 hover:bg-slate-700/50">
                <TableHead className="text-slate-300 font-semibold">
                  Student
                </TableHead>
                <TableHead className="text-slate-300 font-semibold">
                  Email
                </TableHead>
                <TableHead className="text-slate-300 font-semibold">
                  Score
                </TableHead>
                <TableHead className="text-slate-300 font-semibold">
                  Percentage
                </TableHead>
                <TableHead className="text-slate-300 font-semibold">
                  Violations
                </TableHead>
                <TableHead className="text-slate-300 font-semibold">
                  Time Taken
                </TableHead>
                <TableHead className="text-slate-300 font-semibold">
                  Attended Date
                </TableHead>
                <TableHead className="text-slate-300 font-semibold">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student, idx) => (
                <StudentTableRow
                  key={idx}
                  student={student}
                  formatDate={formatDate}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

// Sub-component for mobile student cards
function StudentMobileCard({
  student,
  formatDate,
}: {
  student: StudentPerformance;
  formatDate: (dateString: string) => string;
}) {
  return (
    <div className="bg-slate-700/30 rounded-lg p-3 space-y-2 border border-slate-600/30">
      <div className="flex justify-between items-start">
        <div className="space-y-1 flex-1 min-w-0">
          <h5 className="font-semibold text-white text-sm truncate">
            {student.name}
          </h5>
          <p className="text-xs text-slate-400 truncate">{student.email}</p>
        </div>
        <Badge
          className={
            student.scorePercentage >= 80
              ? "bg-green-500/20 text-green-400 border-green-500/30 text-xs"
              : student.scorePercentage >= 60
              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs"
              : "bg-red-500/20 text-red-400 border-red-500/30 text-xs"
          }
        >
          {student.scorePercentage}%
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-slate-400">Score: </span>
          <span className="font-semibold text-white">
            {student.score}/{student.totalPoints}
          </span>
        </div>
        <div>
          <span className="text-slate-400">Time: </span>
          <span className="font-semibold text-white">{student.timeTaken}m</span>
        </div>
        <div>
          <span className="text-slate-400">Violations: </span>
          <span
            className={`font-semibold ${
              student.violations > 0 ? "text-red-400" : "text-green-400"
            }`}
          >
            {student.violations}
          </span>
        </div>
        <div>
          <span className="text-slate-400">Attended: </span>
          <span className="font-semibold text-white text-xs">
            {formatDate(student.attendedAt)}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-slate-600/30">
        <Badge
          className={
            student.status === "completed"
              ? "bg-green-500/20 text-green-400 border-green-500/30 text-xs"
              : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs"
          }
        >
          {student.status}
        </Badge>
        <div className="flex items-center gap-1 text-slate-400 text-xs">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(student.attendedAt)}</span>
        </div>
      </div>
    </div>
  );
}

// Sub-component for desktop table rows
function StudentTableRow({
  student,
  formatDate,
}: {
  student: StudentPerformance;
  formatDate: (dateString: string) => string;
}) {
  return (
    <TableRow className="border-slate-600/30 hover:bg-slate-700/30 transition-colors">
      <TableCell className="font-medium text-white">{student.name}</TableCell>
      <TableCell className="text-slate-400">{student.email}</TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-semibold text-white">
            {student.score}/{student.totalPoints}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={
            student.scorePercentage >= 80
              ? "bg-green-500/20 text-green-400 border-green-500/30"
              : student.scorePercentage >= 60
              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
              : "bg-red-500/20 text-red-400 border-red-500/30"
          }
        >
          {student.scorePercentage}%
        </Badge>
      </TableCell>
      <TableCell>
        {student.violations > 0 ? (
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">{student.violations}</span>
          </div>
        ) : (
          <span className="text-green-400 font-medium">0</span>
        )}
      </TableCell>
      <TableCell className="text-slate-300">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          {student.timeTaken} min
        </div>
      </TableCell>
      <TableCell className="text-slate-300">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">{formatDate(student.attendedAt)}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={
            student.status === "completed"
              ? "bg-green-500/20 text-green-400 border-green-500/30"
              : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
          }
        >
          {student.status}
        </Badge>
      </TableCell>
    </TableRow>
  );
}
