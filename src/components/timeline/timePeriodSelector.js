import React, { useContext } from "react";
import { Button, ButtonGroup, Text } from "~/components/_styled";
import { UIContext } from "~/app";
import { scrollToYear } from "~/lib/timeline";

export default function TimePeriodSelector({ timelinePeriod, orphanCount }) {
  const { uiState, updateUiState } = useContext(UIContext);

  const TIMELINE_RECALC_DURATION = 100;
  const FADE_OUT_DURATION = 300;

  function selectTimePeriod(timelinePeriod) {
    if (uiState.timelineScrollYear) {
      const timelineScrollContainer = document.querySelector(
        "#timeline-scroll-container"
      );
      timelineScrollContainer.classList.remove("animate-fade-in");
      timelineScrollContainer.classList.add("animate-fade-out");

      setTimeout(() => {
        updateUiState({ timelinePeriod });

        setTimeout(() => {
          scrollToYear(uiState.timelineScrollYear, false);
          timelineScrollContainer.classList.add("animate-fade-in");
          timelineScrollContainer.classList.remove("animate-fade-out");
        }, TIMELINE_RECALC_DURATION);
      }, FADE_OUT_DURATION);
    } else {
      updateUiState({ timelinePeriod });
    }
  }

  return (
    <div
      id="time-period-selector"
      className="bg-white z-40 fixed left-0 md:left-4 bottom-0 w-full md:w-max md:bottom-4 flex items-center shadow-lg py-2 pl-4 pr-1 md:rounded md:border-0 border-t border-lightGray"
    >
      <Text tag="span" size="compact" css="font-medium mr-2 flex">
        View <span className="hidden md:block">&nbsp;timeline&nbsp;</span> in
      </Text>
      <ButtonGroup>
        <Button
          size="compact"
          onClick={() => selectTimePeriod("YEAR")}
          css={`rounded-full ${timelinePeriod === "YEAR" && "underline"}
          `}
        >
          Years
        </Button>
        <Button
          size="compact"
          onClick={() => selectTimePeriod("SEASON")}
          css={`rounded-full ${timelinePeriod === "SEASON" && "underline"}`}
        >
          Seasons
        </Button>
        <Button
          size="compact"
          onClick={() => selectTimePeriod("MONTH")}
          css={`rounded-full ${timelinePeriod === "MONTH" && "underline"}`}
        >
          Months
        </Button>
      </ButtonGroup>
    </div>
  );
}
