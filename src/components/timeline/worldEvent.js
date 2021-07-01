import React from "react";

export default function WorldEvent({ event }) {
  return (
    <div
      data-world-event-id={event.id}
      className="bg-lightGold text-gold rounded-2xl py-1.5 px-3 mr-4 my-2"
    >
      {event.title}
    </div>
  );
}
