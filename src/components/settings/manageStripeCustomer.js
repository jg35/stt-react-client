import Button from "~/components/button";

export default function ManageStripeCustomer({ stripeCustomerId }) {
  return (
    <div>
      <form
        action={`${process.env.REACT_APP_NETLIFY_FUNCTIONS_URL}/actions/subscriptions/portal`}
        method="POST"
      >
        <input type="hidden" name="customerId" value={stripeCustomerId} />
        <Button type="submit">Manage subscription</Button>
      </form>
    </div>
  );
}
