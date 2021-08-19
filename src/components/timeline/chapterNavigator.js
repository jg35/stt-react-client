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

  function ChapterWrap({ chapterId, children, left, isHover = false }) {
    return (
      <div
        className="flex-1 flex items-center justify-center"
        onClick={() => setHoverChapter(chapterId)}
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
    <div className="relative flex items-center w-full h-10">
      {chapters.length > 0 && <TimelineMarker />}
      <div
        className="relative flex items-center justify-around"
        style={{ width: "calc(100% - 2rem)" }}
      >
        {chapters.map((chapter, index) => {
          if (hoverChapter && hoverChapter === chapter.id) {
            return (
              <ChapterWrap isHover chapterId={chapter.id} key={chapter.id}>
                <div
                  style={{ maxWidth: "8rem" }}
                  className="absolute bg-white font-medium cursor-pointer text-center border-b-2 py-1/2 px-1 border-black animate-expand overflow-hidden"
                  onClick={() => scrollToFragment(chapter.id)}
                >
                  <div
                    style={{ textOverflow: "ellipsis", overflow: "hidden" }}
                    className=" whitespace-nowrap"
                    title={
                      (chapter.content.length > 15 && chapter.content) || ""
                    }
                  >
                    {chapter.content}
                  </div>
                </div>
              </ChapterWrap>
            );
          } else {
            return (
              <ChapterWrap chapterId={chapter.id} key={chapter.id}>
                <Svg name="chapter" />
              </ChapterWrap>
            );
          }
        })}
      </div>
    </div>
  );
}
