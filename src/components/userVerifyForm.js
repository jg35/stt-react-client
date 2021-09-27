import { useState, useContext } from "react";
import { useHistory } from "react-router";
import { DateTime } from "luxon";
import { useMutation } from "@apollo/client";
import { UPDATE_USER } from "~/lib/gql";
import Modal from "~/components/modal";
import { Button, Title, Text, Grid } from "~/components/_styled";
import Toggle from "~/components/toggle";
import useToastMessage from "~/hooks/useToastMessage";
import { UIContext } from "~/app";
import { resendEmailVerification } from "~/lib/firebase";
import { getHTMLTranslation } from "~/lib/util";

function PolicyAgreementCheckbox({ link, value, toggle, policyName, id }) {
  return (
    <div className="flex justify-between items-center overflow-hidden">
      <p className="font-medium">
        I agree to the&nbsp;
        <a
          href={link}
          className="underline text-blue cursor-pointer"
          title="Click to open"
          target="_blank"
        >
          {policyName}
        </a>
      </p>
      <Toggle id={id} css="ml-2" val={value} onChange={toggle} />
    </div>
  );
}

export default function UserVerifyForm({ emailVerified, user }) {
  const [updateUser] = useMutation(UPDATE_USER);
  const { updateUiState } = useContext(UIContext);
  const [sending, setSending] = useState(false);
  const [step, setStep] = useState(
    user.termsSignedOn && user.privacySignedOn ? 2 : 1
  );
  const { setSuccess } = useToastMessage();
  const history = useHistory();
  const [inProgress, setInProgress] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(user.termsSignedOn);
  const [privacyAgreed, setPrivacyAgreed] = useState(user.privacySignedOn);

  const totalSteps =
    !emailVerified && (!user.termsSignedOn || !user.privacySignedOn) ? 2 : 1;

  return (
    <Modal size="sm" isOpen={true} canClose={false}>
      <div className="flex justify-between items-center mb-6">
        <Title css="mb-0">
          {getHTMLTranslation(`components.userVerifyForm.title.step.${step}`)}
        </Title>
        {totalSteps > 1 && (
          <span>
            {step}/{totalSteps}
          </span>
        )}
      </div>

      <div>
        <Text size="large">
          {getHTMLTranslation(
            `components.userVerifyForm.description.step.${step}`
          )}
        </Text>
        {step === 1 && (
          <>
            <Grid colSpan={["col-span-12 lg:col-span-6"]} css="mt-6">
              <PolicyAgreementCheckbox
                id="privacyToggle"
                policyName="privacy policy"
                link="https://www.iubenda.com/privacy-policy/26041690"
                value={privacyAgreed}
                toggle={() => setPrivacyAgreed(!privacyAgreed)}
              />
              <PolicyAgreementCheckbox
                id="termsToggle"
                policyName="terms"
                link="https://www.iubenda.com/terms-and-conditions/26041690"
                value={termsAgreed}
                toggle={() => setTermsAgreed(!termsAgreed)}
              />
            </Grid>
            <Grid
              colSpan={["col-span-12 lg:col-start-7 lg:col-span-6"]}
              css="mt-6"
            >
              <Button
                variant="cta"
                disabled={!termsAgreed || !privacyAgreed}
                inProgress={inProgress}
                onClick={() => {
                  setInProgress(true);
                  const date = DateTime.now().toFormat("yyyy-MM-dd");
                  updateUser({
                    variables: {
                      userId: user.id,
                      data: {
                        termsSignedOn: date,
                        privacySignedOn: date,
                      },
                    },
                  }).then(() => {
                    setInProgress(false);
                    if (totalSteps > 1) {
                      setStep(2);
                    } else {
                      updateUiState({ showVerifyModal: false }, false);
                    }
                  });
                }}
              >
                {inProgress ? "Saving..." : totalSteps > 1 ? "Next" : "Save"}
              </Button>
            </Grid>
          </>
        )}

        {step === 2 && (
          <>
            <Grid colSpan={["col-span-12 lg:col-span-6"]} css="mt-6">
              <Button
                inProgress={sending}
                onClick={() => {
                  setSending(true);
                  resendEmailVerification().then(() => {
                    setSuccess({ ref: "SEND_RESET_EMAIL" });
                    setSending(false);
                  });
                }}
              >
                {getHTMLTranslation("components.userVerifyForm.send")}
              </Button>
              <Button variant="cta" onClick={() => history.go()}>
                {getHTMLTranslation("components.userVerifyForm.confirm")}
              </Button>
            </Grid>
          </>
        )}
      </div>
    </Modal>
  );
}
