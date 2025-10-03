import { useState } from 'react';
import QuestionCard from '../QuestionCard';

export default function QuestionCardExample() {
  const [selected, setSelected] = useState<number | undefined>(undefined);

  return (
    <div className="p-8 space-y-6 bg-background max-w-3xl">
      <div>
        <p className="text-sm text-muted-foreground mb-4">Active Question</p>
        <QuestionCard
          questionNumber={1}
          totalQuestions={10}
          questionText="What is the full form of SQL?"
          choices={[
            'Structured Query Language',
            'Simple Query Language',
            'Sequential Query Language',
            'Standard Query Language'
          ]}
          selectedAnswer={selected}
          onAnswerChange={setSelected}
          points={5}
        />
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-4">Review Mode - Correct Answer</p>
        <QuestionCard
          questionNumber={2}
          totalQuestions={10}
          questionText="Which of the following is a NoSQL database?"
          choices={['MySQL', 'MongoDB', 'PostgreSQL', 'Oracle']}
          points={5}
          isReview={true}
          correctAnswer={1}
          userAnswer={1}
        />
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-4">Review Mode - Wrong Answer</p>
        <QuestionCard
          questionNumber={3}
          totalQuestions={10}
          questionText="What does ACID stand for in database systems?"
          choices={[
            'Atomicity, Consistency, Isolation, Durability',
            'Association, Consistency, Isolation, Durability',
            'Atomicity, Correlation, Isolation, Durability',
            'Atomicity, Consistency, Integration, Durability'
          ]}
          points={10}
          isReview={true}
          correctAnswer={0}
          userAnswer={2}
        />
      </div>
    </div>
  );
}
