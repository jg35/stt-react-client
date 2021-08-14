import { Button, Title, Text } from "~/components/_styled";
import { DateTime } from "luxon";
import UserPaymentForm from "~/components/userPaymentForm";

function buildSummary(subscriptionStatus, subscriptionMeta) {
  let planMessage;
  switch (subscriptionStatus) {
    // Other statuses PAYMENT_FAILED / CANCELLED will be handled by global modal
    case "ACTIVE":
      const planName = subscriptionMeta.interval + "ly";
      const nextPaymentDate = `${DateTime.fromSeconds(
        subscriptionMeta.periodEnd
      ).toFormat("dd MMMM yyyy")}`;
      planMessage = (
        <>
          You're on our <strong>{planName}</strong> plan. Your next payment of £
          {subscriptionMeta.amount / 100} will be taken on{" "}
          <strong>{nextPaymentDate}.</strong>
        </>
      );
      break;
    // TODO - should become cancelled when user cancels plan. Becomes CANCELLED_EXPIRED when plan has actually been cancelled
    case "CANCEL_AT_PERIOD_END":
      planMessage = (
        <>
          You're plan has been cancelled. You'll have access to Stories To Tell
          until <strong>{nextPaymentDate}.</strong>
        </>
      );
      break;
    case "IN_TRIAL":
      planMessage = (
        <>
          You're on our free trial. If you would like to continue using Stories
          To Tell, please follow the instructions below.
        </>
      );
  }
  return (
    <>
      <Text>{planMessage}</Text>
      <Text>
        To update payment information,{" "}
        {subscriptionStatus === "CANCEL_AT_PERIOD_END"
          ? "or to renew your plan"
          : "change plans or cancel"}
        , please click below.
      </Text>
    </>
  );
}

export default function ManageStripeCustomer({
  stripeCustomerId,
  subscriptionStatus,
  subscriptionMeta,
}) {
  return (
    <div>
      <Title>Your subscription</Title>
      {buildSummary(subscriptionStatus, subscriptionMeta)}
      {subscriptionStatus === "IN_TRIAL" ? (
        <UserPaymentForm
          intent="MANUAL"
          type="CHOOSE_PLAN"
          subscriptionStatus={subscriptionStatus}
          stripeCustomerId={stripeCustomerId}
          asModal={false}
        />
      ) : (
        <form
          action={`${process.env.REACT_APP_FUNCTIONS_SERVER_URL}/actions/public/stripe/portal`}
          method="POST"
        >
          <input type="hidden" name="customerId" value={stripeCustomerId} />
          <Button type="submit" variant="secondary" css="w-auto">
            Manage my subscription
          </Button>
        </form>
      )}
    </div>
  );
}
