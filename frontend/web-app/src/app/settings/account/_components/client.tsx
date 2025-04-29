"use client";

// import { useState } from "react";

import AccountRemovalButton from "./_components/account-removal-button";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import ChangeUsername from "./_components/change-username";

export default function Page() {
  //   const [showUsernameForm, setShowUsernameForm] = useState(false);
  const router = useRouter();

  return (
    <div className="relative w-full max-w-sm h-[500px] overflow-hidden">
      {/* Account Summary */}
      <div className="absolute inset-0 transition-transform duration-500 bg-muted/30 border rounded-xl p-6 space-y-6">
        {/* Display Name */}
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold ">Display Name</div>
            <div className="text-muted-foreground text-sm">
              You haven&apos;t added a display name yet.
            </div>
          </div>
          <Button
            onClick={() => router.push("/settings")}
            size="sm"
            variant="muted"
          >
            Edit
          </Button>
        </div>

        {/* Username */}
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold ">Username</div>
            <div className="text-muted-foreground text-sm">bignate021</div>
          </div>
          <ChangeUsername />
        </div>

        {/* Email */}
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-white">Email</div>
            <div className="text-zinc-300 text-sm">
              *************@yahoo.com
              <button className="ml-2 text-blue-400 hover:underline text-xs">
                Reveal
              </button>
            </div>
          </div>
          <Button disabled size="sm" variant="muted">
            Edit
          </Button>
        </div>

        {/* Phone Number */}
        <div className=" items-center justify-between hidden">
          <div>
            <div className="font-semibold text-white">Phone Number</div>
            <div className="text-zinc-300 text-sm">
              ********1066
              <button className="ml-2 text-blue-400 hover:underline text-xs">
                Reveal
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-blue-400 hover:underline text-xs">
              Remove
            </button>
            <Button size="sm" variant="muted">
              Edit
            </Button>
          </div>
        </div>

        {/* Account Removal Section */}
        <div className="mt-10">
          <h2 className="text-base font-semibold mb-1">Account Removal</h2>
          <p className="text-muted-foreground text-sm max-w-md mb-6">
            Disabling your account means you can recover it at any time after
            taking this action.
          </p>
          <div className="flex gap-4">
            <AccountRemovalButton type="disable" />
            <AccountRemovalButton type="delete" />
          </div>
        </div>
      </div>
    </div>
  );
}
