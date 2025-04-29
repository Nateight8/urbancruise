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

const formSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ChangeUsername({ onBack }: { onBack: () => void }) {
  const [mounted, setMounted] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  const { checkUsername, isAvailable, isChecking } = useUsernameAvailability();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (data: FormValues) => {
    console.log(data);
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
            <span
              className={`${
                !form.watch("username")
                  ? "text-muted-foreground"
                  : isAvailable &&
                    formSchema.safeParse(form.getValues()).success
                  ? "text-success"
                  : "text-destructive"
              }`}
            >
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
            <UniqueIcon
              size={64}
              className={`${
                !form.watch("username")
                  ? "text-muted-foreground"
                  : isAvailable
                  ? "text-success"
                  : "text-destructive"
              }`}
            />
            <span
              className={`text-center -mt-4 ${
                !form.watch("username")
                  ? "text-muted-foreground"
                  : isAvailable
                  ? "text-success"
                  : "text-destructive"
              }`}
            >
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
                    <>
                      {isChecking ? (
                        <span className="text-muted-foreground">
                          Checking...
                        </span>
                      ) : isAvailable ? (
                        <span className="text-success">Available!</span>
                      ) : (
                        <span className="text-destructive">Already taken</span>
                      )}
                    </>
                  )}
                </div>
              </FormItem>
            )}
          />

          <AnimatePresence>
            {form.watch("username").length >= 3 && (
              <motion.div
                key="confirmation-bar"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 10 }}
                className="fixed left-1/2 -translate-x-1/2 bottom-4 w-full flex items-center justify-between rounded-2xl p-3 max-w-3xl border shadow-md shadow-black bg-muted/30"
              >
                <p>
                  Confirm to set profile URL: urbancruise.com/
                  <span
                    className={
                      !isAvailable ? "text-muted-foreground" : "text-foreground"
                    }
                  >
                    {form.watch("username")}
                  </span>
                </p>

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
                  <Button
                    variant="success"
                    disabled={!isAvailable}
                    size="sm"
                    type="submit"
                  >
                    Save Changes
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </Form>
    </AnimatePresence>
  );
}
