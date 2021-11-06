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
    body: `This tutorial gives you a short introduction to the timeline, so you're ready to start adding things to your book.`,
    nextText: "Start",
    isComplete: (data, uiState) => uiState.tutorial.step > 1,
    async: false,
    xl: true,
  }),
  registerStep({
    step: 2,
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
    body: `Answering questions is a great way to start rediscovering old memories. We have over 200 questions to answer about your life and this list grows each day!`,
    isComplete: (data, uiState) => uiState.tutorial.step > 3,
    async: false,
    referenceElSelector: "#question-panel",
  }),
  registerStep({
    step: 4,
    body: `To move onto a different question, click the shuffle button.`,
    isComplete: (data, uiState) => uiState.tutorial.step > 4,
    async: false,
    placement: "auto",
    referenceElSelector: "#shuffle-button-wrapper",
  }),
  registerStep({
    step: 5,
    body: `To choose a different set of questions, click here to view other question packs.`,
    isComplete: (data, uiState) => uiState.tutorial.step > 5,
    placement: "auto",
    async: false,
    referenceElSelector: "#question-select-button",
  }),
  registerStep({
    step: 6,
    body: `When you find a question you like, begin answering your question by typing in this text field.`,
    placement: "bottom-start",
    isComplete: (data, uiState) => uiState.tutorial.step > 6,
    async: false,
    referenceElSelector: "#form-question-text-input",
  }),
  registerStep({
    step: 7,
    body: `Here's a question we prepared earlier, now an entry in our timeline. We can see the original question at the bottom of the card.`,
    isComplete: (data, uiState) => uiState.tutorial.step > 7,
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
    step: 8,
    body: `Other entries are also here - a chapter, another memory and a photo.`,
    isComplete: (data, uiState) => uiState.tutorial.step > 8,
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
    step: 9,
    body: `Our question and chapter share the same date. When things share the same date we can manually reorder them by clicking on these arrows.`,
    isComplete: (data, uiState) => uiState.tutorial.step > 9,
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
    step: 10,
    body: `Your timeline is a strictly chronological document. If a memory is in the wrong place you will need to update the date.`,
    isComplete: (data, uiState) => uiState.tutorial.step > 10,
    async: false,
    xl: true,
  }),
  registerStep({
    step: 11,
    body: `To do that, click on the the card to update it. For other things you can do, click on the little dots in the corner.`,
    isComplete: (data, uiState) => uiState.tutorial.step > 11,
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
    step: 12,
    body: `To add new content, just click on one of these buttons.`,
    isComplete: (data, uiState) => uiState.tutorial.step > 12,
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
    step: 13,
    body: (data, uiState) =>
      `Above our timeline cards are events, simple markers to remind you about things that happened in your lifetime. Blue events are about your own life.`,
    isComplete: (data, uiState) => uiState.tutorial.step > 13,
    async: false,
    placement: "top-start",
    referenceElSelector: "button[data-user-event-id]",
    preInit: function (data) {
      const eventId = data.stt_userEvent[0].id;
      scrollToEvent(eventId, false);
    },
  }),
  registerStep({
    step: 14,
    body: (data, uiState) =>
      `And here is a world event. They can help to remind you where you were on that day or give you a sense of the trends at the time.`,
    isComplete: (data, uiState) => uiState.tutorial.step > 14,
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
    step: 15,
    body: `Finally we can also change the scale of our timeline. Right now it's set to years, but we can also zoom in to see it in seasons and months.`,
    isComplete: (data, uiState) => uiState.tutorial.step > 15,
    async: false,
    referenceElSelector: "#time-period-selector button",
    placement: "top-start",
  }),
  registerStep({
    step: 16,
    xl: true,
    last: true,
    nextText: "Close tutorial",
    body: `That's all for now. If you need help with any of the topics covered, click on the help button in the main menu and send us a message. We'll be there to help you!`,
    isComplete: (data, uiState) => uiState.tutorial.step > 16,
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
