import React from "react";
import Svg from "~/components/svg";

export default function ChapterFragment({ title }) {
  return (
    <div className="flex-1 flex justify-center items-center px-4">
      <Svg name="chapter" width="24" height="24" css="mr-2" />
      <h1 className="text-xl font-medium">{title}</h1>
    </div>
  );
}
