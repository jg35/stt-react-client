import { useHistory } from "react-router";
import Modal from "~/components/modal";
import Button from "~/components/button";
import { resendEmailVerification } from "~/lib/firebase";

export default function UserVerifyForm() {
  const history = useHistory();
  return (
    <Modal size="sm" isOpen={true} close={() => console.log("cannot close")}>
      <div>
        <h1 className="text-xl">
          Please check your email to verify your account
        </h1>
        <p className="mt-2">
          If you have not recieved a verification email, please click below to
          resend
        </p>
      </div>

      <Button cta onClick={() => history.go()}>
        I've verified my account
      </Button>

      <Button cta onClick={resendEmailVerification}>
        Resend verification email
      </Button>
    </Modal>
  );
}