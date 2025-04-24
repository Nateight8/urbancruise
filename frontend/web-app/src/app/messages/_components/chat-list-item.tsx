"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConversationParticipant } from "@/graphql/operations/participant-operations";
import {
  CheckIcon,
  CheckCheck,
  Clock,
  UserRoundIcon,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useCachedUser } from "@/hooks/use-cached-user";
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
    if (!lastMessage) return "New Chat";

    // Determine the appropriate status text based on who sent the message
    if (isOwnMessage) {
      // For messages sent by current user, show delivery status
      const status = lastMessage.status || lastMessageStatus;
      switch (status) {
        case "SENT":
          return "New Chat";
        case "DELIVERED":
          return "Delivered";
        case "READ":
          return "Seen";
        case "FAILED":
          return "Failed to send";
        default:
          return "New Chat";
      }
    } else {
      // For received messages, show "New Chat" if status is SENT
      const status = lastMessage.status || lastMessageStatus;
      if (status === "SENT") {
        return "New Chat";
      }
      if (status === "READ") {
        return "Received";
      }
      // Otherwise show content preview
      return lastMessage.content.length > 30
        ? `${lastMessage.content.substring(0, 30)}...`
        : lastMessage.content;
    }
  };

  // Function to render the status icon
  const renderStatusIcon = () => {
    if (!lastMessage) return null;

    if (isOwnMessage) {
      const status = lastMessage.status || lastMessageStatus;
      switch (status) {
        case "SENT":
          return <Clock className="h-3.5 w-3.5 text-muted-foreground" />;
        case "DELIVERED":
          return <CheckIcon className="h-3.5 w-3.5 text-muted-foreground" />;
        case "READ":
          return <CheckCheck className="h-3.5 w-3.5 text-blue-500" />;
        case "FAILED":
          return <span className="text-xs text-red-500">!</span>;
        default:
          return <Send className="h-3.5 w-3.5 text-muted-foreground" />;
      }
    } else {
      // For received messages, you can show an icon based on content type
      // This is a simplified example - you'd need content analysis for real implementation
      return <Send className="h-3.5 w-3.5 text-primary rotate-180" />;
    }
  };

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
          <h3 className="truncate font-medium">{user.username}</h3>
          <div className="flex items-center gap-1.5">
            {renderStatusIcon()}
            <p className="text-sm text-muted-foreground truncate">
              {renderStatusText()}
            </p>
          </div>
        </div>
      </>
    </Link>
  );
}
