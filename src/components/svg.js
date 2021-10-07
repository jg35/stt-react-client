import React from "react";

import icons from "~/lib/icons";

export default function Svg({
  name,
  size = 24,
  css = "",
  title = "",
  color = "offBlack",
  hoverColor = null,
}) {
  const icon = icons[name];

  if (icon) {
    return (
      <span
        title={title}
        className={`${css} rounded-full flex items-center justify-center text-${color} ${
          hoverColor
            ? `p-2 hover:bg-lightGray hover:text-${hoverColor} duration-200 ease-in`
            : ""
        }`}
      >
        <svg
          height={size}
          width={size}
          viewBox={icon.viewBox || "0 0 24 24"}
          className={`${css} fill-current`}
        >
          {icon.path()}
        </svg>
      </span>
    );
  }
  return null;
}
