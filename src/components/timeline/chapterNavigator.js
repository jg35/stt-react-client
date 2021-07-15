import React, { useState, useEffect } from "react";
import Svg from "~/components/svg";
import { scrollToFragment } from "~/lib/timeline";

export default function ScrollNavigator({ fragments }) {
  const [hoverChapter, setHoverChapter] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [totalLength, setTotalLength] = useState(0);
  useEffect(() => {
    if (fragments.length) {
      setChapters(
        fragments.reduce((chapters, fragment, index) => {
          if (fragment.type === "CHAPTER") {
            chapters.push({ ...fragment, position: index });
          }
          return chapters;
        }, [])
      );
      setTotalLength(
        fragments
          .filter((f) => f.type === "TEXT")
          .reduce((len, f) => len + f.content.length, 0)
      );
    }
  }, [fragments]);

  function getLeftPosition(chapterIndex) {
    // Gets relative position based on book content
    const startsAtLength = fragments.reduce(
      (length, fragment, currentIndex) => {
        if (fragment.type === "TEXT" && currentIndex < chapterIndex) {
          length += fragment.content.length;
        }
        return length;
      },
      0
    );
    return Math.floor((100 / totalLength) * startsAtLength);
  }

  function ChapterWrap({ chapterId, children, left }) {
    return (
      <div
        className="absolute flex-1 flex items-center justify-center z-10 top-1/2"
        style={{ left: `${left}%`, transform: "translate(-12px, -50%)" }}
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
    <div className="relative flex justify-center items-between w-full h-10">
      {chapters.length > 0 && <TimelineMarker />}
      <div className="relative" style={{ width: "calc(100% - 2rem)" }}>
        {chapters.map((chapter, index) => {
          if (hoverChapter && hoverChapter === chapter.id) {
            return (
              <ChapterWrap
                chapterId={chapter.id}
                key={index}
                left={getLeftPosition(chapter.position)}
              >
                <div className="relative">
                  <div
                    className="bg-white font-medium cursor-pointer text-center border-b-2 py-1/2 px-1 border-black animate-expand"
                    onClick={() => scrollToFragment(chapter.id)}
                  >
                    {chapter.content}
                  </div>
                </div>
              </ChapterWrap>
            );
          } else {
            return (
              <ChapterWrap
                chapterId={chapter.id}
                key={index}
                left={getLeftPosition(chapter.position)}
              >
                <Svg name="chapter" />
              </ChapterWrap>
            );
          }
        })}
      </div>
    </div>
  );
}
