import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { IconUser } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { IconMessageCircle } from "@tabler/icons-react";
import type { User } from "@/graphql/operations/user-operations";
import { useRouter } from "next/navigation";
import { useCachedUser } from "@/hooks/use-cached-user";

export default function User({ user }: { user: User }) {
  const router = useRouter();

  const loggedInUser = useCachedUser();

  return (
    <div>
      <div className="flex items-center gap-2 flex-col">
        <Avatar className="size-20">
          <AvatarImage src={user.image} />
          <AvatarFallback>
            <IconUser />
          </AvatarFallback>
        </Avatar>

        <div className="gap-2 text-center">
          <p>{user.name}</p>
          <p>{user.username}</p>
        </div>
        <Button
          disabled={!loggedInUser}
          onClick={() => {
            router.push(
              `/messages/${loggedInUser?.participantId}-${user.participantId}`
            );
          }}
          variant="outline"
        >
          <IconMessageCircle />
        </Button>
      </div>
    </div>
  );
}
