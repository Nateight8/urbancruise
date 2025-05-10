"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconHome,
  IconSearch,
  IconBell,
  IconMail,
  IconPencil,
  IconPower,
} from "@tabler/icons-react";
import { UserAvatar } from "../user/user-avatar";
import { handleLogout } from "@/lib/Oauth-functions";
import { isRouteActive } from "@/lib/utils/route";

export type SidebarNavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  isAction?: boolean;
};

export interface SidebarNavProps {
  items?: SidebarNavItem[];
  className?: string;
  logo?: React.ReactNode;
}

export function SidebarNav({
  items = defaultNavItems,
  className,
  logo,
}: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "hidden md:flex  h-full flex-col justify-between  px-3 py-4 bg-background",
        className
      )}
    >
      {/* Top section - Logo */}
      <div className="flex items-center justify-center ">
        <div className="flex h-12 w-12 items-center justify-center">
          {logo || (
            <Link href="/" className="text-primary">
              <svg
                viewBox="0 0 24 24"
                className="h-8 w-8 text-primary"
                fill="currentColor"
              >
                <g>
                  <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
                </g>
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* Middle section - Navigation Items */}
      <div className="flex flex-col items-center justify-center  mt-6 mb-6 p-1">
        <nav className="flex flex-col items-center space-y-3">
          {items
            .filter((item) => !item.isAction)
            .map((item, index) => {
              const isActive = isRouteActive(pathname, item.href);

              return (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full p-2 transition-colors hover:bg-muted",
                    isActive ? "bg-muted text-primary" : "text-foreground/70"
                  )}
                  aria-label={item.title}
                >
                  <span className="sr-only">{item.title}</span>
                  <div className="h-6 w-6">{item.icon}</div>
                </Link>
              );
            })}
        </nav>

        {/* Action Button (Like Compose) */}
        {items.find((item) => item.isAction) && (
          <div className="mt-4">
            {items
              .filter((item) => item.isAction)
              .map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-primary p-2 text-primary-foreground shadow-md hover:bg-primary/90"
                  aria-label={item.title}
                >
                  <span className="sr-only">{item.title}</span>
                  <div className="h-6 w-6">{item.icon}</div>
                </Link>
              ))}
          </div>
        )}
      </div>

      {/* Bottom section - User Profile */}
      {pathname !== "/profile" ? (
        <Link href="/profile" className="flex items-center justify-center">
          <UserAvatar />
        </Link>
      ) : (
        <button
          onClick={handleLogout}
          className="flex h-12 hover:cursor-pointer w-12 items-center justify-center rounded-full p-2 text-foreground shadow-md hover:bg-foreground/10"
          aria-label="log out"
        >
          <span className="sr-only">log out</span>
          <IconPower />
        </button>
      )}
    </div>
  );
}

const defaultNavItems: SidebarNavItem[] = [
  {
    title: "Home",
    href: "/",
    icon: <IconHome />,
  },
  {
    title: "Explore",
    href: "/explore",
    icon: <IconSearch />,
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: <IconBell />,
  },
  {
    title: "Messages",
    href: "/messages",
    icon: <IconMail />,
  },
  {
    title: "Compose",
    href: "/compose",
    icon: <IconPencil />,
    isAction: true,
  },
];
