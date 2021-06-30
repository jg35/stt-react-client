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
    title: "Timeline view",
    body: "Here we are in the timeline view. The timeline view is where you will add all of your memories, photos and memorable events",
    nextText: "Sounds good",
    isComplete: (data, uiState) => uiState.tutorialStep > 2,
    async: false,
    anchorId: "nav-items",
    anchorPosition: "RIGHT",
    calloutId: "nav-item-timeline",
  }),
  registerStep({
    step: 3,
    title: "Adding to the timeline",
    body: "As you hover over each section of your timeline, you'll notice some buttons appearing. These actions are how we add content to our timeline",
    nextText: "Okay",
    isComplete: (data, uiState) => uiState.tutorialStep > 3,
    async: false,
    anchorId: "section-actions",
    calloutId: "section-actions-event",
    anchorPosition: "LEFT",
  }),
  registerStep({
    step: 4,
    title: "Adding your first event",
    body: 'Events in your life help uncover new memories. Let\'s add one now by clicking "Add event"',
    isComplete: (data, uiState) =>
      uiState.tutorialStep > 4 ||
      data.stt_userEvent.length ||
      (uiState.capture.item && uiState.capture.item.type === "EVENT"),
    async: true,
    anchorId: "section-actions",
    calloutId: "section-actions-event",
    anchorPosition: "LEFT",
  }),
  registerStep({
    step: 5,
    title: "Adding your first event",
    body: "Think of a big event that has shaped your life - maybe when you last moved, changed jobs or met your life partner.",
    nextText: "Sounds good",
    isComplete: (data, uiState) => uiState.tutorialStep > 5,
    async: false,
    anchorPosition: "RIGHT",
    anchorId: "capture-form-wrapper",
    calloutId: "capture-form-wrapper",
  }),
  registerStep({
    step: 6,
    title: "Adding your first event",
    body: `Enter a title and date and click "Add" to create your event. Don't worry, the date doesn't have to be accurate - we can fix that later.`,
    isComplete: (data, uiState) =>
      uiState.tutorialStep > 6 || data.stt_userEvent.length >= 1,
    async: true,
    anchorId: "capture-form-wrapper",
    calloutId: "capture-form-wrapper",
    anchorPosition: "RIGHT",
  }),
  registerStep({
    step: 7,
    title: "Adding your first memory",
    body: 'Ok great. Now let\'s try adding your first memory. Click "Add memory to continue"',
    isComplete: (data, uiState) =>
      uiState.tutorialStep > 7 ||
      data.stt_fragment.length ||
      (uiState.capture.item && uiState.capture.item.type === "TEXT"),
    async: true,
    anchorPosition: "LEFT",
    anchorId: "section-actions",
    calloutId: "section-actions-memory",
  }),
  registerStep({
    step: 8,
    title: "Adding your first memory",
    body: `Add a date and click "Add" to create your event. Don't worry, the date doesn't have to be accurate - we can fix that later.`,
    isComplete: (data, uiState) => uiState.tutorialStep > 8,
    async: true,
    anchorId: "capture-form-wrapper",
    calloutId: "capture-form-wrapper",
    anchorPosition: "RIGHT",
  }),
];

function setTutorialStepCss(step, remove = false) {
  if (remove) {
    document.querySelector("#page").classList.remove(`tutorial-step-${step}`);
  } else {
    document.querySelector("#page").classList.add(`tutorial-step-${step}`);
  }
}

function registerStep({
  anchorId,
  anchorPosition = "RIGHT",
  async = false,
  calloutId,
  before = false,
  body,
  isComplete,
  nextText = "Next",
  position = null,
  step,
  title,
  xl = false,
}) {
  return {
    anchorId,
    anchorPosition,
    calloutId,
    async,
    before,
    body,
    isComplete,
    nextText,
    position,
    step,
    title,
    xl,
    init: function () {
      setTutorialStepCss(this.step);
    },
    end: function () {
      setTutorialStepCss(this.step, true);
    },
  };
}
