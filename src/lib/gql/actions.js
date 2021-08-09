import { gql } from "@apollo/client";

export const ACTION_SYNC_USER = gql`
  mutation ($data: SyncUserInput!) {
    action_sync_user(data: $data) {
      synced
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
    action_stt_ACTION_PUBLISH_VERSION(userId: $userId) {
      generated
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
