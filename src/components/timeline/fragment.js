import React from "react";
import FragmentHeader from "~/components/timeline/fragmentHeader";
import ChapterFragment from "~/components/timeline/chapterFragment";
import MemoryFragment from "~/components/timeline/memoryFragment";
import PhotoFragment from "~/components/timeline/photoFragment";

export default function Fragment({ fragment }) {
  return (
    <div
      className="animate-fade-in rounded p-2 pb-4 bg-white min-h-full shadow flex flex-col m-2"
      data-fragment-id={fragment.id}
    >
      <FragmentHeader fragment={fragment} />
      {fragment.type === "CHAPTER" && (
        <ChapterFragment title={fragment.content} />
      )}
      {fragment.type === "TEXT" && <MemoryFragment fragment={fragment} />}
      {fragment.type === "PHOTO" && <PhotoFragment fragment={fragment} />}
    </div>
  );
}
