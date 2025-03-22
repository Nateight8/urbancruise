"use client";
import { useEffect } from "react";
import { useMutation, useApolloClient } from "@apollo/client";
import userOperations, {
  GetLoggedInUserResponse,
  UpdateUsernameResponse,
} from "@/graphql/operations/user-operations";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useUsernameAvailability } from "@/hooks/use-username-availability";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must be at most 20 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
});

interface UsernameFormProps {
  onSuccess?: () => void;
}

export function UsernameForm({ onSuccess }: UsernameFormProps) {
  // Custom hook for username availability checking
  const { isAvailable, isChecking, checkUsername } = useUsernameAvailability();
  const router = useRouter();
  const apolloClient = useApolloClient();

  // Mutation to update username
  const [updateUsername, { loading: updateLoading }] = useMutation(
    userOperations.Mutations.updateUsername,
    {
      update: (cache, { data }: { data?: UpdateUsernameResponse }) => {
        if (data?.updateUsername?.success && data.updateUsername.user) {
          try {
            // Update cache data for logged in user
            const cacheData = cache.readQuery<GetLoggedInUserResponse>({
              query: userOperations.Querries.getLoggedInUser,
            });

            if (cacheData?.getLoggedInUser?.user) {
              cache.writeQuery({
                query: userOperations.Querries.getLoggedInUser,
                data: {
                  getLoggedInUser: {
                    ...cacheData.getLoggedInUser,
                    user: {
                      ...cacheData.getLoggedInUser.user,
                      username: data.updateUsername.user.username,
                      onboardingCompleted: true,
                    },
                  },
                },
              });
            }
          } catch (e) {
            console.error("Error updating cache:", e);
          }
        }
      },
    }
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  // Watch for username changes and check availability
  const username = form.watch("username");

  useEffect(() => {
    if (username) {
      checkUsername(username);
    }
  }, [username, checkUsername]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await updateUsername({
        variables: {
          username: values.username,
        },
      });

      if (result.data?.updateUsername?.success) {
        toast.success("Username set successfully!");

        // Force a refetch to update the UI
        await apolloClient.resetStore();

        // Call the success callback if provided
        if (onSuccess) {
          onSuccess();
        }

        // Redirect to home
        router.refresh();
      } else {
        toast.error(
          result.data?.updateUsername?.message || "Failed to set username"
        );
      }
    } catch (error) {
      console.error("Error updating username:", error);
      toast.error("There was a problem setting your username");
    }
  }

  // Function to determine what status message to show (in priority order)
  const getStatusMessage = () => {
    // Always show checking first when it's active and username is valid length
    if (isChecking && username.length >= 3) {
      return {
        text: "Checking availability...",
        className: "text-muted-foreground animate-pulse",
      };
    }

    if (username.length < 3) {
      return {
        text: "Create a unique public display name",
        className: "text-muted-foreground",
      };
    }

    if (isAvailable === false) {
      return {
        text: "Username is already taken",
        className: "text-destructive",
      };
    }

    if (isAvailable === true) {
      return { text: "Username is available", className: "text-green-500" };
    }

    // Fallback empty message
    return { text: "\u00A0", className: "text-transparent" };
  };

  const statusMessage = getStatusMessage();

  return (
    <div className="h-screen flex items-center justify-center mx-auto p-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full max-w-xs"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="yourusername"
                      {...field}
                      className={`h-12 ${
                        isAvailable === true && username.length >= 3
                          ? "border-green-500 focus-visible:ring-green-500"
                          : isAvailable === false && username.length >= 3
                          ? "border-red-500 focus-visible:ring-red-500"
                          : ""
                      }`}
                    />
                    {isChecking && username.length >= 3 && (
                      <div className="absolute right-3 top-3">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </FormControl>

                {/* Fixed-height status message container */}
                <div className="h-5 mt-1 transition-opacity duration-200">
                  <p
                    className={`text-[0.8rem] font-medium ${statusMessage.className}`}
                  >
                    {statusMessage.text}
                  </p>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={updateLoading || isChecking || isAvailable === false}
          >
            {updateLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
