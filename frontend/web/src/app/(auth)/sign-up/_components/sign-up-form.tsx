"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import InputPassword from "./input-pass";
import Link from "next/link";
import { IconArrowNarrowRight } from "@tabler/icons-react";

const FormSchema = z.object({
  fullname: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),

  email: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),

  password: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export function SignUpForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="h-12"
                  autoComplete="off"
                  placeholder="Full name"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="h-12"
                  autoComplete="off"
                  placeholder="Email"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputPassword field={field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="">
          <Button
            size="lg"
            className="w-full"
            variant="gooeyLeft"
            type="submit"
          >
            Sign up <IconArrowNarrowRight className="mr-2" />
          </Button>
          <div className="flex items-center space-x-2 py-3">
            <p className="text-muted-foreground text-sm">
              Already got an account?
            </p>
            <Link
              href="/sign-in"
              className="border rounded-md py-1 px-2 bg-muted text-sm"
            >
              log in
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
}
