import React, { useContext, useEffect, useState } from "react";
import { UIContext } from "~/app";
import { Button, ButtonGroup } from "~/components/_styled";
import Svg from "~/components/svg";
import {
  makeCreateFragmentForm,
  makeCreateUserEventForm,
} from "~/lib/uiManager";

export default function SectionCaptureActions({ show, date, index }) {
  const { updateUiState, uiState } = useContext(UIContext);
  const [captureActive, setCaptureActive] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    setCaptureActive(
      !isNaN(uiState.activeCaptureIndex)
        ? window.innerWidth <= 1024 || uiState.activeCaptureIndex === index
        : window.innerWidth <= 1024
    );
  }, [uiState]);
  return (
    <div
      id="section-actions"
      className={`flex justify-end ${
        !captureActive && !show ? "opacity-0" : "animate-fade-in"
      }`}
    >
      {(show || captureActive) && (
        <ButtonGroup id="section-actions-inner">
          <Button
            id="section-actions-event"
            css="whitespace-nowrap rounded-lg"
            size="compact"
            onClick={() =>
              updateUiState(makeCreateUserEventForm({ date }), false)
            }
          >
            <Svg name="calendar" css="md:hidden " width={18} height={18} />
            <span className="hidden md:block">Add event</span>
          </Button>

          <Button
            id="section-actions-memory"
            size="compact"
            css="whitespace-nowrap rounded-lg"
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
            <Svg name="writing" css="md:hidden " width={18} height={18} />
            <span className="hidden md:block">Add memory</span>
          </Button>

          <Button
            id="section-actions-photo"
            size="compact"
            css="whitespace-nowrap rounded-lg"
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
            <Svg name="photo" css="md:hidden " width={18} height={18} />
            <span className="hidden md:block">Add photo</span>
          </Button>

          <Button
            id="section-actions-chapter"
            size="compact"
            css="whitespace-nowrap rounded-lg"
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
            <Svg name="chapter" css="md:hidden " width={18} height={18} />
            <span className="hidden md:block">Add chapter</span>
          </Button>
        </ButtonGroup>
      )}
    </div>
  );

  return null;
}
