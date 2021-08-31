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
import { Empty } from "~/components/_styled";
import usePageTitle from "~/hooks/usePageTitle";

export default function Edit() {
  usePageTitle("Edit");
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
    <>
      <Page>
        <EditPreviewContainer>
          <Empty info="Add some things to your timeline to begin editing your book. " />
          {/* {data ? (
            data.stt_fragment.length > 0 ? (
              <EditPreview fragments={fragments} saveFragment={saveFragment} />
            ) : (
              <Empty info="Add some things to your timeline to begin editing your book. " />
            )
          ) : (
            <PreviewSkeleton />
          )} */}
        </EditPreviewContainer>
      </Page>
      <CaptureModal editView />
    </>
  );
}
