import React from "react";

export default function MemoryFragment({ fragment }) {
  return (
    <div
      className="flex-1 relative overflow-hidden"
      style={{ minHeight: "5rem" }}
    >
      <div className="absolute w-full ">
        {fragment.title && (
          <span className="font-medium">{fragment.title}:&nbsp;</span>
        )}
        {fragment.content}
      </div>
    </div>
  );
}
