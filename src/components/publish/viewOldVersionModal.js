import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import Modal from "~/components/modal";
import { Skeleton } from "~/components/_styled";
import OldVersion from "~/components/publish/oldVersion";
import { ACTION_VIEW_OLD_VERSION } from "~/lib/gql";

export default function ViewOldVersionModal({ version, setShowPreview }) {
  const [bookFragments, setBookFragments] = useState(null);
  const [viewOldVersion] = useMutation(ACTION_VIEW_OLD_VERSION);

  useEffect(() => {
    viewOldVersion({
      variables: { versionId: version.id },
    }).then(({ data }) => {
      setBookFragments(data.action_stt_view_old_version.version.fragments);
    });
  }, []);

  return (
    <Modal isOpen={true} close={() => setShowPreview(false)} size="md">
      {!bookFragments ? (
        <Skeleton height="h-8" repeat={12} />
      ) : (
        <OldVersion
          fragments={bookFragments}
          version={version}
          close={() => setShowPreview(false)}
        />
      )}
    </Modal>
  );
}
