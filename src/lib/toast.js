import { v4 as uuid } from "uuid";

const DEFAULT_TIMEOUT = 5000;

const TOAST_MESSAGES = {
  ERROR: {
    FETCH_DEFAULT: () =>
      `Sorry! We've been unable to access your data. Please reload the page or try again later.`,
    DEFAULT: () => "Oops, something went wrong. Please try again later",
    CREATE: (thing) =>
      `Something went wrong when creating your ${thing}. Please try again.`,
    UPDATE: (thing) =>
      `Something went wrong when updating your ${thing}. Please try again.`,
    DELETE: (thing) =>
      `Something went wrong when deleting your ${thing}. Please try again.`,
    ADD_TO_SHARE_LIST: () =>
      "Email could not be added to share list. Please try again.",
    FRAGMENT_VISIBILITY: () =>
      `The visibility could not be changed. Please try agian.`,
    SESSION_EXPIRED: () => `Your session has expired. Please login.`,
  },
  SUCCESS: {
    CREATE: ([thing]) => `You've successfully created a new ${thing}`,
    UPDATE: ([thing]) => `You've succcesfully updated your ${thing}`,
  },
};

export function createToastMessage(
  type,
  message = "",
  timeout = false,
  blockPage = false
) {
  return {
    type,
    text:
      typeof message === "object"
        ? TOAST_MESSAGES[type][message.ref](message.params || [])
        : message,
    id: uuid(),
    timeout: timeout ? DEFAULT_TIMEOUT : 0,
    blockPage,
  };
}
