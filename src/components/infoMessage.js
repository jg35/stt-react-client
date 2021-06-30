import React, { useState, useEffect, useContext } from "react";
import messages from "~/lib/messages";
import Svg from "~/components/svg";
import Button from "~/components/button";
import { UIContext } from "~/app";

export default function InfoMessage({ name }) {
  const { uiState, updateUiState } = useContext(UIContext);

  const [renderMessage, setRenderMessage] = useState(
    uiState.displayMessages[name] && messages[name]
  );

  useEffect(() => {
    setRenderMessage(uiState.displayMessages[name] && messages[name]);
  }, [uiState.displayMessages]);

  function hideMessage() {
    const displayMessages = uiState.displayMessages;
    updateUiState({ displayMessages: { ...displayMessages, [name]: false } });
  }

  if (renderMessage) {
    return (
      <div
        className="bg-lightestGray rounded shadow-lg p-6 w-4/6 my-4 text-lg flex relative"
        style={{ maxWidth: "40rem" }}
      >
        <div className="mr-2 mt-1">
          <Svg name="info" />
        </div>
        <div>
          <p className="flex-1 px-2 mb-2 text-base">{renderMessage}</p>
          <div className="">
            <Button
              css="font-medium text-base text-darkGray"
              onClick={() => hideMessage()}
            >
              Discard this message
            </Button>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
