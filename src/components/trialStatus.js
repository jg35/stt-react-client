import { useContext } from "react";
import { UIContext } from "~/app";
import Button from "~/components/button";
import { getTrialDaysRemaining, getNumAsWord } from "~/lib/util";

export default function TrialStatus({ expiry, status, stripeCustomerId }) {
  const { updateUiState } = useContext(UIContext);
  const trialDaysRemaining = getTrialDaysRemaining(expiry);
  if (status !== "IN_TRIAL" || trialDaysRemaining <= 0) {
    return null;
  }
  return (
    <Button
      onClick={() =>
        updateUiState(
          {
            payment: {
              showModal: true,
              type: "CHOOSE_PLAN",
              intent: "MANUAL",
              subscriptionStatus: status,
              stripeCustomerId,
            },
          },
          false
        )
      }
    >
      {getNumAsWord(trialDaysRemaining)} days remaining - Pick a plan
    </Button>
  );
}