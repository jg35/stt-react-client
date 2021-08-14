import React, { useContext } from "react";
import { Button, ButtonGroup, Text } from "~/components/_styled";
import { UIContext } from "~/app";

export default function TimePeriodSelector({ timelinePeriod, orphanCount }) {
  const { updateUiState } = useContext(UIContext);

  return (
    <div className="h-10 bg-white sticky bottom-4 w-max flex items-center shadow-lg py-6 px-4 rounded border">
      <Text tag="span" size="compact" css="font-medium mr-2">
        View timeline in:
      </Text>
      <ButtonGroup>
        <Button
          size="compact"
          onClick={() => updateUiState({ timelinePeriod: "YEAR" })}
          css={`
            ${timelinePeriod === "YEAR" && "underline"}
          `}
        >
          Years
        </Button>
        <Button
          size="compact"
          onClick={() => updateUiState({ timelinePeriod: "SEASON" })}
          css={`
            ${timelinePeriod === "SEASON" && "underline"}
          `}
        >
          Seasons
        </Button>
        <Button
          size="compact"
          onClick={() => updateUiState({ timelinePeriod: "MONTH" })}
          css={`
            ${timelinePeriod === "MONTH" && "underline"}
          `}
        >
          Months
        </Button>
      </ButtonGroup>
    </div>
  );
}
