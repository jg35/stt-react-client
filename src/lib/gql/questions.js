import { gql } from "@apollo/client";

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
