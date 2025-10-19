"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, UserPlus, Upload, Download } from "lucide-react";

interface TeacherHeaderProps {
  onAddTeacher: () => void;
  onDownloadCSV: () => void;
  onFileSelect: (file: File | null) => void;
  csvFile: File | null;
  onBulkUpload: () => void;
}

export default function TeacherHeader({
  onAddTeacher,
  onDownloadCSV,
  onFileSelect,
  csvFile,
  onBulkUpload,
}: TeacherHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link
          href="/dashboard/admin"
          className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Teacher Management
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Add, view, and manage teachers
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAddTeacher}
          className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold flex items-center space-x-2 hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25 text-sm sm:text-base"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Teacher</span>
        </motion.button>

        <label className="px-3 sm:px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg font-semibold flex items-center space-x-2 hover:bg-slate-600/50 transition-all cursor-pointer text-sm sm:text-base">
          <Upload className="w-4 h-4" />
          <span>Upload CSV</span>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => onFileSelect(e.target.files?.[0] || null)}
            className="hidden"
          />
        </label>

        {csvFile && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onBulkUpload}
            className="px-3 sm:px-4 py-2 bg-green-600 rounded-lg font-semibold hover:bg-green-700 transition-all text-sm sm:text-base"
          >
            Process Upload
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onDownloadCSV}
          className="px-3 sm:px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg font-semibold flex items-center space-x-2 hover:bg-slate-600/50 transition-all text-sm sm:text-base"
        >
          <Download className="w-4 h-4" />
          <span>Download CSV</span>
        </motion.button>
      </div>
    </div>
  );
}