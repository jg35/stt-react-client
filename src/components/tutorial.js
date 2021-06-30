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

  useEffect(() => {
    getTimeline();
  }, []);

  useEffect(() => {
    // Check
    if (data && uiState) {
      // Check whether to move to the next step
      const nextStep = getNextStep(steps, data, uiState);
      if (!currentStep || (nextStep && nextStep.step !== currentStep.step)) {
        if (currentStep) {
          currentStep.end();
        }
        if (nextStep.position) {
          setWidgetStyle({
            left: nextStep.position.x,
            transform: "translateX(-50%) translateY(-50%)",
            top: nextStep.position.y,
          });
          nextStep.init(updateUiState);
        } else if (nextStep.anchorId && nextStep.calloutId) {
          // Find anchor / callout elements in the dom
          setTimeout(() => {
            const calloutEl = document.querySelector(`#${nextStep.calloutId}`);
            const anchorEl = document.querySelector(`#${nextStep.anchorId}`);
            if (calloutEl && anchorEl) {
              const widgetStyle = getWidgetStyle(
                anchorEl,
                nextStep.anchorPosition
              );
              const arrowStyle = getArrowStyle(
                calloutEl,
                nextStep.anchorPosition,
                widgetStyle
              );
              setWidgetStyle(widgetStyle);
              setArrowStyle(arrowStyle);
              nextStep.init(updateUiState);
            }
          });
        }
        // Set the next step
        setCurrentStep(nextStep);
        saveCurrentStep(nextStep.step);
      }
    }
  }, [data, uiState]);

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
