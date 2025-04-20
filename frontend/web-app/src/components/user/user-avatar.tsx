"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import userOperations from "@/graphql/operations/user-operations";

import { useQuery } from "@apollo/client";
import { IconLogin2, IconUserFilled } from "@tabler/icons-react";
import { Button } from "../ui/button";
export function UserAvatar() {
  const { data } = useQuery(userOperations.Querries.getLoggedInUser, {
    skip: typeof window === "undefined",
    fetchPolicy: "cache-first",
  });

  const user = data?.getLoggedInUser?.user;

  if (!user)
    return (
      <Button
        variant="outline"
        size="icon"
        className="rounded-full size-12 hover:cursor-pointer"
      >
        <IconLogin2 />
      </Button>
    );

  return (
    <Avatar className="size-12">
      {user?.avatar ? (
        <AvatarImage src={user.avatar} alt={user.username || "User avatar"} />
      ) : (
        <AvatarFallback>
          <IconUserFilled />
        </AvatarFallback>
      )}
    </Avatar>
  );
}
