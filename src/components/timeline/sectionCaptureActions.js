import React, { useContext } from "react";
import { UIContext } from "~/app";
import Button from "~/components/button";
import {
  makeCreateFragmentForm,
  makeCreateUserEventForm,
} from "~/lib/uiManager";

import { useStepActive } from "~/hooks/tutorialHooks";

export default function SectionCaptureActions({ show, date, index }) {
  const { updateUiState } = useContext(UIContext);
  const tutorialStepActive = useStepActive(index === 0 ? [3, 4, 7] : []);

  return (
    <div
      id="section-actions"
      className={`flex ${
        !show && !tutorialStepActive ? "opacity-0" : "animate-fade-in"
      }`}
    >
      <div id="section-actions-event">
        <Button
          css="mr-3"
          onClick={() => updateUiState(makeCreateUserEventForm({ date }))}
        >
          Add event
        </Button>
      </div>
      <div id="section-actions-memory">
        <Button
          css="mr-3"
          onClick={() =>
            updateUiState(
              makeCreateFragmentForm({ type: "TEXT", date, dateType: "AUTO" })
            )
          }
        >
          Add memory
        </Button>
      </div>
      <div id="section-actions-photo">
        <Button
          css="mr-3"
          onClick={() =>
            updateUiState(
              makeCreateFragmentForm({ type: "PHOTO", date, dateType: "AUTO" })
            )
          }
        >
          Add photo
        </Button>
      </div>
      <div id="section-actions-chapter">
        <Button
          css="mr-3"
          onClick={() =>
            updateUiState(
              makeCreateFragmentForm({
                type: "CHAPTER",
                date,
                dateType: "AUTO",
              })
            )
          }
        >
          Add chapter
        </Button>
      </div>
    </div>
  );

  return null;
}
