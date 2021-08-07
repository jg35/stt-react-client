import { useContext, useEffect, useState } from "react";
import colors from "~/lib/colors";
import { UIContext } from "~/app";
import Svg from "~/components/svg";

function ToastMessage({ message }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message) {
      setShow(true);
    }
    if (message.timeout) {
      setTimeout(() => {
        setShow(false);
      }, message.timeout);
    }
  }, []);

  let closeIconColour = colors.white;
  let messageStyles =
    "fixed py-3 px-4 shadow font-medium z-50 flex w-full flex justify-center";
  switch (message.type) {
    case "ERROR":
      messageStyles += " bg-red text-white";
      break;
    case "SUCCESS":
      messageStyles += " bg-successGreen text-white";
      break;
    default:
      closeIconColour = colors.black;
      messageStyles += " bg-white";
      break;
  }

  return (
    <div
      className={`${messageStyles} ${
        show ? "animate-slide-in" : "animate-slide-out"
      }`}
    >
      <p>{message.text}</p>
      {!message.timeout && (
        <div
          className="p-1 ml-2 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setShow(false);
          }}
        >
          <Svg name="cancel" width="16" height="16" color={closeIconColour} />
        </div>
      )}
    </div>
  );
}

export default function ToastMessages() {
  const { uiState, updateUiState } = useContext(UIContext);

  return uiState.messages.map((message) => {
    return <ToastMessage key={message.id} message={message} />;
  });
}
