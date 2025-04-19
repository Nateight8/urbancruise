"use client";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconMoodSmile, IconPhoto, IconSend2 } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  message: z.string().min(1, {
    message: "Message must be at least 1 character.",
  }),
});

export default function ChatInput() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    console.log(values);
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
                >
                  <IconSend2 size={16} aria-hidden="true" />
                </Button>
                {/* Textarea buttons */}
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
