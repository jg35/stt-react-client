import { gql } from "@apollo/client";

export const FETCH_VERSION = gql`
  query ($versionId: Int!) {
    stt_version_by_pk(id: $versionId) {
      author
      coverUrl
      generated
      id
      privacyStatus
      publishedAt
      publishedPath
      theme
      title
      userId
    }
  }
`;

export const UPDATE_VERSION = gql`
  mutation ($id: Int!, $data: stt_version_set_input) {
    update_stt_version_by_pk(pk_columns: { id: $id }, _set: $data) {
      author
      coverUrl
      generated
      id
      privacyStatus
      publishedAt
      theme
      title
      userId
    }
  }
`;

export const DELETE_VERSION = gql`
  mutation ($id: Int!) {
    delete_stt_version_by_pk(id: $id) {
      id
    }
  }
`;
