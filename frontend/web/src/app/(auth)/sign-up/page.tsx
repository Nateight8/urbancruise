import { Button } from "@/components/ui/button";
import { IconBrandGithub, IconBrandGoogleFilled } from "@tabler/icons-react";
import { SignUpForm } from "./_components/sign-up-form";
import { signIn } from "@/auth";

export default function SignUp() {
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
            <p className="text-xs">Let&apos;s get you started</p>
          </div>

          <h1 className="text-4xl font-bold">Sign up</h1>

          <p className="text-sm text-muted-foreground">
            Create an account to unlock a tailored experience just for you.
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
        <SignUpForm />
      </div>
    </>
  );
}
