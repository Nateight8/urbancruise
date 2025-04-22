"use client";
import { useQuery } from "@apollo/client";
import ChatAppBar from "./_components/chat-appbar";
import ChatInput from "./_components/chat-input";
import ChatMessages from "./_components/chat-messages";
import conversationOperations, {
  GetConversationResponse,
} from "@/graphql/operations/conversation-operations";
import { use } from "react";

export default function MessageClient({
  params,
}: {
  params: Promise<{ messageid: string }>;
}) {
  const { messageid } = use(params);

  const { data } = useQuery<GetConversationResponse>(
    conversationOperations.Querries.getConversation,
    {
      variables: {
        conversationId: messageid,
      },
    }
  );

  console.log("Data from getConversation", data);

  return (
    <>
      <div className="flex h-[100svh] flex-col p-2">
        <ChatAppBar participants={data?.conversation?.participants ?? []} />
        <ChatMessages messages={data?.conversation?.messages ?? []} />
        <ChatInput messageId={messageid} />
      </div>
    </>
  );
}
