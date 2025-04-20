import { ScrollArea } from "@/components/ui/scroll-area";
import ChatListItem from "./chat-list-item";
import { chatLists } from "./chat-lists";

export default function ChatList() {
  return (
    <aside className="w-80 h-full border-r pl-2">
      <ScrollArea className="h-full">
        {chatLists.map((chatlist) => (
          <ChatListItem key={chatlist.id} chat={chatlist} />
        ))}
      </ScrollArea>
    </aside>
  );
}
