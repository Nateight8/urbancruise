import { useEffect, useRef, useCallback } from "react";

// Custom debounce hook
export function useDebounce<Args extends unknown[], Return>(
  callback: (...args: Args) => Return,
  delay: number
) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedFn = useCallback(
    (...args: Args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedFn;
}
