import { useQuery } from "@apollo/client";
import userOperations, {
  GetLoggedInUserResponse,
} from "@/graphql/operations/user-operations";

export function useCachedUser() {
  const { data } = useQuery<GetLoggedInUserResponse>(
    userOperations.Querries.getLoggedInUser,
    {
      fetchPolicy: "cache-first",
    }
  );

  return data?.getLoggedInUser?.user;
}
