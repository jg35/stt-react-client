import { createPopper } from "@popperjs/core";
import {
  scrollToFragment,
  scrollToEvent,
  scrollToEditFragment,
  scrollToTimelineTop,
} from "~/lib/timeline";

export function getNextStep(steps, data, uiState, history) {
  return steps.find((step) => !step.isComplete(data, uiState, history));
}

function setPopper(referenceEl, popperEl, options) {
  let virtualEl;

  if (!referenceEl || options.fixed) {
    virtualEl = {
      getBoundingClientRect: () => {
        let y, x;
        if (!options.fixed) {
          y = window.innerHeight / 2 - popperEl.clientHeight / 2;
          x = window.innerWidth / 2 + popperEl.clientWidth / 2;
        } else {
          y = window.innerHeight;
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

  if (referenceEl || virtualEl) {
    createPopper(referenceEl || virtualEl, popperEl, {
      placement: options.placement,
      modifiers: referenceEl
        ? [
            {
              name: "arrow",
            },
            {
              name: "offset",
              options: {
                offset: [12, 12],
              },
            },
          ]
        : [],
    });
  }
}

const IS_MOBILE = window.innerWidth < 768;

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
    body: "Here we are in the timeline view. This is the place where you will add content to your book and where you will spend most of your time.",
    isComplete: (data, uiState) => uiState.tutorialStep > 2,
    async: false,
    referenceElSelector: "#nav-item-timeline",
  }),
  registerStep({
    step: 3,
    title: "Questions",
    body: "This is the questions panel. When you’re not sure where to begin, answering questions is a great way to start uncovering old memories",
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
    referenceElSelector: "#question-panel",
  }),
  registerStep({
    step: 5,
    title: "Questions",
    body: "Find a question that resonates with you and start typing your answer",
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
    body: `Answering a question opens up this capture window. Write another sentence or two and when your happy, date your memory and click "Add" to save your memory.`,
    isComplete: (data, uiState) =>
      data.stt_fragment.length > 0 ||
      (uiState.capture.item && uiState.capture.item.date) ||
      uiState.tutorialStep > 6,
    async: true,
    fixed: IS_MOBILE,
    saveProgress: false,
    preInit: function () {
      if (IS_MOBILE) {
        const modalWrapper = document.querySelector("#capture-form-wrapper");
        modalWrapper.style["max-height"] = "calc(var(--vh, 1vh) * 100 - 180px)";
      }
    },
  }),
  registerStep({
    step: 7,
    title: "Timeline",
    body: `Brilliant! You’ve now added your first memory.`,
    isComplete: (data, uiState) => uiState.tutorialStep > 7,
    async: false,
    referenceElSelector: "div[data-fragment-id]",
    preInit: function (data) {
      scrollToFragment(data.stt_fragment[0].id, false);
    },
  }),
  registerStep({
    step: 8,
    title: "Timeline",
    body: `You’ll notice in each time period there are other actions you can perform, like adding events and photos.`,
    isComplete: (data, uiState) => uiState.tutorialStep > 8,
    async: false,
    placement: "top",
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
      this.referenceElSelector = `div[data-section-actions-index="${activeCaptureIndex}"]`;
    },
  }),
  registerStep({
    step: 9,
    title: "Event",
    body: (data, uiState) =>
      `Let's add an event now. Events are any big moments in your life - perhaps when you moved house or changed job. Click ${
        IS_MOBILE ? "on the calendar icon" : "'Add event'"
      } to continue`,
    isComplete: (data, uiState) =>
      data.stt_userEvent.length > 0 ||
      uiState.capture.showModal === true ||
      uiState.tutorialStep > 9,
    async: true,
    placement: "top",
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
    step: 10,
    title: "Your first event",
    body: (data, uiState) =>
      `Think of something memorable that has hapepend in your life. Enter a title, set the date and click “Add” to create your event`,
    isComplete: (data, uiState) =>
      data.stt_userEvent.length > 0 || uiState.tutorialStep > 10,
    async: true,
    saveProgress: false,
    preInit: function (data) {
      if (IS_MOBILE) {
        const modalWrapper = document.querySelector("#capture-form-wrapper");
        modalWrapper.style["max-height"] = "calc(var(--vh, 1vh) * 100 - 180px)";
      }
    },
    fixed: IS_MOBILE,
  }),
  registerStep({
    step: 11,
    title: "Timeline",
    body: (data, uiState) =>
      `Great, here's the event in your timeline. Next to your event you will also see "World events."`,
    isComplete: (data, uiState) => uiState.tutorialStep > 11,
    async: false,
    placement: "top",
    preInit: function (data) {
      const eventId = data.stt_userEvent[0].id;
      scrollToEvent(eventId, false);
      this.referenceElSelector = `button[data-user-event-id="${eventId}"]`;
    },
  }),
  registerStep({
    step: 12,
    title: "Timeline",
    body: (data, uiState) =>
      `Like your own events, world events are visible across your timeline to help you date existing memories and remember new ones.`,
    isComplete: (data, uiState) => uiState.tutorialStep > 12,
    async: false,
    placement: "top",
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
    step: 13,
    title: "Timeline",
    body: (data, uiState) =>
      `Let’s try adding a photo now. ${
        IS_MOBILE ? "Tap the camera icon" : 'Click "Add photo"'
      } to continue`,
    isComplete: (data, uiState) =>
      data.stt_fragment.find((f) => f.type === "PHOTO") ||
      uiState.tutorialStep > 13 ||
      uiState.capture.showModal === true,
    async: true,
    placement: "top",
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
    step: 14,
    title: "Capture - Photo",
    body: (data, uiState) =>
      `Upload your image, enter a caption (if you like) and date your photo. Click “Add” to save your photo.`,
    isComplete: (data, uiState) =>
      data.stt_fragment.find((f) => f.type === "PHOTO") ||
      uiState.tutorialStep > 14,
    async: true,
    saveProgress: false,
    preInit: function () {
      if (IS_MOBILE) {
        const max = "calc(var(--vh, 1vh) * 100 - 180px)";
        const uppyInnerMax = "calc(var(--vh, 1vh) * 100 - 250px)";
        document.querySelector("#capture-form-wrapper").style["max-height"] =
          max;
        document.querySelector(".uppy-Dashboard-inner").style["max-height"] =
          uppyInnerMax;
      }
    },
    fixed: IS_MOBILE,
  }),

  registerStep({
    step: 15,
    title: "Chapters",
    body: `Every book needs a chapter so let's create one. ${
      IS_MOBILE ? "Tap the bookmark icon" : 'Click "Add chapter"'
    } to continue`,
    isComplete: (data, uiState) =>
      data.stt_fragment.find((f) => f.type === "CHAPTER") ||
      uiState.capture.showModal === true ||
      uiState.tutorialStep > 15,
    async: true,
    placement: "top",
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
    step: 16,
    title: "Your first chapter",
    body: (data, uiState) =>
      `Enter a name and click "Add" to save your chapter`,
    isComplete: (data, uiState) =>
      data.stt_fragment.find((f) => f.type === "CHAPTER") ||
      uiState.tutorialStep > 16,
    async: true,
    saveProgress: false,
    preInit: function () {
      // TODO - on desktop need to set the referenceElSelector
      if (IS_MOBILE) {
        const max = "calc(var(--vh, 1vh) * 100 - 180px)";
        document.querySelector("#capture-form-wrapper").style["max-height"] =
          max;
      }
    },
    fixed: IS_MOBILE,
  }),
  registerStep({
    step: 17,
    title: "Edit view",
    body: (data, uiState) =>
      `Fantastic, all of the different bits are there in our timeline now. Let’s head over to the edit view now`,
    placement: "bottom",
    isComplete: (data, uiState, history) =>
      history.location.pathname.includes("edit") || uiState.tutorialStep > 17,
    async: true,
    referenceElSelector: "#nav-item-edit",
  }),
  registerStep({
    step: 18,
    title: "Edit view",
    body: (data, uiState) =>
      `The edit view shows you what your book will look like in it’s final form and makes it easy to make quick edits to your memories`,
    isComplete: (data, uiState) => uiState.tutorialStep > 18,
    // referenceElSelector: ".js-preview-scroll-container",
  }),
  registerStep({
    step: 19,
    title: "Edit view",
    body: (data, uiState) =>
      `The memories in your book are ordered chronologically. You can update the date to move something that isn't in the right place`,
    isComplete: (data, uiState) => uiState.tutorialStep > 19,
    referenceElSelector: ".js-preview-scroll-container > div",
    nextText: "Okay",
  }),
  registerStep({
    step: 20,
    title: "Edit view",
    body: (data, uiState) =>
      `To edit one of your memories, click into it and start typing. When you're done click or tab outside the entry to save your changes`,
    isComplete: (data, uiState) => uiState.tutorialStep > 20,
    nextText: "Okay",
    placement: "bottom",
    preInit: function (data) {
      const frag = data.stt_fragment.find((f) => f.type === "TEXT");
      scrollToEditFragment(frag.id);
      this.referenceElSelector = `div[data-preview-fragment-id="${frag.id}"]`;
    },
  }),
  registerStep({
    step: 21,
    title: "Edit view",
    body: (data, uiState) =>
      `In general think of the timeline view as where you capture content for your book, and the edit view as where you do most of your writing`,
    isComplete: (data, uiState) => uiState.tutorialStep > 21,
    // referenceElSelector: "#nav-item-edit",
  }),
  registerStep({
    step: 22,
    title: "Publish view",
    body: (data, uiState) =>
      `The only thing left to cover is the publish view, but let's talk about that later when you're ready to create your first version.`,
    isComplete: (data, uiState) => uiState.tutorialStep > 22,
    referenceElSelector: "#nav-item-publish",
    nextText: "Finish",
  }),
  registerStep({
    step: 23,
    xl: true,
    last: true,
    title: "Congratulations! 🎉",
    nextText: "Close tutorial",
    body: `And there you have it. You're now ready to start creating your book, full of wonderful memories. If you ever extra help, look for the help icon in the main menu`,
    isComplete: (data, uiState) => uiState.tutorialStep > 23,
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
