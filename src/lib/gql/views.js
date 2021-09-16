import { gql } from "@apollo/client";
import {
  userFragment,
  versionFragment,
  eventFragment,
  fragmentFragment,
  questionFragment,
} from "~/lib/gql/_fragments";

export const FETCH_TIMELINE_VIEW = gql`
  ${userFragment}
  ${eventFragment}
  ${fragmentFragment}
  ${questionFragment}
  ${versionFragment}
  query FetchTimelineView($userId: String!) {
    stt_worldEvent(order_by: { date: asc, id: asc }) {
      id
      title
      date
      country
    }
    stt_userEvent(
      order_by: { date: asc }
      where: { userId: { _eq: $userId } }
    ) {
      ...eventFragment
    }
    stt_fragment(where: { userId: { _eq: $userId } }) {
      ...fragmentFragment
    }
    stt_user_by_pk(id: $userId) {
      ...userFragment
    }
    stt_question {
      ...questionFragment
    }
    stt_version(
      where: { userId: { _eq: $userId }, _and: { generated: { _eq: false } } }
    ) {
      ...versionFragment
    }
  }
`;

// TODO - cache theme in storage, until it's fetched from the other view
export const FETCH_EDIT_VIEW = gql`
  ${fragmentFragment}
  ${versionFragment}
  query FetchEditView($userId: String!) {
    stt_fragment(where: { userId: { _eq: $userId } }) {
      ...fragmentFragment
    }
    stt_version(
      where: { userId: { _eq: $userId }, _and: { generated: { _eq: false } } }
    ) {
      ...versionFragment
    }
  }
`;

export const FETCH_SHARE_VIEW = gql`
  ${versionFragment}
  query FetchShareView($userId: String!) {
    stt_version(where: { userId: { _eq: $userId } }) {
      ...versionFragment
    }
  }
`;

export const FETCH_PUBLISH_VIEW = gql`
  ${versionFragment}
  query FetchPublishView($userId: String!) {
    stt_version(where: { userId: { _eq: $userId } }, order_by: { id: desc }) {
      ...versionFragment
    }
  }
`;

export const FETCH_CREATE_BOOK_VIEW = gql`
  ${versionFragment}
  query FetchCreateBookView($userId: String!) {
    stt_version(
      where: { generated: { _eq: false }, userId: { _eq: $userId } }
      order_by: { id: desc }
      limit: 1
    ) {
      ...versionFragment
    }
  }
`;
