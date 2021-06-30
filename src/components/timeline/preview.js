import React, { useRef, useEffect, useContext } from "react";
import { debounce } from "lodash";
import { getImgIxSrc } from "~/lib/util";
import ChapterNavigator from "~/components/timeline/chapterNavigator";
import PreivewSkeleton from "~/components/timeline/previewSkeleton";
import { UIContext } from "~/app";

export default function Preview({ fragments }) {
  const previewScrollContainer = useRef(null);
  const { uiState, updateUiState } = useContext(UIContext);
  function scrollToFragment(fragmentId) {
    const match = document.querySelector(
      `div[data-fragment-id="${fragmentId}"]`
    );
    if (match) {
      match.scrollIntoView({ behavior: "smooth" });
    }
  }

  useEffect(() => {
    const lastScrollPosition = uiState.previewScrollPosition;
    if (fragments && previewScrollContainer && lastScrollPosition) {
      setTimeout(() => {
        previewScrollContainer.current.scrollTo(0, lastScrollPosition);
      });
    }
  }, [previewScrollContainer, fragments]);

  if (uiState.showPreview) {
    return (
      <div className="pl-3 pr-1 pb-4 h-full max-h-full w-2/5 relative">
        <div className="relative h-full" style={{ width: "calc(100% - 20px)" }}>
          <div className="absolute left-0 top-0 shadow-lg rounded-lg bg-white h-full w-full py-10 px-3 z-20">
            {fragments ? (
              <>
                <div
                  ref={previewScrollContainer}
                  className="h-full overflow-scroll js-preview-scroll-container px-7"
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
                            className="text-center text-4xl my-20 cursor-pointer"
                            key={index}
                            onClick={() => scrollToFragment(frag.id)}
                            data-preview-fragment-id={frag.id}
                          >
                            {frag.content}
                          </h1>
                        );
                      } else if (frag.type === "PHOTO") {
                        return (
                          <figure className="my-8" key={index}>
                            <img
                              src={`${getImgIxSrc(frag.mediaUrl)}?width=600`}
                              className="w-full shadow"
                              onClick={() => scrollToFragment(frag.id)}
                              data-preview-fragment-id={frag.id}
                            />
                            <figcaption className="text-center">
                              {frag.mediaCaption}
                            </figcaption>
                          </figure>
                        );
                      } else {
                        return (
                          <p
                            className="mb-4 cursor-pointer whitespace-pre-wrap"
                            key={index}
                            onClick={() => scrollToFragment(frag.id)}
                            data-preview-fragment-id={frag.id}
                          >
                            {frag.content}
                          </p>
                        );
                      }
                    })}
                </div>
                <ChapterNavigator
                  chapters={fragments.filter((f) => f.type === "CHAPTER")}
                />
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
