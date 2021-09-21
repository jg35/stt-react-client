import React from "react";
import FragmentHeader from "~/components/timeline/fragmentHeader";
import ChapterFragment from "~/components/timeline/chapterFragment";
import MemoryFragment from "~/components/timeline/memoryFragment";
import PhotoFragment from "~/components/timeline/photoFragment";

export default function Fragment({
  fragment,
  grouped,
  isFirst,
  isLast,
  moveFragment,
}) {
  return (
    <div
      className="rounded-md bg-white shadow flex flex-col h-full"
      data-fragment-id={fragment.id}
      data-fragment-type={fragment.type}
    >
      <FragmentHeader
        fragment={fragment}
        grouped={grouped}
        isFirst={isFirst}
        isLast={isLast}
        moveFragment={moveFragment}
      />
      {fragment.type === "CHAPTER" && (
        <ChapterFragment title={fragment.content} />
      )}

      {fragment.type === "TEXT" && <MemoryFragment fragment={fragment} />}

      {fragment.type === "PHOTO" && <PhotoFragment fragment={fragment} />}
    </div>
  );
}
