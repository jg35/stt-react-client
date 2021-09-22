import { useState } from "react";
import { Button } from "~/components/_styled";
import ManagePrivacyModal from "~/components/publish/managePrivacyModal";

export default function ManagePrivacySettingsButton() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Button size="compact" onClick={() => setShowModal(true)}>
        Manage privacy settings
      </Button>
      {showModal && (
        <ManagePrivacyModal closeModal={() => setShowModal(false)} />
      )}
    </>
  );
}
