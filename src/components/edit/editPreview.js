import React, { useState, useContext, useRef, useEffect } from "react";
import { DateTime } from "luxon";
import { debounce } from "lodash";

import { UIContext } from "~/app";
import ChapterNavigator from "~/components/timeline/chapterNavigator";
import PhotoFragment from "~/components/edit/photoFragment";
import EditableFragment from "~/components/edit/editableFragment";
import SaveStatus from "~/components/saveStatus";
import { setGoogleFontStyles } from "~/lib/uiManager";

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
    <>
      <div className="absolute top-2 left-4">
        <SaveStatus saving={saving} lastSaved={lastSaved} />
      </div>
      <div
        ref={editPreviewScrollContainer}
        className={`h-full overflow-scroll js-preview-scroll-container relative pt-10 px-8`}
        onScroll={debounce((e) => {
          updateUiState({
            editPreviewScrollPosition: e.target.scrollTop,
          });
        }, 1000)}
      >
        {fragments
          .filter((f) => !f.hidden)
          .map((frag) => {
            if (frag.type !== "PHOTO") {
              return (
                <EditableFragment
                  theme={theme}
                  fragment={frag}
                  key={frag.id}
                  saveFragment={(newContent) =>
                    saveFragmentHandler(newContent, frag.content, frag.id)
                  }
                />
              );
            }
            return (
              <PhotoFragment fragment={frag} theme={theme} key={frag.id} />
            );
          })}
      </div>
      <ChapterNavigator fragments={fragments} />
    </>
  );
}