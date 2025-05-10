import ChatList from "./_components/chat-list";

export default function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[100svh]">
      <div className="hidden md:block w-80 border-r">
        <ChatList />
      </div>
      <main className="flex-1 flex">{children}</main>
    </div>
  );
}
