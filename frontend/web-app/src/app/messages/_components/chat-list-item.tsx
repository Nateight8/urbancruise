"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConversationParticipant } from "@/graphql/operations/participant-operations";
import {
  // CheckIcon,
  // CheckCheck,
  // Clock,
  UserRoundIcon,
  // Send,
} from "lucide-react";
import Link from "next/link";
import { useCachedUser } from "@/hooks/use-cached-user";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
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
  const { user, lastMessage, conversationId, lastMessageStatus } =
    chatParticipant;
  const currentUser = useCachedUser();

  // Determine if the last message was from the current user
  const isOwnMessage = lastMessage && currentUser?.id === lastMessage.senderId;

  // Function to render the message status text (Snapchat style)
  const renderStatusText = () => {
    if (!lastMessage) return "Start vibing...";

    // Determine the appropriate status text based on who sent the message
    if (isOwnMessage) {
      const status = lastMessage.status || lastMessageStatus;
      switch (status) {
        case "SENT":
          return "🚀 Yeeted";
        case "DELIVERED":
          return "🎯 Landed";
        case "READ":
          return "👀 Peeped";
        case "FAILED":
          return "💀 Flopped";
        default:
          return "🚀 Yeeted";
      }
    } else {
      const status = lastMessage.status || lastMessageStatus;
      if (status === "SENT") {
        return "🔥 Sheesh";
      }
      if (status === "READ") {
        return "🧠 Vibe";
      }
      return lastMessage.content.length > 30
        ? `${lastMessage.content.substring(0, 30)}...`
        : lastMessage.content;
    }
  };

  const isActive = usePathname() === `/messages/${conversationId}`;

  return (
    <Link
      href={`/messages/${conversationId}`}
      className={cn(
        "flex items-center gap-2 p-4 hover:bg-muted/50 transition-colors hover:cursor-pointer",
        {
          "bg-muted/20 border-y border-border/40": isActive,
        }
      )}
    >
      <>
        <Avatar className="size-12 flex-shrink-0">
          {user.image && <AvatarImage src={user.image} />}
          <AvatarFallback>
            <UserRoundIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 overflow-hidden">
          <h3 className="truncate font-medium">{user.username}</h3>
          <div className="flex items-center gap-1.5">
            {/* {renderStatusIcon()} */}
            <p className="text-xs text-muted-foreground italic truncate">
              {renderStatusText()}
            </p>
          </div>
        </div>
      </>
    </Link>
  );
}
