"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./chat-message";
import { Message } from "@/graphql/operations/conversation-operations";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChatMessages({
  messages,
  loading,
}: {
  messages: Message[];
  loading: boolean;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 bg-muted/20 border md:rounded-lg overflow-hidden">
      {loading ? (
        <Skeleton className="h-full bg-muted/40" />
      ) : (
        <ScrollArea className="h-full p-4">
          <div className="flex flex-col min-h-full">
            <div className="flex-1" />
            <div className="flex flex-col gap-2">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
