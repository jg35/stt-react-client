import React, { useContext, useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { sortBy } from "lodash";
import { FETCH_EDIT_VIEW, UPDATE_FRAGMENT } from "~/lib/gql";
import { AuthContext } from "~/components/authWrap";
import Page from "~/components/page";
import CaptureModal from "~/components/capture/captureModal";

import EditPreview from "~/components/edit/editPreview";
import EditPreviewSkeleton from "~/components/edit/editPreviewSkeleton";
import EditPreviewContainer from "~/components/edit/editPreviewContainer";

export default function Edit() {
  const {
    authState: { user },
  } = useContext(AuthContext);
  const { data } = useQuery(FETCH_EDIT_VIEW, {
    variables: { userId: user.id },
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
    });
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
