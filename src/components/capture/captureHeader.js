import React, { useEffect, useState, useContext } from "react";
import { useLazyQuery } from "@apollo/client";
import { uniq } from "lodash";
import { SECTION_FETCH_CAPTURE_HEADER } from "~/lib/gql";
import {
  Button,
  ButtonGroup,
  Card,
  Title,
  FormInput,
  Grid,
} from "~/components/_styled";
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
  const [questionVisible, setQuestionVisible] = useState(
    window.innerWidth >= 768
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
      <Card css="p-2 md:p-4">
        <Grid
          gap="gap-y-2 md:gap-4"
          colSpan={[
            "col-span-12 md:col-span-7 lg:col-span-8 xl:col-span-9",
            "col-span-12 md:col-span-5 lg:col-span-4 xl:col-span-3",
          ]}
        >
          {questionVisible && currentQuestion && (
            <div
              id="question-panel"
              className="animate-fade-in bg-white rounded p-2 border-2 shadow md:pl-3"
            >
              <div className="flex justify-between items-center mb-2 h-10">
                <Title css="mb-0 w-4/5 truncate">{currentQuestion.title}</Title>
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
                <FormInput
                  id="form-question-text-input"
                  value={questionAnswer}
                  handleChange={(e) => {
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
                  css="bg-white w-3/4 p-0 truncate js-question-text-input"
                  placeholder={currentQuestion.placeholder}
                />
                <TagSelect
                  currentTag={questionTagCategory}
                  tagOptions={tagOptions}
                  selectTag={setQuestionTagCategory}
                  minimal
                />
              </div>
            </div>
          )}

          <Grid colSpan={["col-span-3 md:col-span-4"]} height="h-full">
            {window.innerWidth < 768 && (
              <Button
                css="font-medium px-4"
                onClick={() => setQuestionVisible(!questionVisible)}
              >
                <Svg name="question" css="md:hidden" width={18} height={18} />
              </Button>
            )}
            <Button
              css="font-medium px-4 md:h-full"
              onClick={() =>
                updateUiState(
                  makeCreateUserEventForm({}, { revealAfterCreate: true }),
                  false
                )
              }
            >
              <Svg name="calendar" css="md:hidden " width={18} height={18} />
              <span className="hidden md:block">
                Add
                <br />
                event
              </span>
            </Button>
            <Button
              css="font-medium px-4 md:h-full"
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
              <Svg name="writing" css="md:hidden" width={18} height={18} />
              <span className="hidden md:block">
                Add <br />
                memory
              </span>
            </Button>
            <Button
              css="font-medium px-4 md:h-full"
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
              <Svg name="photo" css="md:hidden" width={18} height={18} />
              <span className="hidden md:block">
                Add <br />
                photo
              </span>
            </Button>
          </Grid>
        </Grid>
      </Card>
    );
  }
  return (
    <div className="animate-fade-in bg-white rounded pt-4 pb-2 px-4 shadow">
      <CaptureHeaderSkeleton />
    </div>
  );
}
