"use client";

import { useEffect, useState } from "react";
import { ApolloWrapper } from "@/graphql/apollo-wraper";

export default function ApolloProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use hydration safety pattern to prevent React 19 context issues
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR and initial mount, wrap in div without context providers
  if (!mounted) {
    return <div suppressHydrationWarning>{children}</div>;
  }

  // Once client-side, use the Apollo wrapper
  return <ApolloWrapper>{children}</ApolloWrapper>;
}
