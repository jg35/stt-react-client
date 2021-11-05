import { useState, useEffect } from "react";
import Modal from "~/components/modal";
import { sortBy } from "lodash";
import QuestionSetCard from "~/components/capture/questionSetCard";
import { Title } from "~/components/_styled";

function QuestionSetRow({ sets, title, selectQuestionSet }) {
  return (
    <div className="mt-4">
      <Title css="mb-0" size="compact">
        {title}
      </Title>

      <div className="flex whitespace-nowrap overflow-x-scroll">
        {sets.map((set, i) => (
          <QuestionSetCard
            key={i}
            set={set}
            selectQuestionSet={selectQuestionSet}
          />
        ))}
      </div>
    </div>
  );
}

export default function QuestionSelectModal({
  close,
  isOpen,
  questionOptions,
  selectQuestionSet,
}) {
  const [questionSetGroups, setQuestionSetGroups] = useState([]);

  function selectHandler(setId) {
    selectQuestionSet(setId);
    close();
  }

  useEffect(() => {
    const groups = questionOptions.reduce((groups, questionSet) => {
      const ref = questionSet.category?.toLowerCase().replace(/\s/g, "-");
      if (ref && !groups[ref]) {
        groups[ref] = [questionSet];
      } else if (groups[ref]) {
        groups[ref] = sortBy(groups[ref].concat(questionSet), "order");
      }
      return groups;
    }, {});
    setQuestionSetGroups(groups);
  }, [questionOptions]);
  if (!isOpen) {
    return null;
  }

  return (
    <Modal close={close} isOpen={isOpen} size="full">
      <Title>Select a question pack to start answering questions</Title>
      <div className="shadow-inner py-4 px-4 bg-lightestGray rounded-b -mx-6 -mb-6">
        <QuestionSetRow
          sets={questionSetGroups["about-you"]}
          title="1. About you and your family"
          selectQuestionSet={selectHandler}
          key={1}
        />
        <QuestionSetRow
          sets={questionSetGroups["life-stages"]}
          title="2. Stages of your life"
          selectQuestionSet={selectHandler}
          key={2}
        />
        <QuestionSetRow
          sets={questionSetGroups["education"]}
          title="3. Education"
          selectQuestionSet={selectHandler}
          key={3}
        />
        {/* TODO change to adulthood */}
        <QuestionSetRow
          sets={questionSetGroups["adulthood"]}
          title="4. Adulthood"
          selectQuestionSet={selectHandler}
          key={4}
        />
        <QuestionSetRow
          sets={questionSetGroups["life"]}
          title="5. Life"
          selectQuestionSet={selectHandler}
          key={5}
        />
        <QuestionSetRow
          sets={questionSetGroups["advice-&-reflection"]}
          title="6. Advice & Reflection"
          selectQuestionSet={selectHandler}
          key={6}
        />
      </div>
    </Modal>
  );
}
