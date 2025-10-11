// components/dashboard/ActionButtons.tsx
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PlusCircle, Copy } from "lucide-react";

interface ActionButtonsProps {
  onCreateQuiz: () => void;
  onUseTemplates: () => void;
}

export function ActionButtons({ onCreateQuiz, onUseTemplates }: ActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
      <ActionButton
        icon={PlusCircle}
        label="Create New Quiz"
        onClick={onCreateQuiz}
        gradient="from-blue-500 to-purple-600"
        testId="button-create-quiz"
      />
      <ActionButton
        icon={Copy}
        label="Use Quiz Templates"
        onClick={onUseTemplates}
        gradient="from-green-500 to-teal-600"
        testId="button-choose-quiz"
      />
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  gradient,
  testId
}: {
  icon: React.ComponentType<any>;
  label: string;
  onClick: () => void;
  gradient: string;
  testId: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex-1 sm:flex-none"
    >
      <Button
        onClick={onClick}
        className={`bg-gradient-to-r ${gradient} hover:${gradient.replace('500', '600').replace('600', '700')} text-white font-semibold py-3 px-4 sm:px-6 rounded-xl transition-all shadow-lg shadow-blue-500/25 w-full`}
        data-testid={testId}
      >
        <Icon className="w-4 h-4 mr-2" />
        {label}
      </Button>
    </motion.div>
  );
}