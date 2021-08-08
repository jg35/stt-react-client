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
  option,
  selectPlan,
  selected,
  index,
}) {
  return (
    <div onClick={() => selectPlan()} className={`cursor-pointer w-48 mb-4`}>
      <div
        className={`shadow-lg bg-white border-2 p-4 ${
          index === 0 ? "mr-1" : "ml-1"
        } rounded ${selected ? "border-green" : "border-black"}`}
      >
        <h1 className={`text-xl`}>{getTitle(option.interval)}</h1>
        <p className={`text-lg`}>{formatPrice(option.amount)}</p>
        <div className="pt-6">
          <Button
            css={selected ? "bg-green hover:bg-green " : ""}
            onClick={() => selectPlan()}
            disabled={selected}
          >
            {selected ? "Plan selected" : "Select this plan"}
          </Button>
        </div>
      </div>
    </div>
  );
}
