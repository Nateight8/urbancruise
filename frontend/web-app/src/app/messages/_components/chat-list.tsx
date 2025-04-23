"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatListItem from "./chat-list-item";
// import { chatLists } from "./chat-lists";
import { useQuery, useSubscription } from "@apollo/client";
import participantOperations, {
  MyParticipantsResponse,
  ConversationParticipant,
  ParticipantsUpdatedResponse,
} from "@/graphql/operations/participant-operations";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export default function ChatList() {
  const { data: chatListsData, loading } = useQuery<MyParticipantsResponse>(
    participantOperations.Querries.myParticipants
  );

  const [chatLists, setChatLists] = useState<ConversationParticipant[]>([]);

  // Initialize chatLists from query data
  useEffect(() => {
    if (chatListsData?.conversationParticipants) {
      setChatLists(chatListsData.conversationParticipants);
    }
  }, [chatListsData]);

  // Subscribe to chat list updates
  useSubscription<ParticipantsUpdatedResponse>(
    participantOperations.Subscriptions.conversationParticipantsUpdated,
    {
      onData: ({ data }) => {
        if (data.data?.conversationParticipantsUpdated) {
          const updatedParticipant = data.data.conversationParticipantsUpdated;

          setChatLists((prev) => {
            // Check if conversation already exists in the list
            const existingIndex = prev.findIndex(
              (chat) =>
                chat.conversationId === updatedParticipant.conversationId
            );

            if (existingIndex >= 0) {
              // Update existing conversation
              const updated = [...prev];
              updated[existingIndex] = {
                ...updated[existingIndex],
                lastMessage: updatedParticipant.lastMessage,
              };

              // Sort to move this conversation to the top
              return updated.sort((a, b) => {
                // Put the updated conversation at the top
                if (a.conversationId === updatedParticipant.conversationId)
                  return -1;
                if (b.conversationId === updatedParticipant.conversationId)
                  return 1;
                return 0;
              });
            } else {
              // Add new conversation at the top
              return [updatedParticipant, ...prev];
            }
          });
        }
      },
    }
  );

  if (loading)
    return (
      <aside className="w-80 h-full border-r py-2 pl-2">
        <ScrollArea className="h-full">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
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
        {chatLists.map((chatlist) => (
          <ChatListItem
            key={`chat-${chatlist.conversationId}`}
            chatParticipant={chatlist}
          />
        ))}
      </ScrollArea>
    </aside>
  );
}
