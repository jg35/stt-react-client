import { gql } from "@apollo/client";

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
