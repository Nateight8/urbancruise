import { AuthForm } from "./auth-form";
import LayoutContainer from "./layout-container";

import OAuthSignIn from "./oauth-sign";

export default function Authentication() {
  return (
    <div className="h-screen py-8 px-4">
      <LayoutContainer>
        {/* Sign-in Form Section */}
        <div className="bg-muted/30 rounded-2xl   flex border border-border/40 flex-col items-center justify-center p-8  order-last lg:order-first">
          <div className="flex flex-col items-center max-w-xs w-full mx-auto space-y-8">
            <div className="text-center flex items-center flex-col space-y-4">
              <div className="rounded-2xl w-fit py-1 px-2 border text-center">
                <p className="text-xs">Let&apos;s get you started</p>
              </div>

              <h1 className="text-4xl font-bold">Sign up</h1>

              <p className="text-sm text-muted-foreground">
                Create an account to unlock a tailored experience just for you.
              </p>
            </div>

            <OAuthSignIn />

            <div className="w-full flex items-center justify-center">
              <div className="border-t flex-grow"></div>
              <span className="px-4 text-sm text-muted-foreground">OR</span>
              <div className="border-t flex-grow"></div>
            </div>
            <AuthForm />
            {/* <SignUpForm /> */}
          </div>

          {/* {children} */}
        </div>

        {/* Branding Section */}
        {/* <div className="bg-muted/30 rounded-2xl hidden border border-border/40 lg:flex flex-col items-center justify-center p-8 lg:p-16 order-first lg:order-last">
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
        </div> */}
      </LayoutContainer>
    </div>
  );
}
