// hooks/useFullscreen.ts
import { useState, useEffect, useCallback } from "react";
import { useToast } from "./use-toast";

export function useFullscreen(isMobile: boolean = false) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { toast } = useToast();

  // Check fullscreen state
  useEffect(() => {
    if (isMobile) return;

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange
      );
    };
  }, [isMobile]);

  const enterFullscreen = useCallback(async () => {
    if (isMobile) {
      toast({
        title: "Mobile Device Detected",
        description: "Fullscreen is not required on mobile devices",
        variant: "default",
      });
      return;
    }

    try {
      const elem = document.documentElement;

      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        await (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).msRequestFullscreen) {
        await (elem as any).msRequestFullscreen();
      } else {
        throw new Error("Fullscreen API not supported");
      }

      setIsFullscreen(true);
    } catch (error) {
      console.warn("Fullscreen error:", error);
      toast({
        title: "Fullscreen Not Available",
        description:
          "Please enable fullscreen manually for the best experience",
        variant: "default",
      });
    }
  }, [isMobile, toast]);

  const exitFullscreen = useCallback(async () => {
    if (isMobile) return;

    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      }

      setIsFullscreen(false);
    } catch (error) {
      console.warn("Exit fullscreen error:", error);
    }
  }, [isMobile]);

  const toggleFullscreen = useCallback(async () => {
    if (isFullscreen) {
      await exitFullscreen();
    } else {
      await enterFullscreen();
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
  };
}
