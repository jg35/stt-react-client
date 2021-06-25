import { gql } from "@apollo/client";

export const FETCH_LOCAL_AUTH_STATE = gql`
  query {
    authState @client
  }
`;

export const FETCH_LOCAL_UI_STATE = gql`
  query {
    uiState @client
  }
`;

export const FETCH_TIMELINE = gql`
  query {
    stt_worldEvent(order_by: { date: asc, id: asc }) {
      id
      title
      date
      country
    }
    stt_userEvent(order_by: { date: asc, id: asc }) {
      id
      title
      date
    }
    stt_fragment {
      id
      content
      date
      dateType
      type
      mediaUrl
      mediaCaption
      questionId
      hidden
      complete
      tag
      createdAt
      updatedAt
    }
    stt_user {
      location
      dob
    }
  }
`;

export const INSERT_FRAGMENT = gql`
  mutation ($data: stt_fragment_insert_input!) {
    insert_stt_fragment_one(object: $data) {
      id
      content
      date
      dateType
      type
      mediaUrl
      mediaCaption
      questionId
      hidden
      complete
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
      content
      date
      dateType
      mediaUrl
      mediaCaption
      tag
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

export const INSERT_USER_EVENT = gql`
  mutation ($data: stt_userEvent_insert_input!) {
    insert_stt_userEvent_one(object: $data) {
      id
      title
      date
      createdAt
      updatedAt
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

export const UPDATE_VERSION = gql`
  mutation ($id: Int!, $data: stt_version_set_input) {
    update_stt_version_by_pk(pk_columns: { id: $id }, _set: $data) {
      id
    }
  }
`;

export const FETCH_QUESTIONS = gql`
  query {
    stt_question {
      id
      title
      placeholder
      tag
    }
  }
`;
