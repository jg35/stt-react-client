import React from "react";
import FragmentHeader from "~/components/timeline/fragmentHeader";
import ChapterFragment from "~/components/timeline/chapterFragment";
import MemoryFragment from "~/components/timeline/memoryFragment";
import PhotoFragment from "~/components/timeline/photoFragment";

export default function Fragment({ fragment, editView }) {
  return (
    <div
      style={{ minHeight: "10rem", width: editView ? "100%" : "18rem" }}
      className="animate-fade-in rounded p-2 pb-4 bg-white shadow flex flex-col"
      data-fragment-id={fragment.id}
      data-fragment-type={fragment.type}
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
