import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { sortBy } from "lodash";
import { FETCH_EDIT_VIEW, UPDATE_FRAGMENT } from "@src/lib/gql";
import { useCustomQuery } from "@src/hooks/useCustomApollo";
import Page from "@src/components/page";
import CaptureModal from "@src/components/capture/captureModal";

import EditPreview from "@src/components/edit/editPreview";
import EditPreviewSkeleton from "@src/components/edit/editPreviewSkeleton";
import EditPreviewContainer from "@src/components/edit/editPreviewContainer";
import useToastMessage from "@src/hooks/useToastMessage";

export default function Edit() {
  const { setError } = useToastMessage();
  const { data } = useCustomQuery(FETCH_EDIT_VIEW, {
    userId: true,
  });

  const [updateFragment] = useMutation(UPDATE_FRAGMENT);
  const [fragments, setFragments] = useState([]);

  useEffect(() => {
    if (data) {
      if (data.stt_fragment.length) {
        setFragments(sortBy(data.stt_fragment, "date"));
      }
    }
  }, [data]);

  function saveFragment(newContent, fragmentId) {
    return updateFragment({
      variables: {
        data: {
          content: newContent,
        },
        id: fragmentId,
      },
    }).catch((e) => setError(e, { ref: "UPDATE", params: ["book"] }));
  }

  return (
    <Page>
      <div
        className="flex h-full w-full justify-center"
        style={{ margin: "0 auto" }}
      >
        <EditPreviewContainer>
          {data ? (
            <EditPreview fragments={fragments} saveFragment={saveFragment} />
          ) : (
            <EditPreviewSkeleton />
          )}
        </EditPreviewContainer>
      </div>
      <CaptureModal editView />
    </Page>
  );
}
