// import { auth } from "@/auth";
import Image from "next/image";
// import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export default async function Layout({ children }: PropsWithChildren) {
  // const session = await auth();

  // if (session) {
  //   return redirect("/dashboard");
  // }

  return (
    <div className="h-screen py-8 px-4">
      <div className=" grid gap-4 grid-cols-1 h-full lg:grid-cols-[38.2fr_61.8fr] P-8">
        {/* Sign-in Form Section */}
        <div className="bg-muted/30 rounded-2xl flex border border-border/40 flex-col items-center justify-center p-8  order-last lg:order-first">
          {children}
        </div>

        {/* Branding Section */}
        <div className="bg-muted/30 rounded-2xl hidden border border-border/40 lg:flex flex-col items-center justify-center p-8 lg:p-16 order-first lg:order-last">
          <div className="max-w-md text-center">
            <Image
              src="/placeholder.svg?height=100&width=100"
              alt="Logo"
              width={100}
              height={100}
              className="mx-auto mb-8"
            />
            <h1 className="text-3xl font-bold mb-4">Welcome to Our Platform</h1>
            <p className="text-gray-600">
              Experience the power of seamless collaboration
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
