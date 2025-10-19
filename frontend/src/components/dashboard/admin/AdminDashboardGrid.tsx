import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Users, GraduationCap, BarChart3 } from "lucide-react";

const dashboardCards = [
  {
    id: "teachers",
    title: "Teacher Management",
    description: "Add, view, and manage teachers",
    icon: GraduationCap,
    path: "/dashboard/admin/teacher",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "students",
    title: "Student Management",
    description: "View and manage students",
    icon: Users,
    path: "/dashboard/admin/student",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "View system analytics and reports",
    icon: BarChart3,
    path: "/dashboard/admin/analytics",
    color: "from-green-500 to-emerald-500",
  },
];

export function DashboardGrid() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {dashboardCards.map((card, index) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all cursor-pointer group"
          onClick={() => router.push(card.path)}
        >
          <div
            className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
          >
            <card.icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {card.title}
          </h3>
          <p className="text-slate-400 leading-relaxed">
            {card.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}