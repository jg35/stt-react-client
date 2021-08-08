import React, { useContext, useEffect, useState } from "react";
import { UIContext } from "@src/app";
import Button from "@src/components/button";
import {
  makeCreateFragmentForm,
  makeCreateUserEventForm,
} from "@src/lib/uiManager";

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
        <div className="flex" id="section-actions-inner">
          <div id="section-actions-event">
            <Button
              css="mr-3"
              onClick={() =>
                updateUiState(makeCreateUserEventForm({ date }), false)
              }
            >
              Add event
            </Button>
          </div>
          <div id="section-actions-memory">
            <Button
              css="mr-3"
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
          </div>
          <div id="section-actions-photo">
            <Button
              css="mr-3"
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
                  }),
                  false
                )
              }
            >
              Add chapter
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return null;
}
