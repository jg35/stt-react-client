import React, { useEffect, useState, useContext } from "react";
import { useLazyQuery } from "@apollo/client";
import { uniq } from "lodash";
import { SECTION_FETCH_CAPTURE_HEADER } from "~/lib/gql";
import Button from "~/components/button";
import ButtonGroup from "~/components/buttonGroup";
import Svg from "~/components/svg";
import TagSelect from "~/components/capture/tagSelect";
import CaptureHeaderSkeleton from "~/components/capture/captureHeaderSkeleton";
import { AuthContext } from "~/components/authWrap";
import { UIContext } from "~/app";
import {
  makeCreateFragmentForm,
  makeCreateUserEventForm,
} from "~/lib/uiManager";

export default function CaptureHeader({ init }) {
  const {
    authState: { user },
  } = useContext(AuthContext);
  const { updateUiState } = useContext(UIContext);
  const [getCaptureHeader, { loading, data }] = useLazyQuery(
    SECTION_FETCH_CAPTURE_HEADER,
    {
      variables: { userId: user.id },
    }
  );
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [tagOptions, setTagOptions] = useState([]);
  const [questionOptions, setQuestionOptions] = useState([]);
  const [questionTagCategory, setQuestionTagCategory] = useState("all");
  const [questionAnswer, setQuestionAnswer] = useState("");
  const [questionsAnswered, setQuestionsAnswered] = useState();

  useEffect(() => {
    if (init && !data) {
      getCaptureHeader();
    }
  }, [init]);

  useEffect(() => {
    if (data) {
      const questionsAnswered = uniq(
        data.stt_fragment.filter((f) => !!f.questionId).map((f) => f.questionId)
      );
      const options = data.stt_question.filter(
        (q) =>
          // Has already answered question
          !questionsAnswered.includes(q.id) &&
          // Matches current tag category
          (questionTagCategory === "all" || q.tag === questionTagCategory)
      );
      setQuestionsAnswered(questionsAnswered);
      setQuestionOptions(options);
    }
  }, [questionTagCategory, data]);

  useEffect(() => {
    if (
      currentQuestion &&
      !questionOptions.find((q) => q.id === currentQuestion.id)
    ) {
      shuffleQuestion();
    } else if (!currentQuestion) {
      shuffleQuestion();
    }
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

  if (data) {
    return (
      <>
        <div
          id="question-panel"
          className="w-full h-full bg-white  rounded p-4 border-2 shadow"
        >
          {currentQuestion && (
            <>
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-xl">{currentQuestion.title}</h1>
                {questionOptions.length > 1 && (
                  <div id="shuffle-button-wrapper">
                    <Button
                      variant="minimal"
                      size="compact"
                      onClick={() => shuffleQuestion()}
                    >
                      <Svg name="shuffle" width="20" height="20"></Svg>
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center">
                <input
                  id="form-question-text-input"
                  value={questionAnswer}
                  onChange={(e) => {
                    setQuestionAnswer(e.target.value);
                    if (e.target.value.length > 15) {
                      updateUiState(
                        makeCreateFragmentForm(
                          {
                            type: "TEXT",
                            content: e.target.value,
                            questionId: currentQuestion.id,
                          },
                          { revealAfterCreate: true }
                        ),
                        false
                      );
                      setTimeout(() => {
                        setQuestionAnswer("");
                      }, 500);
                    }
                  }}
                  className="input bg-white p-0 text-lg js-question-text-input"
                  style={{ maxWidth: "none" }}
                  placeholder={currentQuestion.placeholder}
                />
                <TagSelect
                  currentTag={questionTagCategory}
                  tagOptions={tagOptions}
                  selectTag={setQuestionTagCategory}
                  minimal
                />
              </div>
            </>
          )}
        </div>

        <ButtonGroup>
          <Button
            css="font-medium px-4 w-24 h-full"
            onClick={() =>
              updateUiState(
                makeCreateUserEventForm({}, { revealAfterCreate: true }),
                false
              )
            }
          >
            Add event
          </Button>
          <Button
            css="font-medium px-4 w-24 h-full"
            onClick={() =>
              updateUiState(
                makeCreateFragmentForm(
                  {
                    type: "TEXT",
                  },
                  { revealAfterCreate: true }
                ),
                false
              )
            }
          >
            Add memory
          </Button>
          <Button
            css="font-medium px-4 w-24 h-full"
            onClick={() =>
              updateUiState(
                makeCreateFragmentForm(
                  {
                    type: "PHOTO",
                  },
                  { revealAfterCreate: true }
                ),
                false
              )
            }
          >
            Add photo
          </Button>
        </ButtonGroup>
      </>
    );
  }
  return <CaptureHeaderSkeleton />;
}
