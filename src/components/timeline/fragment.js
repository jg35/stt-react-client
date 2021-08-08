import React from "react";
import FragmentHeader from "@src/components/timeline/fragmentHeader";
import ChapterFragment from "@src/components/timeline/chapterFragment";
import MemoryFragment from "@src/components/timeline/memoryFragment";
import PhotoFragment from "@src/components/timeline/photoFragment";

export default function Fragment({ fragment }) {
  return (
    <div
      className="animate-fade-in rounded-md bg-white shadow flex flex-col h-full"
      data-fragment-id={fragment.id}
      data-fragment-type={fragment.type}
    >
      <FragmentHeader fragment={fragment} />
      {fragment.type === "CHAPTER" && (
        <ChapterFragment title={fragment.content} />
      )}

      {fragment.type === "TEXT" && <MemoryFragment fragment={fragment} />}

      {fragment.type === "PHOTO" && <PhotoFragment fragment={fragment} />}

      {fragment.type === "TEXT" && fragment.title && (
        <div className="bg-lightestGray text-black font-medium rounded-b py-1 px-2">
          {fragment.title}
        </div>
      )}
    </div>
  );
}
