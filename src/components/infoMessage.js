import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { setUIStateVar } from "~/lib/apollo";
import { FETCH_LOCAL_UI_STATE } from "~/lib/gql";
import messages from "~/lib/messages";
import Svg from "~/components/svg";
import Button from "~/components/button";

export default function InfoMessage({ name }) {
  const { data } = useQuery(FETCH_LOCAL_UI_STATE);

  const [renderMessage, setRenderMessage] = useState(
    data.uiState.displayMessages[name] && messages[name]
  );

  useEffect(() => {
    setRenderMessage(data.uiState.displayMessages[name] && messages[name]);
  }, [data.uiState.displayMessages]);

  function hideMessage() {
    const displayMessages = data.uiState.displayMessages;
    setUIStateVar({ displayMessages: { ...displayMessages, [name]: false } });
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
