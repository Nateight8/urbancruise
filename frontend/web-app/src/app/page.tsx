"use client";
import AuthenticationScreen from "@/components/auth/authentication-v2";
import { UsernameForm } from "@/components/auth/username-form";
import Feeds from "@/components/feed/feeds";
// import Feeds from "@/components/feed/feeds";
import userOperations from "@/graphql/operations/user-operations";
import { useQuery } from "@apollo/client";

export default function Home() {
  const { data: loggedInUser } = useQuery(
    userOperations.Querries.getLoggedInUser
  );

  // Check if we have any data at all
  if (!loggedInUser?.getLoggedInUser) {
    return <AuthenticationScreen />;
  }

  // Check if we have a user object
  if (!loggedInUser.getLoggedInUser.user) {
    return <UsernameForm />;
  }

  // Check if username is null or undefined
  if (!loggedInUser.getLoggedInUser.user.username) {
    return <UsernameForm />;
  }

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Feeds />
    </div>
  );
}
