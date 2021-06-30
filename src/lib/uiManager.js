import { FragmentSchema, EventSchema } from "~/lib/yup";

export default {
  init: () => {
    const uiState = localStorage.getItem("uiState");
    return uiState
      ? JSON.parse(uiState)
      : {
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
          tutorialStep: 1,
        };
  },
  update: (setUi, oldUi, newUi, persist) => {
    const updateUi = {
      ...oldUi,
      ...newUi,
    };
    setUi(updateUi);
    if (persist) {
      localStorage.setItem("uiState", JSON.stringify(updateUi));
    }
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
