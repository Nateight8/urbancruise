// "use client";
// import { IconMessageCircle } from "@tabler/icons-react";
// import { Button } from "../ui/button";

// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
// import { User } from "@/graphql/operations/user-operations";
// import { useRouter } from "next/navigation";

// export function UrbanUser({ user }: { user: User }) {
//   const router = useRouter();
//   console.log("user", user.loggedInUserId);
//   return (
//     <div>
//       <div className="mb-4">
//         <Avatar className="size-20">
//           <AvatarImage src="/images/pfp/pfp.jpeg" />
//           <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
//         </Avatar>
//         <p>{user.username}</p>
//       </div>
//       <div className="">
//         <Button
//           variant="muted"
//           size="icon"
//           className="rounded-full"
//           onClick={() =>
//             router.push(`/messages/${user.loggedInUserId}-${user.id}`)
//           }
//         >
//           <IconMessageCircle size={16} />
//         </Button>
//       </div>
//     </div>
//   );
// }
