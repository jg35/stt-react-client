import React from "react";

export default function MemoryFragment({ fragment }) {
  return (
    <div className="flex-1 relative overflow-hidden" style={{ minHeight: "5rem" }}>
      <div className="absolute w-full text-md px-1">
        {fragment.content}
      </div>
    </div>
  );
}
