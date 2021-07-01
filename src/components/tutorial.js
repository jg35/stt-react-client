import React, { useContext, useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { AuthContext } from "~/components/authWrap";
import Button from "~/components/button";
import LoadingSpinner from "~/components/loadingSpinner";

import { FETCH_TIMELINE_VIEW, UPDATE_USER } from "~/lib/gql";
import { UIContext } from "~/app";
import {
  steps,
  getNextStep,
  getWidgetStyle,
  getArrowStyle,
} from "~/lib/tutorial";

export default function Tutorial() {
  const [updateUser, { loading: updateUserLoading }] = useMutation(UPDATE_USER);
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

  function stepStyleHandler(nextStep) {
    let widgetStyle = {};
    let arrowStyle = {};
    if (nextStep.position) {
      widgetStyle = {
        left: nextStep.position.x,
        transform: "translateX(-50%) translateY(-50%)",
        top: nextStep.position.y,
      };
    } else {
      // Find anchor / callout elements in the dom
      const calloutEl =
        nextStep.calloutEl || document.querySelector(nextStep.calloutSelector);
      const anchorEl =
        nextStep.anchorEl || document.querySelector(nextStep.anchorSelector);
      if (calloutEl && anchorEl) {
        widgetStyle = getWidgetStyle(anchorEl, nextStep.anchorPosition);
        arrowStyle = getArrowStyle(
          calloutEl,
          nextStep.anchorPosition,
          widgetStyle
        );
      }
    }
    setArrowStyle(arrowStyle);
    setWidgetStyle(widgetStyle);
  }

  useEffect(() => {
    getTimeline();
  }, []);

  useEffect(() => {
    // Check
    if (data && uiState) {
      // Check whether to move to the next step
      const nextStep = getNextStep(steps, data, uiState);
      if (
        !currentStep ||
        (!currentStep.last && nextStep.step !== currentStep.step)
      ) {
        // Wait for DOM
        if (currentStep) {
          currentStep.end(data, uiState, updateUiState);
        }
        nextStep.init(data, uiState, updateUiState);
        // Set the next step
        setCurrentStep(nextStep);
      }
    }
  }, [data, uiState]);

  useEffect(() => {
    if (currentStep) {
      setTimeout(() => {
        stepStyleHandler(currentStep);
      });
    }
  }, [currentStep]);

  function saveCurrentStep(step) {
    if (step > steps.length) {
      endTutorial();
    } else {
      updateUiState({ tutorialStep: step });
    }
  }

  function endTutorial() {
    updateUser({
      variables: { userId: user.id, data: { onboarding: true } },
      update(cache, { data }) {
        currentStep.end(data, uiState);
        updateUiState({
          capture: {
            showModal: false,
            item: null,
            event: null,
          },
          showPreview: false,
          tutorialStep: -1,
          activeCaptureIndex: null,
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
              {typeof currentStep.body === "function"
                ? currentStep.body(data, uiState)
                : currentStep.body}
            </p>
          </div>
          <div className="flex justify-between">
            <div>
              {!currentStep.last && (
                <Button onClick={endTutorial}>
                  <LoadingSpinner
                    loading={updateUserLoading}
                    css="mr-2 h-4 w-4"
                  />
                  {updateUserLoading ? "Updating..." : "Skip tutorial"}
                </Button>
              )}
            </div>

            <Button
              bigCta
              disabled={currentStep.async}
              onClick={() => saveCurrentStep(currentStep.step + 1)}
            >
              {currentStep.async || updateUserLoading ? (
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
