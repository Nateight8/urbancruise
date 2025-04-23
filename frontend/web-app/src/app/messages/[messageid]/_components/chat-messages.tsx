"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./chat-message";
import { Message } from "@/graphql/operations/conversation-operations";

export default function ChatMessages({ messages }: { messages: Message[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="flex-1 bg-muted/20 border rounded-lg overflow-hidden p-2 flex flex-col gap-2 justify-end">
      <ScrollArea className="h-full" ref={scrollRef}>
        <div className="flex flex-col justify-end min-h-full">
          <div className="flex-1" /> {/* Spacer to push content to bottom */}
          <div className="flex flex-col gap-2">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} /> {/* Anchor for auto-scrolling */}
          </div>
        </div>
      </ScrollArea>
    </main>
  );
}
