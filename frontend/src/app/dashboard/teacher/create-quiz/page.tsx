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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  PlusCircle,
  Trash2,
  ArrowLeft,
  Save,
  Zap,
  Copy,
  Check,
  FileText,
  Clock,
  Hash,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { teacherAPI } from "@/lib/api";
import { Question, CreateQuizData } from "@/types";

interface QuizQuestion extends Question {
  id: string;
}

export default function QuizCreationPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("30");
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: "1",
      questionText: "",
      choices: ["", "", "", ""],
      correctAnswer: 0,
      points: 5,
    },
  ]);
  const [secretCode, setSecretCode] = useState("");
  const [showSecretCode, setShowSecretCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Load template data if provided
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const templateData = searchParams.get("template");

    if (templateData) {
      try {
        const parsedTemplate = JSON.parse(decodeURIComponent(templateData));
        setTitle(parsedTemplate.title || "");
        setDescription(parsedTemplate.description || "");
        setDuration(parsedTemplate.duration?.toString() || "30");
        setQuestions(parsedTemplate.questions || []);

        toast({
          title: "Template Loaded",
          description: "Quiz template has been loaded. You can now modify it.",
        });
      } catch (error) {
        console.error("Error parsing template data:", error);
      }
    }
  }, [toast]);

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      questionText: "",
      choices: ["", "", "", ""],
      correctAnswer: 0,
      points: 5,
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const updateQuestion = (
    id: string,
    field: keyof QuizQuestion,
    value: any
  ) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const updateChoice = (
    questionId: string,
    choiceIndex: number,
    value: string
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const newChoices = [...q.choices];
          newChoices[choiceIndex] = value;
          return { ...q, choices: newChoices };
        }
        return q;
      })
    );
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Secret code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a quiz title",
        variant: "destructive",
      });
      return;
    }

    // Validate all questions
    for (const question of questions) {
      if (!question.questionText.trim()) {
        toast({
          title: "Error",
          description: "Please fill in all question texts",
          variant: "destructive",
        });
        return;
      }

      for (const choice of question.choices) {
        if (!choice.trim()) {
          toast({
            title: "Error",
            description: "Please fill in all answer choices",
            variant: "destructive",
          });
          return;
        }
      }
    }

    try {
      setIsPublishing(true);
      const quizData: CreateQuizData = {
        title,
        description,
        duration: parseInt(duration),
        questions: questions.map((q) => ({
          id: q.id,
          questionText: q.questionText,
          choices: q.choices,
          correctAnswer: q.correctAnswer,
          points: q.points,
        })),
      };

      const response = await teacherAPI.createQuiz(quizData);

      if (response.data.success) {
        const secretCode = response.data.data.secretCode;
        setSecretCode(secretCode);
        setShowSecretCode(true);

        toast({
          title: "Quiz Published Successfully!",
          description: "Share the secret code with your students",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create quiz",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCreateAnother = () => {
    setShowSecretCode(false);
    setSecretCode("");
    setTitle("");
    setDescription("");
    setDuration("30");
    setQuestions([
      {
        id: "1",
        questionText: "",
        choices: ["", "", "", ""],
        correctAnswer: 0,
        points: 5,
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl p-6 space-y-8">
        {/* Header */}
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
                className="bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-white backdrop-blur-sm"
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
                <Zap className="w-4 h-4 text-yellow-400 mr-2" />
                <span className="text-sm font-medium text-slate-300">
                  Create Quiz
                </span>
              </motion.div>
              <h1 className="text-4xl font-bold leading-tight">
                Create Your
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {" "}
                  Quiz
                </span>
              </h1>
              <p className="text-xl text-slate-300">
                Set up questions and configure quiz settings
              </p>
            </div>
          </div>
        </motion.div>

        {/* Success View */}
        {showSecretCode ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 backdrop-blur-sm"
          >
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <Check className="h-10 w-10 text-green-400" />
              </div>

              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-green-400">
                  Quiz Published Successfully!
                </h3>
                <p className="text-slate-300 text-lg">
                  Share this secret code with your students to join the quiz
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 max-w-md mx-auto">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Hash className="h-5 w-5 text-blue-400" />
                  <p className="text-slate-400 font-medium">Secret Code</p>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <code className="text-4xl font-bold text-white bg-slate-700/50 px-6 py-4 rounded-xl tracking-wider font-mono">
                    {secretCode}
                  </code>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyToClipboard(secretCode)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-4 rounded-xl transition-all shadow-lg shadow-blue-500/25"
                  >
                    {copied ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <Copy className="h-6 w-6" />
                    )}
                  </motion.button>
                </div>
                <p className="text-slate-400 text-sm mt-4">
                  Students can join using this code at the student dashboard
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => router.push("/dashboard/teacher")}
                    className="bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-600/50 hover:text-white backdrop-blur-sm w-full sm:w-auto"
                  >
                    Back to Dashboard
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleCreateAnother}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold backdrop-blur-sm w-full sm:w-auto"
                  >
                    Create Another Quiz
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Quiz Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 transition-all">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Quiz Details</CardTitle>
                      <CardDescription className="text-slate-400">
                        Basic information about the quiz
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-slate-300">
                      Quiz Title
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., DBMS Midterm Exam"
                      className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-slate-300">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      placeholder="Brief description of the quiz..."
                      className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500/50 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration" className="text-slate-300">
                      Duration (minutes)
                    </Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="duration"
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="bg-slate-700/50 border-slate-600/50 text-white pl-10 focus:border-blue-500/50"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Questions Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold">Questions</h2>
                  <p className="text-slate-400">
                    Add and configure your quiz questions
                  </p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={addQuestion}
                    className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white backdrop-blur-sm"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Question
                  </Button>
                </motion.div>
              </div>

              {questions.map((question, qIndex) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * qIndex }}
                >
                  <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 transition-all group">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-400">
                              {qIndex + 1}
                            </span>
                          </div>
                          <CardTitle className="text-lg">
                            Question {qIndex + 1}
                          </CardTitle>
                        </div>
                        {questions.length > 1 && (
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeQuestion(question.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Question Text */}
                      <div className="space-y-2">
                        <Label className="text-slate-300">Question Text</Label>
                        <Textarea
                          value={question.questionText}
                          onChange={(e) =>
                            updateQuestion(
                              question.id,
                              "questionText",
                              e.target.value
                            )
                          }
                          placeholder="Enter your question here..."
                          rows={2}
                          className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500/50 resize-none"
                        />
                      </div>

                      {/* Answer Choices */}
                      <div className="space-y-4">
                        <Label className="text-slate-300">Answer Choices</Label>
                        <RadioGroup
                          value={question.correctAnswer.toString()}
                          onValueChange={(value) =>
                            updateQuestion(
                              question.id,
                              "correctAnswer",
                              parseInt(value)
                            )
                          }
                          className="space-y-3"
                        >
                          {question.choices.map((choice, cIndex) => (
                            <motion.div
                              key={cIndex}
                              whileHover={{ scale: 1.02 }}
                              className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/30 border border-slate-600/30 hover:border-slate-500/50 transition-all"
                            >
                              <RadioGroupItem
                                value={cIndex.toString()}
                                id={`q${qIndex}-c${cIndex}`}
                                className="text-blue-500 border-slate-400"
                              />
                              <Input
                                value={choice}
                                onChange={(e) =>
                                  updateChoice(
                                    question.id,
                                    cIndex,
                                    e.target.value
                                  )
                                }
                                placeholder={`Choice ${cIndex + 1}`}
                                className="bg-transparent border-0 text-white placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                              />
                              <Label
                                htmlFor={`q${qIndex}-c${cIndex}`}
                                className={`text-xs font-medium cursor-pointer ${
                                  question.correctAnswer === cIndex
                                    ? "text-green-400"
                                    : "text-slate-400"
                                }`}
                              >
                                {question.correctAnswer === cIndex
                                  ? "✓ Correct"
                                  : "Mark correct"}
                              </Label>
                            </motion.div>
                          ))}
                        </RadioGroup>
                      </div>

                      {/* Points */}
                      <div className="space-y-2">
                        <Label className="text-slate-300">Points</Label>
                        <Input
                          type="number"
                          value={question.points}
                          onChange={(e) =>
                            updateQuestion(
                              question.id,
                              "points",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-24 bg-slate-700/50 border-slate-600/50 text-white focus:border-blue-500/50"
                          min="1"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 justify-end sticky bottom-6 bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              ></motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg shadow-blue-500/25 backdrop-blur-sm w-full sm:w-auto"
                >
                  {isPublishing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Publishing...
                    </>
                  ) : (
                    "Publish Quiz"
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
