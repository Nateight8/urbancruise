import ChatAppBar from "./_components/chat-appbar";
import ChatInput from "./_components/chat-input";
import ChatMessages from "./_components/chat-messages";

export default function MessageClient() {
  return (
    <>
      <div className="flex h-[100svh] flex-col p-2">
        <ChatAppBar />
        <ChatMessages />
        <ChatInput />
      </div>
    </>
  );
}
