import React from "react";
import colors from "~/lib/colors";
import { Button } from "~/components/_styled";
import Svg from "~/components/svg";
import { renderFragmentDate } from "~/lib/util";
import FragmentHeaderMenu from "~/components/timeline/fragmentHeaderMenu";

export default function FragmentHeader({
  fragment,
  grouped,
  isFirst,
  isLast,
  moveFragment,
}) {
  const renderDate = fragment.date ? renderFragmentDate(fragment.date) : null;

  return (
    <div className="py-1 pl-3 pr-1 flex justify-between items-center border-b border-lightGray">
      <div className="text-center text-gray text-sm font-medium flex cursor-default">
        {renderDate
          ? `${renderDate}${fragment.isSmartDate ? " (smart)" : ""}`
          : "No date"}
      </div>

      <div
        className="flex items-center justify-end"
        style={{ minWidth: "4rem" }}
      >
        {grouped && (
          <div className="flex items-center">
            {!isFirst && (
              <Button
                variant="minimal"
                size="compact"
                onClick={() => moveFragment(fragment.id, fragment.date, "BACK")}
              >
                <Svg
                  name="chevronLeft"
                  size={12}
                  title="Entries with the same date can be reordered"
                />
              </Button>
            )}
            {!isLast && (
              <Button
                variant="minimal"
                size="compact"
                onClick={() =>
                  moveFragment(fragment.id, fragment.date, "FORWARD")
                }
              >
                <Svg
                  name="chevronRight"
                  size={12}
                  title="Entries with the same date can be reordered"
                />
              </Button>
            )}
          </div>
        )}
        {fragment.hidden && (
          <div
            className="px-2 py-1 cursor-default"
            title="This memory won't be included in your book"
          >
            <Svg css="cursor-default" name="private" color="gray" size={18} />
          </div>
        )}
        <FragmentHeaderMenu fragment={fragment} />
      </div>
    </div>
  );
}
