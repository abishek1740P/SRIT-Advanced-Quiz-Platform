// frontend/src/app/dashboard/admin/analytics/components/TopTeachers.tsx
import { motion } from "framer-motion";
import { Award, GraduationCap } from "lucide-react";
import { SystemAnalytics } from "../../../../types/index";

interface TopTeachersProps {
  teachers: SystemAnalytics["topTeachers"] | undefined;
}

export default function TopTeachers({ teachers }: TopTeachersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Top Teachers</h3>
        <Award className="w-5 h-5 text-yellow-400" />
      </div>

      <div className="space-y-4">
        {teachers && teachers.length > 0 ? (
          teachers.map((teacher) => (
            <div
              key={teacher._id}
              className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {teacher.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">
                    {teacher.name}
                  </p>
                  <p className="text-slate-400 text-xs">
                    {teacher.email}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">
                  {teacher.quizCount}
                </p>
                <p className="text-slate-400 text-xs">Quizzes</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-slate-400">
            <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No teacher data available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}