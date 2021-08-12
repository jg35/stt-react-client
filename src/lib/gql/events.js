import { gql } from "@apollo/client";

export const INSERT_USER_EVENT = gql`
  mutation ($data: stt_userEvent_insert_input!) {
    insert_stt_userEvent_one(object: $data) {
      id
      title
      date
      createdAt
      updatedAt
      userId
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
