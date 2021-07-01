import React from "react";

export default function Button({
  onClick,
  children,
  minimal = false,
  cta = false,
  css = "",
  type = "button",
  disabled = false,
  bigCta = false,
  id,
}) {
  let variantCSS = "";
  if (minimal) {
    variantCSS = "bg-transparent hover:bg-lightestGray";
  } else if (cta) {
    variantCSS = "bg-lightGray hover:bg-black hover:text-white";
  } else if (bigCta) {
    variantCSS = "bg-black text-white";
  } else {
    variantCSS = "bg-lightestGray hover:bg-lightGray";
  }
  const CONTENT_IS_TEXT = typeof children === "string";
  return (
    <button
      id={id}
      disabled={disabled}
      type={type}
      className={`flex items-center rounded px-2 py-1 ${variantCSS} ${css} ${
        CONTENT_IS_TEXT ? "justify-center" : "justify-start"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
