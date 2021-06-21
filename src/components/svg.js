import React from "react";

import icons from "../lib/icons";

export default function Svg({
  name,
  width = 24,
  height = 24,
  color = "#000000",
  css = "",
}) {
  const icon = icons[name];

  if (icon) {
    return (
      <svg
        height={height}
        width={width}
        viewBox={icon.viewBox || "0 0 24 24"}
        className={css}
      >
        {icon.path(color)}
      </svg>
    );
  }
  return null;
}
