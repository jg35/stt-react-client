import { Button, Title, Text } from "~/components/_styled";
import { DateTime } from "luxon";
import TrialStatus from "~/components/trialStatus";

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

      planMessage = (
        <>
          You're on our <strong>{planName}</strong> plan. Your next payment of £
          {subscriptionMeta.amount / 100} will be taken on{" "}
          <strong>{nextPaymentDate}</strong>.
          <br />
          <br />
          To update payment information, manage or cancel your subscription,
          please click below.
        </>
      );
      break;
    // TODO - should become cancelled when user cancels plan. Becomes CANCELLED_EXPIRED when plan has actually been cancelled
    case "CANCEL_AT_PERIOD_END":
      planMessage = (
        <>
          You're plan has been cancelled. You'll have access to Stories To Tell
          until <strong>{nextPaymentDate}</strong>.
          <br />
          <br />
          If you've changed your mind about cancelling, click below to manage
          your subscription.
        </>
      );
      break;
    case "IN_TRIAL":
      planMessage = (
        <>
          You're on our free trial. If you would like to continue using Stories
          To Tell, please subscribe below.
        </>
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
    <div>
      <Title>Your subscription</Title>
      <Text>{buildSummary(subscriptionStatus, subscriptionMeta)}</Text>
      {subscriptionStatus === "IN_TRIAL" ? (
        <div className="mt-6">
          <TrialStatus
            stripeCustomerId={stripeCustomerId}
            expiry={trialExpiresDate}
            status={subscriptionStatus}
            css="w-full md:w-auto"
          />
        </div>
      ) : (
        <form
          action={`${process.env.REACT_APP_FUNCTIONS_SERVER_URL}/actions/public/stripe/portal`}
          method="POST"
        >
          <input type="hidden" name="customerId" value={stripeCustomerId} />
          <Button type="submit" css="w-full md:w-auto">
            Manage my subscription
          </Button>
        </form>
      )}
    </div>
  );
}
