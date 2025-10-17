// src/components/QuestionCard.tsx
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Trash2 } from "lucide-react";

interface Question {
  id: string;
  questionText: string;
  choices: string[];
  correctAnswer: number;
  points: number;
}

interface QuestionCardProps {
  question: Question;
  index: number;
  totalQuestions: number;
  onQuestionUpdate: (id: string, field: keyof Question, value: any) => void;
  onChoiceUpdate: (questionId: string, choiceIndex: number, value: string) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

export function QuestionCardCreateQuiz({
  question,
  index,
  totalQuestions,
  onQuestionUpdate,
  onChoiceUpdate,
  onRemove,
  canRemove,
}: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 * index }}
    >
      <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 transition-all group">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-blue-400">
                  {index + 1}
                </span>
              </div>
              <CardTitle className="text-lg">
                Question {index + 1}
              </CardTitle>
            </div>
            {canRemove && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(question.id)}
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
                onQuestionUpdate(
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
                onQuestionUpdate(
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
                    id={`q${index}-c${cIndex}`}
                    className="text-blue-500 border-slate-400"
                  />
                  <Input
                    value={choice}
                    onChange={(e) =>
                      onChoiceUpdate(
                        question.id,
                        cIndex,
                        e.target.value
                      )
                    }
                    placeholder={`Choice ${cIndex + 1}`}
                    className="bg-transparent border-0 text-white placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                  />
                  <Label
                    htmlFor={`q${index}-c${cIndex}`}
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
                onQuestionUpdate(
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
  );
}