import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRoundIcon } from "lucide-react";
import AccountRemovalButton from "./account-removal-button";
import { useMutation } from "@apollo/client";
import userOperations from "@/graphql/operations/user-operations";
import { useRouter } from "next/navigation";
import { useCachedUser } from "@/hooks/use-cached-user";

export default function Preview({
  onUsernameEdit,
  displayName,
  onDisplayNameClick,
  onBioClick,
}: {
  onUsernameEdit: () => void;
  displayName?: string;
  onDisplayNameClick: () => void;
  onBioClick: () => void;
}) {
  const router = useRouter();

  const [deleteAccount] = useMutation(userOperations.Mutations.deleteAccount, {
    onCompleted: () => {
      router.push("/");
    },
  });

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const cachedUser = useCachedUser();

  console.log("cachedUser", cachedUser);

  return (
    <div className="flex-1 px-6">
      <h1 className="text-sm font-bold pb-4">Preview</h1>
      <div className="border shadow-black/40 hover:shadow-lg hover:cursor-pointer shadow-md bg-muted/30 rounded-md p-4 py-6 max-w-xs flex flex-col justify-center items-center gap-4">
        <Avatar className="size-14">
          <AvatarImage src={cachedUser?.image} />
          <AvatarFallback>
            <UserRoundIcon className="size-4" />
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col text-center">
          <button
            className="text-2xl text-primary/80 hover:text-primary font-bold hover:cursor-pointer"
            onClick={onDisplayNameClick}
          >
            {displayName || cachedUser?.name}
          </button>
          <button
            onClick={onUsernameEdit}
            className="text-sm text-muted-foreground hover:text-primary hover:cursor-pointer"
          >
            @{cachedUser?.username}
          </button>
        </div>

        <button
          onClick={onBioClick}
          className="text-xs text-center hover:text-primary transition-colors"
        >
          {cachedUser?.bio || "Empty bio makes you look boring..."}
        </button>
      </div>

      {/* Account Removal Section */}
      <div className="mt-10 max-w-xs">
        <h2 className="text-base font-semibold mb-1">Account Removal</h2>
        <p className="text-muted-foreground text-sm max-w-md mb-6">
          Disabling your account means you can recover it at any time after
          taking this action.
        </p>
        <div className="flex gap-4">
          <AccountRemovalButton
            disabled={true}
            type="disable"
            action={() => {
              console.log("Account disabled");
            }}
          />
          <AccountRemovalButton type="delete" action={handleDeleteAccount} />
        </div>
      </div>
    </div>
  );
}
