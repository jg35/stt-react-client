import { createPopper } from "@popperjs/core";
import {
  scrollToFragment,
  scrollToEvent,
  scrollToEditFragment,
} from "~/lib/timeline";

export function getNextStep(steps, data, uiState, pathName) {
  return steps.find((step) => !step.isComplete(data, uiState, pathName));
}

function setPopper(referenceEl, popperEl, options) {
  let virtualEl;

  if (!referenceEl || options.fixed) {
    virtualEl = {
      getBoundingClientRect: () => {
        const modal = document.querySelector("#modal-wrapper");
        const height = (modal && modal.clientHeight) || window.innerHeight;
        let y, x;
        if (!options.fixed) {
          y = height / 2 - popperEl.clientHeight / 2;
          x = window.innerWidth / 2 + popperEl.clientWidth / 2;
        } else {
          y = height;
          x = 0;
        }

        return {
          width: popperEl.clientWidth,
          height: popperEl.clientHeight,
          top: y,
          left: x,
          bottom: options.fixed ? 0 : y,
          right: x,
        };
      },
    };
  }

  const showAfterChangeModifier = {
    name: "showAfterChange",
    enabled: true,
    phase: "afterWrite",
    fn({ state }) {
      state.elements.popper.children[0].classList.remove("hidden");
      state.elements.popper.children[0].classList.add("animate-fade-in");
    },
  };

  if (referenceEl || virtualEl) {
    createPopper(virtualEl || referenceEl, popperEl, {
      placement: options.placement,
      modifiers: !virtualEl
        ? [
            {
              name: "arrow",
              options: {
                padding: 8,
              },
            },
            {
              name: "offset",
              options: {
                offset: [0, 12],
              },
            },
            showAfterChangeModifier,
          ]
        : [
            showAfterChangeModifier,
            {
              name: "offset",
              options: {
                offset: [0, 0],
              },
            },
          ],
    });
  }
}

const IS_MOBILE = window.innerWidth < 768;

function getModalMaxHeight(addOffset = 0) {
  const tooltipSize = document.querySelector("#tooltip").clientHeight;
  const padding = IS_MOBILE ? 20 : 40;
  return `calc(var(--vh, 1vh) * 100 - ${tooltipSize + padding + addOffset}px)`;
}

