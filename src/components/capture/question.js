import { useEffect, useState } from "react";
import { Button, Title, FormInput, Grid } from "~/components/_styled";
import Svg from "~/components/svg";
import QuestionCategorySelect from "~/components/capture/questionCategorySelect";
import QuestionMenu from "~/components/capture/questionMenu";

export default function Question({
  questionOptions,
  hideQuestion,
  hideQuestionTag,
  openQuestionModal,
}) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionCategory, setQuestionCategory] = useState("First memories");
  const [questionAnswer, setQuestionAnswer] = useState("");
  const [shuffleIndex, setShuffleIndex] = useState(0);

  useEffect(() => {
    if (!questionOptions[questionCategory]) {
      // change the category
      Object.keys(questionOptions).forEach((categoryKey) => {
        if (questionOptions[categoryKey].questions.length) {
          setQuestionCategory(categoryKey);
          setShuffleIndex(0);
          setCurrentQuestion(null);
          return;
        }
      });
    }

    if (
      // No question is set
      !currentQuestion ||
      // There are no questions for the current category
      !questionOptions[questionCategory] ||
      // Question was hidden or category was changed
      !questionOptions[questionCategory].questions.find(
        (q) => q.id === currentQuestion.id
      )
    ) {
      shuffleQuestion();
    }
  }, [currentQuestion, questionOptions, questionCategory]);

  function shuffleQuestion() {
    // After hiding questions or tags there may not be any questions left
    let newShuffleIndex = shuffleIndex + 1;
    if (newShuffleIndex >= questionOptions[questionCategory].questions.length) {
      newShuffleIndex = 0;
    }
    setCurrentQuestion(
      questionOptions[questionCategory].questions.find(
        (q) =>
          q.id ===
          questionOptions[questionCategory].shuffleOrder[newShuffleIndex]
      )
    );
    setShuffleIndex(newShuffleIndex);
  }

  function hideQuestionHandler() {
    // // Get number of questions
    // const categoryQuestionCount = questionOptions[
    //   questionCategory
    // ].questions.filter((q) => q.id !== currentQuestion.id);

    // // If current category no longer has any questions, reset question category
    // if (!categoryQuestionCount.length) {
    //   setQuestionCategory("All");
    // }
    hideQuestion(currentQuestion.id);
  }

  function hideTagHandler() {
    const tag = currentQuestion.tags[0];
    // const categoryQuestionCount = questionOptions[
    //   questionCategory
    // ].questions.filter((q) => q.tags.includes(tag));
    // // If current category no longer has any questions, reset question category
    // if (!categoryQuestionCount.length) {
    //   setQuestionCategory("All");
    // }
    hideQuestionTag(tag);
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <div
      id="question-panel"
      className="bg-white rounded px-2 pt-2 border-2 shadow pl-3"
    >
      <div className="flex justify-between items-start">
        <Title css="mb-0 w-4/5 ">{currentQuestion.title}</Title>

        <div className="flex items-center">
          {currentQuestion.tags.length && (
            <span
              id="question-tag"
              className="hidden md:block text-darkGray font-medium px-2 py-1 bg-lightestGray rounded-md flex items-center justify-center whitespace-nowrap mr-2"
            >
              #{currentQuestion.tags[0].replace(/\s/g, "-")}
            </span>
          )}

          <div id="shuffle-button-wrapper">
            <Button
              variant="minimal"
              size="compact"
              onClick={() => shuffleQuestion()}
            >
              <Svg name="shuffle" size={20}></Svg>
            </Button>
          </div>
          <QuestionMenu
            currentTag={currentQuestion.tags[0]}
            hideTag={hideTagHandler}
            hideQuestion={hideQuestionHandler}
          />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <FormInput
          id="form-question-text-input"
          style={{ paddingLeft: 0 }}
          value={questionAnswer}
          handleChange={(e) => {
            setQuestionAnswer(e.target.value);
            if (e.target.value.length > 15) {
              openQuestionModal(e.target.value, currentQuestion);
              setTimeout(() => {
                setQuestionAnswer("");
              }, 500);
            }
          }}
          css="bg-white w-3/4 p-0 truncate js-question-text-input"
          placeholder="Start writing here..."
        />
        <QuestionCategorySelect
          currentCategory={questionOptions[questionCategory]}
          categoryOptions={questionOptions}
          selectCategory={(category) => {
            setQuestionCategory(category);
            setShuffleIndex(0);
          }}
        />
      </div>
    </div>
  );
}
