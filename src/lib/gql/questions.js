import { gql } from "@apollo/client";
import { questionFragment } from "~/lib/gql/_fragments";

export const FETCH_QUESTIONS = gql`
  ${questionFragment}
  query FetchQuestions {
    stt_questionSet(where: { category: { _is_null: false } }) {
      id
      title
      description
      category
      order
      imageUrl
      questions {
        ...questionFragment
      }
    }
  }
`;
