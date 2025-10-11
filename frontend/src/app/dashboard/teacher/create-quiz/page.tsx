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