export const steps = [
  registerStep({
    step: 1,
    title: "Timeline created!",
    body: "Since it's your first time here, we have a quick tutorial to get you up and running with Stories To Tell. Sound good?",
    nextText: "Yep, let's go!",
    isComplete: (data, uiState) => uiState.tutorialStep > 1,
    async: false,
    xl: true,
  }),
  registerStep({
    step: 2,
    title: "Timeline",
    body: "Here we are in the timeline view, where you will add content to your book and spend most of your time.",
    isComplete: (data, uiState) => uiState.tutorialStep > 2,
    placement: "bottom-start",
    async: false,
    referenceElSelector: "#nav-item-timeline",
  }),
  registerStep({
    step: 3,
    title: "Questions",
    body: "This is the questions panel. When you’re not sure where to start, answering questions is a great way to start uncovering old memories.",
    isComplete: (data, uiState) => uiState.tutorialStep > 3,
    async: false,
    referenceElSelector: "#question-panel",
  }),
  registerStep({
    step: 4,
    title: "Questions",
    body: "Try changing the question by tapping the shuffle button",
    isComplete: (data, uiState) => uiState.tutorialStep > 4,
    async: false,
    placement: "bottom-end",
    referenceElSelector: "#shuffle-button-wrapper",
  }),
  registerStep({
    step: 5,
    title: "Questions",
    body: "Find a question you like and start typing your answer...",
    nextText: "Okay",
    isComplete: (data, uiState) =>
      data.stt_fragment.length > 0 ||
      uiState.capture.showModal === true ||
      uiState.tutorialStep > 5,
    async: true,
    referenceElSelector: "#question-panel",
  }),
  registerStep({
    step: 6,
    title: "Your first memory",
    body: `Write another sentence or two and when your happy, date your memory and click "Add" to save your memory...`,
    isComplete: (data, uiState) =>
      data.stt_fragment.length > 0 || uiState.tutorialStep > 6,
    async: true,
    fixed: true,
    saveProgress: false,
    referenceElSelector: "#form-text-editor",
    placement: "bottom-end",
    preInit: function (data, uiState, updateUiState) {
      updateUiState(
        {
          questionVisible: false,
        },
        false
      );
      const modalWrapper = document.querySelector("#capture-form-wrapper");
      modalWrapper.style["max-height"] = getModalMaxHeight();
    },
  }),
  registerStep({
    step: 7,
    title: "Timeline",
    body: `Brilliant! You’ve now added your first memory.`,
    isComplete: (data, uiState) => uiState.tutorialStep > 7,
    async: false,
    placement: "top",
    referenceElSelector: "div[data-fragment-id]",
    preInit: function (data, uiState, updateUiState) {
      scrollToFragment(data.stt_fragment[0].id, false);
    },
  }),
  registerStep({
    step: 8,
    title: "Timeline",
    body: `Right now your timeline is divided into years, but you can also see it in seasons and months`,
    isComplete: (data, uiState) => uiState.tutorialStep > 8,
    async: false,
    referenceElSelector: "#time-period-selector button",
    placement: "top-start",
  }),
  registerStep({
    step: 9,
    title: "Timeline",
    body: `You’ll notice in each time period there are other actions you can perform, like adding events and photos`,
    isComplete: (data, uiState) => uiState.tutorialStep > 9,
    async: false,
    placement: "top-start",
    preInit: function (data, uiState, updateUiState) {
      scrollToFragment(data.stt_fragment[0].id, false);
      const activeCaptureIndex = findActiveSectionIndex(
        data.stt_fragment[0].id
      );
      updateUiState(
        {
          activeCaptureIndex,
        },
        false
      );
      this.referenceElSelector = `div[data-section-actions-index="${activeCaptureIndex}"] button`;
    },
  }),
  registerStep({
    step: 10,
    title: "Event",
    body: (data, uiState) =>
      `Let's add an event now. Events are visual markers to help trigger other memories. Click here to continue...`,
    isComplete: (data, uiState) =>
      data.stt_userEvent.length > 0 ||
      uiState.capture.showModal === true ||
      uiState.tutorialStep > 10,
    async: true,
    placement: "top-end",
    preInit: function (data, uiState, updateUiState) {
      const activeCaptureIndex = findActiveSectionIndex(
        data.stt_fragment[0].id
      );
      updateUiState(
        {
          activeCaptureIndex,
        },
        false
      );
      this.referenceElSelector = `#section-actions-event-index-${activeCaptureIndex}`;
    },
  }),
  registerStep({
    step: 11,
    title: "Your first event",
    body: (data, uiState) =>
      `Think of something that has hapepend in your life. Enter a title, set the date and click “Add” to create your event...`,
    isComplete: (data, uiState) =>
      data.stt_userEvent.length > 0 || uiState.tutorialStep > 11,
    async: true,
    saveProgress: false,
    referenceElSelector: "#capture-form-wrapper",
    placement: "auto",
    preInit: function (data) {
      const modalWrapper = document.querySelector("#capture-form-wrapper");
      modalWrapper.style["max-height"] = getModalMaxHeight();
    },
    fixed: true,
  }),
  registerStep({
    step: 12,
    title: "Timeline",
    body: (data, uiState) =>
      `Great, here's the event in your timeline. Next to your event you'll also see "World events."`,
    isComplete: (data, uiState) => uiState.tutorialStep > 12,
    async: false,
    placement: "top-start",
    preInit: function (data) {
      const eventId = data.stt_userEvent[0].id;
      scrollToEvent(eventId, false);
      this.referenceElSelector = `button[data-user-event-id="${eventId}"]`;
    },
  }),
  registerStep({
    step: 13,
    title: "Timeline",
    body: (data, uiState) =>
      `Like your own events, world events are visible across your timeline to help you date existing memories and remember new ones.`,
    isComplete: (data, uiState) => uiState.tutorialStep > 13,
    async: false,
    placement: "top-start",
    preInit: function (data) {
      const eventId = data.stt_userEvent[0].id;
      scrollToEvent(eventId, false);
      const event = document.querySelector(
        `button[data-user-event-id="${eventId}"]`
      );
      const section = event.closest("section");
      const sectionIndex = section.getAttribute("data-section-index");
      this.referenceElSelector = `section[data-section-index="${sectionIndex}"] div[data-world-event-id]`;
    },
  }),
  registerStep({
    step: 14,
    title: "Timeline",
    body: (data, uiState) =>
      `Let’s try adding a photo now. Click here to continue...`,
    isComplete: (data, uiState) =>
      data.stt_fragment.find((f) => f.type === "PHOTO") ||
      uiState.tutorialStep > 14 ||
      uiState.capture.showModal === true,
    async: true,
    placement: "top-end",
    preInit: function (data, uiState, updateUiState) {
      const activeCaptureIndex = findActiveSectionIndex(
        data.stt_userEvent[0].id,
        true
      );
      this.referenceElSelector = `button#section-actions-photo-index-${activeCaptureIndex}`;
      updateUiState({
        activeCaptureIndex,
      });
    },
  }),
  registerStep({
    step: 15,
    title: "Capture - Photo",
    body: (data, uiState) =>
      `Upload your image, enter a caption (if you like) and date your photo. Click “Add” to save your photo...`,
    isComplete: (data, uiState) =>
      data.stt_fragment.find((f) => f.type === "PHOTO") ||
      uiState.tutorialStep > 15,
    async: true,
    saveProgress: false,
    preInit: function () {
      const max = getModalMaxHeight();
      // const uppyInnerMax = getModalMaxHeight(40);
      const uppyInner = document.querySelector(".uppy-Dashboard-inner");
      document.querySelector("#capture-form-wrapper").style["max-height"] = max;
      uppyInner.style["top"] = 12;
      if (window.innerWidth >= 820) {
        uppyInner.style["top"] = 0;
        uppyInner.style["transform"] = "translateX(-50%)";
      }
    },
    fixed: true,
  }),

  registerStep({
    step: 16,
    title: "Chapters",
    body: `Every book needs a chapter so let's create one. Click here to continue...`,
    placement: "top-end",
    isComplete: (data, uiState) =>
      data.stt_fragment.find((f) => f.type === "CHAPTER") ||
      uiState.capture.showModal === true ||
      uiState.tutorialStep > 16,
    async: true,
    placement: "top-end",
    preInit: function (data, uiState, updateUiState) {
      const photoId = data.stt_fragment.find((f) => f.type === "PHOTO").id;
      const activeCaptureIndex = findActiveSectionIndex(photoId);
      this.referenceElSelector = `button#section-actions-chapter-index-${activeCaptureIndex}`;
      updateUiState({
        activeCaptureIndex,
      });
      scrollToFragment(photoId, false);
    },
  }),
  registerStep({
    step: 17,
    title: "Your first chapter",
    body: (data, uiState) =>
      `Enter a name and click "Add" to save your chapter...`,
    isComplete: (data, uiState) =>
      data.stt_fragment.find((f) => f.type === "CHAPTER") ||
      uiState.tutorialStep > 17,
    async: true,
    saveProgress: false,
    referenceElSelector: "#capture-form-wrapper",
    placement: "bottom-end",
    preInit: function () {
      document.querySelector("#capture-form-wrapper").style["max-height"] =
        getModalMaxHeight();
    },
    fixed: true,
  }),
  registerStep({
    step: 18,
    title: "Editing",
    body: (data, uiState) =>
      `Fantastic, all of the different bits are there in our timeline now. Let’s head over to the edit view now...`,
    placement: "bottom-start",
    isComplete: (data, uiState, pathName) =>
      pathName.includes("edit") || uiState.tutorialStep > 18,
    async: true,
    referenceElSelector: "#nav-item-edit",
  }),
  registerStep({
    step: 19,
    title: "Editing",
    saveProgress: false,
    body: (data, uiState) =>
      `The edit view shows you what your book will look like in it’s final form and makes it easy to make quick edits to your memories`,
    isComplete: (data, uiState) => uiState.tutorialStep > 19,
    placement: "auto",
    referenceElSelector: ".js-preview-scroll-container div",
  }),
  registerStep({
    step: 20,
    title: "Editing",
    body: (data, uiState) =>
      `Memories in your book are in date order. If something isn't in the right place, just update the date.`,
    isComplete: (data, uiState) => uiState.tutorialStep > 20,
    placement: "auto",
    referenceElSelector: ".js-preview-scroll-container > div",
    nextText: "Okay",
  }),
  registerStep({
    step: 21,
    title: "Editing",
    body: (data, uiState) =>
      `To edit one of your memories, click into it and start typing. Click outside or press tab to save your changes.`,
    isComplete: (data, uiState) => uiState.tutorialStep > 21,
    nextText: "Okay",
    placement: "auto",
    preInit: function (data) {
      const frag = data.stt_fragment.find((f) => f.type === "TEXT");
      scrollToEditFragment(frag.id);
      this.referenceElSelector = `div[data-preview-fragment-id="${frag.id}"]`;
    },
  }),
  registerStep({
    step: 22,
    title: "🧠",
    body: (data, uiState) =>
      `In general think of the timeline view as where you capture content for your book, and the edit view as where you do most of your writing.`,
    isComplete: (data, uiState) => uiState.tutorialStep > 22,
    xl: true,
    nextText: "Got it",
  }),
  registerStep({
    step: 23,
    title: "Publishing",
    body: (data, uiState) =>
      `The only thing left is to publish your book, but let's cross that bridge a bit later!`,
    isComplete: (data, uiState) => uiState.tutorialStep > 23,
    referenceElSelector: "#nav-item-publish",
    nextText: "Finish",
  }),
  registerStep({
    step: 24,
    xl: true,
    last: true,
    title: "The end",
    nextText: "Close tutorial",
    body: `You're now ready to start filling out your timeline with your memories. If you need help with any of the topics covered, look for the help button in the main menu.`,
    isComplete: (data, uiState) => uiState.tutorialStep > 24,
    async: false,
  }),
];

