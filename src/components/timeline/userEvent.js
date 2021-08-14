import React, { useState, useContext } from "react";
import { useMutation } from "@apollo/client";
import Svg from "~/components/svg";
import colors from "~/lib/colors";
import { DELETE_USER_EVENT } from "~/lib/gql";
import { makeEditUserEventForm } from "~/lib/uiManager";
import LoadingSpinner from "~/components/loadingSpinner";
import { UIContext } from "~/app";
import useToastMessage from "~/hooks/useToastMessage";

export default function UserEvent({ event }) {
  const { setError } = useToastMessage();
  const { updateUiState } = useContext(UIContext);
  const [active, setActive] = useState(false);
  const [removeUserEvent, { loading }] = useMutation(DELETE_USER_EVENT);

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
    }).catch((e) => setError(e, { ref: "DELETE", params: ["event"] }));
  }

  return (
    <button
      type="button"
      data-user-event-id={event.id}
      className="bg-lightBlue text-blue rounded-2xl py-1.5 pl-3 pr-2 mr-4 flex items-center cursor-pointer my-2"
      title="Edit event"
      onClick={() => updateUiState(makeEditUserEventForm(event), false)}
    >
      {event.title}
      <div
        title="Delete event"
        className="p-1 ml-2 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          deleteHandler();
        }}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
      >
        {!loading ? (
          <Svg
            name="cancel"
            width="16"
            height="16"
            color={active ? colors.blue : "#bbc6d2"}
          />
        ) : (
          <LoadingSpinner color={colors.blue} loading={loading} css="h-4 w-4" />
        )}
      </div>
    </button>
  );
}
