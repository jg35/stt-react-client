import { gql } from "@apollo/client";

export const INSERT_FRAGMENT = gql`
  mutation ($data: stt_fragment_insert_input!) {
    insert_stt_fragment_one(object: $data) {
      id
      title
      content
      date
      dateType
      type
      mediaUrl
      mediaCaption
      questionId
      hidden
      tag
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_FRAGMENT = gql`
  mutation ($id: Int!, $data: stt_fragment_set_input) {
    update_stt_fragment_by_pk(pk_columns: { id: $id }, _set: $data) {
      id
      hidden
      title
      content
      date
      dateType
      mediaUrl
      mediaCaption
      tag
      questionId
    }
  }
`;

export const DELETE_FRAGMENT = gql`
  mutation ($id: Int!) {
    delete_stt_fragment_by_pk(id: $id) {
      id
    }
  }
`;
