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
    PUBLISH_VERSION: () =>
      `"Something went wrong when publishing your book. Please try again"`,
  },
  SUCCESS: {
    CREATE: ([thing]) => `You've successfully created a new ${thing}.`,
    UPDATE: ([thing]) => `You've succcesfully updated your ${thing}.`,
    DELETE_VERSION: () => `Your book was delete.`,
    PUBLISHED_VERSION: () => `Your book was published!`,
    SEND_RESET_EMAIL: () =>
      `Please check your email for instructions to reset your password. Once done, continue to login.`,
    DELETE_ACCOUNT: (deleteDate) =>
      `Your account is now scheduled for deletion. Login before ${deleteDate} to restore your account.`,
    RESTORED_ACCOUNT: (userFirstName) =>
      `Welcome back${userFirstName}. Your account has now been restored.`,
    REPUBLISHED_VERSION: (version) =>
      `Version ${version} was successfully republished.`,
    SEND_CONFIRMATION_EMAIL: () =>
      `A new confirmation has been sent to your email address. Please check your email to activate your account.`,
  },
};

export function createToastMessage(type, message = "") {
  return {
    type,
    text:
      typeof message === "object"
        ? TOAST_MESSAGES[type][message.ref](message.params || [])
        : message,
    id: uuid(),
    timeout: DEFAULT_TIMEOUT,
  };
}
