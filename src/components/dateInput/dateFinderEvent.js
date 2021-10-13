import React from "react";
import { renderFragmentDate } from "~/lib/util";

export default function DateFinderEvent({ event, isUserEvent = true }) {
  return (
    <div
      className={`${
        isUserEvent ? "bg-lightBlue text-blue" : "bg-lightGold text-gold"
      } rounded-lg py-1 px-2 mr-1.5 my-1`}
      title={renderFragmentDate(event.date)}
    >
      {event.title}
    </div>
  );
}
