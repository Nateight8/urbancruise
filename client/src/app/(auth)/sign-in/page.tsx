import { Button } from "@/components/ui/button";
import { IconBrandGithub, IconBrandGoogleFilled } from "@tabler/icons-react";
import { SignInForm } from "./_components/sign-in-form";
import { signIn } from "@/auth";

export default function SignIn() {
  const handleGoogleSignIn = async () => {
    "use server";
    await signIn("google");
  };

  const handleGithubSignIn = async () => {
    "use server";
    await signIn("github");
  };

  return (
    <>
      <div className="flex flex-col items-center max-w-xs w-full mx-auto space-y-8">
        <div className="text-center flex items-center flex-col space-y-4">
          <div className="rounded-2xl w-fit py-1 px-2 border text-center">
            <p className="text-xs">Welcome back</p>
          </div>

          <h1 className="text-4xl font-bold">Sign in</h1>

          <p className="text-sm text-muted-foreground">
            Access your account to continue your personalized experience.
          </p>
        </div>
        <div className="space-x-5">
          <Button onClick={handleGoogleSignIn} variant="outline" size="icon">
            <IconBrandGoogleFilled className="w-6 h-6" />
          </Button>
          <Button onClick={handleGithubSignIn} variant="outline" size="icon">
            <IconBrandGithub className="w-6 h-6" />
          </Button>
        </div>
        <div className="w-full flex items-center justify-center">
          <div className="border-t flex-grow"></div>
          <span className="px-4 text-sm text-muted-foreground">OR</span>
          <div className="border-t flex-grow"></div>
        </div>
        <SignInForm />
      </div>
    </>
  );
}
