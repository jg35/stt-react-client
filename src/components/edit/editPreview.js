import React, { useRef, useEffect, useContext, useState } from "react";
import { useMutation } from "@apollo/client";
import { DateTime } from "luxon";
import { debounce, sortBy, cloneDeep } from "lodash";
import { getImgIxSrc } from "~/lib/util";
import { scrollToFragment } from "~/lib/timeline";
import { UPDATE_FRAGMENT } from "~/lib/gql";
import ChapterNavigator from "~/components/timeline/chapterNavigator";
import PreivewSkeleton from "~/components/timeline/previewSkeleton";
import { UIContext } from "~/app";
import EditableFragment from "~/components/edit/editableFragment";

export default function Preview({ fragments, saveFragment, theme }) {
  const [saving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // const previewScrollContainer = useRef(null);
  // const { uiState, updateUiState } = useContext(UIContext);

  // useEffect(() => {
  //   const lastScrollPosition = uiState.previewScrollPosition;
  //   if (fragments && previewScrollContainer && lastScrollPosition) {
  //     setTimeout(() => {
  //       if (previewScrollContainer.current) {
  //         previewScrollContainer.current.scrollTo(0, lastScrollPosition);
  //       }
  //     });
  //   }
  // }, [previewScrollContainer, fragments]);

  // function fragmentScrollHandler(fragmentId) {
  //   scrollToFragment(fragmentId);
  //   updateUiState({ tutorialClickedPreviewFragment: true });
  // }

  function saveFragmentHandler(newValue, currentValue, fragmentId) {
    if (newValue !== currentValue) {
      setIsSaving(true);
      saveFragment(newValue, fragmentId).then(() => {
        setIsSaving(false);
        setLastSaved(new DateTime.local().toFormat("h:mma").toLowerCase());
      });
    }
  }

  return (
    <div
      className="pl-3 pr-1 pb-4 h-full max-h-full w-full "
      style={{ maxWidth: "768px" }}
    >
      <div
        id="preview-container"
        className=" h-full"
        style={{ width: "calc(100% - 20px)" }}
      >
        <div className="shadow-lg rounded-lg bg-white h-full w-full pt-14 py-10 px-3 z-20 relative">
          <div className="h-12 text-right text-gray font-medium absolute top-4 right-8">
            {saving ? "Saving..." : lastSaved ? `Last saved: ${lastSaved}` : ""}
          </div>
          <div
            // ref={previewScrollContainer}
            className="h-full overflow-scroll js-preview-scroll-container px-7 relative"
            // onScroll={debounce((e) => {
            //   updateUiState({
            //     previewScrollPosition: e.target.scrollTop,
            //   });
            // }, 1000)}
          >
            {fragments
              .filter((f) => !f.hidden)
              .map((frag, index) => {
                if (frag.type !== "PHOTO") {
                  return (
                    <EditableFragment
                      theme={theme}
                      fragment={frag}
                      key={index}
                      saveFragment={(newContent) =>
                        saveFragmentHandler(newContent, frag.content, frag.id)
                      }
                    />
                  );
                }
                // if (frag.type === "CHAPTER") {
                //   return (
                //     <input
                //       className="text-center text-4xl my-20 font-medium outline-none w-full overflow-hidden"
                //       key={index}
                //       onChange={(e) =>
                //         setFragment(index, frag, e.target.value)
                //       }
                //       // onClick={() => fragmentScrollHandler(frag.id)}
                //       data-preview-fragment-id={frag.id}
                //       value={frag.content}
                //     />
                //   );
                // } else if (frag.type === "TEXT") {
                //   return (
                //     <textarea
                //       className="mb-4 whitespace-pre-wrap w-full focus:outline-none resize-none"
                //       key={index}
                //       onChange={(e) =>
                //         setFragment(index, frag, e.target.value)
                //       }
                //       // onClick={() => fragmentScrollHandler(frag.id)}
                //       data-preview-fragment-id={frag.id}
                //       value={frag.content}
                //       placeholder="Your memory..."
                //     ></textarea>
                //   );
                // }
                return null;
                // } else if (frag.type === "PHOTO") {
                //   return (
                //     <figure
                //       className="my-8"
                //       key={index}
                //       // onClick={() => fragmentScrollHandler(frag.id)}
                //     >
                //       <img
                //         src={`${getImgIxSrc(frag.mediaUrl)}?width=600`}
                //         className="w-full shadow"
                //         data-preview-fragment-id={frag.id}
                //       />
                //       <figcaption className="text-center">
                //         {frag.mediaCaption}
                //       </figcaption>
                //     </figure>
                //   );
                // } else {
                //   return (
                //     <p
                //       className="mb-4 cursor-pointer whitespace-pre-wrap"
                //       key={index}
                //       // onClick={() => fragmentScrollHandler(frag.id)}
                //       data-preview-fragment-id={frag.id}
                //     >
                //       {frag.content}
                //     </p>
                //   );
                // }
              })}
          </div>
          <ChapterNavigator
            chapters={fragments.filter((f) => f.type === "CHAPTER")}
          />
        </div>
        {/* <div className="shadow-lg rounded-lg bg-white h-full w-full p-10 absolute left-3 z-10"></div> */}
        {/* <div className="shadow-xl rounded-lg bg-white h-full w-full p-10 absolute left-6"></div> */}
      </div>
    </div>
  );
}
