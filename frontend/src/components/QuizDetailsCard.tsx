// src/components/QuizDetailsCard.tsx
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, Clock } from "lucide-react";

interface QuizDetailsCardProps {
  title: string;
  onTitleChange: (title: string) => void;
  description: string;
  onDescriptionChange: (description: string) => void;
  duration: string;
  onDurationChange: (duration: string) => void;
}

export function QuizDetailsCard({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  duration,
  onDurationChange,
}: QuizDetailsCardProps) {
  return (
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
              onChange={(e) => onTitleChange(e.target.value)}
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
              onChange={(e) => onDescriptionChange(e.target.value)}
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
                onChange={(e) => onDurationChange(e.target.value)}
                className="bg-slate-700/50 border-slate-600/50 text-white pl-10 focus:border-blue-500/50"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}