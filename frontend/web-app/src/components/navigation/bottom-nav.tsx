"use client";

import { useRouter } from "next/navigation";
import { IconHome, IconSearch, IconBell, IconMail } from "@tabler/icons-react";

const navItems = [
  {
    title: "Home",
    href: "/",
    Icon: IconHome,
  },
  {
    title: "Explore",
    href: "/explore",
    Icon: IconSearch,
  },
  {
    title: "Messages",
    href: "/messages",
    Icon: IconMail,
  },
  {
    title: "Notifications",
    href: "/notifications",
    Icon: IconBell,
  },
  {
    title: "Street",
    href: "/strret",
    Icon: IconBell,
  },
];

interface NavlinkItem {
  title: string;
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
}

export function BottomNav() {
  return (
    <div className="fixed border-t bottom-0 left-0 right-0 z-50 md:hidden">
      <nav className="flex items-center gap-1 justify-between border-t bg-background/80 backdrop-blur-lg">
        {navItems.map((item) => {
          return <NavlinkItem key={item.href} {...item} />;
        })}
      </nav>
    </div>
  );
}

function NavlinkItem({ Icon, href }: NavlinkItem) {
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
        <Icon className="h-6 w-6" />
      </div>
    </button>
  );
}

// Helper function to check if a path matches a route pattern
// function isRouteActive(currentPath: string, routePattern: string): boolean {
//   // If it's an exact match
//   if (currentPath === routePattern) return true;

//   // If the route pattern ends with a dynamic segment (e.g., /messages/[id])
//   if (routePattern.includes("[") && routePattern.includes("]")) {
//     const basePath = routePattern.split("/[")[0];
//     return currentPath.startsWith(basePath);
//   }

//   // If the route pattern is a parent route (e.g., /messages)
//   if (currentPath.startsWith(routePattern + "/")) {
//     return true;
//   }

//   return false;
// }
