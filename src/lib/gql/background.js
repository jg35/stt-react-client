import { gql } from "@apollo/client";

// All background requests (i.e. in hooks etc)

export const FETCH_IMAGES = gql`
  query ($userId: String!) {
    stt_fragment(where: { userId: { _eq: $userId } }) {
      mediaUrl
      type
    }
    stt_version(where: { userId: { _eq: $userId } }) {
      coverUrl
      theme
    }
  }
`;
