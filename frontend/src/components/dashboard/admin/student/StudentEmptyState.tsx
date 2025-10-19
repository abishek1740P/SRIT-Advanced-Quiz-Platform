import { FileText } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<any>;
}

export function EmptyState({ 
  title, 
  description, 
  icon: Icon = FileText 
}: EmptyStateProps) {
  return (
    <div className="p-8 text-center text-slate-400">
      <Icon className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 opacity-50" />
      <p className="text-base sm:text-lg">{title}</p>
      {description && (
        <p className="text-xs sm:text-sm mt-2">{description}</p>
      )}
    </div>
  );
}