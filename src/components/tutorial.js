import React, { useContext, useEffect, useState, useRef } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { AuthContext } from "~/components/authWrap";
import { Button, Text, Grid } from "~/components/_styled";
import { useHistory } from "react-router";
import Waiting from "~/components/waiting";

import { FETCH_TIMELINE_VIEW, UPDATE_USER } from "~/lib/gql";
import { UIContext } from "~/app";
import { steps, getNextStep } from "~/lib/tutorial";
import useToastMessage from "~/hooks/useToastMessage";

export default function Tutorial() {
  const history = useHistory();
  const tutorialWidgetRef = useRef(null);
  const tutorialWidgetRefInner = useRef(null);
  const { setError } = useToastMessage();
  const [updateUser, { loading: updateUserLoading }] = useMutation(UPDATE_USER);
  const {
    authState: { dbUser },
  } = useContext(AuthContext);
  const { uiState, updateUiState } = useContext(UIContext);
  const [getTimeline, { data, loading }] = useLazyQuery(FETCH_TIMELINE_VIEW, {
    variables: {
      userId: dbUser.id,
    },
  });
  const [currentStep, setCurrentStep] = useState(null);

  useEffect(() => {
    getTimeline();
  }, []);

  useEffect(() => {
    checkNextStep();
    return history.listen((location) => {
      checkNextStep(location.pathname);
    });
  }, [data, uiState, history]);

  function checkNextStep(pathName = history.location.pathname) {
    if (data) {
      const nextStep = getNextStep(steps, data, uiState, pathName);
      if (
        (nextStep && !currentStep) ||
        (nextStep && currentStep && nextStep.step !== currentStep.step)
      ) {
        // End the current step
        if (currentStep) {
          currentStep.end(data, uiState, updateUiState);
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
      currentStep.init(data, uiState, updateUiState, tutorialWidgetRef.current);
    }
  }, [currentStep, tutorialWidgetRef]);

  function proceed(nextStep) {
    if (nextStep > steps.length) {
      endTutorial();
    } else {
      updateUiState({ tutorialStep: nextStep });
    }
  }

  function endTutorial() {
    updateUser({
      variables: { userId: dbUser.id, data: { onboarding: true } },
      update(cache, { data }) {
        cache.modify({
          id: cache.identify(dbUser),
          fields: {
            onboarding: () => true,
          },
        });

        currentStep.end(data, uiState);
        updateUiState({
          capture: {
            showModal: false,
            item: null,
            event: null,
          },
          showPreview: false,
          tutorialStep: 1000,
          activeCaptureIndex: null,
        });
        setCurrentStep(null);
      },
    }).catch((e) => setError(e, { ref: "UPDATE", params: ["account"] }));
  }

  let tutorialStyles = "z-50 bg-white border-lightGray border";

  if (!currentStep) {
    return null;
  }

  if (currentStep.fixed) {
    tutorialStyles += " min-w-full h-40 py-2 px-4 rounded-t-lg";
  } else {
    if (currentStep.xl) {
      tutorialStyles += " w-96 p-4 h-52";
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
        className="flex flex-col justify-between h-full hidden max-w-5xl mx-auto"
      >
        <div
          className={`${
            currentStep.fixed && "md:py-2"
          } flex justify-between font-medium ${
            currentStep.xl ? "text-base" : "text-sm"
          }`}
        >
          <span>{currentStep.title}</span>
          <span>
            {currentStep.step}/{steps.length}
          </span>
        </div>
        <div>
          <Text
            variant={currentStep.xl ? "large" : "default"}
            css={`
              ${currentStep.xl ? "mt-4" : "mt-2"}
            `}
          >
            {typeof currentStep.body === "function"
              ? currentStep.body(data, uiState)
              : currentStep.body}
          </Text>
        </div>
        <div className="flex justify-end">
          <div className="w-full md:max-w-lg">
            <Grid colSpan={["col-span-6"]}>
              <div>
                {!currentStep.last && (
                  <Button
                    size="compact"
                    onClick={endTutorial}
                    inProgress={updateUserLoading}
                  >
                    {updateUserLoading ? "Updating..." : "Skip tutorial"}
                  </Button>
                )}
              </div>

              <Button
                variant="cta"
                size="compact"
                disabled={currentStep.async}
                inProgress={
                  updateUserLoading && currentStep.step === steps.length
                }
                onClick={() => proceed(currentStep.step + 1)}
              >
                {currentStep.async || updateUserLoading ? (
                  updateUserLoading ? (
                    "Saving..."
                  ) : (
                    <span className="flex items-center justify-center">
                      <Waiting size={20} color="white" css="mr-2" />
                      Waiting
                    </span>
                  )
                ) : (
                  currentStep.nextText
                )}
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
