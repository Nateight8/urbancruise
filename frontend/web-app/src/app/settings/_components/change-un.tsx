"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUsernameAvailability } from "@/hooks/username-availability";
import { LeftArrow, UniqueIcon } from "@/components/svg";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { IconArrowLeft } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useCachedUser } from "@/hooks/use-cached-user";
import { useMutation } from "@apollo/client";
import userOperations from "@/graphql/operations/user-operations";

const formSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ChangeUsername({ onBack }: { onBack: () => void }) {
  const [updateUsername, { loading }] = useMutation(
    userOperations.Mutations.updateUsername
  );
  const cachedUser = useCachedUser();
  const [mounted, setMounted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [username, setUsername] = useState(cachedUser?.username || "");
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: cachedUser?.username,
    },
  });

  const { checkUsername, isAvailable, isChecking } = useUsernameAvailability();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Watch for username changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "username") {
        const newUsername = value.username || "";
        setUsername(newUsername);
        setShowConfirmation(
          newUsername.length >= 3 && newUsername !== cachedUser?.username
        );
      }
    });
    return () => subscription.unsubscribe();
  }, [form, cachedUser?.username]);

  const usernameIsAvailable = username === cachedUser?.username || isAvailable;

  const isValidUsername = formSchema.safeParse({ username }).success;

  const getColorClass = () => {
    if (!username) {
      return "text-muted-foreground";
    }

    switch (true) {
      case username === cachedUser?.username:
        return "text-muted-foreground";
      case !isValidUsername:
        return "text-destructive";
      case usernameIsAvailable && isValidUsername:
        return "text-success";
      default:
        return "text-destructive";
    }
  };

  const getStatusMessage = () => {
    if (!username || username.length < 3) {
      return null;
    }

    if (isChecking) {
      return {
        text: "Checking...",
        className: "text-muted-foreground",
      };
    }

    if (username === cachedUser?.username) {
      return {
        text: "Current username",
        className: "text-muted-foreground",
      };
    }

    if (!isValidUsername) {
      return {
        text: "Invalid username format",
        className: "text-destructive",
      };
    }

    if (isAvailable) {
      return {
        text: "Available!",
        className: "text-success",
      };
    }

    return {
      text: "Already taken",
      className: "text-destructive",
    };
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const result = await updateUsername({
        variables: {
          username: data.username,
        },
      });

      if (result.data?.updateUsername?.success) {
        setIsSuccess(true);
        form.reset({ username: data.username });
        setTimeout(() => {
          onBack();
        }, 1500);
      }
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full h-full relative"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: mounted ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
          >
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute top-0 left-0"
              onClick={onBack}
            >
              <IconArrowLeft className="w-4 h-4" /> Cancel
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: mounted ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.4 }}
            className="absolute top-1/2 text-xs text-muted-foreground w-36 text-right flex items-center justify-end"
          >
            <span className={`${getColorClass()}`}>
              3-20 chars, letters, numbers, underscores
            </span>
            <LeftArrow className="text-muted-foreground" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: mounted ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.6 }}
            className="text-xs text-muted-foreground mb-2 absolute right-4 top-1/3 w-52 flex items-center flex-col gap-2"
          >
            <UniqueIcon size={64} className={getColorClass()} />
            <span className={`text-center -mt-4 ${getColorClass()}`}>
              Pick a unique identifier that will represent you across the
              platform.
            </span>
          </motion.div>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="w-full max-w-xs p-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <FormLabel>Choose Username</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. dev_alex92"
                      onChange={async (e) => {
                        field.onChange(e);
                        if (e.target.value.length >= 3) {
                          await checkUsername(e.target.value);
                        }
                      }}
                    />
                  </FormControl>
                </div>
                <div className="text-sm h-6">
                  {field.value.length >= 3 && (
                    <span className={getStatusMessage()?.className}>
                      {getStatusMessage()?.text}
                    </span>
                  )}
                </div>
              </FormItem>
            )}
          />

          <AnimatePresence>
            {showConfirmation && !isSuccess && (
              <motion.div
                key="confirmation-bar"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 10 }}
                className="absolute left-1/2 -translate-x-1/2 bottom-4 w-full flex items-center justify-between rounded-2xl p-3 max-w-3xl border shadow-md shadow-black bg-muted/30"
              >
                <p className="hidden md:block">
                  Confirm to set profile URL: urbancruise.com/
                  <span
                    className={
                      !usernameIsAvailable
                        ? "text-muted-foreground"
                        : "text-foreground"
                    }
                  >
                    {username}
                  </span>
                </p>

                <p className="block md:hidden">Save Changes</p>

                <div className="space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-transparent"
                    onClick={() => {
                      form.reset();
                      setShowConfirmation(false);
                    }}
                    type="button"
                  >
                    Reset
                  </Button>
                  <Button
                    variant="success"
                    disabled={!usernameIsAvailable || loading}
                    size="sm"
                    type="submit"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </motion.div>
            )}

            {isSuccess && (
              <motion.div
                key="success-message"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 10 }}
                className="absolute left-1/2 -translate-x-1/2 bottom-4 w-full flex items-center justify-center rounded-2xl p-3 max-w-3xl text-success"
              >
                Username updated successfully!
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </Form>
    </AnimatePresence>
  );
}
