import merge from "lodash.merge";
import userResolvers from "./user.js";

// import listenersResolvers from "./listeners.js";

const resolvers = merge({}, userResolvers);

export default resolvers;
