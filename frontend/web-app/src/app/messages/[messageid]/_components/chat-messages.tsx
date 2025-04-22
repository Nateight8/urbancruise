"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./chat-message";
import { Message } from "@/graphql/operations/conversation-operations";

export default function ChatMessages({ messages }: { messages: Message[] }) {
  return (
    <main className="flex-1 bg-muted/20 border rounded-lg overflow-hidden p-2 flex flex-col gap-2 justify-end">
      <ScrollArea className="h-full">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </ScrollArea>
    </main>
  );
}
