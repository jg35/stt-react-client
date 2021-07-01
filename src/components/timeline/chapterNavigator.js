import React, { useState } from "react";
import Svg from "~/components/svg";
import { scrollToFragment } from "~/lib/timeline";

export default function ScrollNavigator({ chapters }) {
  const [hoverChapter, setHoverChapter] = useState(null);

  function ChapterWrap({ chapterId, children }) {
    return (
      <div
        className="flex-1 flex items-center justify-center z-10"
        onMouseEnter={() => setHoverChapter(chapterId)}
        onMouseLeave={() => setHoverChapter(null)}
      >
        {children}
      </div>
    );
  }

  function TimelineMarker() {
    return (
      <div
        className="absolute top-1/2 left-0 border border-lightGray w-full w-px"
        style={{
          transform: "translateY(-50%)",
        }}
      ></div>
    );
  }
  return (
    <div className="relative flex justify-center items-between w-full h-10 px-3">
      {chapters.length > 0 && <TimelineMarker />}
      {chapters.map((chapter, index) => {
        if (hoverChapter && hoverChapter === chapter.id) {
          return (
            <ChapterWrap chapterId={chapter.id} key={index}>
              <div
                className="bg-white font-medium cursor-pointer text-center border-b-2 py-1/2 px-1 border-black animate-expand"
                onClick={() => scrollToFragment(chapter.id)}
              >
                {chapter.content}
              </div>
            </ChapterWrap>
          );
        } else {
          return (
            <ChapterWrap chapterId={chapter.id} key={index}>
              <Svg name="chapter" />
            </ChapterWrap>
          );
        }
      })}
    </div>
  );
}
