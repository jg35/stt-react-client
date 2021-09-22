import { Button, Title, Text } from "~/components/_styled";
import { DateTime } from "luxon";
import TrialStatus from "~/components/trialStatus";
import { getHTMLTranslation } from "~/lib/util";

function buildSummary(subscriptionStatus, subscriptionMeta) {
  let planMessage;
  let nextPaymentDate;
  if (subscriptionMeta && subscriptionMeta.periodEnd) {
    nextPaymentDate = `${DateTime.fromSeconds(
      subscriptionMeta.periodEnd
    ).toFormat("dd MMMM yyyy")}`;
  }

  switch (subscriptionStatus) {
    // Other statuses PAYMENT_FAILED / CANCELLED will be handled by global modal
    case "ACTIVE":
      const planName = subscriptionMeta.interval + "ly";

      planMessage = getHTMLTranslation(
        "components.settings.manageStripeCustomer.plan.active",
        [
          { key: "NEXT_PAYMENT_DATE", value: nextPaymentDate },
          { key: "PLAN_NAME", value: planName },
          { key: "NEXT_PAYMENT_AMOUNT", value: subscriptionMeta.amount / 100 },
        ]
      );
      break;
    // TODO - should become cancelled when user cancels plan. Becomes CANCELLED_EXPIRED when plan has actually been cancelled
    case "CANCEL_AT_PERIOD_END":
      planMessage = getHTMLTranslation(
        "components.settings.manageStripeCustomer.plan.cancelAtPeriodEnd",
        [{ key: "NEXT_PAYMENT_DATE", value: nextPaymentDate }]
      );
      break;
    case "IN_TRIAL":
      planMessage = getHTMLTranslation(
        "components.settings.manageStripeCustomer.plan.inTrial"
      );
  }
  return (
    <>
      <Text css="mb-6">{planMessage}</Text>
    </>
  );
}

export default function ManageStripeCustomer({
  stripeCustomerId,
  subscriptionStatus,
  subscriptionMeta,
  trialExpiresDate,
}) {
  return (
    <div className="border-b border-lightGray pb-6 mb-6">
      <Title size="compact">Your subscription</Title>
      <Text>{buildSummary(subscriptionStatus, subscriptionMeta)}</Text>
      {subscriptionStatus === "IN_TRIAL" ? (
        <div className="mt-6">
          <TrialStatus
            stripeCustomerId={stripeCustomerId}
            expiry={trialExpiresDate}
            status={subscriptionStatus}
            isBillingView
          />
        </div>
      ) : (
        <form
          action={`${process.env.REACT_APP_FUNCTIONS_SERVER_URL}/actions/public/stripe/portal`}
          method="POST"
        >
          <input type="hidden" name="customerId" value={stripeCustomerId} />
          <input
            type="hidden"
            name="appId"
            value={process.env.REACT_APP_HASURA_APP_ID}
          ></input>
          <Button type="submit" css="w-full">
            Manage my subscription
          </Button>
        </form>
      )}
    </div>
  );
}
