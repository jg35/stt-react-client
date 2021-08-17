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
      deleteModal: {
        show: false,
        cancelled: false,
        confirm: false,
        title: "",
      },
      showAccessListModal: false,
      displayMessages: {
        ORPHANED_FRAGMENTS: true,
      },
      tutorialStep: -1,
      tutorialClickedPreviewFragment: false,
      activeCaptureIndex: null,
      payment: {
        showModal: false,
        type: "CHOOSE_PLAN",
        intent: "AUTO",
        subscriptionStatus: null,
        stripeCustomerId: null,
      },
      messages: [],
      editPreviewScrollPosition: null,
      previewScrollPosition: null,
      googleFontStyles: [{ family: "Roboto", weight: 400 }],
      signedUrlsInit: false,
      signedUrls: {},
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

export function makeCreateFragmentForm(initialValue = {}, options = {}) {
  return {
    capture: {
      originatesFromQuestion: !!initialValue.questionId,
      showModal: true,
      item: FragmentSchema.cast(initialValue),
      revealAfterCreate: options.revealAfterCreate || false,
    },
  };
}

export function makeCreateUserEventForm(initialValue = {}, options = {}) {
  return {
    capture: {
      showModal: true,
      item: EventSchema.cast(initialValue),
      revealAfterCreate: options.revealAfterCreate || false,
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

export function setGoogleFontStyles(fontStyles, fontFamily) {
  const activeFont = fontStyles.find((f) => f.family === fontFamily);
  if (!activeFont) {
    return fontStyles.concat({ family: fontFamily });
  }
  return fontStyles;
}
