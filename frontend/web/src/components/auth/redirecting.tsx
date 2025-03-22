"use client";

import { redirect } from "next/navigation";
import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/router";

export default function Redirecting() {
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationDuration = 3000; // 3 seconds in milliseconds
  const updateInterval = 30; // Update every 30ms for smooth animation
  // const router = useRouter();

  // Calculate the background color based on progress
  const getBackgroundColor = (progress: number) => {
    const startHue = 221; // Blue
    const endHue = 142; // Green
    const hue = startHue + ((endHue - startHue) * progress) / 100;
    return `hsl(${hue}, 80%, 50%)`;
  };

  useEffect(() => {
    setIsRunning(true);
  }, []);

  useEffect(() => {
    if (isRunning) {
      const startTime = Date.now();

      intervalRef.current = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const newProgress = Math.min(
          100,
          Math.floor((elapsedTime / animationDuration) * 100)
        );

        setProgress(newProgress);

        if (newProgress >= 100) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          setIsRunning(false);
          redirect("/");
        }
      }, updateInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  return (
    <div className="w-full max-w-md mx-auto dark:bg-slate-900">
      <div className="space-y-2 pb-4">
        <div className="h-1 w-full bg-muted rounded-full overflow-hidden border">
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${progress}%`,
              backgroundColor: getBackgroundColor(progress),
            }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>
    </div>
  );
}
