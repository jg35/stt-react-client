import { useState, useContext } from "react";
import { useHistory } from "react-router";
import useToastMessage from "~/hooks/useToastMessage";
import { Title, Text, Button, Grid } from "~/components/_styled";
import { resendEmailVerification } from "~/lib/firebase";
import AlertCircle from "~/components/alertCircle";
import { UIContext } from "~/app";

export default function AccountActivation() {
  const { uiState } = useContext(UIContext);
  const { setSuccess } = useToastMessage();
  const history = useHistory();
  const [sendingEmail, setSendingEmail] = useState(false);

  if (!uiState.accountActivated) {
    return (
      <div className="pb-6 mb-6 border-b border-lightGray">
        <Title size="compact" css="relative inline-block">
          Activate your account
          <AlertCircle active={true} position="top-1 -right-4" />
        </Title>
        <Text>
          To activate your account, we need to confirm your email address.
        </Text>
        <Text>
          This was sent by email when you signed up. To resend this, click
          below.
        </Text>
        <Grid colSpan={["col-span-12 md:col-span-6"]}>
          <Button
            size="compact"
            inProgress={sendingEmail}
            onClick={() => {
              setSendingEmail(true);
              resendEmailVerification().then(() => {
                setSuccess({ ref: "SEND_CONFIRMATION_EMAIL" });
                setSendingEmail(false);
              });
            }}
          >
            Resend confirmation email
          </Button>
          <Button
            variant="cta"
            size="compact"
            onClick={() => {
              history.go();
            }}
          >
            I've activated my account
          </Button>
        </Grid>
      </div>
    );
  }

  return null;
}
