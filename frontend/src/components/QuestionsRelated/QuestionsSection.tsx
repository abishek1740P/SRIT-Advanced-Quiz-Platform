import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { QuestionCardCreateQuiz } from "./QuestionCardCreateQuiz";

interface Question {
  id: string;
  questionText: string;
  choices: string[];
  correctAnswer: number;
  points: number;
}

interface QuestionsSectionProps {
  questions: Question[];
  onAddQuestion: () => void;
  onQuestionUpdate: (id: string, field: keyof Question, value: any) => void;
  onChoiceUpdate: (
    questionId: string,
    choiceIndex: number,
    value: string
  ) => void;
  onRemoveQuestion: (id: string) => void;
  title?: string;
  description?: string;
  addButtonText?: string;
}

export function QuestionsSection({
  questions,
  onAddQuestion,
  onQuestionUpdate,
  onChoiceUpdate,
  onRemoveQuestion,
  title = "Questions",
  description = "Add and configure your quiz questions",
  addButtonText = "Add Question",
}: QuestionsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-slate-400">{description}</p>
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onAddQuestion}
            className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white backdrop-blur-sm"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            {addButtonText}
          </Button>
        </motion.div>
      </div>

      {questions.map((question, index) => (
        <QuestionCardCreateQuiz
          key={question.id}
          question={question}
          index={index}
          totalQuestions={questions.length}
          onQuestionUpdate={onQuestionUpdate}
          onChoiceUpdate={onChoiceUpdate}
          onRemove={onRemoveQuestion}
          canRemove={questions.length > 1}
        />
      ))}
    </motion.div>
  );
}
