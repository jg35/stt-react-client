import React, { useContext, useEffect, useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { AuthContext } from "~/components/authWrap";
import Button from "~/components/button";
import LoadingSpinner from "~/components/loadingSpinner";

import { FETCH_TIMELINE_VIEW, FETCH_LOCAL_UI_STATE } from "~/lib/gql";
import { setUIStateVar } from "../lib/apollo";

const steps = [
  {
    step: 1,
    nextSyncStep: 2,
    title: "Welcome to the tutorial",
    body: "This is quick tutorial designed to get you up and running with our app. Ready?",
    nextStepText: "I'm ready!",
    isComplete: (data, uiState) => uiState.tutorialProgress.step > 1,
    async: false,
    position: { x: "50%", y: "50%" },
  },
  {
    step: 2,
    nextSyncStep: 3,
    title: "Timeline view",
    body: "Here we are in the timeline view. The timeline view is where you will add all of your memories, photos and memorable events",
    nextStepText: "Sounds good",
    isComplete: (data, uiState) => uiState.tutorialProgress.step > 2,
    async: false,
  },
  {
    step: 3,
    nextSyncStep: 5,
    title: "Adding to the timeline",
    body: "As you hover over each section of your timeline, you'll notice some buttons appearing. These actions are how we add content to our timeline",
    nextStepText: "Okay",
    isComplete: (data, uiState) => uiState.tutorialProgress.step > 3,
    async: false,
  },
  {
    step: 4,
    title: "Adding your first event",
    body: 'Events in your life help uncover new memories. Let\'s add one now by clicking "Add event"',
    isComplete: (data, uiState) =>
      data.stt_userEvent.length ||
      (uiState.capture.item && uiState.capture.item.type === "EVENT"),
    async: true,
  },
  {
    step: 5,
    nextSyncStep: 7,
    title: "Adding your first event",
    body: "Think of a big event that has shaped your life - maybe when you last moved, changed jobs or met your life partner.",
    nextStepText: "Sounds good",
    isComplete: (data, uiState) => uiState.tutorialProgress.step > 5,
    async: false,
  },
  {
    step: 6,
    title: "Adding your first event",
    body: `Enter a title and date and click "Add" to create your event. Don't worry, the date doesn't have to be accurate - we can fix that later.`,
    isComplete: (data, uiState) => data.stt_userEvent.length >= 1,
    async: true,
  },
  {
    step: 7,
    progressRef: 5,
    title: "Adding your first memory",
    body: 'Ok great. Now let\'s try adding your first memory. Click "Add memory to continue"',
    isComplete: (data, uiState) =>
      data.stt_fragment.length ||
      (uiState.capture.item && uiState.capture.item.type === "TEXT"),
    async: true,
  },
];

function getCurrentStep(data, tutorialProgress) {
  return steps.find((step) => !step.isComplete(data, tutorialProgress));
}

export default function Tutorial() {
  const user = useContext(AuthContext);
  const { data: uiData } = useQuery(FETCH_LOCAL_UI_STATE);
  const [getTimeline, { data, loading }] = useLazyQuery(FETCH_TIMELINE_VIEW, {
    variables: {
      userId: user.id,
    },
  });
  const [arrowStyle, setArrowStyle] = useState({});
  const [calloutIsBefore, setCalloutIsBefore] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [widgetCss, setWidgetCss] = useState("opacity-0");
  const [widgetStyle, setWidgetStyle] = useState({});
  const [widgetWidth] = useState(240);

  useEffect(() => {
    getTimeline();
  }, []);

  useEffect(() => {
    if (data && uiData) {
      setCurrentStep(getCurrentStep(data, uiData.uiState));
    }
  }, [data, uiData]);

  function getWidgetPosition(anchorEl, isBefore) {
    const WIDGET_X_PAD = 20;
    const WIDGET_Y_PAD = 20;
    const rect = anchorEl.getBoundingClientRect();

    return {
      left:
        isBefore === "true"
          ? rect.left - widgetWidth - WIDGET_X_PAD
          : rect.right + WIDGET_X_PAD,
      top: rect.top - WIDGET_Y_PAD,
    };
  }

  function getArrowStyle(calloutEl, calloutBefore, widgetStyle) {
    console.log("widgetStyle", widgetStyle);
    const rect = calloutEl.getBoundingClientRect();
    console.log(rect);

    let start, end;
    if (calloutBefore === "true") {
      start = widgetStyle.left + widgetWidth;
      end = rect.x + rect.width / 2;
    } else {
      start = rect.x + rect.width / 2;
      end = widgetStyle.left;
    }

    const width = start - end;

    return {
      left: start,
      width: `${Math.abs(width)}px`,
      height: "2px",
      top: rect.top - 15,
      backgroundColor: "black",
      "::before": {
        left: calloutBefore === "true" ? 0 : "calc(100%-2px)",
      },
      "::after": {
        left: calloutBefore === "true" ? "-8px" : "calc(100%-6px)",
      },
    };
  }

  useEffect(() => {
    if (currentStep) {
      if (currentStep.position) {
        setWidgetStyle({
          left: currentStep.position.x,
          transform: "translateX(-50%) translateY(-50%)",
          top: currentStep.position.y,
        });
      } else {
        // Find anchor / callout elements in the dom
        const callout = document.querySelector(
          `[data-tutorial-callout*="${currentStep.step}"]`
        );
        let calloutBefore;
        if (callout) {
          calloutBefore = callout.getAttribute("data-tutorial-callout-before");
        }
        const anchor = document.querySelector(
          `[data-tutorial-anchor*="${currentStep.step}"]`
        );
        let anchorBefore;
        if (anchor) {
          anchorBefore = anchor.getAttribute("data-tutorial-anchor-before");
        }
        const widgetStyle = getWidgetPosition(anchor, anchorBefore);
        const arrowStyle = getArrowStyle(callout, calloutBefore, widgetStyle);
        setCalloutIsBefore(calloutBefore === "true");
        setWidgetStyle(widgetStyle);
        setArrowStyle(arrowStyle);
      }
    }
    setWidgetCss("animate-fade-in opacity-100");
  }, [currentStep]);

  if (loading) {
    return null;
  }

  if (currentStep) {
    return (
      <>
        <div
          className={`z-50 widget-callout absolute animate-fade-in ${
            calloutIsBefore ? "widget-callout--before" : "widget-callout--after"
          }`}
          style={arrowStyle}
        ></div>
        <div
          style={widgetStyle}
          className={`opacity-0 absolute z-50 rounded shadow-xl bg-white border-2 border-black w-60 h-auto flex flex-col justify-between ${widgetCss} p-2`}
        >
          <div className="flex justify-between font-medium text-sm">
            <span>{currentStep.title}</span>
            <span>
              {currentStep.step}/{steps.length}
            </span>
          </div>
          <div>
            <p className="my-2">{currentStep.body}</p>
          </div>
          <div className="flex justify-between">
            <Button>Skip tutorial</Button>

            <Button
              bigCta
              disabled={currentStep.async}
              onClick={() =>
                setUIStateVar({
                  tutorialProgress: { step: currentStep.nextSyncStep },
                })
              }
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
                currentStep.nextStepText || "Next"
              )}
            </Button>
          </div>
        </div>
      </>
    );
  }
  return null;
}
