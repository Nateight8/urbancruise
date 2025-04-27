"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IconChevronLeft, IconUser } from "@tabler/icons-react";
import { ConversationParticipant } from "@/graphql/operations/conversation-operations";
import { useCachedUser } from "@/hooks/use-cached-user";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChatAppBar({
  participants,
  loading,
}: {
  participants: ConversationParticipant[];
  loading: boolean;
}) {
  const cachedUser = useCachedUser();

  const otherParticipant = participants.find(
    (participant) => participant.user.username !== cachedUser?.username
  );

  return (
    <header className="flex-shrink-0  h-16 flex  items-center">
      <div className="flex items-center gap-3">
        <Button
          className="rounded-full"
          variant="muted"
          size="icon"
          aria-label="Add new item"
        >
          <IconChevronLeft size={16} aria-hidden="true" />
        </Button>

        {loading ? (
          <div className="flex items-center gap-2 p-1 pr-3 ">
            <Skeleton className="size-10 rounded-full" />
            <Skeleton className="h-4 w-8" />
          </div>
        ) : (
          <button className="flex items-center gap-2 hover:cursor-pointer hover:bg-accent/50 rounded-3xl p-1 pr-3 hover:border border border-transparent hover:border-border">
            <Avatar className="size-10">
              <AvatarImage
                src={otherParticipant?.user.image ?? "/images/pfp/pfp.jpeg"}
              />
              <AvatarFallback>
                <IconUser size={16} aria-hidden="true" />
              </AvatarFallback>
            </Avatar>
            <p className="text-base font-semibold capitalize">
              {otherParticipant?.user.username}
            </p>
          </button>
        )}
      </div>
    </header>
  );
}
