import { Message } from "@/graphql/operations/conversation-operations";
import { useCachedUser } from "@/hooks/use-cached-user";

export default function ChatMessage({ message }: { message: Message }) {
  const cachedUser = useCachedUser();

  return (
    <div className="mb-3 rounded-lg">
      <p
        className={`text-sm uppercase font-semibold px-2 ${
          message.senderId === cachedUser?.id ? "text-red-500" : "text-blue-400"
        }`}
      >
        {message.senderId === cachedUser?.id ? "ME" : message.sender?.username}
      </p>

      <div className="hover:bg-muted/50 w-fit rounded-lg p-2">
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  );
}
