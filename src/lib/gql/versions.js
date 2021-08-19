import { gql } from "@apollo/client";
import { versionFragment } from "~/lib/gql/_fragments";
export const FETCH_VERSION = gql`
  ${versionFragment}
  query ($versionId: Int!) {
    stt_version_by_pk(id: $versionId) {
      ...versionFragment
    }
  }
`;

export const UPDATE_VERSION = gql`
  ${versionFragment}
  mutation ($id: Int!, $data: stt_version_set_input) {
    update_stt_version_by_pk(pk_columns: { id: $id }, _set: $data) {
      ...versionFragment
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
