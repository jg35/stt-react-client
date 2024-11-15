import { gql } from "@apollo/client";
import { accessTokenFragment } from "~/lib/gql/_fragments";

export const FETCH_PRIVATE_ACCESS_TOKENS = gql`
  ${accessTokenFragment}
  query FetchPrivateAccessTokens($userId: String!) {
    stt_accessToken(
      where: { userId: { _eq: $userId }, _and: { email: { _is_null: false } } }
    ) {
      ...accessTokenFragment
    }
  }
`;

export const DELETE_ACCESS_TOKEN = gql`
  mutation DeleteAccessToken($id: Int!) {
    delete_stt_accessToken_by_pk(id: $id) {
      id
    }
  }
`;
