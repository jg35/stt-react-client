import { gql } from "@apollo/client";
import { eventFragment } from "~/lib/gql/_fragments";

export const INSERT_USER_EVENT = gql`
  ${eventFragment}
  mutation InsertUserEvent($data: stt_userEvent_insert_input!) {
    insert_stt_userEvent_one(object: $data) {
      ...eventFragment
    }
  }
`;

export const UPDATE_USER_EVENT = gql`
  ${eventFragment}
  mutation UpdateUserEvent($id: Int!, $data: stt_userEvent_set_input) {
    update_stt_userEvent_by_pk(pk_columns: { id: $id }, _set: $data) {
      ...eventFragment
    }
  }
`;

export const DELETE_USER_EVENT = gql`
  mutation DeleteUserEvent($id: Int!) {
    delete_stt_userEvent_by_pk(id: $id) {
      id
    }
  }
`;
