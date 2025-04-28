import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IconEdit, IconSettings, IconUser } from "@tabler/icons-react";
export function Profile() {
  return (
    <div className="max-w-md pt-12">
      <div className="py-6 flex justify-end">
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full text-muted-foreground"
        >
          <IconEdit className="size-6" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full text-muted-foreground"
        >
          <IconSettings className="size-6" />
        </Button>
      </div>
      <div className="flex flex-col items-center gap-4 ">
        <Avatar className="size-36">
          <AvatarImage src="/images/pfp/pfp3.jpeg" />
          <AvatarFallback>
            <IconUser />
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold">John Doe</h1>
          <p className="text-sm text-muted-foreground">@john_doe</p>
        </div>
      </div>
      {/* account stats */}

      <div className="flex gap-4 py-4 text-center">
        <div className="flex-1 flex flex-col items-center">
          <h3 className="text-2xl font-bold text-primary">712</h3>
          <p className="text-xs text-muted-foreground tracking-wide uppercase">
            Following
          </p>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <h3 className="text-2xl font-bold text-primary">18.8k</h3>
          <p className="text-xs text-muted-foreground tracking-wide uppercase">
            Followers
          </p>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <h3 className="text-2xl font-bold text-primary text-center">12</h3>
          <p className="text-xs text-muted-foreground text-center tracking-wide uppercase">
            Posts
          </p>
        </div>
      </div>

      <div className="py-4">
        <p className="text-center text-base text-muted-foreground  mx-auto">
          🚀 Building cool things. 💬 Love to chat. 🌎 Exploring the world, one
          line of code at a time.
        </p>
      </div>
      {/* actions */}
    </div>
  );
}
