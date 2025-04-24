import { Button } from "@/components/ui/button";
import { IconBrandGithub, IconBrandGoogleFilled } from "@tabler/icons-react";
import { signIn } from "next-auth/react";

export default function OAuthSignIn() {
  const handleGoogleSignIn = async () => {
    await signIn("google");
  };

  const handleGithubSignIn = async () => {
    await signIn("github");
  };

  return (
    <div className="space-x-5">
      <Button onClick={handleGoogleSignIn} variant="outline" size="icon">
        <IconBrandGoogleFilled className="w-6 h-6" />
      </Button>
      <Button onClick={handleGithubSignIn} variant="outline" size="icon">
        <IconBrandGithub className="w-6 h-6" />
      </Button>
    </div>
  );
}
