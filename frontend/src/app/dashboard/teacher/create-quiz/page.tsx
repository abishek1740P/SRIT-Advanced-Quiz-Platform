// src/app/dashboard/teacher/create-quiz/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { QuizCreationHeader } from "@/components/QuizCreationHeader";
import { QuizDetailsCard } from "@/components/QuizDetailsCard";
import { QuestionsSection } from "@/components/QuestionsSection";
import { PublishSuccessCard } from "@/components/PublishSuccessCard";
import { PublishActions } from "@/components/PublishActions";
import { BackgroundElements } from "@/components/BackgroundElements";
import { useToast } from "@/hooks/use-toast";
import { teacherAPI } from "@/lib/api";
import { Question, CreateQuizData } from "@/types";
import { GoogleGenAI } from "@google/genai";
import { aiAPI } from "@/lib/api";

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
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiQuestionCount, setAiQuestionCount] = useState(5); // Default to 5 questions

  // Initialize Gemini AI

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

  const generateAIQuestions = async () => {
    if (!title.trim() || !description.trim()) {
      toast({
        title: "Error",
        description:
          "Please enter both title and description to generate AI questions",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGeneratingAI(true);

      const response = await aiAPI.generateQuestions({
        title,
        description,
        questionCount: aiQuestionCount,
      });

      const generatedQuestions = response.data.data.questions;

      // Transform to our question format with unique IDs
      const newQuestions: QuizQuestion[] = generatedQuestions.map(
        (q: Question, index: number) => ({
          id: `ai-${Date.now()}-${index}`,
          questionText: q.questionText,
          choices: q.choices,
          correctAnswer: q.correctAnswer,
          points: q.points || 5,
        })
      );

      setQuestions(newQuestions);

      toast({
        title: "AI Questions Generated!",
        description: `Successfully generated ${newQuestions.length} questions`,
      });
    } catch (error: any) {
      console.error("AI Generation Error:", error);

      let errorMessage = "Failed to generate questions. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Request timeout. Please try again.";
      }

      toast({
        title: "AI Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

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
    setAiQuestionCount(5); // Reset to default
  };

  const handleBack = () => router.push("/dashboard/teacher");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
      <BackgroundElements />

      <div className="relative z-10 mx-auto max-w-4xl p-6 space-y-8">
        <QuizCreationHeader onBack={handleBack} />

        {/* Success View */}
        {showSecretCode ? (
          <PublishSuccessCard
            secretCode={secretCode}
            copied={copied}
            onCopy={copyToClipboard}
            onBack={handleBack}
            onCreateAnother={handleCreateAnother}
          />
        ) : (
          <>
            <QuizDetailsCard
              title={title}
              onTitleChange={setTitle}
              description={description}
              onDescriptionChange={setDescription}
              duration={duration}
              onDurationChange={setDuration}
            />

            {/* AI Generation Section */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">
                    Generate Questions with AI
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Let AI create questions based on your quiz description
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Question Count Selector */}
                  <div className="flex items-center space-x-2">
                    <label
                      htmlFor="questionCount"
                      className="text-sm font-medium text-slate-300"
                    >
                      Questions:
                    </label>
                    <select
                      id="questionCount"
                      value={aiQuestionCount}
                      onChange={(e) =>
                        setAiQuestionCount(Number(e.target.value))
                      }
                      disabled={isGeneratingAI}
                      className="bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                      <option value={20}>20</option>
                      <option value={25}>25</option>
                      <option value={30}>30</option>
                    </select>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={generateAIQuestions}
                    disabled={
                      isGeneratingAI || !title.trim() || !description.trim()
                    }
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold shadow-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isGeneratingAI ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Generating {aiQuestionCount} Questions...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>✨ Generate Using AI</span>
                      </div>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>

            <QuestionsSection
              questions={questions}
              onAddQuestion={addQuestion}
              onQuestionUpdate={updateQuestion}
              onChoiceUpdate={updateChoice}
              onRemoveQuestion={removeQuestion}
            />

            <PublishActions
              onPublish={handlePublish}
              isPublishing={isPublishing}
            />
          </>
        )}
      </div>
    </div>
  );
}
