import React from "react";

export default function WorldEvent({ event }) {
  return (
    <div className="bg-lightGold text-gold rounded py-1 px-2 mr-4">
      {event.title}
    </div>
  );
}
