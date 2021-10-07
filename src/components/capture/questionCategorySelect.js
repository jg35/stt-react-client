import React from "react";

import Menu from "~/components/menu";
import Svg from "~/components/svg";
import colors from "~/lib/colors";
import { Button } from "~/components/_styled";

function QuestionCategorySelectOption({ category, selectCategory }) {
  return (
    <Button
      variant="minimal"
      size="compact"
      css="justify-end items-center"
      onClick={() => selectCategory(category.name)}
    >
      {category.name}
      <span className="text-sm text-gray">&nbsp;({category.count})</span>
    </Button>
  );
}

export default function QuestionCategorySelect({
  currentCategory,
  categoryOptions,
  selectCategory,
}) {
  let toggleCss = "text-darkGray";
  return currentCategory ? (
    <Menu
      id="question-category-menu"
      compact
      toggle={
        <div className={`font-medium flex ${toggleCss}`}>
          <span className="whitespace-nowrap flex items-center">
            {currentCategory.name}
          </span>
          <Svg name="chevronDown" size={12} css="ml-1" color="darkGray" />
        </div>
      }
      items={Object.keys(categoryOptions).map((categoryKey, i) => {
        return {
          component: (
            <QuestionCategorySelectOption
              category={categoryOptions[categoryKey]}
              key={i}
              selectCategory={selectCategory}
            />
          ),
        };
      })}
    />
  ) : null;
}
