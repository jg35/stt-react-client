import React from "react";

import Menu from "~/components/menu";
import Svg from "~/components/svg";
import colors from "~/lib/colors";
import Buttton from "~/components/button";

function TagSelectOption({ tag, selectTag }) {
  return (
    <Buttton
      variant="minimal"
      size="compact"
      css="justify-end capitalize"
      onClick={() => selectTag(tag)}
    >
      {tag}
    </Buttton>
  );
}

export default function TagSelect({
  currentTag,
  tagOptions,
  selectTag,
  minimal,
}) {
  let toggleCss = "bg-black text-white";
  if (minimal) {
    toggleCss = "text-gray";
  }
  return (
    <Menu
      compact
      toggle={
        <div className={`font-medium flex text-gray ${toggleCss}`}>
          <span className="whitespace-nowrap ">
            {currentTag ? (
              <span className="capitalize">{currentTag}</span>
            ) : (
              "Select a tag"
            )}
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
  );
}
