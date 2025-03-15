"use client";
import userOperations, { GetLoggedInUser } from "@/graphql/operations/user";
import { useQuery } from "@apollo/client";
import { SignOut } from "@/components/sign-out-btn";

export default function Home() {
  const { data } = useQuery<GetLoggedInUser>(
    userOperations.Querries.createPost
  );

  //TODA: WE WILL THINK OF HOW TO USE STATES

  // if (data?.getLoggedInUser.status === 200) {
  //   redirect("/dashboard");
  // }

  console.log("SESSION: ", data);

  return (
    <div className="">
      <SignOut />

      {data?.getLoggedInUser.status === 200 && (
        <div>
          <p>Logged in as {data?.getLoggedInUser.user.name}</p>
        </div>
      )}
    </div>
  );
}
