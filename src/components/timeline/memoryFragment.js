import React, { useRef } from "react";

export default function MemoryFragment({ fragment }) {
  const wrapRef = useRef(null);
  return (
    <div
      ref={wrapRef}
      className="flex-1 relative overflow-hidden m-2"
      style={{ height: "calc(100% -24px)" }}
    >
      <div className="absolute w-full">{fragment.content}</div>
      <div
        className="absolute w-full h-4 bottom-0"
        style={{
          background:
            "linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 50%)",
        }}
      ></div>
    </div>
  );
}
