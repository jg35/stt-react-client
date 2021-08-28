import React, { useEffect } from "react";

import Menu from "~/components/menu";
import Svg from "~/components/svg";
import colors from "~/lib/colors";
import { Button } from "~/components/_styled";

function TagSelectOption({ tag, selectTag }) {
  return (
    <Button
      variant="minimal"
      size="compact"
      css="justify-end capitalize items-center"
      onClick={() => selectTag(tag.tag)}
    >
      {tag.tag}
      <span className="text-sm text-gray">
        &nbsp;({tag.questionCount - tag.answeredCount})
      </span>
    </Button>
  );
}

export default function TagSelect({
  currentTag,
  currentQuestionTag,
  tagOptions,
  selectTag,
  minimal,
}) {
  let toggleCss = "bg-black text-white";
  if (minimal) {
    toggleCss = "text-gray";
  }

  function renderCurrentTag() {
    if (currentTag.tag === "all") {
      return (
        <>
          All
          <span className="text-gray text-sm">
            &nbsp;({currentQuestionTag})
          </span>
        </>
      );
    }
    return currentTag.tag;
  }
  return currentTag ? (
    <Menu
      compact
      toggle={
        <div className={`font-medium flex ${toggleCss}`}>
          <span className="whitespace-nowrap capitalize">
            {renderCurrentTag()}
          </span>
          <Svg
            name="chevron"
            rotate={90}
            width="12"
            height="12"
            css="ml-2"
            color={minimal ? colors.gray : colors.white}
          />
        </div>
      }
      items={tagOptions.map((t, i) => {
        return {
          component: <TagSelectOption tag={t} key={i} selectTag={selectTag} />,
        };
      })}
    />
  ) : null;
}
