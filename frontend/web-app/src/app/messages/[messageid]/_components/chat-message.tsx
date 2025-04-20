interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    username: string;
  };
  timestamp: string;
}

export default function ChatMessage({ message }: { message: Message }) {
  return (
    <div className="mb-3 rounded-lg">
      <p
        className={`text-sm uppercase font-semibold px-2 ${
          message.sender.username === "user" ? "text-red-500" : "text-blue-400"
        }`}
      >
        {message.sender.username === "user" ? "ME" : message.sender.username}
      </p>

      <div className="hover:bg-muted/50 w-fit rounded-lg p-2  ">
        <p className="text-sm ">{message.content}</p>
      </div>
    </div>
  );
}
