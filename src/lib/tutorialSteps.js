const blurPx = "1px";

export default () => {
  let page;
  function disablePage() {
    if (!page) {
      page = document.querySelector("#page");
    }
    page.style["pointer-events"] = "none";
  }
  function enablePage() {
    if (!page) {
      page = document.querySelector("#page");
    }
    page.style["pointer-events"] = "all";
  }

  function enableElement(selector) {
    document.querySelector(selector).style["pointer-events"] = "all";
  }

  function enableForm({
    textInput = false,
    datePicker = false,
    countrySelect = false,
    submitBtn = false,
  }) {
    if (textInput) {
      enableElement("#form-text-input");
    }
    if (datePicker) {
      enableElement("#form-datepicker");
    }
    if (countrySelect) {
      enableElement("#form-country-select");
    }
    if (submitBtn) {
      enableElement("#form-submit-btn");
    }
  }

  return [
    registerStep({
      step: 1,
      title: "Welcome",
      body: "Hello! 👋 Since it's your first time here, we have a quick tutorial to get you up and running with Stories To Tell. Sound good?",
      nextText: "Yep, let's go!",
      isComplete: (data, uiState) => uiState.tutorialStep > 1,
      async: false,
      position: { x: "50%", y: "50%" },
      xl: true,
      init: () => {
        disablePage();
        document.querySelector("#page").style["filter"] = `blur(${blurPx})`;
      },
      end: (updateUiState) => {
        enablePage();
        document.querySelector("#page").style["filter"] = "blur(0px)";
        updateUiState({ tutorialStep: 2 });
      },
    }),
    registerStep({
      step: 2,
      title: "Timeline view",
      body: "Here we are in the timeline view. The timeline view is where you will add all of your memories, photos and memorable events",
      nextText: "Sounds good",
      isComplete: (data, uiState) => uiState.tutorialStep > 2,
      async: false,
      anchorId: "nav-items",
      calloutId: "nav-item-timeline",
      init: () => {
        disablePage();
      },
      end: (updateUiState) => {
        enablePage();
        updateUiState({ tutorialStep: 3 });
      },
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
      before: true,
      init: () => {
        disablePage();
      },
      end: (updateUiState) => {
        enablePage();
        updateUiState({ tutorialStep: 4 });
      },
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
      before: true,
      init: () => {
        disablePage();
        enableElement("#section-actions-event");
      },
      end: (updateUiState) => {
        enablePage();
        updateUiState({ tutorialStep: 5 });
      },
    }),
    registerStep({
      step: 5,
      title: "Adding your first event",
      body: "Think of a big event that has shaped your life - maybe when you last moved, changed jobs or met your life partner.",
      nextText: "Sounds good",
      isComplete: (data, uiState) => uiState.tutorialStep > 5,
      async: false,
      anchorId: "capture-form-wrapper",
      calloutId: "capture-form-wrapper",
      init: () => {
        disablePage();
      },
      end: (updateUiState) => {
        enablePage();
        updateUiState({ tutorialStep: 6 });
      },
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
      init: () => {
        disablePage();
        enableForm({
          textInput: true,
          datePicker: true,
          submitBtn: true,
        });
      },
      end: (updateUiState) => {
        enablePage();
        updateUiState({ tutorialStep: 7 });
      },
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
      before: true,
      anchorId: "section-actions",
      calloutId: "section-actions-memory",
      init: () => {
        disablePage();
        enableElement("#section-actions-memory");
      },
      end: (updateUiState) => {
        enablePage();
        updateUiState({ tutorialStep: 8 });
      },
    }),
    registerStep({
      step: 8,
      title: "Adding your first memory",
      body: `Add a  and date and click "Add" to create your event. Don't worry, the date doesn't have to be accurate - we can fix that later.`,
      isComplete: (data, uiState) => uiState.tutorialStep > 8,
      async: true,
      anchorId: "capture-form-wrapper",
      calloutId: "capture-form-wrapper",
      init: () => {
        disablePage();
        enableForm({ textEditor: true, datePicker: true, submitBtn: true });
      },
      end: (updateUiState) => {
        enablePage();
        updateUiState({ tutorialStep: 7 });
      },
    }),
  ];
};

function registerStep({
  anchorId,
  async = false,
  calloutId,
  before = false,
  body,
  end = () => {},
  init = () => {},
  isComplete,
  nextText = "Next",
  position = null,
  step,
  title,
  xl = false,
}) {
  return {
    anchorId,
    calloutId,
    async,
    before,
    body,
    end,
    init,
    isComplete,
    nextText,
    position,
    step,
    title,
    xl,
  };
}
