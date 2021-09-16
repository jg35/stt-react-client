import { gql } from "@apollo/client";
import {
  userFragment,
  questionFragment,
  fragmentFragment,
  versionFragment,
  accessTokenFragment,
} from "~/lib/gql/_fragments";

// Identical to timeline query, enables access to partial timeline
// data without prop drilling
export const SECTION_FETCH_CAPTURE_HEADER = gql`
  ${fragmentFragment}
  ${questionFragment}
  query SectionFetchCaptureHeader($userId: String!) {
    stt_question {
      ...questionFragment
    }
    stt_fragment(where: { userId: { _eq: $userId } }) {
      ...fragmentFragment
    }
  }
`;

export const SECTION_FETCH_PRIVACY_SETTINGS = gql`
  ${userFragment}
  ${accessTokenFragment}
  ${versionFragment}
  query SectionFetchPrivacySettings($userId: String!) {
    stt_version(
      where: { userId: { _eq: $userId }, _and: { generated: { _eq: true } } }
      order_by: { id: desc }
      limit: 1
    ) {
      ...versionFragment
    }
    stt_accessToken(where: { userId: { _eq: $userId } }) {
      ...accessTokenFragment
    }
    stt_user(where: { id: { _eq: $userId } }) {
      ...userFragment
    }
  }
`;

export const SECTION_UPDATE_PRIVACY_SETTINGS = gql`
  ${userFragment}
  mutation SectionUpdatePrivacySettings(
    $userId: String!
    $privacyStatus: String!
    $publicHandle: String
  ) {
    update_stt_user_by_pk(
      pk_columns: { id: $userId }
      _set: { publicHandle: $publicHandle }
    ) {
      ...userFragment
    }
    update_stt_version(
      where: { userId: { _eq: $userId } }
      _set: { privacyStatus: $privacyStatus }
    ) {
      returning {
        id
        privacyStatus
      }
    }
  }
`;
