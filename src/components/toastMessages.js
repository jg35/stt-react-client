import { useContext, useEffect, useState } from "react";
import { UIContext } from "~/app";
import { motion } from "framer-motion";

export default function ToastMessages() {
  const { uiState, updateUiState } = useContext(UIContext);
  const [message, setMessage] = useState(
    uiState.messages[uiState.messages.length - 1]
  );
  const [messageStyle, setMessageStyle] = useState("");

  useEffect(() => {
    const message = uiState.messages[uiState.messages.length - 1];
    if (message) {
      setMessage(message);
      setMessageStyle(
        message.type === "SUCCESS" ? "bg-successGreen" : "bg-red"
      );
      setTimeout(() => {
        updateUiState(
          {
            messages: uiState.messages.filter((m) => m.id !== message.id),
          },
          false
        );
        setMessage(null);
      }, message.timeout);
    }
  }, [uiState.messages]);

  return (
    <motion.div
      className={`w-full fixed z-50 flex font-medium text-white justify-center items-center p-2 top-0 ${messageStyle}`}
      initial="hidden"
      animate={message ? "visible" : "hidden"}
      variants={{
        visible: {
          y: 0,
        },
        hidden: {
          y: -30,
        },
      }}
    >
      {message?.text}
    </motion.div>
  );
}
