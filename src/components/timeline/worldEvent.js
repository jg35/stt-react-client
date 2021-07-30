import React from "react";
import { renderFragmentDate } from "~/lib/util";

export default function WorldEvent({ event }) {
  return (
    <div
      data-world-event-id={event.id}
      className="bg-lightGold text-gold rounded-2xl py-1.5 px-3 mr-4 my-2"
      title={renderFragmentDate(event.date)}
    >
      {event.title}
    </div>
  );
}
