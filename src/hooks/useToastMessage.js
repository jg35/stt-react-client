import { useContext } from "react";
import { UIContext } from "~/app";
import { createToastMessage } from "~/lib/toast";
import { refreshToken } from "~/lib/firebase";
import { useHistory } from "react-router";

const MESSAGE_TIMEOUT = 5000;

export default function useToastMessage() {
  const history = useHistory();
  const { uiState, updateUiState } = useContext(UIContext);

  function setToastMessage(type, message, closeManually) {
    const toast = createToastMessage(
      type,
      message,
      closeManually ? 0 : MESSAGE_TIMEOUT
    );
    updateUiState(
      {
        messages: [...uiState.messages, toast],
      },
      false
    );
  }

  return {
    setError: (error, message, closeManually = false) => {
      if (error && error.graphQLErrors) {
        // Here we check the error code, incase we need to handle differently than showing a message
        const errorCode = error.graphQLErrors[0].extensions.code;
        switch (errorCode) {
          case "postgres-max-connections-error":
          case "busy":
            break;
          case "jwt-missing-role-claims":
          case "jwt-invalid-claims":
          case "invalid-jwt":
          case "invalid-jwt-key":
            refreshToken().catch((e) => {
              setToastMessage("ERROR", "SESSION_EXPIRED");
              history.push("/login");
            });
            break;
          default:
            setToastMessage("ERROR", message, closeManually);
        }
      } else {
        setToastMessage("ERROR", message, closeManually);
      }
    },
    setSuccess: (message, closeManually = false) => {
      setToastMessage("SUCCESS", message, closeManually);
    },
  };
}
