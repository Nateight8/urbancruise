"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConversationParticipant } from "@/graphql/operations/participant-operations";
import { UserRoundIcon } from "lucide-react";
import Link from "next/link";
// interface Chat {
//   id: string;
//   name: string;
//   lastMessage: string;
//   timestamp: string;
//   unreadCount: number;
//   imageUrl: string;
// }

export default function ChatListItem({
  chatParticipant,
}: {
  chatParticipant: ConversationParticipant;
}) {
  const { user, lastMessage, lastMessageAt, conversationId } = chatParticipant;

  console.log("CHAT PARTICIPANT from chat list item", chatParticipant);

  return (
    <Link
      href={`/messages/${conversationId}`}
      className="flex items-center gap-2 p-4 hover:bg-muted/50 transition-colors hover:cursor-pointer"
    >
      <>
        <Avatar className="size-12 flex-shrink-0">
          {user.image && <AvatarImage src={user.image} />}
          <AvatarFallback>
            <UserRoundIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 overflow-hidden">
          <h3 className="truncate font-medium">{user.name}</h3>
          <p className="text-sm text-muted-foreground truncate whitespace-nowrap overflow-hidden text-ellipsis">
            {lastMessage?.content}
          </p>
        </div>
      </>
    </Link>
  );
}
