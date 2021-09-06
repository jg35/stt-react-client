import { useEffect, useState } from "react";
import { useCustomQuery } from "~/hooks/useCustomApollo";
import { ACTION_STRIPE_FETCH_PRICES } from "~/lib/gql";
import Modal from "~/components/modal";
import { Title, Button, Text } from "~/components/_styled";
import SubscriptionOptionCard from "~/components/settings/subscriptionOptionCard";
import { getTranslation } from "~/lib/util";

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
      return getTranslation("components.userPaymentForm.openMessage");
    }
    switch (subscriptionStatus) {
      case "CANCELLED":
      case "CANCEL_AT_PERIOD_END":
        return getTranslation("components.userPaymentForm.cancelled");

      case "PAYMENT_FAILED":
        return getTranslation("components.userPaymentForm.paymentFailed");

      case "IN_TRIAL":
        return getTranslation("components.userPaymentForm.inTrial");
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
        <input
          type="hidden"
          name="appId"
          value={process.env.REACT_APP_HASURA_APP_ID}
        ></input>
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
