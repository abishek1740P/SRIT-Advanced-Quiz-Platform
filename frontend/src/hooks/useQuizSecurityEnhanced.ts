// hooks/useQuizSecurityEnhanced.ts - COMPREHENSIVE BLOCKING
import { useState, useEffect, useCallback } from "react";
import { useToast } from "./use-toast";

interface UseQuizSecurityEnhancedProps {
  quizStarted: boolean;
  isMobile: boolean;
  autoSubmitTriggered: boolean;
  onAutoSubmit: () => void;
}

export function useQuizSecurityEnhanced({
  quizStarted,
  isMobile,
  autoSubmitTriggered,
  onAutoSubmit,
}: UseQuizSecurityEnhancedProps) {
  const [violations, setViolations] = useState(0);
  const { toast } = useToast();

  const incrementViolations = useCallback(() => {
    setViolations((prev) => prev + 1);
  }, []);

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

    // COMPLETELY BLOCKED ACTIONS (silent blocking)
    const blockedHandlers = {
      // Right-click context menu
      contextmenu: (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      },

      // Copy/paste/cut
      copy: (e: ClipboardEvent) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      },
      paste: (e: ClipboardEvent) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      },
      cut: (e: ClipboardEvent) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      },

      // Text selection
      selectstart: (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      },

      // Dragging
      dragstart: (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      },

      // Prevent saving images
      beforeunload: (e: BeforeUnloadEvent) => {
        if (quizStarted) {
          e.preventDefault();
          e.returnValue =
            "Are you sure you want to leave? Your quiz may be submitted.";
          return e.returnValue;
        }
      },
    };

    // Keyboard handler for both blocking and violations
    const handleKeyDown = (e: KeyboardEvent) => {
      // Completely blocked shortcuts (no violation)
      const blockedShortcuts = [
        "F12",
        "F11",
        "F5",
        "PrintScreen",
        ...(e.ctrlKey || e.metaKey
          ? ["c", "v", "x", "a", "p", "s", "u", "i", "j", "k"]
          : []),
        ...(e.ctrlKey && e.shiftKey ? ["i", "j", "c"] : []),
      ];

      if (
        blockedShortcuts.includes(e.key) ||
        blockedShortcuts.includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Violation-triggering actions
      if (e.altKey && e.key === "Tab") {
        e.preventDefault();
        handleSecurityEvent("Tab switching is not allowed.");
        return false;
      }
    };

    // Violation handlers
    const violationHandlers = {
      visibilitychange: () => {
        if (document.hidden) {
          handleSecurityEvent(
            isMobile
              ? "Please stay on the quiz page."
              : "Tab switching is not allowed."
          );
        }
      },
      keydown: handleKeyDown,
    };

    // Apply CSS security measures
    const applySecurityStyles = () => {
      document.body.style.userSelect = "none";
      document.body.style.webkitUserSelect = "none";
      (document.body.style as any).msUserSelect = "none";
      (document.body.style as any).webkitUserDrag = "none";
      (document.body.style as any).userDrag = "none";

      // Disable text selection on all elements
      const style = document.createElement("style");
      style.id = "quiz-security-styles";
      style.textContent = `
        * {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-user-drag: none !important;
          user-drag: none !important;
        }
      `;
      document.head.appendChild(style);
    };

    const removeSecurityStyles = () => {
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";
      (document.body.style as any).msUserSelect = "none";
      (document.body.style as any).webkitUserDrag = "none";
      (document.body.style as any).userDrag = "none";

      const style = document.getElementById("quiz-security-styles");
      if (style) style.remove();
    };

    // Register event listeners
    Object.entries(blockedHandlers).forEach(([type, handler]) => {
      document.addEventListener(type, handler as EventListener, {
        capture: true,
      });
    });

    Object.entries(violationHandlers).forEach(([type, handler]) => {
      document.addEventListener(type, handler as EventListener, {
        capture: true,
      });
    });

    // Apply security styles
    applySecurityStyles();

    // Cleanup
    return () => {
      Object.entries(blockedHandlers).forEach(([type, handler]) => {
        document.removeEventListener(type, handler as EventListener, {
          capture: true,
        });
      });

      Object.entries(violationHandlers).forEach(([type, handler]) => {
        document.removeEventListener(type, handler as EventListener, {
          capture: true,
        });
      });

      removeSecurityStyles();
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
