import React from "react";
import Button from "~/components/button";
import { changeTimelinePeriod } from "~/lib/apollo";

export default function TimePeriodSelector({ timelinePeriod }) {
  return (
    <div className="h-10 bg-white sticky bottom-4 w-max flex items-center shadow-lg py-6 px-4 rounded border">
      <span className="font-medium mr-2">View timeline in:</span>
      <Button
        onClick={() => changeTimelinePeriod("YEAR")}
        css={`
          ${timelinePeriod === "YEAR" && "underline"}
        `}
      >
        Years
      </Button>
      <Button
        onClick={() => changeTimelinePeriod("SEASON")}
        css={`mx-2 ${timelinePeriod === "SEASON" && "underline"}`}
      >
        Seasons
      </Button>
      <Button
        onClick={() => changeTimelinePeriod("MONTH")}
        css={`mx-2 ${timelinePeriod === "MONTH" && "underline"}`}
      >
        Months
      </Button>
    </div>
  );
}
