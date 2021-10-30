import React, { useRef } from "react";

export default function MemoryFragment({ fragment }) {
  const wrapRef = useRef(null);
  return (
    <div
      ref={wrapRef}
      className="flex-1 relative overflow-hidden m-2"
      style={{ height: "calc(100% -24px)" }}
    >
      <div className="absolute w-full">
        {fragment.content.length > 250
          ? `${fragment.content.slice(0, 250)}...`
          : fragment.content}
      </div>
    </div>
  );
}
