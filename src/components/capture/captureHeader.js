import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { uniq } from "lodash";
import { FETCH_QUESTIONS } from "../../lib/gql";
import {
  showCreateFragmentForm,
  showCreateUserEventForm,
} from "../../lib/apollo";
import colors from "../../lib/colors";
import Button from "../button";
import Svg from "../svg";
import Menu from "../menu";

export default function CaptureHeader({ questionsAnswered }) {
  const { data } = useQuery(FETCH_QUESTIONS);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [tagOptions, setTagOptions] = useState([]);
  const [questionOptions, setQuestionOptions] = useState([]);
  const [questionTagCategory, setQuestionTagCategory] = useState("all");
  const [questionAnswer, setQuestionAnswer] = useState("");

  useEffect(() => {
    if (data) {
      const options = data.stt_question.filter(
        (q) =>
          // Has already answered question
          !questionsAnswered.includes(q.id) &&
          // Matches current tag category
          (questionTagCategory === "all" || q.tag === questionTagCategory)
      );
      setQuestionOptions(options);
    }
  }, [questionTagCategory, data]);

  useEffect(() => {
    shuffleQuestion();
  }, [questionOptions]);

  function shuffleQuestion() {
    let newQuestion =
      questionOptions[Math.floor(Math.random() * questionOptions.length)];
    if (questionOptions.length > 1 && currentQuestion) {
      while (currentQuestion.id === newQuestion.id) {
        newQuestion =
          questionOptions[Math.floor(Math.random() * questionOptions.length)];
      }
    }

    setCurrentQuestion(newQuestion);
  }

  useEffect(() => {
    if (currentQuestion) {
      setTagOptions(
        uniq(
          data.stt_question
            .filter((q) => !questionsAnswered.includes(q.id))
            .reduce(
              (tags, q) => {
                if (q.tag !== questionTagCategory) {
                  tags.push(q.tag);
                }
                return tags;
              },
              [questionTagCategory !== "all" ? "all" : null]
            )
            .filter((x) => x !== null)
        )
      );
    }
  }, [currentQuestion]);

  function TagSelectOption({ tag }) {
    return (
      <div
        className="text-right uppercase w-full"
        onClick={() => setQuestionTagCategory(tag)}
      >
        {tag}
      </div>
    );
  }

  if (currentQuestion) {
    return (
      <>
        <div className="w-full h-full bg-white  rounded p-4 border shadow">
          <div className="flex justify-between items-center">
            <h1 className="text-xl">{currentQuestion.title}</h1>
            {questionOptions.length > 1 && (
              <Button minimal onClick={() => shuffleQuestion()}>
                <Svg name="shuffle" width="20" height="20"></Svg>
              </Button>
            )}
          </div>
          <div className="flex justify-between items-center">
            <input
              value={questionAnswer}
              onChange={(e) => {
                setQuestionAnswer(e.target.value);
                if (e.target.value.length > 15) {
                  showCreateFragmentForm({
                    type: "TEXT",
                    content: e.target.value,
                    questionId: currentQuestion.id,
                  });
                  setTimeout(() => {
                    setQuestionAnswer("");
                    shuffleQuestion();
                  }, 500);
                }
              }}
              className="input bg-white pl-0 text-lg pb-0"
              style={{ maxWidth: "none" }}
              placeholder={currentQuestion.placeholder}
            />
            <Menu
              toggle={
                <div className="block uppercase font-medium flex text-gray">
                  <span className="whitespace-nowrap ">
                    {questionTagCategory}
                  </span>
                  <Svg
                    name="chevron"
                    rotate={90}
                    width="14"
                    height="14"
                    css="ml-1"
                    color={colors.gray}
                  />
                </div>
              }
              sections={[
                tagOptions.map((t, i) => <TagSelectOption tag={t} key={i} />),
              ]}
            />
          </div>
        </div>
        <div className="flex">
          <Button
            css="ml-3 items-center font-medium px-4 w-24"
            onClick={() => showCreateUserEventForm()}
          >
            Add event
          </Button>
          <Button
            css="ml-3 items-center font-medium px-4 w-24"
            onClick={() => showCreateFragmentForm({ type: "TEXT" })}
          >
            Add memory
          </Button>
          <Button
            css="ml-3 items-center font-medium px-4 w-24"
            onClick={() => showCreateFragmentForm({ type: "PHOTO" })}
          >
            Add photo
          </Button>
        </div>
      </>
    );
  }
  return null;
}
