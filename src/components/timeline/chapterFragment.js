import React from "react";
import Svg from "~/components/svg";
import { Title } from "~/components/_styled";

export default function ChapterFragment({ title }) {
  return (
    <div className="flex-1 flex justify-center items-center px-4 relative">
      <Svg name="chapter" size={24} css="mr-2" />
      <Title css="mb-0">{title}</Title>
    </div>
  );
}
