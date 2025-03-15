import { gql } from "@apollo/client";

const triggerOperations = {
  Mutations: {
    createTrigger: gql`
      mutation CreateTrigger($type: TriggerEnum!, $automationId: ID!) {
        createTrigger(type: $type, automationId: $automationId) {
          message
          success
        }
      }
    `,
  },
};

enum TriggerEnum {
  DM = "DM",
  COMMENT = "COMMENT",
}

interface Trigger {
  id: string;
  type: TriggerEnum;
}

export default triggerOperations;
export type { Trigger };
