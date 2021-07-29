import React from "react";
import FragmentHeader from "~/components/timeline/fragmentHeader";
import ChapterFragment from "~/components/timeline/chapterFragment";
import MemoryFragment from "~/components/timeline/memoryFragment";
import PhotoFragment from "~/components/timeline/photoFragment";

export default function Fragment({ fragment }) {
  return (
    <div
      className="animate-fade-in rounded bg-white shadow flex flex-col"
      style={{ minHeight: "250px", maxHeight: "250px" }}
      data-fragment-id={fragment.id}
      data-fragment-type={fragment.type}
    >
      <FragmentHeader fragment={fragment} />
      {fragment.type === "CHAPTER" && (
        <ChapterFragment title={fragment.content} />
      )}

      {fragment.type === "TEXT" && <MemoryFragment fragment={fragment} />}

      {fragment.type === "PHOTO" && <PhotoFragment fragment={fragment} />}

      {fragment.type !== "CHAPTER" &&
        (fragment.title || fragment.mediaCaption) && (
          <div className="bg-black text-white rounded-b py-1 px-2">
            {fragment.title || fragment.mediaCaption}
          </div>
        )}
    </div>
  );
}
