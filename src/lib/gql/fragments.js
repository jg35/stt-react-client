import { gql } from "@apollo/client";
import { fragmentFragment } from "~/lib/gql/_fragments";

export const INSERT_FRAGMENT = gql`
  ${fragmentFragment}
  mutation InsertFragment($data: stt_fragment_insert_input!) {
    insert_stt_fragment_one(object: $data) {
      ...fragmentFragment
    }
  }
`;

export const UPDATE_FRAGMENT = gql`
  ${fragmentFragment}
  mutation UpdateFragment($id: Int!, $data: stt_fragment_set_input) {
    update_stt_fragment_by_pk(pk_columns: { id: $id }, _set: $data) {
      ...fragmentFragment
    }
  }
`;

export const DELETE_FRAGMENT = gql`
  mutation DeleteFragment($id: Int!) {
    delete_stt_fragment_by_pk(id: $id) {
      id
    }
  }
`;
