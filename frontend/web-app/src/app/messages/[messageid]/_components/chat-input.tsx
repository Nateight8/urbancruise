"use client";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import conversationOperations, {
  GetConversationResponse,
  Message,
} from "@/graphql/operations/conversation-operations";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconMoodSmile, IconPhoto, IconSend2 } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCachedUser } from "@/hooks/use-cached-user";

const FormSchema = z.object({
  message: z.string().min(1, {
    message: "Message must be at least 1 character.",
  }),
});

export default function ChatInput({ messageId }: { messageId: string }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      message: "",
    },
  });

  const cachedUser = useCachedUser();

  // Split the messageId into participantIds
  const participantIds = messageId.split("-");

  const [sendMessage, { loading }] = useMutation(
    conversationOperations.Mutations.sendMessage,
    {
      optimisticResponse: {
        sendMessage: {
          __typename: "SendMessageResponse",
          success: true,
        },
      },
      onCompleted: () => {
        form.reset();
      },
      update: (cache, { data }) => {
        if (data?.sendMessage?.success) {
          // Read the existing conversation data
          const existingData = cache.readQuery<GetConversationResponse>({
            query: conversationOperations.Querries.getConversation,
            variables: { conversationId: messageId },
          });

          if (existingData?.conversation) {
            // Create a new message object
            const newMessage: Message = {
              id: `temp-${Date.now()}`,
              content: form.getValues().message,
              conversationId: messageId,
              isDeleted: false,
              isEdited: false,
              sender: {
                id: cachedUser?.id || "",
                username: cachedUser?.username || "",
              },
              senderId: cachedUser?.id || "",
            };

            // Update the cache with the new message
            cache.writeQuery<GetConversationResponse>({
              query: conversationOperations.Querries.getConversation,
              variables: { conversationId: messageId },
              data: {
                conversation: {
                  ...existingData.conversation,
                  messages: [...existingData.conversation.messages, newMessage],
                },
              },
            });
          }
        }
      },
    }
  );

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    const messageContent = values.message;
    if (!messageContent.trim()) return; // Don't send empty messages

    sendMessage({
      variables: {
        participantIds,
        content: messageContent,
      },
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="sticky bottom-0 pt-4 md:pt-6 z-9999 gap-2 w-full bg-transparent flex items-center ">
            <div className="flex-1 bg-background rounded-[20px] ">
              <div className="relative flex items-center rounded-[20px] border border-transparent bg-muted/60 transition-colors focus-within:bg-muted/50 focus-within:border-input has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 [&:has(input:is(:disabled))_*]:pointer-events-none">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <textarea
                          disabled={loading}
                          className="flex-1  max-h-29.5 min-h-0 resize-none py-1.75 w-full bg-transparent px-3 text-[15px] leading-relaxed text-foreground field-sizing-content placeholder:text-muted-foreground/70 focus-visible:outline-none "
                          placeholder="Send a chat..."
                          aria-label="send a chat"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              form.handleSubmit(onSubmit)();
                            }
                          }}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button
                  className="rounded-full "
                  variant="ghost"
                  size="icon"
                  aria-label="Add new item"
                  type="submit"
                  disabled={loading}
                >
                  <IconSend2 size={16} aria-hidden="true" />
                </Button>
              </div>
            </div>
            <Button
              className="rounded-full"
              variant="muted"
              size="icon"
              aria-label="Add new item"
            >
              <IconMoodSmile size={16} aria-hidden="true" />
            </Button>
            <Button
              className="rounded-full"
              variant="muted"
              size="icon"
              aria-label="Add new item"
            >
              <IconPhoto size={16} aria-hidden="true" />
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
