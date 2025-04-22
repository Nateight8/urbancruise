"use client";
import { useQuery, useSubscription } from "@apollo/client";
import ChatAppBar from "./_components/chat-appbar";
import ChatInput from "./_components/chat-input";
import ChatMessages from "./_components/chat-messages";
import conversationOperations, {
  GetConversationResponse,
  Message,
} from "@/graphql/operations/conversation-operations";
import { use } from "react";
import { useState } from "react";

export default function MessageClient({
  params,
}: {
  params: Promise<{ messageid: string }>;
}) {
  const { messageid } = use(params);
  const [messages, setMessages] = useState<Message[]>([]);

  const { data } = useQuery<GetConversationResponse>(
    conversationOperations.Querries.getConversation,
    {
      variables: {
        conversationId: messageid,
      },

      onCompleted: (data) => {
        if (data?.conversation?.messages) {
          setMessages(data.conversation.messages);
        }
      },
    }
  );

  useSubscription(conversationOperations.Subscriptions.messageSent, {
    variables: {
      conversationId: messageid,
    },

    onData: ({ data }) => {
      if (data.data) {
        setMessages((prevMessages) => [
          ...prevMessages,
          data.data.messageAdded,
        ]);
      }
    },
  });

  return (
    <>
      <div className="flex h-[100svh] flex-col p-2">
        <ChatAppBar participants={data?.conversation?.participants ?? []} />
        <ChatMessages messages={messages} />
        <ChatInput messageId={messageid} />
      </div>
    </>
  );
}
