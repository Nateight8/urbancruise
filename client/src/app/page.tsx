"use client";

import userOperations, { GetLoggedInUser } from "@/graphql/operations/user";
import { useQuery } from "@apollo/client";
import { redirect } from "next/navigation";

export default function Home() {
  const { data } = useQuery<GetLoggedInUser>(
    userOperations.Querries.createPost
  );

  //TODA: WE WILL THINK OF HOW TO USE STATES

  if (data?.getLoggedInUser.status === 200) {
    redirect("/dashboard");
  }
}
