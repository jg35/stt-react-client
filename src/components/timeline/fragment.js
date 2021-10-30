import React, { useContext } from "react";
import { UIContext } from "~/app";
import { makeEditFragmentForm } from "~/lib/uiManager";
import FragmentHeader from "~/components/timeline/fragmentHeader";
import ChapterFragment from "~/components/timeline/chapterFragment";
import MemoryFragment from "~/components/timeline/memoryFragment";
import PhotoFragment from "~/components/timeline/photoFragment";
import Svg from "~/components/svg";

export default function Fragment({
  fragment,
  grouped,
  isFirst,
  isLast,
  moveFragment,
}) {
  const { updateUiState } = useContext(UIContext);
  return (
    <div
      className="rounded-md bg-white shadow flex flex-col h-full overflow-hidden"
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
      <div
        className="w-full h-full flex cursor-pointer flex-col"
        onClick={() => updateUiState(makeEditFragmentForm(fragment), false)}
      >
        {fragment.type === "CHAPTER" && (
          <ChapterFragment title={fragment.content} />
        )}

        {fragment.type === "TEXT" && <MemoryFragment fragment={fragment} />}

        {fragment.type === "PHOTO" && <PhotoFragment fragment={fragment} />}
        {fragment.question?.title && (
          <div className="self-end left-0 bottom-0 w-full h-auto py-1 px-2 bg-lightGray flex">
            <Svg name="question" css="mr-1" size={14} />
            <span className="truncate pr-2">{fragment.question.title}</span>
          </div>
        )}
      </div>
    </div>
  );
}
