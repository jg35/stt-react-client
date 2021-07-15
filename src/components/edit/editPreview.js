import React, { useState, useContext, useRef, useEffect } from "react";
import { DateTime } from "luxon";
import { debounce } from "lodash";

import { UIContext } from "~/app";
import ChapterNavigator from "~/components/timeline/chapterNavigator";
import PhotoFragment from "~/components/edit/photoFragment";
import EditableFragment from "~/components/edit/editableFragment";
import SaveStatus from "~/components/edit/saveStatus";

export default function Preview({ fragments, saveFragment, theme }) {
  const { uiState, updateUiState } = useContext(UIContext);
  const editPreviewScrollContainer = useRef(null);
  const [saving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    const lastScrollPosition = uiState.editPreviewScrollPosition;
    if (fragments && editPreviewScrollContainer && lastScrollPosition) {
      setTimeout(() => {
        if (editPreviewScrollContainer.current) {
          editPreviewScrollContainer.current.scrollTo(0, lastScrollPosition);
        }
      });
    }
  }, [editPreviewScrollContainer, fragments]);

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
      className="pb-4 h-full max-h-full w-full "
      style={{ maxWidth: "768px" }}
    >
      <div
        id="preview-container"
        className=" h-full"
        style={{ width: "calc(100% - 20px)" }}
      >
        <div
          className={`shadow-lg rounded-lg bg-white h-full w-full pt-6 pb-10 z-20 relative px-6`}
        >
          <SaveStatus saving={saving} lastSaved={lastSaved} />
          <div
            ref={editPreviewScrollContainer}
            className={`h-full overflow-scroll js-preview-scroll-container relative ${theme.margin}`}
            onScroll={debounce((e) => {
              updateUiState({
                editPreviewScrollPosition: e.target.scrollTop,
              });
            }, 1000)}
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
                return (
                  <PhotoFragment fragment={frag} theme={theme} key={index} />
                );
              })}
          </div>
          <ChapterNavigator fragments={fragments} />
        </div>
        {/* <div className="shadow-lg rounded-lg bg-white h-full w-full p-10 absolute left-3 z-10"></div> */}
        {/* <div className="shadow-xl rounded-lg bg-white h-full w-full p-10 absolute left-6"></div> */}
      </div>
    </div>
  );
}
