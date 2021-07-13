import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "~/components/modal";
import SubmitButton from "~/components/submitButton";
import SubscriptionOptionCard from "~/components/settings/subscriptionOptionCard";

async function getPrices() {
  return axios.get(
    `${process.env.REACT_APP_NETLIFY_FUNCTIONS_URL}/actions/subscriptions/prices?appId=${process.env.REACT_APP_HASURA_APP_ID}`
  );
}
export default function UserPaymentForm({
  type,
  intent,
  subscriptionStatus,
  stripeCustomerId,
  closeModal,
}) {
  const [subscriptionOptions, setSubscriptionOptions] = useState([]);
  const [priceId, setPriceId] = useState(null);

  useEffect(async () => {
    const { data } = await getPrices(stripeCustomerId);
    setSubscriptionOptions(data);
  }, []);

  function getPaymentMessage() {
    if (intent === "MANUAL") {
      return "Thanks for trying Stories To Tell. Please pick a plan below to continue using it";
    }
    switch (subscriptionStatus) {
      case "CANCELLED":
        return "Your subscription has expired. To regain access to Stories To Tell, please choose a plan below";
      case "PAYMENT_FAILED":
        return "Your last payment failed. Please update your payment method by clicking 'Manage subscription' below";
      case "IN_TRIAL":
        return "Your trial has expired. If you have enjoyed Stories To Tell, please pick a plan below to continue using it";
    }
  }

  return (
    <Modal
      size="sm"
      isOpen={true}
      close={intent === "MANUAL" ? closeModal : null}
    >
      <div>
        <h1 className="text-xl">
          {type === "CHOOSE_PLAN" ? "Pick a plan" : "Manage your subscription"}
        </h1>
        <p className="mt-2">{getPaymentMessage()}</p>
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
        action={`${process.env.REACT_APP_NETLIFY_FUNCTIONS_URL}/actions/subscriptions/checkout`}
        method="POST"
      >
        <input type="hidden" name="customerId" value={stripeCustomerId}></input>
        <input type="hidden" name="priceId" value={priceId}></input>
        <input
          type="hidden"
          name="appId"
          value={process.env.REACT_APP_HASURA_APP_ID}
        />
        <SubmitButton style={{ minWidth: "100%" }} bigCta disabled={!priceId}>
          Continue
        </SubmitButton>
      </form>
    </Modal>
  );
}
