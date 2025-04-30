"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Preview from "./preview";
import { useCachedUser } from "@/hooks/use-cached-user";
import { useMutation } from "@apollo/client";
import userOperations from "@/graphql/operations/user-operations";

const FormSchema = z.object({
  displayName: z.string().min(2, {
    message: "Bot's not allowed",
  }),
  bio: z
    .string()
    .min(2, {
      message: "Bio must be at least 2 characters.",
    })
    .optional()
    .or(z.literal("")),
});

export default function EditProfile({
  onUsernameEdit,
}: {
  onUsernameEdit: () => void;
}) {
  const [updateUser, { loading }] = useMutation(
    userOperations.Mutations.updateUser
  );
  const [mounted, setMounted] = useState(false);
  const displayNameInputRef = useRef<HTMLInputElement>(null);
  const bioInputRef = useRef<HTMLTextAreaElement>(null);
  const cachedUser = useCachedUser();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      displayName: cachedUser?.displayName || cachedUser?.name,
      bio: cachedUser?.bio || "",
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await updateUser({
      variables: {
        name: data.displayName,
        bio: data.bio,
      },
    });
  }

  //   if (showUsernameForm) {
  //     return <UsernameChange onBack={() => setShowUsernameForm(false)} />;
  //   }

  const focusDisplayName = () => {
    displayNameInputRef.current?.focus();
  };

  const focusBio = () => {
    bioInputRef.current?.focus();
  };

  const displayName = form.watch("displayName");

  const formIsDirty = form.formState.isDirty;

  return (
    <>
      <div className="flex gap-4 p-4 overflow-hidden">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex md:gap-4 relative w-full"
          >
            <motion.div
              className="w-full relative md:max-w-sm flex flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: mounted ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="are you a bot?"
                          className="h-10 bg-background/40"
                          {...field}
                          ref={displayNameInputRef}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About me</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="empty bio makes you look boring..."
                          className="h-10 bg-background/40"
                          {...field}
                          ref={bioInputRef}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4 my-10 hidden md:block">
                <div className="flex max-w-sm items-center p-4 rounded-xl shadow-black border hover:shadow-md transition-all duration-300 justify-between">
                  <div>
                    <div className="font-semibold">Username</div>
                    <div className="text-muted-foreground text-sm">
                      {cachedUser?.username}
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="muted"
                    onClick={onUsernameEdit}
                  >
                    Edit
                  </Button>
                </div>

                <div className="flex max-w-sm items-center p-4 rounded-xl shadow-black border hover:shadow-md transition-all duration-300 justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold">Email</div>
                    <div className="text-muted-foreground text-sm truncate w-full pr-3">
                      {cachedUser?.email}
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="muted"
                    onClick={onUsernameEdit}
                  >
                    Change Email
                  </Button>
                </div>
                <p className="text-muted-foreground text-sm">
                  Joined 2024-01-01
                </p>
              </div>

              {/* Spacer to prevent layout shift */}
              <div className="h-24" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: mounted ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Preview
                onBioClick={focusBio}
                onUsernameEdit={onUsernameEdit}
                onDisplayNameClick={focusDisplayName}
                displayName={displayName}
              />
            </motion.div>

            <AnimatePresence>
              {formIsDirty && (
                <motion.div
                  key="confirmation-bar"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ type: "spring", damping: 10 }}
                  className="fixed left-1/2 w-full -translate-x-1/2 bottom-4 p-4  "
                >
                  <div className="border shadow-md shadow-black p-3 max-w-3xl bg-muted/30 w-full flex items-center justify-between rounded-2xl">
                    <p>Save Changes</p>

                    <div className="space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-transparent"
                        onClick={() => form.reset()}
                        type="button"
                      >
                        Reset
                      </Button>
                      <Button variant="success" size="sm" type="submit">
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </Form>
      </div>
    </>
  );
}
