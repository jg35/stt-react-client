import { gql } from "@apollo/client";
import { accessTokenFragment } from "~/lib/gql/_fragments";

export const FETCH_PRIVATE_ACCESS_TOKENS = gql`
  ${accessTokenFragment}
  query ($userId: String!) {
    stt_accessToken(
      where: { userId: { _eq: $userId }, _and: { email: { _is_null: false } } }
    ) {
      ...accessTokenFragment
    }
  }
`;

export const INSERT_ACCESS_TOKEN = gql`
  ${accessTokenFragment}
  mutation ($data: stt_accessToken_insert_input!) {
    insert_stt_accessToken_one(object: $data) {
      ...accessTokenFragment
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
