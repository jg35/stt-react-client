import { useContext, useState } from "react";
import Modal from "~/components/modal";
import { AuthContext } from "~/components/authWrap";
import ManagePrivacy from "~/components/settings/managePrivacy";
import { closeHandler } from "~/lib/util";
export default function ManagePrivacyModal({ closeModal }) {
  const [isOpen, setIsOpen] = useState(true);
  const {
    authState: { dbUser },
  } = useContext(AuthContext);
  return (
    <Modal
      size="md"
      isOpen={isOpen}
      close={() => closeHandler(setIsOpen, closeModal)}
    >
      <ManagePrivacy
        showShareList={false}
        dbUser={dbUser}
        onSubmitSuccess={() => closeHandler(setIsOpen, closeModal)}
      />
    </Modal>
  );
}
