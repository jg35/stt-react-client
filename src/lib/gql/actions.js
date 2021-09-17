import { gql } from "@apollo/client";
export const ACTION_DELETE_USER = gql`
  mutation ActionDeleteUser {
    action_stt_delete_user {
      deleteAt
      error
    }
  }
`;

export const ACTION_SYNC_USER = gql`
  mutation ActionSyncUser($data: SyncUserInput!) {
    action_sync_user(data: $data) {
      synced
    }
  }
`;

export const ACTION_CHECK_HANDLE_AVAILABILITY = gql`
  mutation ActionCheckHandleAvailability($handle: String!) {
    action_stt_handle_availability(handle: $handle) {
      available
      message
    }
  }
`;

export const ACTION_GENERATE_TOKEN = gql`
  mutation ActionGenerateToken($email: String!) {
    action_stt_generate_token(email: $email) {
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

export const ACTION_PUBLISH_VERSION = gql`
  mutation ActionPublishVersion($data: PublishVersionInput!) {
    action_stt_publish_version(data: $data) {
      nextVersionId
      version {
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
  }
`;

export const ACTION_S3_GET_SIGNED_URL = gql`
  mutation ActionS3GetSignedUrl($paths: String!) {
    action_s3_get_signed_url(paths: $paths) {
      expires
      objectPath
      signedUrl
    }
  }
`;

export const ACTION_STRIPE_FETCH_PRICES = gql`
  query ActionStripeFetchPrices($appId: String!) {
    action_subscriptions_get_prices(appId: $appId) {
      id
      interval
      amount
    }
  }
`;

export const ACTION_VIEW_OLD_VERSION = gql`
  mutation ActionViewOldVersion($versionId: Int!) {
    action_stt_view_old_version(versionId: $versionId) {
      version
    }
  }
`;
