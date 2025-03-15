import { gql } from "@apollo/client";

const automationSetupOperations = {
  Mutations: {
    SaveAutomationStep: gql`
      mutation Mutation($input: SaveAutomationStepInput!) {
        saveAutomationStep(input: $input) {
          success
        }
      }
    `,
  },
};

enum ListenerEnum {
  MESSAGE = "MESSAGE",
  SMARTAI = "SMARTAI",
  // Add other listener types as needed
}

enum TriggerEnum {
  MESSAGE = "DM",
  COMMENT = "COMMENT",
  // Add other trigger types as needed
}

interface AutomationStep {
  id: string;
  automationId: string;
  prompt?: string;
  commentReply?: string;
  listener: ListenerEnum;
  type: TriggerEnum;
  word: string;
}

export { automationSetupOperations };
export type { AutomationStep };
