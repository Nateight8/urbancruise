"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UsernameForm } from "@/components/auth/username-form";
import { useState } from "react";

export default function ChangeUsername() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center p-4 rounded-xl shadow-black border hover:shadow-md transition-all duration-300 justify-between">
      <div>
        <div className="font-semibold">Username</div>
        <div className="text-muted-foreground text-sm">bignate021</div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="muted">
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Username</DialogTitle>
          </DialogHeader>
          <UsernameForm onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
