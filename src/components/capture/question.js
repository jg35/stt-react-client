import { useEffect, useState } from "react";
import { Button, Title, FormInput } from "~/components/_styled";
import Svg from "~/components/svg";
import QuestionCategorySelect from "~/components/capture/questionCategorySelect";
import QuestionMenu from "~/components/capture/questionMenu";

export default function Question({
  questionOptions,
  hideQuestion,
  openQuestionModal,
}) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionCategory, setQuestionCategory] = useState("All");
  const [questionAnswer, setQuestionAnswer] = useState("");
  const [shuffleIndex, setShuffleIndex] = useState(0);

  useEffect(() => {
    if (
      // No question is set
      !currentQuestion ||
      // Question was hidden or category was changed
      !questionOptions[questionCategory].questions.find(
        (q) => q.id === currentQuestion.id
      )
    ) {
      shuffleQuestion();
    }
  }, [currentQuestion, questionOptions, questionCategory]);

  function shuffleQuestion() {
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
    // Get number of questions
    const categoryQuestionCount = questionOptions[
      questionCategory
    ].questions.filter((q) => q.id !== currentQuestion.id);

    // If current category no longer has any questions, reset question category
    if (!categoryQuestionCount.length) {
      setQuestionCategory("All");
    }
    hideQuestion(currentQuestion.id);
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

        <div className="flex">
          {/* <span className="rounded bg-lightGray text-darkGray flex items-center py-1 px-2 capitalize text-sm font-medium">
            parenthood
          </span> */}
          {/* TODO - show menu, with "Don't show this question again", "Don't show me questions with 'parenthood' category" */}

          <div id="shuffle-button-wrapper">
            <Button
              variant="minimal"
              size="compact"
              onClick={() => shuffleQuestion()}
            >
              <Svg name="shuffle" size={20}></Svg>
            </Button>
          </div>
          <QuestionMenu hideQuestion={hideQuestionHandler} />
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
