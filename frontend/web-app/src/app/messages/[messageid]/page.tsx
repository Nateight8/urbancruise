"use client";
import {
  useApolloClient,
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client";
import ChatAppBar from "./_components/chat-appbar";
import ChatInput from "./_components/chat-input";
import ChatMessages from "./_components/chat-messages";
import conversationOperations, {
  GetConversationResponse,
} from "@/graphql/operations/conversation-operations";
import { use, useEffect, useMemo } from "react";
import { useCachedUser } from "@/hooks/use-cached-user";

export default function MessageClient({
  params,
}: {
  params: Promise<{ messageid: string }>;
}) {
  const { messageid } = use(params);
  const client = useApolloClient();
  const currentUser = useCachedUser();

  const [markMessageAsDelivered] = useMutation(
    conversationOperations.Mutations.markMessageAsDelivered
  );
  const [markMessageAsRead] = useMutation(
    conversationOperations.Mutations.markMessageAsRead
  );

  const { data, loading } = useQuery<GetConversationResponse>(
    conversationOperations.Querries.getConversation,
    {
      variables: {
        conversationId: messageid,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  // Extract messages directly from query data
  const messages = useMemo(
    () => data?.conversation?.messages || [],
    [data?.conversation?.messages]
  );

  // Subscribe to new messages
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

          // If the message is not from the current user, mark it as delivered
          if (
            currentUser?.id &&
            subscriptionData.data.messageAdded.senderId !== currentUser.id
          ) {
            // Mark the message as delivered
            markMessageAsDelivered({
              variables: {
                messageId: subscriptionData.data.messageAdded.id,
              },
            });
          }
        }
      }
    },
  });

  // Subscribe to message status updates
  useSubscription(conversationOperations.Subscriptions.messageStatusChanged, {
    variables: {
      conversationId: messageid,
    },
    onData: ({ data: subscriptionData }) => {
      if (subscriptionData?.data?.messageStatusUpdated) {
        const { id, status } = subscriptionData.data.messageStatusUpdated;

        // Update the message status in the cache
        const existingData = client.readQuery<GetConversationResponse>({
          query: conversationOperations.Querries.getConversation,
          variables: { conversationId: messageid },
        });

        if (existingData?.conversation) {
          const updatedMessages = existingData.conversation.messages.map(
            (msg) => {
              if (msg.id === id) {
                return { ...msg, status };
              }
              return msg;
            }
          );

          client.writeQuery<GetConversationResponse>({
            query: conversationOperations.Querries.getConversation,
            variables: { conversationId: messageid },
            data: {
              __typename: "Query",
              conversation: {
                ...existingData.conversation,
                messages: updatedMessages,
              },
            },
          });
        }
      }
    },
  });

  // Mark messages as read when the conversation is viewed
  useEffect(() => {
    if (messages.length > 0 && currentUser?.id) {
      // Get messages that aren't from the current user and aren't marked as read
      const unreadMessages = messages.filter(
        (msg) => msg.senderId !== currentUser.id && msg.status !== "READ"
      );

      // Mark each message as read
      unreadMessages.forEach((msg) => {
        markMessageAsRead({
          variables: {
            messageId: msg.id,
          },
        });
      });
    }
  }, [messages, currentUser, markMessageAsRead]);

  return (
    <>
      <div className="flex size-full flex-col md:p-2">
        <ChatAppBar
          loading={loading}
          participants={data?.conversation?.participants || []}
        />
        <ChatMessages loading={loading} messages={messages} />
        <ChatInput messageId={messageid} />
      </div>
    </>
  );
}
