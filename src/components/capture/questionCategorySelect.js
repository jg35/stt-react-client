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
      css="justify-end capitalize items-center"
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
  let toggleCss = "text-gray";
  return currentCategory ? (
    <Menu
      compact
      toggle={
        <div className={`font-medium flex ${toggleCss}`}>
          <span className="whitespace-nowrap capitalize">
            {currentCategory.name}
          </span>
          <Svg
            name="chevronDown"
            rotate={90}
            size={12}
            css="ml-2"
            color="text-gray"
          />
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
