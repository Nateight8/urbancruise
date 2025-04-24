import { Message } from "@/graphql/operations/conversation-operations";
import { useCachedUser } from "@/hooks/use-cached-user";
import { CheckIcon, CheckCheck, Clock } from "lucide-react";
import { motion } from "motion/react";

export default function ChatMessage({ message }: { message: Message }) {
  const cachedUser = useCachedUser();

  const userId = cachedUser?.id;
  const messageSenderUsername = message.sender?.username;
  const isOwnMessage = message.senderId === userId;

  console.log("message.status", message.status);

  // Only show status for messages sent by the current user
  const renderStatusIndicator = () => {
    if (!isOwnMessage) return null;

    switch (message.status) {
      case "SENT":
        return <Clock className="h-3 w-3 text-muted-foreground ml-1" />;
      case "DELIVERED":
        return <CheckIcon className="h-3 w-3 text-muted-foreground ml-1" />;
      case "READ":
        return <CheckCheck className="h-3 w-3 text-blue-500 ml-1" />;
      case "FAILED":
        return <span className="text-xs text-red-500 ml-1">!</span>;
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="mb-4 rounded-lg"
      initial={{
        opacity: 0,
        x: isOwnMessage ? 20 : -20,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
    >
      <p
        className={`text-sm uppercase font-semibold leading-none ${
          isOwnMessage ? "text-red-500" : "text-blue-400"
        }`}
      >
        {isOwnMessage ? "ME" : messageSenderUsername}
      </p>

      <motion.div className="hover:bg-muted/50 flex items-center gap-1 w-fit min-h-10 rounded-lg relative">
        <div
          className={`w-0.5 min-h-6 h-fit rounded-l-lg ${
            isOwnMessage ? "bg-red-500" : "bg-blue-500"
          }`}
        />
        <div className="flex items-center">
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          {renderStatusIndicator()}
        </div>
      </motion.div>
    </motion.div>
  );
}
