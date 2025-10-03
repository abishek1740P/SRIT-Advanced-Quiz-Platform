import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ViolationIndicatorProps {
  count: number;
  isMobile?: boolean; // add this line
}

export default function ViolationIndicator({ count }: ViolationIndicatorProps) {
  if (count === 0) return null;

  return (
    <div className="flex items-center gap-2" data-testid="violation-indicator">
      <AlertTriangle className="h-5 w-5 text-violation" />
      <Badge variant="destructive" data-testid="badge-violation-count">
        {count} {count === 1 ? "Violation" : "Violations"}
      </Badge>
    </div>
  );
}
