import { useState, useContext } from "react";
import { useMutation, gql } from "@apollo/client";
import { Button } from "~/components/_styled";
import ProceedModal from "~/components/proceedModal";
import { UPDATE_USER } from "~/lib/gql";
import useToastMessage from "~/hooks/useToastMessage";
import { AuthContext } from "~/components/authWrap";

export default function OldVersion({ fragments, version, close }) {
  const {
    authState: { dbUser },
  } = useContext(AuthContext);
  const [showProceedModal, setShowProceedModal] = useState(false);
  const [updateUser] = useMutation(UPDATE_USER);
  const { setSuccess } = useToastMessage();
  return (
    <>
      <div className="absolute top-6 lg:top-4">
        <Button
          size="compact"
          variant="cta"
          css="w-auto"
          onClick={() => setShowProceedModal(true)}
        >
          Republish this version
        </Button>
        {showProceedModal && (
          <ProceedModal
            title="Readers will see this version when they visit your url"
            onCancel={() => setShowProceedModal(false)}
            onProceed={() =>
              updateUser({
                variables: {
                  userId: dbUser.id,
                  data: {
                    publishedVersion: version.id,
                  },
                },
              }).then(() => {
                setSuccess({
                  ref: "REPUBLISHED_VERSION",
                  params: [version.version],
                });
                close();
              })
            }
            text="Republish"
            inProgressText="Saving..."
          />
        )}
      </div>

      <div className="mx-auto relative" style={{ maxWidth: "768px" }}>
        {fragments.map((frag, index) => {
          if (frag.type === "CHAPTER") {
            return (
              <h1 className="preview-element" key={index}>
                {frag.content}
              </h1>
            );
          } else if (frag.type === "PHOTO") {
            return (
              <figure key={index}>
                <img
                  src={frag.signedMediaUrl}
                  className="w-auto shadow mx-auto"
                  style={{ maxHeight: "500px" }}
                />
                <figcaption className="preview-element">
                  {frag.mediaCaption}
                </figcaption>
              </figure>
            );
          } else {
            return (
              <p className="preview-element" key={index}>
                {frag.content}
              </p>
            );
          }
        })}
      </div>
    </>
  );
}
