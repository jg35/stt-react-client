import React, { useRef, useEffect, useContext, useState } from "react";
import { debounce } from "lodash";
import { scrollToFragment } from "~/lib/timeline";
import Image from "~/components/image";
import ChapterNavigator from "~/components/timeline/chapterNavigator";
import PreivewSkeleton from "~/components/timeline/previewSkeleton";
import { UIContext } from "~/app";
import { setGoogleFontStyles } from "~/lib/uiManager";
import imageSizes from "~/lib/imageSizes";

export default function Preview({ fragments, theme }) {
  const previewScrollContainer = useRef(null);
  const { uiState, updateUiState } = useContext(UIContext);
  const [chapterStyle, setChapterStyle] = useState("");
  const [textStyle, setTextStyle] = useState("");
  const [containerClass, setContainerClass] = useState("");

  function updateGoogleFonts(fontFamily) {
    const googleFontStyles = setGoogleFontStyles(
      uiState.googleFontStyles,
      fontFamily
    );

    updateUiState({ googleFontStyles }, false);
  }

  useEffect(() => {
    if (theme) {
      updateGoogleFonts(theme.fontFamily);
      setChapterStyle({
        marginTop: "2em",
        marginBottom: "2em",
        fontSize: theme.chapterFontSize,
        lineHeight: theme.lineHeight,
        fontFamily: theme.fontFamily,
      });
      setTextStyle({
        marginBottom: "2em",
        fontSize: theme.fontSize,
        lineHeight: theme.lineHeight,
        fontFamily: theme.fontFamily,
      });
      setContainerClass("px-8");
    }
  }, [theme]);
  useEffect(() => {
    const lastScrollPosition = uiState.previewScrollPosition;
    if (fragments && previewScrollContainer && lastScrollPosition) {
      setTimeout(() => {
        if (previewScrollContainer.current) {
          previewScrollContainer.current.scrollTo(0, lastScrollPosition);
        }
      });
    }
  }, [previewScrollContainer, fragments]);

  function fragmentScrollHandler(fragmentId) {
    scrollToFragment(fragmentId);
    updateUiState({ tutorialClickedPreviewFragment: true });
  }

  if (uiState.showPreview) {
    return (
      <div
        className="pl-3 pr-1 pb-4 h-full max-h-full w-2/5 relative"
        style={{ maxWidth: "768px" }}
      >
        <div
          id="preview-container"
          className="relative h-full"
          style={{ width: "calc(100% - 20px)" }}
        >
          <div className="absolute left-0 top-0 shadow-lg rounded-lg bg-white h-full w-full py-10 px-6 z-20">
            {fragments ? (
              <>
                <div
                  ref={previewScrollContainer}
                  className={`h-full overflow-scroll js-preview-scroll-container ${containerClass}`}
                  onScroll={debounce((e) => {
                    updateUiState({
                      previewScrollPosition: e.target.scrollTop,
                    });
                  }, 1000)}
                >
                  {fragments
                    .filter((f) => !f.hidden)
                    .map((frag, index) => {
                      if (frag.type === "CHAPTER") {
                        return (
                          <h1
                            style={chapterStyle}
                            className="text-center cursor-pointer"
                            key={index}
                            onClick={() => fragmentScrollHandler(frag.id)}
                            data-preview-fragment-id={frag.id}
                          >
                            {frag.content}
                          </h1>
                        );
                      } else if (frag.type === "PHOTO") {
                        return (
                          <figure
                            className="my-8 cursor-pointer"
                            key={index}
                            onClick={() => fragmentScrollHandler(frag.id)}
                          >
                            <Image
                              src={frag.mediaUrl + imageSizes["1400px"]}
                              className="w-full shadow"
                              data-preview-fragment-id={frag.id}
                            />
                            <figcaption
                              className="text-center whitespace-pre-wrap cursor-pointer"
                              style={textStyle}
                            >
                              {frag.mediaCaption}
                            </figcaption>
                          </figure>
                        );
                      } else {
                        return (
                          <p
                            style={textStyle}
                            className="whitespace-pre-wrap cursor-pointer"
                            key={index}
                            onClick={() => fragmentScrollHandler(frag.id)}
                            data-preview-fragment-id={frag.id}
                          >
                            {frag.content}
                          </p>
                        );
                      }
                    })}
                </div>
                <ChapterNavigator fragments={fragments} />
              </>
            ) : (
              <PreivewSkeleton />
            )}
          </div>
          <div className="shadow-lg rounded-lg bg-white h-full w-full p-10 absolute left-3 z-10"></div>
          <div className="shadow-xl rounded-lg bg-white h-full w-full p-10 absolute left-6"></div>
        </div>
      </div>
    );
  }
  return null;
}
