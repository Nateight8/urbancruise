"use client";
import { useQuery } from "@apollo/client";

import { GetLoggedInUserResponse } from "@/graphql/operations/user-operations";
import userOperations from "@/graphql/operations/user-operations";

export default function LayoutContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  // const router = useRouter();
  const { data } = useQuery<GetLoggedInUserResponse>(
    userOperations.Querries.getLoggedInUser
  );

  const user = data?.getLoggedInUser.user;

  return (
    <div
      className={`grid gap-4 grid-cols-1 h-full p-8 ${
        user ? "lg:grid-cols-1" : "lg:grid-cols-[38.2fr_61.8fr]"
      }`}
    >
      {children}
    </div>
  );
}
