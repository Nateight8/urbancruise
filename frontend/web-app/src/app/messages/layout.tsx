import ChatList from "./_components/chat-list";

export default function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-svh">
      <div className="w-full hidden md:block">
        <ChatList />
      </div>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
