import React from "react";

export default function MemoryFragment({ fragment }) {
  return (
    <div className="relative h-6">
      <div className="absolute w-full truncate text-md px-1">
        {fragment.content}
      </div>
    </div>
  );
}
