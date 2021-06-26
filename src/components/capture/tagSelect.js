import React from "react";

import Menu from "~/components/menu";
import Svg from "~/components/svg";
import colors from "~/lib/colors";

function TagSelectOption({ tag, selectTag }) {
  return (
    <div
      className="text-right capitalize w-full p-2"
      onClick={() => selectTag(tag)}
    >
      {tag}
    </div>
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
        <div
          className={`font-medium flex text-gray rounded-md py-1 px-2 ${toggleCss}`}
        >
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
      sections={[
        tagOptions.map((t, i) => (
          <TagSelectOption tag={t} key={i} selectTag={selectTag} />
        )),
      ]}
    />
  );
}
