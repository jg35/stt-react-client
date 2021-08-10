import { gql } from "@apollo/client";

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
      versions {
        id
      }
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
