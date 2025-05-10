"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import userOperations from "@/graphql/operations/user-operations";

import { useQuery } from "@apollo/client";
import { IconLogin2, IconUserFilled } from "@tabler/icons-react";

import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
export function UserAvatar() {
  const { data, loading } = useQuery(userOperations.Querries.getLoggedInUser, {
    fetchPolicy: "cache-first",
  });

  const user = data?.getLoggedInUser?.user;

  if (loading) return <Skeleton className="size-12 rounded-full" />;

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
      <AvatarImage src={user.image} alt={user.username || "User avatar"} />

      <AvatarFallback>
        <IconUserFilled />
      </AvatarFallback>
    </Avatar>
  );
}
