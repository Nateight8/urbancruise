import { Skeleton } from "@/components/ui/skeleton";

export default function ChatsPage() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="flex items-center gap-2 p-1 pr-3 ">
        <Skeleton className="size-10 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}
