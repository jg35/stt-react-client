import React, { useContext, useEffect, useState } from "react";
import { UIContext } from "~/app";
import { Button } from "~/components/_styled";
import Svg from "~/components/svg";
import {
  makeCreateFragmentForm,
  makeCreateUserEventForm,
} from "~/lib/uiManager";
import colors from "~/lib/colors";

export default function SectionCaptureActions({ show, date, index }) {
  const { updateUiState, uiState } = useContext(UIContext);
  const [captureActive, setCaptureActive] = useState(null);
  const showActionToggle = window.innerWidth < 768;

  const animateIn = showActionToggle
    ? "animate-slide-in-left"
    : "animate-fade-in";
  const animateOut = showActionToggle
    ? `${!captureActive ? "hidden" : "animate-slide-out-right"}`
    : "animate-fade-out";

  useEffect(() => {
    if (uiState.activeCaptureIndex !== null) {
      setCaptureActive(
        !isNaN(uiState.activeCaptureIndex)
          ? uiState.activeCaptureIndex === index
          : false
      );
    }
  }, [uiState.activeCaptureIndex]);

  const animate = uiState.tutorialStep === -1 || uiState.tutorialStep === 1000;
  let showActions = false;
  if (showActionToggle) {
    // On mobile, show actions based on capture active
    showActions = captureActive;
  } else {
    showActions = show || captureActive;
  }

  return (
    <div
      id="section-actions"
      data-section-actions-index={index}
      className="flex"
    >
      <div className={`flex-1 flex justify-end`}>
        <Button
          id={`section-actions-event-index-${index}`}
          css={`js-section-actions-event-btn whitespace-nowrap rounded-lg mr-1 xs:mr-2 w-auto ${
            animate && (showActions ? animateIn : animateOut)
          }`}
          size="compact"
          onClick={() =>
            updateUiState(makeCreateUserEventForm({ date }), false)
          }
        >
          <Svg name="calendar" css="md:hidden " width={18} height={18} />
          <span className="hidden md:block">Add event</span>
        </Button>

        <Button
          size="compact"
          css={`whitespace-nowrap rounded-lg mr-1 xs:mr-2 w-auto ${
            animate && (showActions ? animateIn : animateOut)
          }`}
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
          id={`section-actions-photo-index-${index}`}
          size="compact"
          css={`js-section-actions-photo-btn whitespace-nowrap rounded-lg mr-1 xs:mr-2 w-auto ${
            animate && (showActions ? animateIn : animateOut)
          }`}
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
          id={`section-actions-chapter-index-${index}`}
          size="compact"
          css={`js-section-actions-chapter-btn whitespace-nowrap rounded-lg mr-1 xs:mr-2 w-auto ${
            animate && (showActions ? animateIn : animateOut)
          }`}
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
      </div>

      {showActionToggle && (
        <Button
          style={{ borderRadius: "50%" }}
          css={`whitespace-nowrap rounded-lg w-8 h-8`}
          size="compact"
          onClick={() => {
            updateUiState(
              {
                activeCaptureIndex:
                  uiState.activeCaptureIndex === index ? false : index,
              },
              false
            );
          }}
        >
          {captureActive ? (
            <Svg
              name="minus"
              color={colors.gray}
              css="animate-fade-in"
              width={18}
              height={18}
            />
          ) : (
            <Svg
              name="plus"
              color={colors.gray}
              css="animate-fade-in"
              width={18}
              height={18}
            />
          )}
        </Button>
      )}
    </div>
  );
}
