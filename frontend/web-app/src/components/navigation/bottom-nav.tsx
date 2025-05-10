"use client";

import { useRouter, usePathname } from "next/navigation";
import { IconHome, IconMail } from "@tabler/icons-react";
import { isRouteActive } from "@/lib/utils/route";
import { cn } from "@/lib/utils";
import { UserRound } from "lucide-react";

const navItems = [
  {
    title: "Home",
    href: "/",
    Icon: IconHome,
  },
  // {
  //   title: "Explore",
  //   href: "/explore",
  //   Icon: IconSearch,
  // },
  {
    title: "Messages",
    href: "/messages",
    Icon: IconMail,
  },
  // {
  //   title: "Notifications",
  //   href: "/notifications",
  //   Icon: IconBell,
  // },
];

interface NavlinkItem {
  title: string;
  href: string;
  Icon: React.ComponentType<{ className?: string; fill?: string }>;
  active?: boolean;
}

export function BottomNav() {
  const pathname = usePathname();

  // Hide bottom nav in message detail pages and settings routes
  if (pathname.includes("/messages/") || pathname.includes("/settings"))
    return null;

  return (
    <div className="fixed border-t bottom-0 left-0 right-0 z-50 md:hidden">
      <nav className="flex items-center gap-1 justify-between border-t bg-background/80 backdrop-blur-lg">
        {navItems.map((item) => {
          const active = isRouteActive(pathname, item.href);
          return <NavlinkItem key={item.href} {...item} active={active} />;
        })}

        <NavlinkItem
          Icon={UserRound}
          href="/profile"
          active={false}
          title="Profile"
        />
      </nav>
    </div>
  );
}

function NavlinkItem({ Icon, href, active }: NavlinkItem) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        router.push(href);
      }}
      className="h-15 flex-1 flex items-center justify-center"
    >
      <div className="p-4">
        <Icon
          className={cn(
            "h-6 w-6 text-muted-foreground",
            active && "text-primary"
          )}
        />
      </div>
    </button>
  );
}
