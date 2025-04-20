import { useQuery } from "@apollo/client";
import User from "./user";
import userOperations, {
  GetAllUsersResponse,
} from "@/graphql/operations/user-operations";

export default function Feeds() {
  const { data } = useQuery<GetAllUsersResponse>(
    userOperations.Querries.getAllUsers
  );

  return (
    <div>
      {data?.getAllUsers.users.map((user) => (
        <User key={user.id} user={user} />
      ))}
    </div>
  );
}
