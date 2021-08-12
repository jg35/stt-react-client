import { gql } from "@apollo/client";

export const FETCH_TIMELINE_VIEW = gql`
  query ($userId: String!) {
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
      id
      title
      date
      createdAt
      updatedAt
      userId
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
    stt_user_by_pk(id: $userId) {
      id
      location
      dob
      onboarding
      publicHandle
      deleteAt
    }
    stt_question {
      id
      title
      placeholder
      tag
    }
    stt_version(
      where: { userId: { _eq: $userId }, _and: { generated: { _eq: false } } }
    ) {
      id
      theme
      coverUrl
    }
  }
`;

// TODO - cache theme in storage, until it's fetched from the other view
export const FETCH_EDIT_VIEW = gql`
  query ($userId: String!) {
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
    stt_version(
      where: { userId: { _eq: $userId }, _and: { generated: { _eq: false } } }
    ) {
      id
      theme
      coverUrl
    }
  }
`;

export const FETCH_SHARE_VIEW = gql`
  query ($userId: String!) {
    stt_version(where: { userId: { _eq: $userId } }) {
      id
      theme
      title
      author
      coverUrl
      publishedAt
      publishedPath
      publishedFormats
      privacyStatus
      generated
      userId
    }
  }
`;

export const FETCH_PUBLISH_VIEW = gql`
  query ($userId: String!) {
    stt_version(where: { userId: { _eq: $userId } }, order_by: { id: desc }) {
      id
      theme
      title
      author
      coverUrl
      publishedAt
      publishedPath
      publishedFormats
      privacyStatus
      generated
      userId
    }
  }
`;

export const FETCH_CREATE_BOOK_VIEW = gql`
  query ($userId: String!) {
    stt_version(
      where: { generated: { _eq: false }, userId: { _eq: $userId } }
      order_by: { id: desc }
      limit: 1
    ) {
      id
      theme
      title
      author
      coverUrl
      publishedAt
      publishedPath
      publishedFormats
      privacyStatus
      generated
      userId
    }
  }
`;
