"use client";
import AuthenticationScreen from "@/components/auth/authentication-v2";
import { UsernameForm } from "@/components/auth/username-form";
import Feeds from "@/components/feed/feeds";
// import Feeds from "@/components/feed/feeds";
import userOperations from "@/graphql/operations/user-operations";
import { useQuery } from "@apollo/client";

export default function Home() {
  const { data: loggedInUser, loading } = useQuery(
    userOperations.Querries.getLoggedInUser,
    {
      fetchPolicy: "network-only", // This ensures we always get fresh data
    }
  );

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  // If we have no data or no logged in user, show authentication screen
  if (!loggedInUser?.getLoggedInUser?.user) {
    return <AuthenticationScreen />;
  }

  // If we have a user but no username, show username form
  if (!loggedInUser.getLoggedInUser.user.username) {
    return <UsernameForm />;
  }

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Feeds />
    </div>
  );
}
