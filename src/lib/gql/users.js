import { gql } from "@apollo/client";
import { userFragment } from "~/lib/gql/_fragments";

export const FETCH_USER = gql`
  ${userFragment}
  query FetchUser($userId: String!) {
    stt_user_by_pk(id: $userId) {
      ...userFragment
    }
  }
`;

export const UPDATE_USER = gql`
  ${userFragment}
  mutation UpdateUser($userId: String!, $data: stt_user_set_input) {
    update_stt_user_by_pk(pk_columns: { id: $userId }, _set: $data) {
      ...userFragment
    }
  }
`;
