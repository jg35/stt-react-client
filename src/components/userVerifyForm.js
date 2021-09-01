import { useState } from "react";
import { useHistory } from "react-router";
import Modal from "~/components/modal";
import { Button, Title, Text } from "~/components/_styled";
import useToastMessage from "~/hooks/useToastMessage";
import { resendEmailVerification } from "~/lib/firebase";
import { getTranslation } from "~/lib/util";

export default function UserVerifyForm() {
  const [sending, setSending] = useState(false);
  const { setSuccess } = useToastMessage();
  const history = useHistory();
  return (
    <Modal size="sm" isOpen={true} canClose={false}>
      <Title>{getTranslation("components.userVerifyForm.title")}</Title>
      <Text>{getTranslation("components.userVerifyForm.description")}</Text>

      <Button variant="secondary" css="my-1" onClick={() => history.go()}>
        {getTranslation("components.userVerifyForm.confirm")}
      </Button>

      <Button
        css="my-1"
        inProgress={sending}
        onClick={() => {
          setSending(true);
          resendEmailVerification().then(() => {
            setSuccess({ ref: "SEND_RESET_EMAIL" });
            setSending(false);
          });
        }}
      >
        {getTranslation("components.userVerifyForm.resend")}
      </Button>
    </Modal>
  );
}
