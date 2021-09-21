import React, { useEffect, useState, useContext } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { uniq, shuffle } from "lodash";
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
      variables: { userId: user.id },
    }
  );

  const [updateUser] = useMutation(UPDATE_USER);
  const [questionOptions, setQuestionOptions] = useState(null);

  function calcQuestionStartAge({ startAge, startDate, endDate }) {
    // We get the age of user on a given set of dates to get
    // the question into the right category
    if (startDate || endDate) {
      const ageOnDate = getAgeFromDate(
        data.stt_user_by_pk.dob,
        startDate,
        endDate
      );
      // If user was not born when event happened, set startAge so it is hidden
      return ageOnDate >= 0 ? ageOnDate : 9999;
    }
    return startAge;
  }

  useEffect(() => {
    if (init && !data) {
      getCaptureHeader();
    }
  }, [init]);

  const questionCategories = [
    {
      name: "Early memories",
      startAge: 0,
    },
    {
      name: "Childhood",
      startAge: 5,
    },
    {
      name: "Teenage years",
      startAge: 13,
    },
    {
      name: "Twenties",
      startAge: 20,
    },
    {
      name: "Thirties",
      startAge: 30,
    },
    {
      name: "Middle years",
      startAge: 40,
    },
    {
      name: "Older years",
      startAge: 65,
    },
  ];

  useEffect(() => {
    if (data) {
      const userAge = getAge(data.stt_user_by_pk.dob);
      const questionsAnswered = uniq(
        data.stt_fragment.filter((f) => !!f.questionId).map((f) => f.questionId)
      );
      const questions = data.stt_question
        .map((q) => ({ ...q, startAge: calcQuestionStartAge(q) }))
        .filter(
          (q) =>
            !data.stt_user_by_pk.hiddenQuestions.includes(q.id) &&
            userAge >= q.startAge &&
            !questionsAnswered.includes(q.id)
        );
      setQuestionOptions(
        questionCategories.reduce(
          (categories, category, i) => {
            const categoryQuestions = questions.filter(
              (q) =>
                q.startAge >= category.startAge &&
                (i + 1 === questionCategories.length ||
                  q.startAge < questionCategories[i + 1].startAge)
            );
            const renderCategory = {
              name: category.name,
              count: categoryQuestions.length,
              questions: categoryQuestions,
              shuffleOrder: shuffle(categoryQuestions.map((q) => q.id)),
            };
            if (renderCategory.questions.length) {
              categories[category.name] = renderCategory;
            }
            return categories;
          },
          {
            All: {
              name: "All",
              count: questions.length,
              questions: [...questions],
              shuffleOrder: shuffle(questions.map((q) => q.id)),
            },
          }
        )
      );
    }
  }, [data]);

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
          {(uiState.questionVisible || window.innerWidth >= 768) &&
            questionOptions && (
              <Question
                questionOptions={questionOptions}
                hideQuestion={(questionId) =>
                  updateUser({
                    variables: {
                      data: {
                        hiddenQuestions:
                          data.stt_user_by_pk.hiddenQuestions.concat(
                            questionId
                          ),
                      },
                      userId: user.id,
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
                        ...getSmartDate(
                          question,
                          data.stt_user_by_pk.dob,
                          true
                        ),
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
      </Card>
    );
  }
  return (
    <div className="bg-white rounded pt-4 pb-2 px-4 shadow">
      <CaptureHeaderSkeleton />
    </div>
  );
}
