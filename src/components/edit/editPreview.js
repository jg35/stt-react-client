import React, { useState, useContext, useRef, useEffect } from "react";
import { DateTime } from "luxon";
import debounce from "lodash/debounce";

import { UIContext } from "~/app";
import ChapterNavigator from "~/components/timeline/chapterNavigator";
import EditableFragment from "~/components/edit/editableFragment";
import SaveStatus from "~/components/saveStatus";

export default function Preview({ fragments, saveFragment }) {
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
      <div className="absolute top-1 left-4">
        <SaveStatus saving={saving} lastSaved={lastSaved} />
      </div>
      <div
        ref={editPreviewScrollContainer}
        className={`h-full overflow-scroll js-preview-scroll-container relative pt-10 preview-container`}
        onScroll={debounce((e) => {
          updateUiState({
            editPreviewScrollPosition: e.target.scrollTop,
          });
        }, 1000)}
      >
        {fragments
          .filter((f) => !f.hidden)
          .map((frag) => (
            <EditableFragment
              fragment={frag}
              key={frag.id}
              saveFragment={(newContent) =>
                saveFragmentHandler(newContent, frag.content, frag.id)
              }
            />
          ))}
      </div>
      <ChapterNavigator fragments={fragments} editView />
    </>
  );
}
