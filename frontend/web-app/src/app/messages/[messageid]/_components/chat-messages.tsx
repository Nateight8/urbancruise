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

// export const sampleMessages = [
//   {
//     id: "1",
//     content: "Hey there! How are you doing today?",
//     sender: {
//       id: "user1",
//       username: "johndoe",
//       avatar: "https://example.com/avatar1.jpg",
//     },
//     timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
//   },
//   {
//     id: "2",
//     content:
//       "I'm doing great! Just finished working on that project we discussed.",
//     sender: {
//       id: "user2",
//       username: "user",
//       avatar: "https://example.com/avatar2.jpg",
//     },
//     timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
//   },
//   {
//     id: "3",
//     content: "That's awesome! Can you share what you've done so far?",
//     sender: {
//       id: "user1",
//       username: "johndoe",
//       avatar: "https://example.com/avatar1.jpg",
//     },
//     timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
//   },
//   {
//     id: "4",
//     content:
//       "Sure! I've implemented the main features and added some cool animations. Want to see?",
//     sender: {
//       id: "user2",
//       username: "user",
//       avatar: "https://example.com/avatar2.jpg",
//     },
//     timestamp: new Date().toISOString(), // Just now
//   },
// ];
