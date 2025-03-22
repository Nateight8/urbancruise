import { useState, useCallback, useRef, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import userOperations from "@/graphql/operations/user-operations";
import { useDebounce } from "./use-debounce";

interface UsernameAvailabilityResult {
  isAvailable: boolean | null;
  isChecking: boolean;
  checkUsername: (username: string) => void;
}

export function useUsernameAvailability(
  minLength = 3,
  debounceMs = 500
): UsernameAvailabilityResult {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const minimumCheckTimeRef = useRef<NodeJS.Timeout | null>(null);

  // Query to check username availability
  const [checkUsernameQuery] = useLazyQuery(
    userOperations.Querries.checkUsernameAvailability,
    {
      onCompleted: (data) => {
        // Ensure "checking" state shows for at least 600ms for better UX
        if (minimumCheckTimeRef.current) {
          clearTimeout(minimumCheckTimeRef.current);
        }

        minimumCheckTimeRef.current = setTimeout(() => {
          setIsAvailable(data.checkUsernameAvailability);
          setIsChecking(false);
          minimumCheckTimeRef.current = null;
        }, 600);
      },
      fetchPolicy: "network-only", // Don't cache results as availability can change
      onError: (error) => {
        console.error("Username availability check error:", error);
        setIsChecking(false);
        setIsAvailable(null);
      },
    }
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (minimumCheckTimeRef.current) {
        clearTimeout(minimumCheckTimeRef.current);
      }
    };
  }, []);

  // Create a debounced function to check username availability
  const handleCheckUsername = useCallback(
    (username: string) => {
      if (username.length >= minLength) {
        setIsChecking(true);
        checkUsernameQuery({ variables: { username } });
      } else {
        setIsAvailable(null);
        setIsChecking(false);
      }
    },
    [checkUsernameQuery, minLength]
  );

  const debouncedCheckUsername = useDebounce(handleCheckUsername, debounceMs);

  return {
    isAvailable,
    isChecking,
    checkUsername: debouncedCheckUsername,
  };
}
