import { gql } from "@apollo/client";

export const userFragment = gql`
  fragment userFragment on stt_user {
    id
    location
    dob
    trialExpiresDate
    stripeCustomerId
    subscriptionStatus
    subscriptionMeta
    publicHandle
    bookOnline
    publishedVersion
    hiddenQuestions
    deleteAt
    versions {
      id
    }
    notifications {
      id
      ref
      type
      clearable
      clearedAt
      completedAt
      createdAt
      updatedAt
    }
  }
`;

export const notificationFragment = gql`
  fragment notificationFragment on stt_notification {
    id
    userId
    ref
    type
    clearable
    clearedAt
    completedAt
    createdAt
    updatedAt
  }
`;

export const eventFragment = gql`
  fragment eventFragment on stt_userEvent {
    id
    title
    date
    createdAt
    updatedAt
    userId
    smartDate
  }
`;

export const fragmentFragment = gql`
  fragment fragmentFragment on stt_fragment {
    id
    content
    date
    order
    type
    mediaUrl
    mediaCaption
    questionId
    question {
      title
    }
    hidden
    tag
    createdAt
    updatedAt
    smartDate
  }
`;

export const versionFragment = gql`
  fragment versionFragment on stt_version {
    author
    coverUrl
    generated
    id
    privacyStatus
    publishedAt
    publishedPath
    theme
    title
    userId
    version
  }
`;

export const accessTokenFragment = gql`
  fragment accessTokenFragment on stt_accessToken {
    id
    token
    email
    userId
    createdAt
    updatedAt
    type
  }
`;

export const questionFragment = gql`
  fragment questionFragment on stt_question {
    id
    title
    suggestedAge
    ageExact
    startDate
    endDate
  }
`;
