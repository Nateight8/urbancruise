"use client";

import { useState } from "react";
import ChangeUsername from "./_components/change-un";
import EditProfile from "./_components/edit-profile";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
export default function SettingsPage() {
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const router = useRouter();
  return (
    <>
      <div className="h-full w-full md:hidden">
        <div className=" flex items-center justify-between gap-2 h-14">
          <div className="flex-1">
            <Button onClick={() => router.back()} variant="ghost" size="icon">
              <IconArrowLeft className="w-4 h-4" />
            </Button>
          </div>
          <h1 className="text-lgflex-1 font-bold">Edit profile</h1>
          <div className="flex-1"></div>
        </div>
        <div className="flex items-center flex-col p-4 justify-center">
          <Avatar className="size-24">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="">
          <EditProfile onUsernameEdit={() => setIsEditingUsername(true)} />
        </div>
      </div>

      {/* desktop */}
      <div className="h-full hidden md:block w-full overflow-hidden">
        <AnimatePresence mode="wait">
          {!isEditingUsername && (
            <motion.div
              key="edit-profile"
              className="w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <EditProfile onUsernameEdit={() => setIsEditingUsername(true)} />
            </motion.div>
          )}

          {isEditingUsername && (
            <motion.div
              key="change-username"
              className="w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChangeUsername onBack={() => setIsEditingUsername(false)} />
            </motion.div>
          )}
          {/* <ChangeUsernameV3 /> */}
        </AnimatePresence>
      </div>
    </>
  );
}
