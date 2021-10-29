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
    title: "Welcome 👋",
    body: `This tutorial gives you a short introduction to the timeline, so you're ready to start adding things to your book.`,
    nextText: "Start",
    isComplete: (data, uiState) => uiState.tutorial.step > 1,
    async: false,
    xl: true,
  }),
  registerStep({
    step: 2,
    title: "Timeline",
    body: `We start in the timeline view. If you ever get lost using the app click here to come back to where you started.`,
    isComplete: (data, uiState) => uiState.tutorial.step > 2,
    placement: "bottom-start",
    async: false,
    referenceElSelector: "#nav-item-timeline",
    preInit: function (data, uiState, updateUiState) {
      scrollToFragment(data.stt_fragment[0].id, false);
    },
  }),
  registerStep({
    step: 3,
    title: "Questions",
    body: `Our questions panel is a great way to start rediscovering old memories. We have over 150 questions to answer about your life - and this list grows every day!`,
    isComplete: (data, uiState) => uiState.tutorial.step > 3,
    async: false,
    referenceElSelector: "#question-panel",
  }),
  registerStep({
    step: 4,
    title: "Questions",
    body: `The shuffle button lets you start cycling through the questions available.`,
    isComplete: (data, uiState) => uiState.tutorial.step > 4,
    async: false,
    placement: "bottom",
    referenceElSelector: "#shuffle-button-wrapper",
  }),
  // registerStep({
  //   step: 5,
  //   title: "Questions",
  //   body: `Notice each question is tagged. If a tag isn't relevant to you, click on the dots in the corner to open the question menu. There you can hide questions with that tag.`,
  //   isComplete: (data, uiState) =>
  //     window.innerWidth < 768 || uiState.tutorial.step > 5,
  //   async: false,
  //   placement: "bottom",
  //   referenceElSelector: "#question-tag",
  // }),
  registerStep({
    step: 6,
    title: "Questions",
    body: `There are many sets of questions about different areas of your life. You can click on the current question pack to swap it out.`,
    isComplete: (data, uiState) => uiState.tutorial.step > 6,
    placement: "auto",
    async: false,
    referenceElSelector: "#question-select-button",
  }),
  registerStep({
    step: 7,
    title: "Questions",
    body: `When you find a question you like, you can start typing in the text field above to answer your question.`,
    isComplete: (data, uiState) => uiState.tutorial.step > 7,
    async: false,
    referenceElSelector: "#form-question-text-input",
  }),
  registerStep({
    step: 8,
    title: "Timeline",
    body: `Here's a question we prepared earlier, now an entry in our timeline. We can see the original question at the bottom of the card.`,
    isComplete: (data, uiState) => uiState.tutorial.step > 8,
    async: false,
    placement: "top",
    referenceElSelector: "div[data-fragment-id]",
    preInit: function (data, uiState, updateUiState) {
      updateUiState({ questionVisible: false }, false);
      const frag = data.stt_fragment.find((f) => !!f.questionId);
      this.referenceElSelector = `div[data-fragment-id="${frag.id}"]`;
      scrollToFragment(frag.id, false);
    },
  }),
  registerStep({
    step: 9,
    title: "Timeline",
    body: `Other entries are also here - a chapter, another text memory and a chapter. Notice how our chapter and question share the same date.`,
    isComplete: (data, uiState) => uiState.tutorial.step > 9,
    async: false,
    placement: "top-start",
    referenceElSelector: "div[data-fragment-id]",
    // TODO - HIGHLIGHT THE ONE IN THE MIDDLE
    preInit: function (data, uiState, updateUiState) {
      const frag = data.stt_fragment.find(
        (f) => f.type === "CHAPTER" && !f.questionId
      );
      this.referenceElSelector = `div[data-fragment-id="${frag.id}"] #fragment-header-date`;
      scrollToFragment(frag.id, false);
    },
  }),
  registerStep({
    step: 10,
    title: "Timeline",
    body: `When things share the same date we can manually reorder them by clicking on one of the directional arrows.`,
    isComplete: (data, uiState) => uiState.tutorial.step > 10,
    async: false,
    placement: "top",
    referenceElSelector: "div[data-fragment-id]",
    // TODO - HIGHLIGHT THE ONE IN THE MIDDLE
    preInit: function (data, uiState, updateUiState) {
      const frag = data.stt_fragment.find(
        (f) => f.type === "CHAPTER" && !f.questionId
      );
      this.referenceElSelector = `div[data-fragment-id="${frag.id}"] #fragment-header-reorder-button`;
      scrollToFragment(frag.id, false);
    },
  }),
  registerStep({
    step: 11,
    title: "Timeline",
    body: `Your timeline is strictly chronological as this creates the structure for your book. To get things where they need to be you can edit the date.`,
    isComplete: (data, uiState) => uiState.tutorial.step > 11,
    async: false,
    xl: true,
  }),
  registerStep({
    step: 12,
    title: "Timeline",
    body: `To do that, just click on the centre of the timeline card to update it. For other things you can do, click on the three little dots in the corner.`,
    isComplete: (data, uiState) => uiState.tutorial.step > 12,
    async: false,
    placement: "top",
    referenceElSelector: "div[data-fragment-id]",
    preInit: function (data, uiState, updateUiState) {
      const frag = data.stt_fragment.find((f) => !!f.questionId);
      this.referenceElSelector = `div[data-fragment-id="${frag.id}"]`;
      scrollToFragment(frag.id, false);
    },
  }),

  registerStep({
    step: 13,
    title: "Timeline",
    body: `To add new content, just click on one of these buttons. We'll estimate the date for you, but try to set your own date if you can.`,
    isComplete: (data, uiState) => uiState.tutorial.step > 13,
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
    step: 14,
    title: "Timeline",
    body: (data, uiState) =>
      `Above our timeline cards are our events. Events are simple markers to remind you of things that happened in your life around the same time.`,
    isComplete: (data, uiState) => uiState.tutorial.step > 14,
    async: false,
    placement: "top-start",
    referenceElSelector: "button[data-user-event-id]",
    preInit: function (data) {
      const eventId = data.stt_userEvent[0].id;
      scrollToEvent(eventId, false);
    },
  }),
  registerStep({
    step: 15,
    title: "Timeline",
    body: (data, uiState) =>
      `The blue events are events you create yourself. Brown events are our world events. Events are not included in your book.`,
    isComplete: (data, uiState) => uiState.tutorial.step > 15,
    async: false,
    placement: "top-start",
    referenceElSelector: "button[data-user-event-id]",
    preInit: function (data) {
      const eventId = data.stt_userEvent[0].id;
      scrollToEvent(eventId, false);
    },
  }),
  registerStep({
    step: 16,
    title: "Timeline",
    body: (data, uiState) =>
      `World events might help to remind you exactly where you were on that day, while others might just remind you of the trends at that time.`,
    isComplete: (data, uiState) => uiState.tutorial.step > 16,
    async: false,
    placement: "top-start",
    referenceElSelector: "button[data-world-event-id]",
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
    step: 17,
    title: "Timeline",
    body: `Finally we can also change the scale of our timeline. Right now it's set to years, but we can also zoom in to see it in seasons and months.`,
    isComplete: (data, uiState) => uiState.tutorial.step > 17,
    async: false,
    referenceElSelector: "#time-period-selector button",
    placement: "top-start",
  }),
  registerStep({
    step: 18,
    xl: true,
    last: true,
    title: "The end",
    nextText: "Close tutorial",
    body: `If you need help with any of the topics covered, look for the help button in the main menu. We'll be there to help you!`,
    isComplete: (data, uiState) => uiState.tutorial.step > 18,
    async: false,
  }),

  // registerStep({
  //   step: 18,
  //   title: "Editing",
  //   body: (data, uiState) =>
  //     `Fantastic, all of the different bits are there in our timeline now. Let’s head over to the edit view now...`,
  //   placement: "bottom-start",
  //   isComplete: (data, uiState, pathName) =>
  //     pathName.includes("edit") || uiState.tutorial.step > 18,
  //   async: true,
  //   referenceElSelector: "#nav-item-edit",
  // }),
  // registerStep({
  //   step: 19,
  //   title: "Editing",
  //   body: (data, uiState) =>
  //     `The edit view shows you what your book will look like in it’s final form and makes it easy to make quick edits to your memories`,
  //   isComplete: (data, uiState) => uiState.tutorial.step > 19,
  //   placement: "auto",
  //   referenceElSelector: ".js-preview-scroll-container div",
  // }),
  // registerStep({
  //   step: 20,
  //   title: "Editing",
  //   body: (data, uiState) =>
  //     `Memories in your book are in date order. If something isn't in the right place, just update the date.`,
  //   isComplete: (data, uiState) => uiState.tutorial.step > 20,
  //   placement: "auto",
  //   referenceElSelector: ".js-preview-scroll-container > div",
  //   nextText: "Okay",
  // }),
  // registerStep({
  //   step: 21,
  //   title: "Editing",
  //   body: (data, uiState) =>
  //     `To edit one of your memories, click into it and start typing. Click outside or press tab to save your changes.`,
  //   isComplete: (data, uiState) => uiState.tutorial.step > 21,
  //   nextText: "Okay",
  //   placement: "auto",
  //   preInit: function (data) {
  //     const frag = data.stt_fragment.find((f) => f.type === "TEXT");
  //     scrollToEditFragment(frag.id);
  //     this.referenceElSelector = `div[data-preview-fragment-id="${frag.id}"]`;
  //   },
  // }),
  // registerStep({
  //   step: 22,
  //   title: "🧠",
  //   body: (data, uiState) =>
  //     `In general think of the timeline view as where you capture content for your book, and the edit view as where you do most of your writing.`,
  //   isComplete: (data, uiState) => uiState.tutorial.step > 22,
  //   xl: true,
  //   nextText: "Got it",
  // }),
  // registerStep({
  //   step: 23,
  //   title: "Publishing",
  //   body: (data, uiState) =>
  //     `The only thing left is to publish your book, but let's cross that bridge a bit later!`,
  //   isComplete: (data, uiState) => uiState.tutorial.step > 23,
  //   referenceElSelector: "#nav-item-publish",
  //   nextText: "Finish",
  // }),
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
    step,
    title,
    xl,
    init: function (data, uiState, updateUiState, popperEl) {
      if (this.preInit) {
        this.preInit(data, uiState, updateUiState);
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
