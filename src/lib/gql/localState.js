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
