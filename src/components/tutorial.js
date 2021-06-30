import React, { useContext, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { AuthContext } from "~/components/authWrap";
import Button from "~/components/button";
import LoadingSpinner from "~/components/loadingSpinner";

import { FETCH_TIMELINE_VIEW } from "~/lib/gql";
import { UIContext } from "~/app";
import tutorialSteps from "~/lib/tutorialSteps";

function getNextStep(steps, data, uiState) {
  return steps.find((step) => !step.isComplete(data, uiState));
}

function getWidgetPosition(anchorEl, isBefore) {
  const WIDGET_WIDTH = 240;
  const WIDGET_X_PAD = 20;
  const WIDGET_Y_PAD = 20;
  const rect = anchorEl.getBoundingClientRect();

  return {
    left: isBefore
      ? rect.left - WIDGET_WIDTH - WIDGET_X_PAD
      : rect.right + WIDGET_X_PAD,
    top: rect.top - WIDGET_Y_PAD,
  };
}

function getArrowStyle(calloutEl, calloutBefore, widgetStyle) {
  const WIDGET_WIDTH = 240;
  const rect = calloutEl.getBoundingClientRect();

  let start, end;
  if (calloutBefore) {
    start = widgetStyle.left + WIDGET_WIDTH;
    end = rect.x + rect.width / 2;
  } else {
    start = rect.x + rect.width / 2;
    end = widgetStyle.left;
  }

  return {
    left: start,
    width: `${Math.abs(start - end)}px`,
    top: rect.top - 15,
    display: "block",
  };
}

export default function Tutorial() {
  const steps = tutorialSteps();
  const { user } = useContext(AuthContext);

  const { uiState, updateUiState } = useContext(UIContext);
  const [getTimeline, { data, loading }] = useLazyQuery(FETCH_TIMELINE_VIEW, {
    variables: {
      userId: user.id,
    },
  });
  const [arrowStyle, setArrowStyle] = useState({});
  const [currentStep, setCurrentStep] = useState(null);
  const [widgetStyle, setWidgetStyle] = useState({});

  useEffect(() => {
    getTimeline();
  }, []);

  useEffect(() => {
    if (data && uiState) {
      const nextStep = getNextStep(steps, data, uiState);
      if (currentStep && nextStep && nextStep.step !== currentStep.step) {
        currentStep.end(updateUiState);
        setCurrentStep(nextStep);
      } else if (!currentStep) {
        setCurrentStep(nextStep);
      }
    }
  }, [data, uiState, currentStep]);

  useEffect(() => {
    if (currentStep) {
      if (currentStep.position) {
        setWidgetStyle({
          left: currentStep.position.x,
          transform: "translateX(-50%) translateY(-50%)",
          top: currentStep.position.y,
        });
        currentStep.init(updateUiState);
      } else {
        // Find anchor / callout elements in the dom
        setTimeout(() => {
          const calloutEl = document.querySelector(`#${currentStep.calloutId}`);
          const anchorEl = document.querySelector(`#${currentStep.anchorId}`);
          if (calloutEl && anchorEl) {
            const widgetStyle = getWidgetPosition(anchorEl, currentStep.before);
            const arrowStyle = getArrowStyle(
              calloutEl,
              currentStep.before,
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

  if (loading) {
    return null;
  }

  if (currentStep) {
    return (
      <>
        <div
          className={`z-50 widget-callout hidden absolute animate-fade-in ${
            currentStep.before
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
            <Button>Skip tutorial</Button>

            <Button
              bigCta
              disabled={currentStep.async}
              onClick={() => currentStep.end(updateUiState)}
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
