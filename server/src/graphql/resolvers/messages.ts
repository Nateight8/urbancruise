import { eq, and, sql, desc } from "drizzle-orm";
import * as schema from "../../db/schema/index.js";
import { messages } from "../../db/schema/conversation.js";
import type GraphqlContext from "../../types/types.utils.js";
import { GraphQLError } from "../utils.js";
import { withFilter } from "graphql-subscriptions";

// ... existing code ...
