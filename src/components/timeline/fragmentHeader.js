import React from "react";
import colors from "~/lib/colors";
import Svg from "~/components/svg";
import { renderFragmentDate } from "~/lib/util";
import FragmentHeaderMenu from "~/components/timeline/fragmentHeaderMenu";

export default function FragmentHeader({ fragment }) {
  const renderDate = fragment.date ? renderFragmentDate(fragment.date) : null;

  return (
    <div className="py-1 pl-3 pr-1 flex justify-between items-center border-b border-lightGray">
      <div className="text-center text-gray text-sm font-medium flex cursor-default">
        {renderDate
          ? `${renderDate}${fragment.dateType === "AUTO" ? " (auto)" : ""}`
          : "No date"}
      </div>
      <div
        className="flex items-center justify-end"
        style={{ minWidth: "4rem" }}
      >
        {fragment.hidden && (
          <div
            className="px-2 py-1 cursor-default"
            title="This memory won't be included in your book"
          >
            <Svg
              css="cursor-default"
              name="private"
              color={colors.gray}
              width="18"
              height="18"
            />
          </div>
        )}
        <FragmentHeaderMenu fragment={fragment} />
      </div>
    </div>
  );
}
