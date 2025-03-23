"use client";

import { useQuery } from "@apollo/client";
import userOperations from "@/graphql/operations/user-operations";
import Authentication from "@/components/auth/authentication";
// import { UsernameForm } from "@/components/auth/username-form";
// import { useState, useEffect } from "react";
import LoadingScreen from "@/components/ui/loading-screen";
import { useEffect, useState } from "react";
import { UsernameForm } from "@/components/auth/username-form";

export default function Home() {
  const [isClientSide, setIsClientSide] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Only run query after component is mounted on client
  const { data, loading, refetch } = useQuery(
    userOperations.Querries.getLoggedInUser,
    {
      skip: !isClientSide, // Skip the query on server-side
    }
  );

  const user = data?.getLoggedInUser?.user;

  // Handle client-side initialization
  useEffect(() => {
    setIsClientSide(true);
  }, []);

  // Only set loading to false after initial load completes and we're confident about auth state
  useEffect(() => {
    if (isClientSide && !loading) {
      // Add a small delay to ensure UI stability
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [loading, isClientSide]);

  // Keep showing loading screen until we're confident about auth state
  if (isLoading) {
    return <LoadingScreen />;
  }

  console.log(user);

  // Once loading is complete, render the appropriate component based on auth state
  if (!user) {
    return <Authentication />;
  }

  if (user.username === null) {
    return <UsernameForm onSuccess={() => refetch()} />;
  }

  // User is authenticated and has completed onboarding
  return <>welcome {user.username}</>;
}
