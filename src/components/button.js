import React from "react";

export default function Button({ onClick, children, minimal = false, css }) {
  return (
    <button
      type="button"
      className={`flex rounded px-2 py-1 ${
        minimal
          ? "bg-white hover:bg-lightestGray"
          : "bg-lightestGray hover:bg-lightGray"
      } ${css}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
