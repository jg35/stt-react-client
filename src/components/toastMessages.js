import { useContext, useEffect, useState } from "react";
import colors from "~/lib/colors";
import { UIContext } from "~/app";
import Svg from "~/components/svg";

export default function ToastMessages({}) {
  const [messagesVisible, setMessagesVisible] = useState([]);
  const [renderMessages, setRenderMessages] = useState([]);
  const {
    uiState: { messages },
    updateUiState,
  } = useContext(UIContext);

  useEffect(() => {
    if (messages.length) {
      // Newest one is pushed into the last position
      const newMessage = messages[messages.length - 1];
      if (newMessage.timeout) {
        deleteMessage(newMessage.id, newMessage.timeout);
      }
      setMessagesVisible(messagesVisible.concat(newMessage.id));
      setRenderMessages(messages);
    }
  }, [messages]);

  function deleteMessage(messageId, timeout = 0) {
    setTimeout(() => {
      const clipMessages = messages.filter((m) => m.id !== messageId);
      setMessagesVisible(messagesVisible.filter((id) => id !== messageId));
      // Set messages after component is hidden
      setTimeout(
        () =>
          updateUiState({
            messages: clipMessages,
          }),
        200
      );
    }, timeout);
  }

  function ErrorMessage({ message, hide }) {
    return (
      <div className="py-3 px-4 shadow rounded-lg font-medium z-100 flex border-red border-2 text-red">
        <p>{message.text}</p>
        {!message.timeout && (
          <div
            className="p-1 ml-2 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              hide(message.id);
            }}
          >
            <Svg name="cancel" width="16" height="16" color={colors.red} />
          </div>
        )}
      </div>
    );
  }

  function SuccessMessage({ message, hide }) {
    return (
      <div className="py-3 px-4 shadow rounded-lg font-medium z-100 flex border-successGreen border-2 text-successGreen">
        <p>{message.text}</p>
        {!message.timeout && (
          <div
            className="p-1 ml-2 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              hide(message.id);
            }}
          >
            <Svg name="cancel" width="16" height="16" color={colors.green} />
          </div>
        )}
      </div>
    );
  }

  return renderMessages.map((message) => {
    let wrapperCss = "fixed flex justify-center w-full transition-all duration-200 ease-in";
    wrapperCss += messagesVisible.includes(message.id) ? " bottom-8" : " -bottom-24";

    return (
      <div key={message.id} className={wrapperCss}>
        {message.type === "ERROR" ? (
          <ErrorMessage message={message} hide={(messageId) => deleteMessage(messageId)} />
        ) : (
          <SuccessMessage message={message} hide={(messageId) => deleteMessage(messageId)} />
        )}
      </div>
    );
  });
}
