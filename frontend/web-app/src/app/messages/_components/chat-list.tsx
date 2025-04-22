"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatListItem from "./chat-list-item";
// import { chatLists } from "./chat-lists";
import { useQuery } from "@apollo/client";
import participantOperations, {
  MyParticipantsResponse,
} from "@/graphql/operations/participant-operations";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChatList() {
  const { data: chatLists, loading } = useQuery<MyParticipantsResponse>(
    participantOperations.Querries.myParticipants
  );

  if (loading)
    return (
      <aside className="w-80 h-full border-r py-2 pl-2">
        <ScrollArea className="h-full">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-4 hover:bg-muted/50 transition-colors hover:cursor-pointer"
            >
              <Skeleton className="size-12 rounded-full flex-shrink-0" />
              <div className="flex-1 min-w-0 flex flex-col gap-2 overflow-hidden">
                <Skeleton className="h-4 w-24 rounded-full" />
                <Skeleton className="h-4 rounded-full w-16" />
              </div>
            </div>
          ))}
        </ScrollArea>
      </aside>
    );

  return (
    <aside className="w-80 h-full border-r py-2 pl-2">
      <ScrollArea className="h-full">
        {chatLists?.conversationParticipants.map((chatlist) => (
          <ChatListItem key={chatlist.userId} chatParticipant={chatlist} />
        ))}
      </ScrollArea>
    </aside>
  );
}
