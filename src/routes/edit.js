import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { sortBy } from "lodash";
import { FETCH_EDIT_VIEW, UPDATE_FRAGMENT } from "~/lib/gql";
import { useCustomQuery } from "~/hooks/useCustomApollo";
import Page from "~/components/page";
import CaptureModal from "~/components/capture/captureModal";

import EditPreview from "~/components/edit/editPreview";
import PreviewSkeleton from "~/components/previewSkeleton";
import EditPreviewContainer from "~/components/edit/editPreviewContainer";
import useToastMessage from "~/hooks/useToastMessage";

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
            <PreviewSkeleton />
          )}
        </EditPreviewContainer>
      </div>
      <CaptureModal editView />
    </Page>
  );
}
