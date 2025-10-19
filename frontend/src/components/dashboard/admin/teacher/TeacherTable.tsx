"use client";

import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Teacher } from "@/types/index";
import { FileText } from "lucide-react";

interface TeacherTableProps {
  teachers: Teacher[];
  loading: boolean;
  onDeleteTeacher: (teacherId: string) => void;
}

export default function TeacherTable({ teachers, loading, onDeleteTeacher }: TeacherTableProps) {
  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2">Loading teachers...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-slate-700/50">
            <th className="text-left p-3 sm:p-4 font-semibold text-slate-300 text-sm sm:text-base">
              Name
            </th>
            <th className="text-left p-3 sm:p-4 font-semibold text-slate-300 text-sm sm:text-base">
              Email
            </th>
            <th className="text-left p-3 sm:p-4 font-semibold text-slate-300 text-sm sm:text-base">
              Joined Date
            </th>
            <th className="text-left p-3 sm:p-4 font-semibold text-slate-300 text-sm sm:text-base">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher, index) => (
            <TeacherTableRow
              key={teacher._id}
              teacher={teacher}
              index={index}
              onDelete={onDeleteTeacher}
            />
          ))}
        </tbody>
      </table>
      
      {teachers.length === 0 && (
        <div className="p-8 text-center text-slate-400">
          <FileText className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 opacity-50" />
          <p className="text-base sm:text-lg">No teachers found</p>
        </div>
      )}
    </div>
  );
}

interface TeacherTableRowProps {
  teacher: Teacher;
  index: number;
  onDelete: (teacherId: string) => void;
}

function TeacherTableRow({ teacher, index, onDelete }: TeacherTableRowProps) {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors"
    >
      <td className="p-3 sm:p-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xs sm:text-sm font-bold text-white">
              {teacher.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="font-medium text-white text-sm sm:text-base truncate">
            {teacher.name}
          </span>
        </div>
      </td>
      <td className="p-3 sm:p-4 text-slate-300 text-sm sm:text-base truncate">
        {teacher.email}
      </td>
      <td className="p-3 sm:p-4 text-slate-300 text-sm sm:text-base">
        {new Date(teacher.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </td>
      <td className="p-3 sm:p-4">
        <button
          onClick={() => onDelete(teacher._id)}
          className="p-1 sm:p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
          title="Delete Teacher"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </motion.tr>
  );
}