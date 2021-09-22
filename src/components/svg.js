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
      <div
        title={title}
        className={`${css} rounded-full flex items-center justify-center ${color} ${
          hoverColor &&
          `p-2 hover:bg-lightGray hover:${hoverColor} duration-200 ease-in`
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
      </div>
    );
  }
  return null;
}
