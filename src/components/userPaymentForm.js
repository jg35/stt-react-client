import { useEffect, useState } from "react";
import { useCustomQuery } from "~/hooks/useCustomApollo";
import { ACTION_STRIPE_FETCH_PRICES } from "~/lib/gql";
import Modal from "~/components/modal";
import { Title, Button, Text, Grid, Skeleton } from "~/components/_styled";
import SubscriptionOptionCard from "~/components/settings/subscriptionOptionCard";
import { getHTMLTranslation, closeHandler } from "~/lib/util";

export default function UserPaymentForm({
  type,
  intent,
  subscriptionStatus,
  stripeCustomerId,
  closeModal,
  asModal = true,
}) {
  const [subscriptionOptions, setSubscriptionOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const [priceId, setPriceId] = useState(null);
  const { data } = useCustomQuery(ACTION_STRIPE_FETCH_PRICES, {
    variables: { appId: process.env.REACT_APP_HASURA_APP_ID },
  });

  useEffect(async () => {
    if (data) {
      setSubscriptionOptions(
        [...data.action_subscriptions_get_prices].sort((a, b) =>
          a.amount > b.amount ? 1 : -1
        )
      );
    }
  }, [data]);

  function getPaymentMessage() {
    if (intent === "MANUAL") {
      return getHTMLTranslation("components.userPaymentForm.openMessage");
    }
    switch (subscriptionStatus) {
      case "CANCELLED":
      case "CANCEL_AT_PERIOD_END":
        return getHTMLTranslation("components.userPaymentForm.cancelled");

      case "PAYMENT_FAILED":
        return getHTMLTranslation("components.userPaymentForm.paymentFailed");

      case "IN_TRIAL":
        return getHTMLTranslation("components.userPaymentForm.inTrial");
    }
  }

  const inner = data ? (
    <>
      <div>
        <Title className="text-xl">
          {type === "CHOOSE_PLAN"
            ? "Choose a subscription"
            : "Manage your subscription"}
        </Title>
        <Text>{getPaymentMessage()}</Text>
      </div>
      {subscriptionStatus !== "PAYMENT_FAILED" && (
        <Grid css="mt-4" colSpan={["col-span-12 sm:col-span-6"]}>
          {subscriptionOptions.map((option, index) => {
            return (
              <SubscriptionOptionCard
                index={index}
                option={option}
                selected={priceId === option.id}
                key={index}
                selectPlan={() => setPriceId(option.id)}
              />
            );
          })}
        </Grid>
      )}
      <form
        action={`${process.env.REACT_APP_FUNCTIONS_SERVER_URL}/actions/public/stripe/checkout`}
        method="POST"
        id="user-payment-form"
      >
        <input type="hidden" name="customerId" value={stripeCustomerId}></input>
        <input
          type="hidden"
          name="appId"
          value={process.env.REACT_APP_HASURA_APP_ID}
        ></input>
        <input type="hidden" name="priceId" value={priceId}></input>

        <Button type="submit" variant="cta" css="mt-4" disabled={!priceId}>
          Continue
        </Button>
      </form>
    </>
  ) : (
    <Skeleton height="h-36" repeat={3} spacing="my-3" />
  );

  if (!asModal) {
    return inner;
  }

  return (
    <Modal
      size="md"
      isOpen={isOpen}
      canClose={intent === "MANUAL"}
      close={() => closeHandler(setIsOpen, closeModal)}
    >
      {inner}
    </Modal>
  );
}
