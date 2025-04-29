"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

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
// import UsernameChange from "../account/_components/username-change";

const FormSchema = z.object({
  displayName: z.string().min(2, {
    message: "Display Name must be at least 2 characters.",
  }),
  bio: z.string().min(2, {
    message: "Bio must be at least 2 characters.",
  }),
});

export default function EditProfile({
  onUsernameEdit,
}: {
  onUsernameEdit: () => void;
}) {
  //   const [showUsernameForm, setShowUsernameForm] = useState(false);
  const [mounted, setMounted] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      displayName: "",
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  //   if (showUsernameForm) {
  //     return <UsernameChange onBack={() => setShowUsernameForm(false)} />;
  //   }

  return (
    <div className="flex gap-4 p-4">
      <motion.div
        className="max-w-sm w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: mounted ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="shadcn"
                      className="h-10 bg-background/40"
                      {...field}
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
                      placeholder="write something about yourself"
                      className="h-10 bg-background/40"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Submit</Button>
          </form>
        </Form>

        <div className="flex items-center my-10 p-4 rounded-xl shadow-black border hover:shadow-md transition-all duration-300 justify-between">
          <div>
            <div className="font-semibold">Username</div>
            <div className="text-muted-foreground text-sm">bignate021</div>
          </div>
          <Button size="sm" variant="muted" onClick={onUsernameEdit}>
            Edit
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: mounted ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Preview onUsernameEdit={onUsernameEdit} />
      </motion.div>
    </div>
  );
}
