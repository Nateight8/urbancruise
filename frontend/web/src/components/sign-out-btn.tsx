"use client";

import { Button } from "@/components/ui/button";
import { handleSignOut } from "@/actions/auth";

export function SignOut() {
  return (
    <form action={handleSignOut}>
      <Button type="submit" variant="destructive" size="default">
        Sign Out
      </Button>
    </form>
  );
}
