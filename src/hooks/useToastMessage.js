import { useContext } from "react";
import { UIContext } from "~/app";
import { createToastMessage } from "~/lib/toast";

const MESSAGE_TIMEOUT = 5000;

export default function useToastMessage() {
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
        console.log(error.graphQLErrors);
        // Here we check the error code, incase we need to handle differently than showing a message
        const errorCode = error.graphQLErrors[0].extensions.code;
        console.log("errorCode:", errorCode);
        switch (errorCode) {
          case "postgres-max-connections-error":
          case "busy":
            console.log("Redirect - show a busy banner?");
            break;
          case "jwt-missing-role-claims":
          case "jwt-invalid-claims":
          case "invalid-jwt":
          case "invalid-jwt-key":
            console.log("JWT has expired - redirect to login?");
            break;
          default:
            setToastMessage("ERROR", message, closeManually);
        }
      } else {
        console.log("set the error!");
        setToastMessage("ERROR", message, closeManually);
      }
    },
    setSuccess: (message, closeManually = false) => {
      setToastMessage("SUCCESS", message, closeManually);
    },
  };
}
