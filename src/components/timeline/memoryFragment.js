import React from "react";

export default function MemoryFragment({ fragment }) {
  return (
    <div className="flex-1 relative overflow-hidden">
      <div className="absolute w-full p-2">{fragment.content}</div>
    </div>
  );
}
