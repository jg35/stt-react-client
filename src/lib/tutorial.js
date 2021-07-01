import {
  scrollToFragment,
  scrollToEvent,
  scrollToTimelineTop,
} from "~/lib/timeline";
import { DateTime } from "luxon";
export function getNextStep(steps, data, uiState) {
  return steps.find((step) => !step.isComplete(data, uiState));
}

export function getWidgetStyle(anchorEl, anchorPosition) {
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

export function getArrowStyle(calloutEl, anchorPosition, widgetStyle) {
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

export const steps = [
  registerStep({
    step: 1,
    title: "Welcome",
    body: "Hello! 👋 Since it's your first time here, we have a quick tutorial to get you up and running with Stories To Tell. Sound good?",
    nextText: "Yep, let's go!",
    isComplete: (data, uiState) => uiState.tutorialStep > 1,
    async: false,
    position: { x: "50%", y: "50%" },
    xl: true,
  }),
  registerStep({
    step: 2,
    title: "Timeline",
    body: "Here we are in the timeline view. This is your central hub for adding content to your book.",
    isComplete: (data, uiState) => uiState.tutorialStep > 2,
    async: false,
    anchorSelector: "#nav-items",
    anchorPosition: "RIGHT",
    calloutSelector: "#nav-item-timeline",
  }),
  registerStep({
    step: 3,
    title: "Questions",
    body: "Let’s start by looking at the question panel. When you’re not sure where to begin, answering questions is a great way to start uncovering old memories",
    isComplete: (data, uiState) => uiState.tutorialStep > 3,
    async: false,
    anchorSelector: "#question-panel",
    anchorPosition: "RIGHT",
    calloutSelector: "#question-panel",
  }),
  registerStep({
    step: 4,
    title: "Questions",
    body: "You can change the question by clicking the shuffle button, and you can also change the question category by using the dropdown underneath",
    isComplete: (data, uiState) => uiState.tutorialStep > 4,
    async: false,
    anchorSelector: "#question-panel",
    anchorPosition: "RIGHT",
    calloutSelector: "#shuffle-button-wrapper",
  }),
  registerStep({
    step: 5,
    title: "Questions",
    body: "Find a question that resonates with you and start typing your answer",
    nextText: "Okay",
    isComplete: (data, uiState) =>
      uiState.capture.showModal === true || uiState.tutorialStep > 5,
    async: true,
    anchorSelector: "#question-panel",
    anchorPosition: "RIGHT",
    calloutSelector: "#question-panel",
  }),
  registerStep({
    step: 6,
    title: "Your first memory",
    body: `Answering a question opens up this capture window. Write another sentence or two and when your happy, date your memory`,
    isComplete: (data, uiState) =>
      (uiState.capture.item && uiState.capture.item.date) ||
      uiState.tutorialStep > 6,
    async: true,
    anchorSelector: "#capture-form-wrapper",
    calloutSelector: "#capture-form-wrapper",
    anchorPosition: "RIGHT",
  }),
  registerStep({
    step: 7,
    title: "Your first memory",
    body: `Some memories are reminiscent of a time so won’t have a precise date, so a rough date will do! Now click "Add" to save your memory.`,
    isComplete: (data, uiState) =>
      data.stt_fragment.length > 0 || uiState.tutorialStep > 7,
    async: true,
    anchorSelector: "#form-datepicker",
    calloutSelector: "#form-datepicker",
    anchorPosition: "RIGHT",
  }),
  registerStep({
    step: 8,
    title: "Timeline",
    body: `Brilliant! You’ve now added your first memory.`,
    isComplete: (data, uiState) => uiState.tutorialStep > 8,
    async: false,
    anchorSelector: "div[data-fragment-id]",
    calloutSelector: "div[data-fragment-id]",
    anchorPosition: "RIGHT",
    init: function (data, uiState) {
      scrollToFragment(data.stt_fragment[0].id, false);
      setTutorialStepCss(this.step);
    },
  }),
  registerStep({
    step: 9,
    title: "Timeline",
    body: (data, uiState) =>
      `You’ll notice in each time period there are other actions you can perform, like adding events and photos.`,
    isComplete: (data, uiState) => uiState.tutorialStep > 9,
    async: false,
    anchorSelector: "#section-actions-inner",
    calloutSelector: "#section-actions-event",
    anchorPosition: "LEFT",
    init: function (data, uiState, updateUiState) {
      const activeCaptureIndex = findActiveSectionIndex(
        data.stt_fragment[0].id
      );
      updateUiState({
        tutorialStep: this.step,
        activeCaptureIndex,
      });
      setTutorialStepCss(this.step);
    },
  }),
  registerStep({
    step: 10,
    title: "Event",
    body: (data, uiState) =>
      `Let's add an event now. Events are any big moments in your life that you can date accurately - perhaps when you moved house or changed job. Click "Add event" to continue`,
    isComplete: (data, uiState) =>
      uiState.capture.showModal === true || uiState.tutorialStep > 10,
    async: true,
    anchorSelector: "#section-actions-inner",
    calloutSelector: "#section-actions-event",
    anchorPosition: "LEFT",
    init: function (data, uiState, updateUiState) {
      const activeCaptureIndex = findActiveSectionIndex(
        data.stt_fragment[0].id
      );
      updateUiState({
        tutorialStep: this.step,
        activeCaptureIndex,
      });
      setTutorialStepCss(this.step);
    },
  }),
  registerStep({
    step: 11,
    title: "Your first event",
    body: (data, uiState) =>
      `Try to think of something that happened here in ${
        DateTime.fromISO(data.stt_fragment[0].date).year
      }. Enter a title, change the date (if you like) and click “Add” to create your event`,
    isComplete: (data, uiState) =>
      data.stt_userEvent.length > 0 || uiState.tutorialStep > 12,
    async: true,
    anchorSelector: "#capture-form-wrapper",
    calloutSelector: "#capture-form-wrapper",
    anchorPosition: "RIGHT",
  }),
  registerStep({
    step: 12,
    title: "Timeline",
    body: (data, uiState) =>
      `Great, here's the event in your timeline. Next to your event you might have noticed other events. These are our "World events."`,
    isComplete: (data, uiState) => uiState.tutorialStep > 12,
    async: false,
    calloutSelector: "div[data-user-event-id]",
    anchorPosition: "RIGHT",
    init: function (data, uiState) {
      const eventId = data.stt_userEvent[0].id;
      const event = document.querySelector(
        `div[data-user-event-id="${eventId}"]`
      );
      const section = event.closest("#section-events-grid");
      this.anchorEl = section.querySelector("div[data-world-event-id]");
      scrollToEvent(eventId, false);
      setTutorialStepCss(this.step);
    },
  }),
  registerStep({
    step: 13,
    title: "Timeline",
    body: (data, uiState) =>
      `Like your own events, world events are visible across your timeline to help you date existing memories and remember new ones.`,
    isComplete: (data, uiState) => uiState.tutorialStep > 13,
    async: false,
    anchorPosition: "RIGHT",
    init: function (data, uiState) {
      const event = document.querySelector(
        `div[data-user-event-id="${data.stt_userEvent[0].id}"]`
      );
      const section = event.closest("section");
      // TODO - this relies on there being a world event there, which is not guaranteed. We should provide a fallback
      const worldEvent = section.querySelector("div[data-world-event-id]");
      this.anchorEl = worldEvent;
      this.calloutEl = worldEvent;
      setTutorialStepCss(this.step);
    },
  }),
  registerStep({
    step: 14,
    title: "Timeline",
    body: (data, uiState) =>
      `Let’s try adding a photo now. Click “Add photo” to continue`,
    isComplete: (data, uiState) =>
      uiState.tutorialStep > 14 || uiState.capture.showModal,
    async: true,
    anchorSelector: "#section-actions-inner",
    calloutSelector: "#section-actions-photo",
    anchorPosition: "LEFT",
  }),
  registerStep({
    step: 15,
    title: "Capture - Photo",
    body: (data, uiState) =>
      `Upload your image, enter a caption (if you like) and date your photo. Click “Add” to save your photo.`,
    isComplete: (data, uiState) =>
      data.stt_fragment.find((f) => f.type === "PHOTO") ||
      uiState.tutorialStep > 15,
    async: true,
    anchorSelector: "#capture-form-wrapper",
    calloutSelector: "#capture-form-wrapper",
    anchorPosition: "RIGHT",
  }),
  registerStep({
    step: 16,
    title: "Timeline",
    body: `Wonderful! Now lets try out the preview. Click “Show preview” to see how things would appear in your book.`,
    isComplete: (data, uiState) =>
      uiState.showPreview || uiState.tutorialStep > 16,
    async: true,
    anchorSelector: "#show-preview-btn",
    calloutSelector: "#show-preview-btn",
    anchorPosition: "LEFT",
    init: function (data, uiState) {
      const photo = data.stt_fragment.find((f) => f.type === "PHOTO");
      scrollToFragment(photo, false);
      setTutorialStepCss(this.step);
    },
  }),
  registerStep({
    step: 17,
    title: "Preview",
    body: `Looks great! You might notice that the order of your book is chronological. When you edit memories and change dates, the order of your book will be updated. But don’t worry, when it’s time to edit your book you’ll be able to reorder things in any way you like.`,
    isComplete: (data, uiState) => uiState.tutorialStep > 17,
    async: false,
    anchorSelector: "#preview-container",
    calloutSelector: "#preview-container",
    anchorPosition: "LEFT",
  }),
  registerStep({
    step: 18,
    title: "Chapters",
    body: `No book is complete without a chapter so let's create one. Click "Add chapter" to continue`,
    isComplete: (data, uiState) =>
      uiState.capture.showModal || uiState.tutorialStep > 18,
    async: true,
    anchorSelector: "#section-actions-inner",
    calloutSelector: "#section-actions-chapter",
    anchorPosition: "LEFT",
    init: function (data, uiState, updateUiState) {
      scrollToTimelineTop(false);
      updateUiState({
        tutorialStep: this.step,
        activeCaptureIndex: 0,
      });
      setTutorialStepCss(this.step);
    },
  }),
  registerStep({
    step: 19,
    title: "Your first chapter",
    body: (data, uiState) =>
      `Enter a name and click "Add" to save your chapter`,
    isComplete: (data, uiState) =>
      data.stt_fragment.find((f) => f.type === "CHAPTER") ||
      uiState.tutorialStep > 19,
    async: true,
    anchorSelector: "#capture-form-wrapper",
    calloutSelector: "#capture-form-wrapper",
    anchorPosition: "RIGHT",
  }),
  registerStep({
    step: 20,
    title: "Preview",
    body: `Great! Ut’s looking like a real book now. When you click on content within your preview it will reveal it in your timeline. Try that now.`,
    isComplete: (data, uiState) =>
      uiState.tutorialClickedPreviewFragment || uiState.tutorialStep > 20,
    async: true,
    anchorSelector: "#preview-container",
    calloutSelector: "#preview-container",
    anchorPosition: "LEFT",
    end: function (data, uiState, updateUiState) {
      // updateUiState({ tutorialClickedPreviewFragment: false });
      setTutorialStepCss(this.step, true);
    },
  }),
  registerStep({
    step: 21,
    title: "Timeline cards",
    body: "Nice. Now in let’s click the menu button in one of your timeline cards to reveal more actions",
    isComplete: (data, uiState) => uiState.tutorialStep > 21,
    async: false,
    anchorPosition: "LEFT",
    init: function () {
      const card = document.querySelector('div[data-fragment-type="TEXT"]');
      const cardId = card.getAttribute("data-fragment-id");
      const callout = card.querySelector("#menu button");
      callout.style["pointer-events"] = "all";
      scrollToFragment(parseInt(cardId), false);
      this.anchorEl = card;
      this.calloutEl = callout;
      setTutorialStepCss(this.step);
    },
  }),
  registerStep({
    step: 22,
    title: "Timeline cards",
    body: "From here you can edit and delete your memory, and you can also make memories private if you don’t want them to appear in your book. Try making this memory private now.",
    isComplete: (data, uiState) =>
      data.stt_fragment.find((f) => f.hidden) || uiState.tutorialStep > 22,
    async: true,
    anchorPosition: "LEFT",
    init: function () {
      const card = document.querySelector('div[data-fragment-type="TEXT"]');
      const cardId = card.getAttribute("data-fragment-id");
      const callout = card.querySelector("#menu button");
      callout.style["pointer-events"] = "all";
      scrollToFragment(parseInt(cardId), false);
      this.anchorEl = card;
      this.calloutEl = callout;
      setTutorialStepCss(this.step);
    },
  }),
  registerStep({
    step: 23,
    title: "Preview",
    body: `You'll notice now this memory is no longer in your preview.`,
    nextText: "Finish tutorial",
    isComplete: (data, uiState) => uiState.tutorialStep > 23,
    async: false,
    anchorSelector: "#preview-container",
    calloutSelector: "#preview-container",
    anchorPosition: "LEFT",
  }),
  registerStep({
    step: 24,
    xl: true,
    last: true,
    title: "Summary",
    nextText: "Close",
    body: `Congratulations! 🎉 You're now ready to start adding content to your timeline. Once you've explored fully, head over to the “Edit” view to learn about editing your book.`,
    isComplete: (data, uiState) => uiState.tutorialStep > 24,
    async: false,
    position: { x: "50%", y: "50%" },
    anchorPosition: "LEFT",
  }),
];

function findActiveSectionIndex(fragmentId) {
  const fragment = document.querySelector(
    `div[data-fragment-id="${fragmentId}"]`
  );
  const section = fragment.closest("section");
  return parseInt(section.getAttribute("data-section-index"));
}

function setTutorialStepCss(step, remove = false) {
  if (remove) {
    document.querySelector("#page").classList.remove(`tutorial-step-${step}`);
  } else {
    document.querySelector("#page").classList.add(`tutorial-step-${step}`);
  }
}

function registerStep({
  anchorSelector,
  anchorPosition = "RIGHT",
  async = false,
  calloutSelector,
  before = false,
  body,
  isComplete,
  nextText = "Next",
  position = null,
  last = false,
  step,
  title,
  xl = false,
  init = function (data, uiState, updateUiState) {
    setTutorialStepCss(this.step);
    updateUiState({
      tutorialStep: this.step,
    });
  },
  end = function () {
    setTutorialStepCss(this.step, true);
  },
}) {
  return {
    anchorSelector,
    anchorPosition,
    calloutSelector,
    async,
    before,
    body,
    isComplete,
    nextText,
    position,
    step,
    title,
    xl,
    init,
    end,
    last,
  };
}
