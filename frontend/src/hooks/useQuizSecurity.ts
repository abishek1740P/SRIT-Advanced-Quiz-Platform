// hooks/useQuizSecurity.ts
import { useState, useEffect, useCallback } from "react";
import { useToast } from "./use-toast";

interface UseQuizSecurityProps {
  quizStarted: boolean;
  isMobile: boolean;
  autoSubmitTriggered: boolean;
  onAutoSubmit: () => void;
}

export function useQuizSecurity({
  quizStarted,
  isMobile,
  autoSubmitTriggered,
  onAutoSubmit,
}: UseQuizSecurityProps) {
  const [violations, setViolations] = useState(0);
  const { toast } = useToast();

  const incrementViolations = useCallback(() => {
    setViolations((prev) => prev + 1);
  }, []);

  // Security measures when quiz starts
  useEffect(() => {
    if (!quizStarted) return;

    const handleSecurityEvent = (message: string) => {
      const newViolations = violations + 1;
      setViolations(newViolations);

      toast({
        title: isMobile ? "Warning!" : "Violation Detected!",
        description: `${message} ${
          isMobile ? "Warning" : "Violation"
        } ${newViolations}/5`,
        variant: isMobile ? "default" : "destructive",
      });

      if (newViolations >= 5 && !autoSubmitTriggered) {
        toast({
          title: `Maximum ${isMobile ? "Warnings" : "Violations"} Reached!`,
          description: `Quiz will be auto-submitted due to multiple ${
            isMobile ? "warnings" : "violations"
          }.`,
          variant: "destructive",
        });
        setTimeout(onAutoSubmit, 2000);
      }
    };

    // COMPLETELY BLOCKED ACTIONS (no violations)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      // No violation, just silently block
      return false;
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      // No violation, just silently block
      return false;
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      // No violation, just silently block
      return false;
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      // No violation, just silently block
      return false;
    };

    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      // No violation, just silently block text selection
      return false;
    };

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      // No violation, just silently block dragging
      return false;
    };

    // Block F12 and other developer tools shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block developer tools
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "J") ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
        // No violation, just silently block
        return false;
      }

      // Block print screen
      if (e.key === "PrintScreen" || (e.ctrlKey && e.key === "p")) {
        e.preventDefault();
        // No violation, just silently block
        return false;
      }

      // VIOLATION-TRIGGERING ACTIONS (these count as violations)
      if (document.hidden) {
        // This will be handled by visibilitychange
        return;
      }

      // Tab switching attempt while in quiz
      if (e.altKey && e.key === "Tab") {
        e.preventDefault();
        handleSecurityEvent("Tab switching is not allowed.");
        return false;
      }

      // Block some keyboard shortcuts that could be used for cheating
      if (
        (e.ctrlKey || e.metaKey) &&
        ["c", "v", "x", "a"].includes(e.key.toLowerCase())
      ) {
        // These are already blocked by copy/paste handlers, but add violation if attempted
        e.preventDefault();
        handleSecurityEvent("Keyboard shortcuts are disabled during quiz.");
        return false;
      }
    };

    // VIOLATION-TRIGGERING EVENTS
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleSecurityEvent(
          isMobile
            ? "Please stay on the quiz page."
            : "Tab switching is not allowed."
        );
      }
    };

    // Add event listeners for BLOCKED actions (no violations)
    const blockedEvents = [
      { type: "contextmenu", handler: handleContextMenu }, // Right-click
      { type: "copy", handler: handleCopy }, // Copy
      { type: "paste", handler: handlePaste }, // Paste
      { type: "cut", handler: handleCut }, // Cut
      { type: "selectstart", handler: handleSelectStart }, // Text selection
      { type: "dragstart", handler: handleDragStart }, // Dragging
    ];

    // Add event listeners for VIOLATION actions
    const violationEvents = [
      { type: "visibilitychange", handler: handleVisibilityChange }, // Tab switching
      { type: "keydown", handler: handleKeyDown }, // Keyboard shortcuts
    ];

    // Register all event listeners
    [...blockedEvents, ...violationEvents].forEach(({ type, handler }) => {
      document.addEventListener(type, handler as EventListener);
    });

    // Additional security measures
    // Disable text selection globally
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";
    (document.body.style as any).msUserSelect = "none";

    // Disable image dragging
    (document.body.style as any).userDrag = "none";
    (document.body.style as any).webkitUserDrag = "none";

    // Cleanup function
    return () => {
      // Remove all event listeners
      [...blockedEvents, ...violationEvents].forEach(({ type, handler }) => {
        document.removeEventListener(type, handler as EventListener);
      });

      // Restore text selection
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";
      (document.body.style as any).msUserSelect = "none";

      // Restore dragging
      (document.body.style as any).userDrag = "none";
      (document.body.style as any).webkitUserDrag = "none";
    };
  }, [
    quizStarted,
    violations,
    autoSubmitTriggered,
    isMobile,
    onAutoSubmit,
    toast,
  ]);

  return { violations, incrementViolations, setViolations };
}
