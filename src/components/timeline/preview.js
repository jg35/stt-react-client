import React from "react";
import { useQuery } from "@apollo/client";
import { FETCH_LOCAL_UI_STATE } from "../../lib/gql";

import ChapterNavigator from "./chapterNavigator";

export default function Preview({ fragments }) {
  const { data } = useQuery(FETCH_LOCAL_UI_STATE);
  function scrollToFragment(fragmentId) {
    const match = document.querySelector(
      `div[data-fragment-id="${fragmentId}"]`
    );
    if (match) {
      match.scrollIntoView({ behavior: "smooth" });
    }
  }

  if (data.uiState.showPreview) {
    return (
      <div className="pl-3 pr-1 pb-4 max-h-full w-2/5 relative">
        <div className="relative h-full" style={{ width: "calc(100% - 20px)" }}>
          <div className="absolute left-0 top-0 shadow-lg rounded-lg bg-white h-full w-full py-10 px-3 z-20">
            <div className="h-full overflow-scroll js-preview-scroll-container px-7">
              {fragments
                .filter((f) => !f.hidden)
                .sort((a, b) => (a.order < b.order ? -1 : 1))
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
                  } else {
                    return (
                      <p
                        className="mb-4 cursor-pointer"
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
          </div>
          <div className="shadow-lg rounded-lg bg-white h-full w-full p-10 absolute left-3 z-10"></div>
          <div className="shadow-xl rounded-lg bg-white h-full w-full p-10 absolute left-6"></div>
        </div>
      </div>
    );
  }
  return null;
}
