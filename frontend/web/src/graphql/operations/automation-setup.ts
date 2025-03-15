import { gql } from "@apollo/client";

const automationSetupOperations = {
  Mutations: {
    CreateAutomationSetup: gql`
      mutation CreateAutomationSetup(
        $automationId: ID!
        $2: ListenerEnum!
        $type: TriggerEnum!
        $keywords: [String]
        $prompt: String
      ) {
        createAutomationSetup(
          automationId: $automationId
          listener: $listener
          type: $type
          keywords: $keywords
          prompt: $prompt
        ) {
          keyword {
            word
          }
          listener {
            listener
            prompt
          }
          trigger {
            type
          }
        }
      }
    `,
  },
};

interface CreateAutomationSetupResponse {
  automationId: string;
  listener: string;
  prompt: string;
  commentReply: string;
}

export default automationSetupOperations;
export type { CreateAutomationSetupResponse };
