import merge from "lodash.merge";
import userResolvers from "./user.js";
import { conversationResolvers } from "./conversation.js";
import { participantsResolvers } from "./participants.js";

// import listenersResolvers from "./listeners.js";

const resolvers = merge(
  {},
  userResolvers,
  conversationResolvers,
  participantsResolvers
);

export default resolvers;
