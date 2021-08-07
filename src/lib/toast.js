import { v4 as uuid } from "uuid";

const DEFAULT_TIMEOUT = 5000;

const TOAST_MESSAGES = {
  ERROR: {
    DEFAULT: () => "Oops, something went wrong. Please try again later",
  },
  SUCCESS: {
    CREATED: ([thing]) => `You've successfully created a new ${thing}`,
    UPDATE: ([thing]) => `You've succcesfully updated your ${thing}`,
  },
};

export function createToastMessage(type, name, params = [], timeout = false) {
  return {
    type,
    text: TOAST_MESSAGES[type][name](params),
    id: uuid(),
    timeout: timeout ? DEFAULT_TIMEOUT : 0,
  };
}
