import { useState } from "react";
import { useHistory } from "react-router";
import Modal from "~/components/modal";
import Button from "~/components/button";
import useToastMessage from "~/hooks/useToastMessage";
import { resendEmailVerification } from "~/lib/firebase";

export default function UserVerifyForm() {
  const [sending, setSending] = useState(false);
  const { setSuccess } = useToastMessage();
  const history = useHistory();
  return (
    <Modal size="sm" isOpen={true} canClose={false}>
      <div>
        <h1 className="text-xl">
          Please check your email to verify your account
        </h1>
        <p className="mt-2">
          If you have not recieved a verification email, please click below to
          resend
        </p>
      </div>

      <Button variant="secondary" css="my-1" onClick={() => history.go()}>
        I've verified my account
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
        Resend verification email
      </Button>
    </Modal>
  );
}
