"use client";

import { useState } from "react";
import ChangeUsername from "./_components/change-un";
import EditProfile from "./_components/edit-profile";
import { AnimatePresence, motion } from "motion/react";

// import ChangeUsername from "./_components/change-un";

export default function SettingsPage() {
  const [isEditingUsername, setIsEditingUsername] = useState(false);

  return (
    <div className="h-full w-full overflow-hidden">
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
  );
}
