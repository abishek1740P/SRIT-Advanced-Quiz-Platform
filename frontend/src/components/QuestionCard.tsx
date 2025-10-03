import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  questionText: string;
  choices: string[];
  selectedAnswer?: number;
  onAnswerChange?: (choiceIndex: number) => void;
  points?: number;
  isReview?: boolean;
  correctAnswer?: number;
  userAnswer?: number;
  isMobile?: boolean; // added mobile prop
}

export default function QuestionCard({
  questionNumber,
  totalQuestions,
  questionText,
  choices,
  selectedAnswer,
  onAnswerChange,
  points = 5,
  isReview = false,
  correctAnswer,
  userAnswer,
  isMobile = false, // default false
}: QuestionCardProps) {
  return (
    <Card className="p-6" data-testid={`question-card-${questionNumber}`}>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Question {questionNumber} of {totalQuestions}
              </span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm font-medium text-primary">
                {points} points
              </span>
            </div>
            <h3 className="text-lg font-semibold" data-testid="text-question">
              {questionText}
            </h3>
          </div>
        </div>

        <RadioGroup
          value={selectedAnswer?.toString()}
          onValueChange={(value) => onAnswerChange?.(parseInt(value))}
          className="space-y-3"
        >
          {choices.map((choice, index) => {
            const isCorrect = isReview && correctAnswer === index;
            const isWrong =
              isReview && userAnswer === index && userAnswer !== correctAnswer;
            const isSelected = selectedAnswer === index;

            return (
              <div
                key={index}
                className={`flex items-center space-x-3 rounded-md border p-4 hover-elevate ${
                  isCorrect
                    ? "border-success bg-success/5"
                    : isWrong
                    ? "border-violation bg-violation/5"
                    : isSelected
                    ? "border-primary"
                    : ""
                }`}
                data-testid={`choice-${index}`}
              >
                <RadioGroupItem
                  value={index.toString()}
                  id={`choice-${index}`}
                  disabled={isReview}
                />
                <Label
                  htmlFor={`choice-${index}`}
                  className="flex-1 cursor-pointer font-normal"
                >
                  {choice}
                </Label>
                {isCorrect && (
                  <span className="text-xs font-medium text-success">
                    Correct
                  </span>
                )}
                {isWrong && (
                  <span className="text-xs font-medium text-violation">
                    Your answer
                  </span>
                )}
              </div>
            );
          })}
        </RadioGroup>
      </div>
    </Card>
  );
}
