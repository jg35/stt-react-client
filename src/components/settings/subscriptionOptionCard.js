import { useState } from "react";
import Button from "~/components/button";

function getTitle(interval) {
  switch (interval) {
    case "year":
      return "Annual";
    case "month":
      return "Monthly";
    default:
      return "";
  }
}

function formatPrice(price) {
  return `£${price / 100}`;
}

export default function SubscriptionOptionCard({
  planId,
  activeSubscription,
  option,
  selectPlan,
  cancelPlan,
  selected,
}) {
  const [planSelected] = useState(planId === option.id);
  const [planActive] = useState(planId === option.id && activeSubscription);
  return (
    <div
      className={`w-40 shadow-lg bg-white border-2 mr-4 p-4 mb-4 rounded ${
        selected ? "border-green" : "border-black"
      }`}
    >
      <h1 className={`text-xl`}>{getTitle(option.recurring.interval)}</h1>
      <p className="text-lg">{formatPrice(option.unit_amount)}</p>
      <div className="pt-6">
        {!selected && !activeSubscription && (
          <Button onClick={() => selectPlan()}>
            {selected ? "Plan selected" : "Select this plan"}
          </Button>
        )}
        {planActive && (
          <Button onClick={() => cancelPlan()}>Cancel plan</Button>
        )}
        {planSelected && !planActive && (
          <Button disabled>Payment required</Button>
        )}
      </div>
    </div>
  );
}
