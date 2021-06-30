import React, { useContext, useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { AuthContext } from "~/components/authWrap";
import Button from "~/components/button";
import LoadingSpinner from "~/components/loadingSpinner";

import { FETCH_TIMELINE_VIEW, UPDATE_USER } from "~/lib/gql";
import { UIContext } from "~/app";
import tutorialSteps from "~/lib/tutorialSteps";

function getNextStep(steps, data, uiState) {
  return steps.find((step) => !step.isComplete(data, uiState));
}

function getWidgetPosition(anchorEl, anchorPosition) {
  const WIDGET_WIDTH = 240;
  const WIDGET_HEIGHT = 184;
  const WIDGET_X_PAD = 20;
  const WIDGET_Y_PAD = 20;
  const rect = anchorEl.getBoundingClientRect();

  let left, top;

  switch (anchorPosition) {
    case "TOP_LEFT":
      left = rect.left;
      top = rect.top - WIDGET_HEIGHT - WIDGET_Y_PAD;
      break;
    case "LEFT":
      left = rect.left - WIDGET_WIDTH - WIDGET_X_PAD;
      top = rect.top - WIDGET_Y_PAD;
      break;
    case "TOP_RIGHT":
      left = rect.right - WIDGET_WIDTH;
      top = rect.top - WIDGET_HEIGHT - WIDGET_Y_PAD;
      break;
    case "RIGHT":
      left = rect.right + WIDGET_X_PAD;
      top = rect.top - WIDGET_Y_PAD;
      break;
    case "BOTTOM_LEFT":
      left = rect.left;
      top = rect.height + WIDGET_HEIGHT + WIDGET_Y_PAD;
      break;
    case "BOTTOM_RIGHT":
      left = rect.right - WIDGET_WIDTH;
      top = rect.height + WIDGET_HEIGHT + WIDGET_Y_PAD;
      break;
    default:
      left = 0;
      top = 0;
  }

  return {
    left,
    top,
  };
}

function getArrowStyle(calloutEl, anchorPosition, widgetStyle) {
  const WIDGET_WIDTH = 240;
  const WIDGET_HEIGHT = 184;
  const rect = calloutEl.getBoundingClientRect();

  let end,
    left = "auto",
    top = rect.top - 15;

  switch (anchorPosition) {
    case "TOP_LEFT":
      top = rect.top - 45;
      left = widgetStyle.left + WIDGET_WIDTH;
      end = rect.x + rect.width / 2;
      break;
    case "LEFT":
      top = rect.top - 15;
      left = widgetStyle.left + WIDGET_WIDTH;
      end = rect.x + rect.width / 2;
      break;
    case "TOP_RIGHT":
      top = rect.top - 45;
      left = rect.x + rect.width / 2;
      end = widgetStyle.left;
      break;
    case "RIGHT":
      top = rect.top - 15;
      left = rect.x + rect.width / 2;
      end = widgetStyle.left;
      break;
    case "BOTTOM_LEFT":
      top = rect.top + rect.height + 45;
      left = widgetStyle.left + WIDGET_WIDTH;
      end = rect.x + rect.width / 2;
      break;
    case "BOTTOM_RIGHT":
      top = rect.top + rect.height + 45;
      left = rect.x + rect.width / 2;
      end = widgetStyle.left;
      break;
    default:
      break;
  }

  return {
    top,
    left,
    width: `${Math.abs(left - end)}px`,
    display: "block",
  };
}

export default function Tutorial() {
  const [updateUser, { loading: updateUserLoading }] = useMutation(UPDATE_USER);
  const steps = tutorialSteps();
  const { user } = useContext(AuthContext);
  const { uiState, updateUiState } = useContext(UIContext);
  const [getTimeline, { data, loading }] = useLazyQuery(FETCH_TIMELINE_VIEW, {
    variables: {
      userId: user.id,
    },
  });
  const [currentStep, setCurrentStep] = useState(null);
  const [arrowStyle, setArrowStyle] = useState({});
  const [widgetStyle, setWidgetStyle] = useState({});

  useEffect(() => {
    getTimeline();
  }, []);

  useEffect(() => {
    // Check
    if (data && uiState) {
      // Check whether to move to the next step
      const nextStep = getNextStep(steps, data, uiState);
      if (!currentStep) {
        // Set the first step
        setCurrentStep(nextStep);
        saveCurrentStep(nextStep.step);
      } else if (
        currentStep &&
        nextStep &&
        nextStep.step !== currentStep.step
      ) {
        // Move onto the next step
        currentStep.end();
        setCurrentStep(nextStep);
        saveCurrentStep(nextStep.step);
      }
    }
  }, [data, uiState]);

  useEffect(() => {
    if (currentStep) {
      if (currentStep.position) {
        setWidgetStyle({
          left: currentStep.position.x,
          transform: "translateX(-50%) translateY(-50%)",
          top: currentStep.position.y,
        });
        currentStep.init();
      } else {
        // Find anchor / callout elements in the dom
        setTimeout(() => {
          const calloutEl = document.querySelector(`#${currentStep.calloutId}`);
          const anchorEl = document.querySelector(`#${currentStep.anchorId}`);
          if (calloutEl && anchorEl) {
            const widgetStyle = getWidgetPosition(
              anchorEl,
              currentStep.anchorPosition
            );
            const arrowStyle = getArrowStyle(
              calloutEl,
              currentStep.anchorPosition,
              widgetStyle
            );
            setWidgetStyle(widgetStyle);
            setArrowStyle(arrowStyle);
            currentStep.init(updateUiState);
          }
        });
      }
    }
  }, [currentStep]);

  function saveCurrentStep(step) {
    updateUiState({ tutorialStep: step });
  }

  function skipTutorial() {
    updateUser({
      variables: { userId: user.id, data: { onboarding: true } },
      update(cache, { data }) {
        currentStep.end();
        updateUiState({
          capture: {
            showModal: false,
            item: null,
            event: null,
          },
        });
        cache.modify({
          fields: {
            stt_user_by_pk(user = {}) {
              return { ...user, ...data.update_stt_user_by_pk };
            },
          },
        });
      },
    });
  }

  if (loading) {
    return null;
  }

  if (currentStep) {
    return (
      <>
        <div
          className={`z-50 widget-callout hidden absolute animate-fade-in ${
            currentStep.anchorPosition === "LEFT"
              ? "widget-callout--before"
              : "widget-callout--after"
          }`}
          style={arrowStyle}
        ></div>
        <div
          style={widgetStyle}
          className={`absolute z-50 rounded shadow-xl bg-white border-2 border-black h-auto flex flex-col justify-between animate-fade-in ${
            currentStep.xl ? "w-96 p-4" : "w-60 p-2"
          }`}
        >
          <div
            className={`flex justify-between font-medium ${
              currentStep.xl ? "text-base" : "text-sm"
            }`}
          >
            <span>{currentStep.title}</span>
            <span>
              {currentStep.step}/{steps.length}
            </span>
          </div>
          <div>
            <p className={`${currentStep.xl ? "py-4 text-lg" : "py-2"}`}>
              {currentStep.body}
            </p>
          </div>
          <div className="flex justify-between">
            <Button onClick={skipTutorial}>
              <LoadingSpinner loading={updateUserLoading} css="mr-2 h-4 w-4" />
              {updateUserLoading ? "Updating..." : "Skip tutorial"}
            </Button>

            <Button
              bigCta
              disabled={currentStep.async}
              onClick={() => saveCurrentStep(currentStep.step + 1)}
            >
              {currentStep.async ? (
                <span className="flex">
                  <LoadingSpinner
                    loading={true}
                    color="white"
                    css="mr-2 h-4 w-4"
                  />{" "}
                  Waiting...
                </span>
              ) : (
                currentStep.nextText
              )}
            </Button>
          </div>
        </div>
      </>
    );
  }
  return null;
}
