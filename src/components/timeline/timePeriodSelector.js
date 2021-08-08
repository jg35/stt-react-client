import React, { useContext } from "react";
import Button from "~/components/button";
import { scrollToUndated } from "~/lib/timeline";
import { UIContext } from "~/app";

export default function TimePeriodSelector({ timelinePeriod, orphanCount }) {
  const { updateUiState } = useContext(UIContext);

  return (
    <div className="h-10 bg-white sticky bottom-4 w-max flex items-center shadow-lg py-6 px-4 rounded border">
      <span className="font-medium mr-2">View timeline in:</span>
      <Button
        onClick={() => updateUiState({ timelinePeriod: "YEAR" })}
        css={`
          ${timelinePeriod === "YEAR" && "underline"}
        `}
      >
        Years
      </Button>
      <Button
        onClick={() => updateUiState({ timelinePeriod: "SEASON" })}
        css={`mx-2 ${timelinePeriod === "SEASON" && "underline"}`}
      >
        Seasons
      </Button>
      <Button
        onClick={() => updateUiState({ timelinePeriod: "MONTH" })}
        css={`mx-2 ${timelinePeriod === "MONTH" && "underline"}`}
      >
        Months
      </Button>
      {orphanCount > 0 && (
        <>
          <span className="font-medium ml-4 pl-4 mr-2 border-l">
            {orphanCount} {orphanCount > 1 ? "memories" : "memory"} outside
            timeline
          </span>

          <Button
            cta
            onClick={() => scrollToUndated()}
            css={`mx-2 ${timelinePeriod === "MONTH" && "underline"}`}
          >
            View memories
          </Button>
        </>
      )}
    </div>
  );
}
