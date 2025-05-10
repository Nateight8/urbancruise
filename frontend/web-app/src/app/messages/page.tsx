import ChatList from "./_components/chat-list";

export default function Page() {
  return (
    <>
      {/* Mobile: Show chat list */}
      <div className="w-full md:hidden">
        <ChatList />
      </div>
    </>
  );
}
