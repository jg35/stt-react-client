import React, { useContext } from "react";
import { Button, ButtonGroup, Text } from "~/components/_styled";
import { UIContext } from "~/app";

export default function TimePeriodSelector({ timelinePeriod, orphanCount }) {
  const { updateUiState } = useContext(UIContext);

  return (
    <div className="bg-white sticky bottom-4 w-max flex items-center shadow-lg py-2 pl-4 pr-2 rounded border">
      <Text tag="span" size="compact" css="font-medium mr-2 flex">
        View <span className="hidden md:block">&nbsp;timeline&nbsp;</span> in:
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
