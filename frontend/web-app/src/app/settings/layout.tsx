"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import { handleLogout } from "@/lib/Oauth-functions";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-svh">
      <aside className="w-80 hidden md:block h-full border-r py-2 pl-2 ">
        <div className="w-full max-w-50 p-4 ml-auto h-full flex flex-col justify-between">
          <div className="">
            <h3 className="p-2.5  uppercase py-4 text-muted-foreground font-bold text-sm">
              User Settings
            </h3>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                  className: "w-full justify-start",
                })}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <footer className="py-4  flex flex-col w-full  items-center">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-between"
            >
              <span>Log out</span>
              <LogOutIcon className="w-4 h-4" />
            </Button>
          </footer>
        </div>
      </aside>
      <main className="flex-1 bg-muted/25 md:pt-16 overflow-y-auto md:px-8 md:py-8">
        {children}
      </main>
    </div>
  );
}

const links = [
  {
    label: "Manage Profile",
    href: "/settings",
  },
];
