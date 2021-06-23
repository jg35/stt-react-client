import React from "react";
import Svg from "../svg";

export default function ChapterFragment({ title }) {
  return (
    <div className="flex flex-col justify-center items-center font-medium px-4 text-xl min-h-full">
      <Svg name="chapter" width="32" height="32" />
      <h1 className="mt-4">{title}</h1>
    </div>
  );
}
