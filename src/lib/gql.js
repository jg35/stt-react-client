import { gql } from "@apollo/client";

export const FETCH_LOCAL_AUTH_STATE = gql`
  query {
    authState @client
  }
`;

export const FETCH_TIMELINE = gql`
  query {
    stt_worldEvent {
      id
      title
      date
      country
    }
    stt_user {
      location
      dob
      fragments {
        id
        content
        date
        dateType
        type
        mediaUrl
        mediaCaption
        questionId
        sortDate
        hidden
        complete
        tag
        createdAt
        updatedAt
      }
      events {
        title
        date
        createdAt
      }
      versions {
        id
        fragmentOrder
      }
    }
  }
`;

export const UPDATE_FRAGMENT = gql`
  mutation ($id: Int!, $data: stt_fragment_set_input) {
    update_stt_fragment_by_pk(pk_columns: { id: $id }, _set: $data) {
      id
    }
  }
`;

export const UPDATE_VERSION = gql`
  mutation ($id: Int!, $data: stt_version_set_input) {
    update_stt_version_by_pk(pk_columns: { id: $id }, _set: $data) {
      id
      fragmentOrder
    }
  }
`;
