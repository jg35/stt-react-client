import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import Svg from "../svg";
import colors from "../../lib/colors";
import { DELETE_USER_EVENT } from "../../lib/gql";
import { showEditUserEventForm } from "../../lib/apollo";

export default function UserEvent({ event }) {
  const [active, setActive] = useState(false);
  const [removeUserEvent] = useMutation(DELETE_USER_EVENT);

  function deleteHandler() {
    removeUserEvent({
      variables: { id: event.id },
      update(cache) {
        const normalizedId = cache.identify({
          id: event.id,
          __typename: "stt_userEvent",
        });
        cache.evict({ id: normalizedId });
        cache.gc();
      },
    });
  }

  return (
    <div
      className="bg-lightBlue text-blue rounded-2xl py-1.5 pl-3 pr-2 mr-4 flex items-center cursor-pointer my-2"
      onClick={() => showEditUserEventForm(event)}
    >
      {event.title}
      <div
        className="p-1 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          deleteHandler();
        }}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
      >
        <Svg
          name="cancel"
          css="ml-2"
          width="16"
          height="16"
          color={active ? colors.blue : "#bbc6d2"}
        />
      </div>
    </div>
  );
}
