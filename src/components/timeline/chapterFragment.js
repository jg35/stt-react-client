import React from "react";
import Svg from "../svg";

export default function ChapterFragment({ title }) {
  return (
    <div className="flex flex-col justify-center items-center font-medium px-4 text-lg min-h-full">
      <Svg name="chapter" />

      {title}
    </div>
  );
}
