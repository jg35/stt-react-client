import React, { useContext, useEffect, useState } from "react";
import { UIContext } from "~/app";
import { Button, ButtonGroup } from "~/components/_styled";
import {
  makeCreateFragmentForm,
  makeCreateUserEventForm,
} from "~/lib/uiManager";

export default function SectionCaptureActions({ show, date, index }) {
  const { updateUiState, uiState } = useContext(UIContext);
  const [captureActive, setCaptureActive] = useState(false);

  useEffect(() => {
    setCaptureActive(
      !isNaN(uiState.activeCaptureIndex)
        ? uiState.activeCaptureIndex === index
        : false
    );
  }, [uiState]);
  return (
    <div
      id="section-actions"
      className={`flex ${
        !captureActive && !show ? "opacity-0" : "animate-fade-in"
      }`}
    >
      {(show || captureActive) && (
        <ButtonGroup id="section-actions-inner">
          <Button
            id="section-actions-event"
            css="whitespace-nowrap"
            size="compact"
            onClick={() =>
              updateUiState(makeCreateUserEventForm({ date }), false)
            }
          >
            Add event
          </Button>

          <Button
            id="section-actions-memory"
            size="compact"
            css="whitespace-nowrap"
            onClick={() =>
              updateUiState(
                makeCreateFragmentForm({
                  type: "TEXT",
                  date,
                  dateType: "AUTO",
                }),
                false
              )
            }
          >
            Add memory
          </Button>

          <Button
            id="section-actions-photo"
            size="compact"
            css="whitespace-nowrap"
            onClick={() =>
              updateUiState(
                makeCreateFragmentForm({
                  type: "PHOTO",
                  date,
                  dateType: "AUTO",
                }),
                false
              )
            }
          >
            Add photo
          </Button>

          <Button
            id="section-actions-chapter"
            size="compact"
            css="whitespace-nowrap"
            onClick={() =>
              updateUiState(
                makeCreateFragmentForm({
                  type: "CHAPTER",
                  date,
                  dateType: "AUTO",
                }),
                false
              )
            }
          >
            Add chapter
          </Button>
        </ButtonGroup>
      )}
    </div>
  );

  return null;
}
