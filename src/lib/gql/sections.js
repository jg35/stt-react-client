import { gql } from "@apollo/client";

// Identical to timeline query, enables access to partial timeline
// data without prop drilling
export const SECTION_FETCH_CAPTURE_HEADER = gql`
  query ($userId: String!) {
    stt_question {
      id
      title
      placeholder
      tag
    }
    stt_fragment(where: { userId: { _eq: $userId } }) {
      id
      title
      content
      date
      dateType
      type
      mediaUrl
      mediaCaption
      questionId
      hidden
      tag
      createdAt
      updatedAt
    }
  }
`;

export const SECTION_FETCH_PRIVACY_SETTINGS = gql`
  query ($userId: String!) {
    stt_version(
      where: { userId: { _eq: $userId } }
      order_by: { id: desc }
      limit: 1
    ) {
      privacyStatus
    }
    stt_accessToken(where: { userId: { _eq: $userId } }) {
      id
      token
      email
      userId
      createdAt
      updatedAt
      type
    }
  }
`;

export const SECTION_UPDATE_PRIVACY_SETTINGS = gql`
  mutation (
    $userId: String!
    $privacyStatus: String!
    $savedTokenIds: [Int!]
    $newTokens: [stt_accessToken_insert_input!]!
  ) {
    update_stt_version(
      where: { userId: { _eq: $userId } }
      _set: { privacyStatus: $privacyStatus }
    ) {
      affected_rows
    }
    delete_stt_accessToken(
      where: {
        id: { _nin: $savedTokenIds }
        _and: { type: { _eq: "PRIVATE" } }
      }
    ) {
      affected_rows
    }
    insert_stt_accessToken(objects: $newTokens) {
      affected_rows
    }
  }
`;
