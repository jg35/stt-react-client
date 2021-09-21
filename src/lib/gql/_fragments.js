import { gql } from "@apollo/client";

export const userFragment = gql`
  fragment userFragment on stt_user {
    id
    location
    dob
    onboarding
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
    hidden
    tag
    createdAt
    updatedAt
    isSmartDate
    smartDateConfidence
    smartDateReason
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
    tags
    startAge
    endAge
    startDate
    endDate
  }
`;
