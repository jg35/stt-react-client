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

function CaptureHeaderActionButton({ action, icon, type }) {
  return (
    <Button
      css="px-4 font-medium md:h-full flex-col justify-around md:justify-center h-14 md:flex-row"
      onClick={action}
    >
      <Svg name={icon} css="md:hidden " width={18} height={18} />
      <span className="text-sm md:text-base ">
        <span className="hidden md:block">
          Add
          <br />
        </span>
        {type}
      </span>
    </Button>
  );
}

export default function CaptureHeader({ init }) {
  const {
    authState: { user },
  } = useContext(AuthContext);
  const { updateUiState, uiState } = useContext(UIContext);
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
      const tagOptions = [
        {
          tag: "all",
          questionCount: data.stt_question.length,
          answeredCount: questionsAnswered.length,
        },
      ];
      // if (questionTagCategory !== "all") {
      //   tagOptions.push({
      //     tag: "all",
      //     questionCount: data.stt_question.length,
      //     answeredCount: questionsAnswered.length,
      //   });
      // }
      setTagOptions(
        data.stt_question
          .filter((q) => !questionsAnswered.includes(q.id))
          .reduce((tags, q) => {
            if (!tags.find((option) => option.tag === q.tag)) {
              const tagQuestions = data.stt_question.filter(
                (x) => x.tag === q.tag
              );
              tags.push({
                tag: q.tag,
                questionCount: tagQuestions.length,
                answeredCount: tagQuestions.filter((q) =>
                  questionsAnswered.includes(q.id)
                ).length,
              });
            }
            return tags;
          }, tagOptions)
          .filter((x) => x !== null)
      );
    }
  }, [currentQuestion]);

  if (data && currentQuestion) {
    return (
      <Card css="p-2 md:p-4">
        <Grid
          gap="gap-y-2 md:gap-4"
          colSpan={[
            "col-span-12 md:col-span-7 lg:col-span-8 xl:col-span-9",
            "col-span-12 md:col-span-5 lg:col-span-4 xl:col-span-3",
          ]}
        >
          {uiState.questionVisible && (
            <div
              id="question-panel"
              className="animate-fade-in bg-white rounded px-2 pt-2 border-2 shadow pl-3"
            >
              <div className="flex justify-between items-center">
                <Title css="mb-0 w-4/5 ">{currentQuestion.title}</Title>

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
                  style={{ paddingLeft: 0 }}
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
                  placeholder="Start writing here..."
                />
                <TagSelect
                  currentQuestionTag={currentQuestion.tag}
                  currentTag={tagOptions.find(
                    (t) => t.tag === questionTagCategory
                  )}
                  tagOptions={tagOptions}
                  selectTag={setQuestionTagCategory}
                  minimal
                />
              </div>
            </div>
          )}

          <Grid
            colSpan={["col-span-3 md:col-span-4"]}
            height="h-full"
            gap="gap-x-2 md:gap-x-4"
          >
            {window.innerWidth < 768 && (
              <Button
                css={`font-medium px-4 h-14 justify-around flex-col ${
                  uiState.questionVisible &&
                  "shadow bg-darkGray hover:bg-darkGray hover:border-darkGray border-darkGray text-white"
                } `}
                onClick={() =>
                  updateUiState(
                    { questionVisible: !uiState.questionVisible },
                    false
                  )
                }
              >
                <Svg
                  name="question"
                  css="md:hidden"
                  color={uiState.questionVisible && "#ffffff"}
                  width={18}
                  height={18}
                />
                <span className="text-sm md:text-base">Questions</span>
              </Button>
            )}
            <CaptureHeaderActionButton
              icon="calendar"
              type="Event"
              action={() =>
                updateUiState(
                  makeCreateUserEventForm({}, { revealAfterCreate: true }),
                  false
                )
              }
            />

            <CaptureHeaderActionButton
              icon="writing"
              type="Memory"
              action={() =>
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
            />

            <CaptureHeaderActionButton
              icon="photo"
              type="Photo"
              action={() =>
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
            />
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
