"use client";

import { useQuery } from "@apollo/client";
import userOperations from "@/graphql/operations/user-operations";
import { signOut } from "next-auth/react";
export default function Dashboard() {
  const { data } = useQuery(userOperations.Querries.getLoggedInUser);
  const user = data?.getLoggedInUser.user;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {user?.username || "User"}!
      </h1>
      <p className="text-gray-600">Your dashboard is ready.</p>

      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
