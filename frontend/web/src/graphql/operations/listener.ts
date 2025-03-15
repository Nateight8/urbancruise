import { gql } from "@apollo/client";

const listenerOperations = {
  Mutations: {
    createListener: gql`
      mutation CreateListener(
        $automationId: ID!
        $listener: ListenerType!
        $prompt: String
        $commentReply: String
      ) {
        createListener(
          automationId: $automationId
          listener: $listener
          prompt: $prompt
          commentReply: $commentReply
        ) {
          message
          success
        }
      }
    `,
  },
};

interface Listener {
  automationId: string;
  listener: "SMARTAI" | "MESSAGE";
  prompt?: string;
  commentReply?: string;
}

export default listenerOperations;
export type { Listener };
