import React, { useEffect, useState, useContext } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { uniq, shuffle } from "lodash";
import { SECTION_FETCH_CAPTURE_HEADER, UPDATE_USER } from "~/lib/gql";
import { Card, Grid } from "~/components/_styled";
import { getAge, getAgeFromDate, getSmartDate } from "~/lib/util";
import { AGE_RANGES } from "~/lib/constants";

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

  function calcQuestionStartAge({ startAge, startDate, endDate, title }) {
    // We get the age of user on a given set of dates to get
    // the question into the right category
    if (startDate || endDate) {
      const ageOnDate = getAgeFromDate(
        data.stt_user_by_pk.dob,
        startDate,
        endDate
      );
      console.log(`ageOnDate (${title}): ${ageOnDate}`);
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

  // What did you most like about school (min: 4, max: 17)
  // Should be in childhood / teenage years
  function isWithinCategory(startAge, endAge, catStartAge, catEndAge) {
    // Nothing specific so goes into "All" category
    if (startAge === 0 && endAge === null) {
      return false;
    }

    if (!endAge && catEndAge) {
      return startAge >= catStartAge && startAge <= catEndAge;
    } else if (!endAge && !catEndAge) {
      return startAge >= catStartAge;
    }

    const INTERSECTS = startAge <= catStartAge && endAge >= catEndAge;
    const MATCH = startAge >= catStartAge && endAge <= catEndAge;

    return INTERSECTS || MATCH;
  }

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
            !data.stt_user_by_pk.hiddenQuestions.ids.includes(q.id) &&
            !data.stt_user_by_pk.hiddenQuestions.tags.includes(q.tags[0]) &&
            userAge >= q.startAge &&
            !questionsAnswered.includes(q.id)
        );

      const matchedQuestionIds = [];
      const categoryQuestions = AGE_RANGES.reduce((categories, category, i) => {
        const categoryQuestions = questions.filter((q) => {
          const IS_IN_CATEGORY_BOUNDS = isWithinCategory(
            q.startAge,
            q.endAge,
            category.startAge,
            category.endAge
          );

          if (IS_IN_CATEGORY_BOUNDS) {
            matchedQuestionIds.push(q.id);
          }

          return IS_IN_CATEGORY_BOUNDS;
        });
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
      }, {});

      const questionsWithoutCategory = questions.filter(
        (q) => !matchedQuestionIds.includes(q.id)
      );

      if (questionsWithoutCategory.length) {
        categoryQuestions["Other"] = {
          name: "Other",
          count: questionsWithoutCategory.length,
          questions: [...questionsWithoutCategory],
          shuffleOrder: shuffle(questionsWithoutCategory.map((q) => q.id)),
        };
      }

      console.log(categoryQuestions);

      setQuestionOptions(categoryQuestions);
    }
  }, [data]);

  if (data) {
    return (
      <Card css="p-2 md:p-4">
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
                hideQuestionTag={(tag) =>
                  updateUser({
                    variables: {
                      data: {
                        hiddenQuestions: {
                          ...data.stt_user_by_pk.hiddenQuestions,
                          tags: data.stt_user_by_pk.hiddenQuestions.tags.concat(
                            tag
                          ),
                        },
                      },
                      userId: user.id,
                    },
                  })
                }
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
