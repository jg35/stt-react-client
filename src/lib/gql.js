import { gql } from "@apollo/client";

export const FETCH_LOCAL_AUTH_STATE = gql`
  query {
    authState @client
  }
`;

export const FETCH_LOCAL_UI_STATE = gql`
  query {
    uiState @client
  }
`;

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
      edited
    }
  }
`;

export const FETCH_PUBLISH_VIEW = gql`
  query ($userId: String!) {
    stt_version(
      where: { generated: { _eq: true }, userId: { _eq: $userId } }
      order_by: { id: desc }
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
      edited
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
      edited
    }
  }
`;

export const FETCH_VERSION = gql`
  query ($versionId: Int!) {
    stt_version_by_pk(id: $versionId) {
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
      edited
    }
  }
`;

export const FETCH_CAPTURE_HEADER = gql`
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

export const FETCH_QUESTIONS = gql`
  query {
    stt_question {
      id
      title
      placeholder
      tag
    }
  }
`;

export const FETCH_USER = gql`
  query ($userId: String!) {
    stt_user_by_pk(id: $userId) {
      id
      location
      dob
      onboarding
      trialExpiresDate
      stripeCustomerId
      subscriptionStatus
      subscriptionMeta
      publicHandle
    }
  }
`;

export const INSERT_FRAGMENT = gql`
  mutation ($data: stt_fragment_insert_input!) {
    insert_stt_fragment_one(object: $data) {
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

export const UPDATE_USER = gql`
  mutation ($userId: String!, $data: stt_user_set_input) {
    update_stt_user_by_pk(pk_columns: { id: $userId }, _set: $data) {
      location
      dob
      onboarding
      publicHandle
    }
  }
`;

export const UPDATE_FRAGMENT = gql`
  mutation ($id: Int!, $data: stt_fragment_set_input) {
    update_stt_fragment_by_pk(pk_columns: { id: $id }, _set: $data) {
      id
      hidden
      title
      content
      date
      dateType
      mediaUrl
      mediaCaption
      tag
      questionId
    }
  }
`;

export const DELETE_FRAGMENT = gql`
  mutation ($id: Int!) {
    delete_stt_fragment_by_pk(id: $id) {
      id
    }
  }
`;

export const DELETE_VERSION = gql`
  mutation ($id: Int!) {
    delete_stt_version_by_pk(id: $id) {
      id
    }
  }
`;

export const INSERT_USER_EVENT = gql`
  mutation ($data: stt_userEvent_insert_input!) {
    insert_stt_userEvent_one(object: $data) {
      id
      title
      date
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_USER_EVENT = gql`
  mutation ($id: Int!, $data: stt_userEvent_set_input) {
    update_stt_userEvent_by_pk(pk_columns: { id: $id }, _set: $data) {
      id
      title
      date
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_USER_EVENT = gql`
  mutation ($id: Int!) {
    delete_stt_userEvent_by_pk(id: $id) {
      id
    }
  }
`;

export const UPDATE_VERSION = gql`
  mutation ($id: Int!, $data: stt_version_set_input) {
    update_stt_version_by_pk(pk_columns: { id: $id }, _set: $data) {
      id
      theme
      title
      author
      publishedAt
      coverUrl
      edited
    }
  }
`;

export const UPDATE_PRIVACY_SETTINGS = gql`
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

export const PUBLISH_VERSION = gql`
  mutation ($userId: String!) {
    stt_version_generate_book(userId: $userId) {
      generated
    }
  }
`;

export const GENERATE_COVER = gql`
  mutation ($userId: String!) {
    stt_version_generate_cover(userId: $userId) {
      generated
      coverUrl
    }
  }
`;

export const S3_GET_SIGNED_URL = gql`
  mutation ($paths: String!) {
    s3_signed_get_url(paths: $paths) {
      expires
      objectPath
      signedUrl
    }
  }
`;

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

export const STRIPE_FETCH_PRICES = gql`
  query ($appId: String!) {
    subscriptions_get_prices(appId: $appId) {
      id
      interval
      amount
    }
  }
`;

export const ACTION_SYNC_USER = gql`
  mutation ($data: SyncUserInput!) {
    sync_user(data: $data) {
      synced
    }
  }
`;

export const FETCH_PRIVATE_ACCESS_TOKENS = gql`
  query ($userId: String!) {
    stt_accessToken(
      where: { userId: { _eq: $userId }, _and: { email: { _is_null: false } } }
    ) {
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

export const MANGE_PRIVACY_SETTINGS_VIEW = gql`
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

export const INSERT_ACCESS_TOKEN = gql`
  mutation ($data: stt_accessToken_insert_input!) {
    insert_stt_accessToken_one(object: $data) {
      id
      email
      token
      userId
      createdAt
      updatedAt
      type
    }
  }
`;

export const DELETE_ACCESS_TOKEN = gql`
  mutation ($id: Int!) {
    delete_stt_accessToken_by_pk(id: $id) {
      id
    }
  }
`;
