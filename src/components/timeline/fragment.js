import React from "react";
import FragmentHeader from "./fragmentHeader";
import ChapterFragment from "./chapterFragment";
import MemoryFragment from "./memoryFragment";
import PhotoFragment from "./photoFragment";

export default function Fragment({ fragment }) {
  return (
    <div className="animate-fade-in rounded p-2 pb-4 bg-white min-h-full shadow flex flex-col m-2">
      <FragmentHeader fragment={fragment} />
      {fragment.type === "CHAPTER" && (
        <ChapterFragment title={fragment.content} />
      )}
      {fragment.type === "TEXT" && <MemoryFragment fragment={fragment} />}
      {fragment.type === "PHOTO" && <PhotoFragment fragment={fragment} />}
    </div>
  );
}
