import React from "react";

import icons from "@src/lib/icons";

export default function Svg({
  name,
  width = 24,
  height = 24,
  color = "#000000",
  css = "",
  rotate = 0,
  title = "",
}) {
  const icon = icons[name];

  if (icon) {
    return (
      <div title={title} className="flex items-center justify-center">
        <svg
          height={height}
          width={width}
          viewBox={icon.viewBox || "0 0 24 24"}
          className={css}
        >
          {icon.path(color, rotate)}
        </svg>
      </div>
    );
  }
  return null;
}
