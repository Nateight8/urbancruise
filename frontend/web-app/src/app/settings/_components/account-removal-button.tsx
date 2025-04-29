"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AccountRemovalButton({
  type,
  action,
}: {
  type: "disable" | "delete";
  action: () => void;
}) {
  const [open, setOpen] = useState(false);
  const isDelete = type === "delete";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive">
          {isDelete ? "Delete Account" : "Disable Account"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {isDelete ? "Delete Account" : "Disable Account"}
          </DialogTitle>
        </DialogHeader>
        <p className="mb-4">
          {isDelete
            ? "Are you sure you want to permanently delete your account? This action cannot be undone."
            : "Are you sure you want to disable your account? You can recover it at any time."}
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              action();
              setOpen(false);
            }}
          >
            {isDelete ? "Delete" : "Disable"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
