import React from "react";

export default function MemoryFragment({ fragment }) {
  return (
    <div
      className="flex-1 relative overflow-hidden m-2 mb-4"
      style={{ height: "calc(100% -24px)" }}
    >
      <div className="absolute w-full">{fragment.content}</div>
    </div>
  );
}
