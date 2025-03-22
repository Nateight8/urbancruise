"use client";
import { useQuery } from "@apollo/client";
import { SignUpForm } from "./_components/sign-up-form";
import userOperations, {
  GetLoggedInUserResponse,
} from "@/graphql/operations/user-operations";
// import { useRouter } from "next/navigation";
import { UsernameForm } from "../../../components/auth/username-form";
import Redirecting from "../../../components/auth/redirecting";

export default function Page() {
  // const router = useRouter();
  const { data } = useQuery<GetLoggedInUserResponse>(
    userOperations.Querries.getLoggedInUser
  );

  const user = data?.getLoggedInUser.user;

  if (!user) {
    return <SignUpForm />;
  }

  if (user?.username === null) {
    return <UsernameForm />;
  }

  // Redirect properly
  // router.push("/dashboard");

  return <Redirecting />;
}
