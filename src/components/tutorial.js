import React, { useContext, useEffect, useState, useRef } from "react";
import { useLazyQuery } from "@apollo/client";
import { AuthContext } from "~/components/authWrap";
import { Button, Text, Grid } from "~/components/_styled";
import { useHistory } from "react-router";
import cloneDeep from "lodash/cloneDeep";

import { FETCH_TIMELINE_VIEW } from "~/lib/gql";
import { UIContext } from "~/app";
import { steps, getNextStep } from "~/lib/tutorial";
import useNotification from "~/components/notifications/useNotification";

import {
  getTutorialFragments,
  getTutorialUserEvents,
} from "~/lib/tutorialData";

export default function Tutorial() {
  const history = useHistory();
  const tutorialWidgetRef = useRef(null);
  const tutorialWidgetRefInner = useRef(null);
  const {
    authState: { dbUser },
  } = useContext(AuthContext);
  const { notification: tutorialNotification, markCleared } = useNotification(
    dbUser.notifications.find((n) => n.ref === "TRY_TUTORIAL")
  );
  const { uiState, updateUiState } = useContext(UIContext);

  const [tutorialData, setTutorialData] = useState(null);

  const [getTimeline, { data }] = useLazyQuery(FETCH_TIMELINE_VIEW, {
    variables: {
      userId: dbUser.id,
    },
  });

  useEffect(() => {
    if (data) {
      const clonedData = cloneDeep(data);
      clonedData.stt_fragment = getTutorialFragments();
      clonedData.stt_userEvent = getTutorialUserEvents();
      setTutorialData(clonedData);
    }
  }, [data]);

  const [currentStep, setCurrentStep] = useState(null);

  useEffect(() => {
    getTimeline();
  }, []);

  useEffect(() => {
    checkNextStep();
    return history.listen((location) => {
      checkNextStep(location.pathname);
    });
  }, [tutorialData, uiState, history]);

  function checkNextStep(pathName = history.location.pathname) {
    if (tutorialData) {
      const nextStep = getNextStep(steps, tutorialData, uiState, pathName);
      if (
        (nextStep && !currentStep) ||
        (nextStep && currentStep && nextStep.step !== currentStep.step)
      ) {
        // End the current step
        if (currentStep) {
          currentStep.end(tutorialData, uiState, updateUiState);
        }

        // Set the next step
        if (tutorialWidgetRefInner.current) {
          tutorialWidgetRefInner.current.classList.add("hidden");
          tutorialWidgetRefInner.current.classList.remove("animate-fade-in");
        }

        setCurrentStep(nextStep);
      }
    }
  }

  useEffect(() => {
    // Current step has changed and should be initialised
    if (currentStep && tutorialWidgetRef.current) {
      currentStep.init(
        tutorialData,
        uiState,
        updateUiState,
        tutorialWidgetRef.current
      );
    }
  }, [currentStep, tutorialWidgetRef]);

  function proceed(nextStep) {
    if (nextStep > steps.length) {
      endTutorial();
    } else {
      updateUiState(
        {
          tutorial: {
            active: true,
            step: nextStep,
          },
        },
        false
      );
    }
  }

  function endTutorial() {
    currentStep.end(tutorialData, uiState);
    updateUiState(
      {
        capture: {
          showModal: false,
          item: null,
          event: null,
        },
        showPreview: false,
        tutorial: {
          step: 0,
          active: false,
        },
        activeCaptureIndex: null,
      },
      false
    );
    setCurrentStep(null);
    if (tutorialNotification) {
      markCleared();
    }
  }

  let tutorialStyles = "z-50 bg-white border-lightGray border";

  if (!currentStep) {
    return null;
  }

  if (currentStep.fixed) {
    tutorialStyles += " min-w-full h-40 py-2 px-4 rounded-t-lg";
  } else {
    if (currentStep.xl) {
      tutorialStyles += " w-96 p-4 h-50";
    } else {
      tutorialStyles += " w-60 p-2 h-auto";
    }
    tutorialStyles += " rounded-lg shadow-2xl";
  }

  return (
    <div
      id="tooltip"
      ref={tutorialWidgetRef}
      style={{ maxWidth: "80%" }}
      className={tutorialStyles}
    >
      <div
        ref={tutorialWidgetRefInner}
        className="flex flex-col justify-between h-full hidden mx-auto"
      >
        <div className="text-left text-sm">
          <span className="text-gray">
            {currentStep.step}/{steps.length}
          </span>
        </div>
        <div>
          <Text css="mt-2">
            {typeof currentStep.body === "function"
              ? currentStep.body(tutorialData, uiState)
              : currentStep.body}
          </Text>
        </div>
        <div className="flex justify-end">
          <div className="w-full md:max-w-lg">
            <Grid
              gap="gap-x-2 gap-y-0"
              colSpan={
                !currentStep.last
                  ? [`col-span-6`]
                  : ["col-span-0", "col-span-12"]
              }
            >
              <div>
                {!currentStep.last && (
                  <Button size="compact" onClick={endTutorial}>
                    {currentStep.step === 1 ? "Close" : "End tutorial"}
                  </Button>
                )}
              </div>

              <Button
                variant="cta"
                size="compact"
                disabled={currentStep.async}
                onClick={() => proceed(currentStep.step + 1)}
              >
                {currentStep.nextText}
              </Button>
            </Grid>
          </div>
        </div>
      </div>
      {!currentStep.fixed && currentStep.referenceElSelector && (
        <div id="arrow" data-popper-arrow></div>
      )}
    </div>
  );
}