function findActiveSectionIndex(itemId, isEvent = false) {
  let target;
  if (!isEvent) {
    target = document.querySelector(`div[data-fragment-id="${itemId}"]`);
  } else {
    target = document.querySelector(`button[data-user-event-id="${itemId}"]`);
  }

  const section = target.closest("section");
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
  async = false,
  body,
  referenceElSelector,
  fixed = false,
  isComplete,
  last = false,
  nextText = "Next",
  delay = 50,
  placement = "auto",
  preInit = null,
  saveProgress = true,
  step,
  title,
  xl = false,
}) {
  return {
    async,
    body,
    referenceElSelector,
    fixed,
    isComplete,
    last,
    nextText,
    delay,
    placement,
    preInit,
    saveProgress,
    step,
    title,
    xl,
    init: function (data, uiState, updateUiState, popperEl) {
      if (this.preInit) {
        this.preInit(data, uiState, updateUiState);
      }
      if (this.saveProgress) {
        updateUiState({
          tutorialStep: this.step,
        });
      }
      setTutorialStepCss(this.step);

      setTimeout(() => {
        const referenceEl = document.querySelector(this.referenceElSelector);
        setPopper(referenceEl, popperEl, {
          fixed: this.fixed,
          placement: this.placement,
        });
      }, this.delay);
    },
    end: function () {
      setTutorialStepCss(this.step, true);
    },
  };
}
