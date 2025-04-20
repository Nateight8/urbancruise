import { useQuery } from "@apollo/client";
import userOperations, {
  GetAllUsersResponse,
} from "@/graphql/operations/user-operations";

import { UrbanUser } from "../user/urban-user";

export default function Feeds() {
  const { data } = useQuery<GetAllUsersResponse>(
    userOperations.Querries.getAllUsers
  );

  console.log("data", data);

  return (
    <div>
      {data?.getAllUsers.map((user) => (
        <UrbanUser key={user.id} user={user} />
      ))}
      {/* <button
        onClick={() => signOut()}
        className="bg-primary text-white px-4 py-2 rounded-md"
      >
        Sign Out
      </button> */}
    </div>
  );
}
