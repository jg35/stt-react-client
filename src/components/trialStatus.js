import { useContext } from "react";
import { UIContext } from "~/app";
import { Button } from "~/components/_styled";
import Svg from "~/components/svg";
import { getTrialDaysRemaining, getNumAsWord } from "~/lib/util";

export default function TrialStatus({ expiry, status, stripeCustomerId }) {
  const { updateUiState, uiState } = useContext(UIContext);
  const trialDaysRemaining = getTrialDaysRemaining(expiry);
  if (
    uiState.hideTrialStatus ||
    status !== "IN_TRIAL" ||
    trialDaysRemaining <= 0
  ) {
    return null;
  }

  return (
    <div className="flex">
      <Button
        size="compact"
        css="font-medium"
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
      {window.innerWidth < 768 && (
        <Button
          size="compact"
          variant="minimal"
          css="ml-1 w-auto"
          onClick={() => updateUiState({ hideTrialStatus: true })}
        >
          <Svg name="cancel" />
        </Button>
      )}
    </div>
  );
}
