import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  imageUrl: string;
}

export default function ChatListItem({ chat }: { chat: Chat }) {
  return (
    <div className="flex items-center gap-2 p-4 hover:bg-muted/50 transition-colors hover:cursor-pointer">
      <Avatar className="size-12 flex-shrink-0">
        <AvatarImage src={chat.imageUrl} />
        <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0 overflow-hidden">
        <h3 className="truncate font-medium">{chat.name}</h3>
        <p className="text-sm text-muted-foreground truncate whitespace-nowrap overflow-hidden text-ellipsis">
          {chat.lastMessage}
        </p>
      </div>
    </div>
  );
}
