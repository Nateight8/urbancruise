import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { IconUser } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { IconMessageCircle } from "@tabler/icons-react";
import type { User } from "@/graphql/operations/user-operations";

export default function User({ user }: { user: User }) {
  return (
    <div>
      <div className="flex items-center gap-2 flex-col">
        <Avatar className="size-20">
          <AvatarImage src="/images/pfp/pfp.jpeg" />
          <AvatarFallback>
            <IconUser />
          </AvatarFallback>
        </Avatar>

        <div className="gap-2 text-center">
          <p>{user.name}</p>
          <p>{user.username}</p>
        </div>
        <Button variant="outline">
          <IconMessageCircle />
        </Button>
      </div>
    </div>
  );
}
