import { useEffect, useState } from "react";
import { useCustomQuery } from "~/hooks/useCustomApollo";
import { ACTION_STRIPE_FETCH_PRICES } from "~/lib/gql";
import Modal from "~/components/modal";
import { Title, Button, Text } from "~/components/_styled";
import SubscriptionOptionCard from "~/components/settings/subscriptionOptionCard";

export default function UserPaymentForm({
  type,
  intent,
  subscriptionStatus,
  stripeCustomerId,
  closeModal,
  asModal = true,
}) {
  const [subscriptionOptions, setSubscriptionOptions] = useState([]);
  const [priceId, setPriceId] = useState(null);
  const { data } = useCustomQuery(ACTION_STRIPE_FETCH_PRICES, {
    variables: { appId: process.env.REACT_APP_HASURA_APP_ID },
  });

  useEffect(async () => {
    if (data) {
      setSubscriptionOptions(data.action_subscriptions_get_prices);
    }
  }, [data]);

  function getPaymentMessage() {
    if (intent === "MANUAL") {
      return (
        <>
          We hope you've enjoyed Stories To Tell so far, and have the beginnings
          of a wonderful book to share with your loved ones.
          <br />
          <br />
          If you'd like to stick around once your trial is up, become a
          permanent member today by choosing a subscription below.
        </>
      );
    }
    switch (subscriptionStatus) {
      case "CANCELLED":
        return "Your subscription has ended. To restore access to Stories To Tell, please choose a subscription.";
      case "PAYMENT_FAILED":
        return "Your last payment failed. Please update your payment method by clicking 'Manage subscription' below.";
      case "IN_TRIAL":
        return "Your trial has expired. If you have enjoyed Stories To Tell, please choose a subscription.";
    }
  }

  const inner = (
    <>
      <div>
        <Title className="text-xl">
          {type === "CHOOSE_PLAN" ? "Pick a plan" : "Manage your subscription"}
        </Title>
        <Text>{getPaymentMessage()}</Text>
      </div>
      {subscriptionStatus !== "PAYMENT_FAILED" && (
        <div className="mt-6 flex flex-wrap">
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
        </div>
      )}
      <form
        action={`${process.env.REACT_APP_FUNCTIONS_SERVER_URL}/actions/public/stripe/checkout`}
        method="POST"
        id="user-payment-form"
      >
        <input type="hidden" name="customerId" value={stripeCustomerId}></input>
        <input type="hidden" name="priceId" value={priceId}></input>
        <input
          type="hidden"
          name="appId"
          value={process.env.REACT_APP_HASURA_APP_ID}
        />

        <Button type="submit" variant="cta" css="mt-4" disabled={!priceId}>
          Continue
        </Button>
      </form>
    </>
  );

  if (!asModal) {
    return inner;
  }

  return (
    <Modal
      size="md"
      isOpen={true}
      canClose={intent === "MANUAL"}
      close={closeModal}
    >
      {inner}
    </Modal>
  );
}
