import React from "react";

export default function UserEvent({ event }) {
  return (
    <div className="bg-lightBlue text-blue rounded py-1 px-2 mr-4">
      {event.title}
    </div>
  );
}
