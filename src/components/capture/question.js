import { useEffect, useState } from "react";
import { Button, Title, FormInput } from "~/components/_styled";
import Svg from "~/components/svg";
import QuestionMenu from "~/components/capture/questionMenu";
import QuestionSelectButton from "~/components/capture/questionSelectButton";
import QuestionSelectModal from "~/components/capture/questionSelectModal";
export default function Question({
  questionOptions,
  hideQuestion,
  hideQuestionTag,
  openQuestionModal,
}) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionSetId, setQuestionSetId] = useState(2);
  const [questionAnswer, setQuestionAnswer] = useState("");
  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const [shuffleIndex, setShuffleIndex] = useState(0);

  function getQuestionSet() {
    return (
      questionOptions && questionOptions.find((o) => o.id === questionSetId)
    );
  }

  useEffect(() => {
    const questionSet = getQuestionSet();
    if (!questionSet.shuffleOrder.length) {
      // change the category
      questionOptions.forEach((questionSet) => {
        console.log(questionSet);
        if (questionSet.shuffleOrder.length) {
          setQuestionSetId(questionSet.id);
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
      !questionSet ||
      // Question was hidden or category was changed
      !questionSet.questions.find((q) => q.id === currentQuestion.id)
    ) {
      shuffleQuestion();
    }
  }, [currentQuestion, questionOptions, questionSetId]);

  function shuffleQuestion() {
    const questionSet = getQuestionSet();
    // After hiding questions or tags there may not be any questions left
    let newShuffleIndex = shuffleIndex + 1;
    if (newShuffleIndex >= questionSet.shuffleOrder.length) {
      newShuffleIndex = 0;
    }
    setCurrentQuestion(
      questionSet.questions.find(
        (q) => q.id === questionSet.shuffleOrder[newShuffleIndex]
      )
    );
    setShuffleIndex(newShuffleIndex);
  }

  function hideQuestionHandler() {
    hideQuestion(currentQuestion.id);
  }

  function hideTagHandler() {
    const tag = currentQuestion.tags[0];
    hideQuestionTag(tag);
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <div
      id="question-panel"
      className="border-2 border-lightBlack rounded pr-1 py-2 pl-3"
    >
      <div className="flex items-start">
        <div className="w-full">
          <Title css="mb-0 w-11/12">{currentQuestion.title}</Title>
        </div>
        <div className="flex items-center justify-end">
          <div id="shuffle-button-wrapper">
            <Button
              variant="minimal"
              size="compact"
              onClick={() => shuffleQuestion()}
            >
              <Svg name="shuffle" size={20}></Svg>
            </Button>
          </div>
          {/* <QuestionMenu hideQuestion={hideQuestionHandler} /> */}
        </div>
      </div>
      <div className="flex items-center">
        <FormInput
          id="form-question-text-input"
          style={{
            paddingLeft: 0,
            backgroundColor: "transparent",
            paddingBottom: 0,
          }}
          variant="question"
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
          css="bg-white p-0 truncate js-question-text-input"
          placeholder="Start answering here..."
        />
        <QuestionSelectButton
          questionSet={getQuestionSet()}
          toggle={() => setSelectModalOpen(!selectModalOpen)}
        />
        <QuestionSelectModal
          close={() => setSelectModalOpen(false)}
          isOpen={selectModalOpen}
          questionSet={getQuestionSet()}
          questionOptions={questionOptions}
          selectQuestionSet={(id) => {
            setQuestionSetId(id);
          }}
          // TODO toggle instead of hide
          hideQuestion={hideQuestion}
        />
      </div>
    </div>
  );
}
