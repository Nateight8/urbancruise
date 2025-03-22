"use client";

import { useQuery } from "@apollo/client";
import userOperations from "@/graphql/operations/user-operations";
import Authentication from "@/components/auth/authentication";
import { UsernameForm } from "@/components/auth/username-form";
import { useState, useEffect } from "react";
import LoadingScreen from "@/components/ui/loading-screen";
import Dashboard from "@/components/dashboard/dashboard";

export default function Home() {
  const { data, loading, refetch } = useQuery(
    userOperations.Querries.getLoggedInUser
  );
  const [isLoading, setIsLoading] = useState(true);
  const user = data?.getLoggedInUser.user;

  // Only set loading to false after initial load completes and we're confident about auth state
  useEffect(() => {
    if (!loading) {
      // Add a small delay to ensure UI stability
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Keep showing loading screen until we're confident about auth state
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Once loading is complete, render the appropriate component based on auth state
  if (!user) {
    return <Authentication />;
  }

  if (user?.onboardingCompleted === false) {
    return <UsernameForm onSuccess={() => refetch()} />;
  }

  // User is authenticated and has completed onboarding
  return <Dashboard />;
}
