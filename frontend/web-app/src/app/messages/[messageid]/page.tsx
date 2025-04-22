"use client";
import { useApolloClient, useQuery, useSubscription } from "@apollo/client";
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
  const client = useApolloClient();

  const { data } = useQuery<GetConversationResponse>(
    conversationOperations.Querries.getConversation,
    {
      variables: {
        conversationId: messageid,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  // Extract messages directly from query data
  const messages = data?.conversation?.messages || [];

  useSubscription(conversationOperations.Subscriptions.messageSent, {
    variables: {
      conversationId: messageid,
    },
    onData: ({ data: subscriptionData }) => {
      if (subscriptionData?.data?.messageAdded) {
        console.log("Subscription data:", subscriptionData.data);

        // Update the Apollo cache directly with the new message
        const existingData = client.readQuery<GetConversationResponse>({
          query: conversationOperations.Querries.getConversation,
          variables: { conversationId: messageid },
        });

        if (existingData?.conversation) {
          client.writeQuery<GetConversationResponse>({
            query: conversationOperations.Querries.getConversation,
            variables: { conversationId: messageid },
            data: {
              __typename: "Query",
              conversation: {
                ...existingData.conversation,
                messages: [
                  ...existingData.conversation.messages,
                  subscriptionData.data.messageAdded,
                ],
              },
            },
          });
        }
      }
    },
  });

  return (
    <>
      <div className="flex h-[100svh] flex-col p-2">
        <ChatAppBar participants={data?.conversation?.participants || []} />
        <ChatMessages messages={messages} />
        <ChatInput messageId={messageid} />
      </div>
    </>
  );
}
