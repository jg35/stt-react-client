import Button from "~/components/button";
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
        <p>
          You're on our <span className="font-medium">{planName}</span> plan.
          Your next payment of £{subscriptionMeta.amount / 100} will be taken on{" "}
          <span className="font-medium">{nextPaymentDate}.</span>
        </p>
      );
      break;
    // TODO - should become cancelled when user cancels plan. Becomes CANCELLED_EXPIRED when plan has actually been cancelled
    case "CANCEL_AT_PERIOD_END":
      planMessage = (
        <p>
          You're plan has been cancelled. You'll have access to Stories To Tell
          until <span className="font-medium">{nextPaymentDate}.</span>
        </p>
      );
      break;
    case "IN_TRIAL":
      planMessage = (
        <p>
          You're on our free trial. If you would like to continue using Stories
          To Tell, please follow the instructions below.
        </p>
      );
  }
  return (
    <>
      {planMessage}
      <p>
        To update payment information,{" "}
        {subscriptionStatus === "CANCEL_AT_PERIOD_END"
          ? "or to renew your plan"
          : "change plans or cancel"}
        , please click below.
      </p>
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
      <h1 className="text-lg">Your subscription</h1>
      <p className="my-4">
        {buildSummary(subscriptionStatus, subscriptionMeta)}
      </p>
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
          <Button type="submit">Manage my subscription</Button>
        </form>
      )}
    </div>
  );
}
