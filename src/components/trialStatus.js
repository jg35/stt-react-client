import { useContext } from "react";
import { UIContext } from "~/app";
import { Button } from "~/components/_styled";
import Svg from "~/components/svg";
import { getTrialDaysRemaining, getNumAsWord } from "~/lib/util";
import { getTranslation } from "../lib/util";

export default function TrialStatus({
  expiry,
  status,
  stripeCustomerId,
  showExpiry = true,
  css = "",
  isBillingView = false,
}) {
  const { updateUiState, uiState } = useContext(UIContext);
  const trialDaysRemaining = getTrialDaysRemaining(expiry);
  if (
    (uiState.hideTrialStatus && !isBillingView) ||
    status !== "IN_TRIAL" ||
    trialDaysRemaining <= 0
  ) {
    return null;
  }

  return (
    <div className="flex">
      <Button
        size="compact"
        css={`font-medium ${css}`}
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
        {showExpiry &&
          getTranslation("components.trialStatus.status", [
            { key: "TRIAL_DAYS_REMAINING", value: trialDaysRemaining },
            {
              key: "TRIAL_DAYS_REMAINING_PLURAL",
              value: trialDaysRemaining > 1 ? "s" : "",
            },
          ])}
      </Button>
      {window.innerWidth < 768 && !isBillingView && (
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
