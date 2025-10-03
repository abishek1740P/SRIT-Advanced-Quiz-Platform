"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { teacherAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Quiz } from "@/types";
import {
  ArrowLeft,
  Search,
  Copy,
  FileText,
  Calendar,
  Users,
  Zap,
} from "lucide-react";

export default function ChooseQuizPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = quizzes.filter((quiz) =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredQuizzes(filtered);
    } else {
      setFilteredQuizzes(quizzes);
    }
  }, [searchTerm, quizzes]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await teacherAPI.getTeacherQuizzes();

      if (response.data.success) {
        setQuizzes(response.data.data);
        setFilteredQuizzes(response.data.data);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load quizzes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUseAsTemplate = (quiz: Quiz) => {
    // Navigate to create quiz page with template data - this creates NEW quiz
    const templateData = {
      title: `${quiz.title} (Copy)`,
      description: quiz.description,
      duration: quiz.duration,
      questions: quiz.questions.map((q) => ({
        id: Date.now().toString() + Math.random(),
        questionText: q.questionText,
        choices: [...q.choices],
        correctAnswer: q.correctAnswer,
        points: q.points,
      })),
    };

    router.push(
      `/dashboard/teacher/create-quiz?template=${encodeURIComponent(
        JSON.stringify(templateData)
      )}`
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading your quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl p-6 space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push("/dashboard/teacher")}
                className="bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </motion.div>
            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
              >
                <Copy className="w-4 h-4 text-green-400 mr-2" />
                <span className="text-sm font-medium text-slate-300">
                  Use Quiz Templates
                </span>
              </motion.div>
              <h1 className="text-4xl font-bold leading-tight">
                Your Quiz
                <span className="bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                  {" "}
                  Templates
                </span>
              </h1>
              <p className="text-xl text-slate-300">
                Select a quiz to use as template for a new quiz
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search quizzes by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-400 focus:border-green-500/50 transition-all"
          />
        </motion.div>

        {/* Quizzes Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredQuizzes.length > 0 ? (
            filteredQuizzes.map((quiz, index) => (
              <motion.div
                key={quiz._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-green-500/50 transition-all h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg text-white line-clamp-2">
                      {quiz.title}
                    </CardTitle>
                    <CardDescription className="text-slate-400 line-clamp-2">
                      {quiz.description || "No description"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    {/* Quiz Details */}
                    <div className="space-y-2 text-sm text-slate-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-400" />
                        <span>
                          Created:{" "}
                          {new Date(quiz.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-400" />
                        <span>Duration: {quiz.duration} minutes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-purple-400" />
                        <span>Questions: {quiz.questions.length}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-400" />
                        <span>
                          Status:{" "}
                          <span
                            className={
                              quiz.isActive ? "text-green-400" : "text-red-400"
                            }
                          >
                            {quiz.isActive ? "Active" : "Inactive"}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Single Action Button */}
                    <div className="pt-4">
                      <Button
                        onClick={() => handleUseAsTemplate(quiz)}
                        className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white transition-all"
                        size="sm"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Use as Template
                      </Button>
                    </div>
                    <div className="text-xs text-slate-500 text-center">
                      Creates a new quiz with new secret code
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <FileText className="h-16 w-16 mx-auto mb-4 text-slate-400 opacity-50" />
              <h3 className="text-xl font-semibold text-slate-300 mb-2">
                No quizzes found
              </h3>
              <p className="text-slate-400 mb-6">
                {searchTerm
                  ? "No quizzes match your search. Try different keywords."
                  : "You haven't created any quizzes yet."}
              </p>
              <Button
                onClick={() => router.push("/dashboard/teacher/create-quiz")}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Create Your First Quiz
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
