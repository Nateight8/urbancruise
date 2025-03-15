import { gql } from "@apollo/client";
import { Trigger } from "./trigger";
import { keyword } from "./keywords";
import { Listener } from "./listener";

const automationOperations = {
  Queries: {
    ListUserAutomations: gql`
      query ListAutomations {
        listAutomations {
          id
        }
      }
    `,

    GetAutomation: gql`
      query GetAutomation($getAutomationId: ID!) {
        getAutomation(id: $getAutomationId) {
          name
          trigger {
            type
            id
          }

          keywords {
            id
            word
          }

          listener {
            commentReply
            prompt
            listener
            id
          }
        }
      }
    `,
  },

  Mutations: {
    CreateAutomation: gql`
      mutation CreateAutomation($userId: ID!) {
        createAutomation(userId: $userId) {
          id
        }
      }
    `,

    UpdateAutomation: gql`
      mutation UpdateAutomation($automationId: ID!, $name: String!) {
        updateAutomation(id: $automationId, name: $name) {
          message
          success
        }
      }
    `,
  },
};

interface AutomationProps {
  id: string;
  name: string;
  active: boolean;
  createdAt: Date;
}

interface ListUserAutomations {
  listAutomations: AutomationProps[];
}

interface GetAutomation {
  getAutomation: {
    name: string;
    trigger: Trigger;
    keywords: keyword[];
    listener: Listener;
  };
}

interface UpdateAutomation {}

export default automationOperations;
export type { ListUserAutomations, AutomationProps, GetAutomation };
