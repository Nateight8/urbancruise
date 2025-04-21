import ChatAppBar from "./_components/chat-appbar";
import ChatInput from "./_components/chat-input";
import ChatMessages from "./_components/chat-messages";

interface MessageClientProps {
  params: {
    messageid: string;
  };
}

export default function MessageClient({ params }: MessageClientProps) {
  const { messageid } = params;

  return (
    <>
      <div className="flex h-[100svh] flex-col p-2">
        <ChatAppBar />
        <ChatMessages />
        <ChatInput messageId={messageid} />
      </div>
    </>
  );
}
