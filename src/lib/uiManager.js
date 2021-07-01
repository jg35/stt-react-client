import { FragmentSchema, EventSchema } from "~/lib/yup";

export default {
  init: () => {
    const uiState = localStorage.getItem("uiState");
    const defaultState = {
      timelinePeriod: "YEAR",
      showPreview: false,
      capture: {
        showModal: false,
        item: null,
        event: null,
      },
      displayMessages: {
        ORPHANED_FRAGMENTS: true,
      },
      tutorialStep: -1,
      tutorialClickedPreviewFragment: false,
      activeCaptureIndex: null,
    };

    if (uiState) {
      return {
        ...defaultState,
        ...JSON.parse(uiState),
      };
    }
    return defaultState;
  },
};

export function makeCreateFragmentForm(initialValue = {}) {
  return {
    capture: {
      originatesFromQuestion: !!initialValue.questionId,
      showModal: true,
      item: FragmentSchema.cast(initialValue),
    },
  };
}

export function makeCreateUserEventForm(initialValue = {}) {
  return {
    capture: {
      showModal: true,
      item: EventSchema.cast(initialValue),
    },
  };
}

export function makeEditFragmentForm(editFragment) {
  return {
    capture: {
      showModal: true,
      item: { ...editFragment },
    },
  };
}

export function makeEditUserEventForm(userEvent) {
  return {
    capture: {
      showModal: true,
      item: { ...userEvent, type: "EVENT" },
    },
  };
}
