import { Button, Title, Text } from "~/components/_styled";
import Svg from "~/components/svg";
import colors from "~/lib/colors";

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

function Benefit({ text, included = true }) {
  return (
    <span className="block flex mb-2">
      <Svg
        name={included ? "check" : "cross"}
        css="mr-1"
        color={included ? "green" : "red"}
        size={16}
      />
      {text}
    </span>
  );
}

function getDesc(interval) {
  switch (interval) {
    case "month":
      return (
        <>
          {/* <Benefit text="Unlimited access and uploads" /> */}
          {/* <Benefit text="Share your book" /> */}
          <Benefit text="Cancel anytime" />
          {/* <Benefit text="Save 20%" included={false} /> */}
        </>
      );
    case "year":
      return (
        <>
          {/* <Benefit text="Unlimited access and uploads" /> */}
          {/* <Benefit text="Share your book" /> */}
          <Benefit text="Cancel anytime" />
          <Benefit text="Save 20% over our monthly plan" />
        </>
      );
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
  let cardCss =
    "cursor-pointer h-full w-full shadow-lg bg-white border-2 border-lightGray p-4 flex flex-col justify-between rounded ";
  cardCss += index === 0 ? "md:mr-2 " : "md:ml-2 ";
  cardCss += selected ? "border-green " : "border-black ";

  const buttonCss = `mt-2 md:mt-6 ${
    selected &&
    "bg-green border-green hover:bg-green hover:border-green text-white"
  }`;

  const planName = getTitle(option.interval);

  return (
    <div onClick={() => selectPlan()} className={cardCss}>
      <div>
        <Title size="large" css={`mb-0`}>
          {planName}
        </Title>
        <Text size="large">{formatPrice(option.amount)}</Text>
        <Text>{getDesc(option.interval)}</Text>
      </div>

      <Button css={buttonCss} variant="secondary">
        {selected
          ? `${planName} plan selected`
          : `Select ${planName.toLowerCase()} plan`}
      </Button>
    </div>
  );
}
