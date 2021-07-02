import { useState, useEffect } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { DateTime } from "luxon";
import { getTrialDaysRemaining } from "~/lib/util";
import { SUBSCRIPTION_URL } from "~/lib/constants";
import StripeForm from "~/components/settings/stripeForm";
import SubscriptionOptionCard from "~/components/settings/subscriptionOptionCard";

function SubscriptionStatus({
  trialDaysRemaining,
  subscriptionActive,
  paymentDetailsRequired,
  subscription,
}) {
  let message;
  let css;
  if (subscriptionActive) {
    message = `Your subscription is active. Your next payment will be on ${DateTime.fromMillis(
      subscription.current_period_end * 1000
    ).toFormat("d MMMM yyyy")}.`;
  } else if (!trialDaysRemaining) {
    message = `You're trial has expired. Please choose a subscription to continue using Stories To Tell.`;
    css = "text-red";
  } else if (trialDaysRemaining) {
    message = `You have ${trialDaysRemaining} days left of your trial. If you've enjoyed your trial so far, please consider choosing a subscription to continue using Stories To Tell after your trial expires.`;
  }
  return <div className={`mb-4 ${css}`}>{message}</div>;
}

async function getStripeConfig(stripeCustomerId) {
  return axios.get(
    `${SUBSCRIPTION_URL}/init?appId=${process.env.REACT_APP_HASURA_APP_ID}&customerId=${stripeCustomerId}`
  );
}

export default function ManageSubscripiton({
  stripeCustomerId,
  trialExpiresDate,
  subscribed,
}) {
  const [subscriptionOptions, setSubscriptionOptions] = useState([]);
  const [customerPlanId, setCustomerPlanId] = useState(null);
  const [planActive, setPlanActive] = useState(false);
  const trialDaysRemaining = getTrialDaysRemaining(trialExpiresDate);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const stripe = useStripe();

  useEffect(async () => {
    if (stripeCustomerId) {
      const { data } = await getStripeConfig(stripeCustomerId);
      const subscription = data.customerSubscriptions
        ? data.customerSubscriptions[0]
        : null;
      setCustomerPlanId(subscription && subscription.plan.id);
      setSubscription(subscription);
      setPlanActive(subscription && subscription.status === "active");

      setSubscriptionOptions(data.prices);
    }
  }, [stripeCustomerId]);

  function createSubscription(confirmCardPaymentForm) {
    // Create the subscription for the customer
    return axios
      .post(`${SUBSCRIPTION_URL}/create`, {
        customerId: stripeCustomerId,
        priceId: selectedPlan.id,
      })
      .then(({ data }) => {
        const clientSecret = data.clientSecret;
        // Now submit the payment details
        stripe
          .confirmCardPayment(clientSecret, confirmCardPaymentForm)
          .then(({ paymentIntent }) => {
            if (paymentIntent.status === "succeeded") {
              setCustomerPlanId(selectedPlan.id);
              setPlanActive(true);
              setSelectedPlan(null);
            }
            return paymentIntent;
          })
          .catch((error) => {
            console.log(error);
            return error;
          });
      });
  }

  return (
    <div className="p-4 shadow-xl bg-white rounded">
      <h1 className="text-lg mb-2">Manage your subscription</h1>
      <SubscriptionStatus
        subscription={subscription}
        trialDaysRemaining={trialDaysRemaining}
        subscriptionActive={planActive}
        paymentDetailsRequired={customerPlanId && !planActive}
      />
      <h2>{planActive ? "Your plan" : "Available plans"}</h2>
      <div className="mt-2 flex flex-wrap">
        {(planActive
          ? subscriptionOptions.filter((s) => s.id === customerPlanId)
          : subscriptionOptions
        ).map((option, index) => {
          return (
            <SubscriptionOptionCard
              activeSubscription={planActive}
              planId={customerPlanId}
              selected={
                customerPlanId === option.id ||
                (selectedPlan && selectedPlan.id === option.id)
              }
              option={option}
              key={index}
              selectPlan={() => setSelectedPlan(option)}
              cancelPlan={() => {
                console.log("cancel the plan");
              }}
            />
          );
        })}
      </div>

      {selectedPlan && (
        <>
          <p className="py-4" style={{ maxWidth: "35rem" }}>
            You've selected the{" "}
            <strong>
              {selectedPlan.recurring.interval === "year"
                ? "annual "
                : "monthly "}
            </strong>
            plan. By submitting your payment details below, your subscription
            will start today and you will be billed{" "}
            <strong>£{selectedPlan.unit_amount / 100} </strong>
            immediately. You can cancel your subscription at any time.
          </p>
          <StripeForm
            newSubscription={true}
            handleSubmit={createSubscription}
          />
        </>
      )}
    </div>
  );
}
