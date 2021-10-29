import React, { useEffect, useState, useContext } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { uniq, shuffle, cloneDeep } from "lodash";
import { SECTION_FETCH_CAPTURE_HEADER, UPDATE_USER } from "~/lib/gql";
import { Card, Grid } from "~/components/_styled";
import { getAge, getAgeFromDate, getSmartDate } from "~/lib/util";
import CaptureHeaderSkeleton from "~/components/capture/captureHeaderSkeleton";
import { AuthContext } from "~/components/authWrap";
import { UIContext } from "~/app";
import { makeCreateFragmentForm } from "~/lib/uiManager";
import Question from "~/components/capture/question";
import CaptureHeaderActions from "~/components/capture/captureHeaderActions";
export default function CaptureHeader({ init }) {
  const {
    authState: { user },
  } = useContext(AuthContext);
  const { updateUiState, uiState } = useContext(UIContext);
  const [getCaptureHeader, { loading, data }] = useLazyQuery(
    SECTION_FETCH_CAPTURE_HEADER,
    {
      variables: { userId: user.uid },
    }
  );

  const [updateUser] = useMutation(UPDATE_USER);
  const [questionOptions, setQuestionOptions] = useState(null);

  useEffect(() => {
    if (init && !data) {
      getCaptureHeader();
    }
  }, [init]);

  useEffect(() => {
    if (data) {
      const userAge = getAge(data.stt_user_by_pk.dob);
      const questionsAnswered = uniq(
        data.stt_fragment.filter((f) => f.questionId).map((f) => f.questionId)
      );
      setQuestionOptions(
        cloneDeep(data.stt_questionSet).map((questionSet) => {
          const questions = questionSet.questions
            // Filter questions that did not happen in lifetime
            .filter((q) => {
              if (q.ageExact) {
                return userAge >= q.suggestedAge;
              } else if (q.startDate) {
                const livingOnStartDate =
                  getAgeFromDate(data.stt_user_by_pk.dob, q.startDate) >= 0;
                const livingOnEndDate =
                  q.endDate &&
                  getAgeFromDate(data.stt_user_by_pk.dob, q.endDate) >= 0;
                return livingOnStartDate || livingOnEndDate;
              }
              return true;
            })
            // Mark questions that have been answered
            .map((q) => {
              q.answered = questionsAnswered.includes(q.id);
              q.hidden = data.stt_user_by_pk.hiddenQuestions.ids.includes(q.id);
              return q;
            });
          return {
            ...questionSet,
            count: questions.length,
            shuffleOrder: shuffle(
              questions.filter((q) => !q.answered && !q.hidden).map((q) => q.id)
            ),
            questions,
          };
        })
      );
    }
  }, [data]);

  if (questionOptions) {
    return (
      <div className="px-3 py-3 bg-white">
        <Grid
          gap="gap-y-2 md:gap-4"
          colSpan={[
            "col-span-12 lg:col-span-8 xl:col-span-9",
            "col-span-12 lg:col-span-4 xl:col-span-3",
          ]}
        >
          {(uiState.questionVisible || window.innerWidth >= 768) &&
            questionOptions && (
              <Question
                questionOptions={questionOptions}
                hideQuestion={(questionId) =>
                  updateUser({
                    variables: {
                      data: {
                        hiddenQuestions: {
                          ...data.stt_user_by_pk.hiddenQuestions,
                          ids: data.stt_user_by_pk.hiddenQuestions.ids.concat(
                            questionId
                          ),
                        },
                      },
                      userId: user.uid,
                    },
                  })
                }
                openQuestionModal={(answerValue, question) => {
                  updateUiState(
                    makeCreateFragmentForm(
                      {
                        type: "TEXT",
                        content: answerValue,
                        questionId: question.id,
                        ...getSmartDate(question, data.stt_user_by_pk.dob),
                      },
                      { revealAfterCreate: true }
                    ),
                    false
                  );
                }}
              />
            )}
          <CaptureHeaderActions />
        </Grid>
      </div>
    );
  }
  return (
    <div className="bg-white rounded pt-4 pb-2 px-4 shadow">
      <CaptureHeaderSkeleton />
    </div>
  );
}
