import { useApolloClient } from "@apollo/client";
import userOperations, {
  GetLoggedInUserResponse,
} from "@/graphql/operations/user-operations";

export function useCachedUser() {
  const client = useApolloClient();

  // Read the data from cache
  const cachedData = client.readQuery<GetLoggedInUserResponse>({
    query: userOperations.Querries.getLoggedInUser,
  });

  return cachedData?.getLoggedInUser?.user;
}
