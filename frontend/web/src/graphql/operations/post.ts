import { gql } from "@apollo/client";

const postOperations = {
  Querries: {
    getSocialPosts: gql`
      query GetPosts {
        getSocialPosts {
          id
          postid
          caption
          media
          mediaType
          automationId
        }
      }
    `,
  },

  // Mutations: {
  //   createPost: gql`
  //     mutation CreatePostMutation($title: String, $username: String) {
  //       createPost(title: $title, username: $username) {
  //         id
  //         title
  //         username
  //       }
  //     }
  //   `,
  // },
};

// Define the Post interface
interface SocialPost {
  id: string;
  postid: string;
  caption: string | null;
  media: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM"; // Adjust based on possible media types
  automationId: string;
  __typename: "Post";
}

// Define the structure for the query response
interface GetPostsData {
  getSocialPosts: SocialPost[];
}

export default postOperations;
export type { GetPostsData, SocialPost };
