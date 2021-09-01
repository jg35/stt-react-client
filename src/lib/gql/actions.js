import { gql } from "@apollo/client";
import { versionFragment } from "./_fragments";

export const ACTION_DELETE_USER = gql`
  mutation {
    action_stt_delete_user {
      deleteAt
      error
    }
  }
`;

export const ACTION_SYNC_USER = gql`
  mutation ($data: SyncUserInput!) {
    action_sync_user(data: $data) {
      synced
    }
  }
`;

export const ACTION_CHECK_HANDLE_AVAILABILITY = gql`
  mutation ($handle: String!) {
    action_stt_handle_availability(handle: $handle) {
      available
      message
    }
  }
`;

export const ACTION_REGENERATE_TOKEN = gql`
  mutation ($id: Int!) {
    action_stt_regenerate_token(id: $id) {
      id
      token
    }
  }
`;

export const ACTION_PUBLISH_VERSION = gql`
  mutation ($userId: String!) {
    action_stt_publish_version(userId: $userId) {
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
  mutation ($paths: String!) {
    action_s3_get_signed_url(paths: $paths) {
      expires
      objectPath
      signedUrl
    }
  }
`;

export const ACTION_STRIPE_FETCH_PRICES = gql`
  query ($appId: String!) {
    action_subscriptions_get_prices(appId: $appId) {
      id
      interval
      amount
    }
  }
`;

export const ACTION_VIEW_OLD_VERSION = gql`
  mutation ($versionId: Int!) {
    action_stt_view_old_version(versionId: $versionId) {
      version
    }
  }
`;
