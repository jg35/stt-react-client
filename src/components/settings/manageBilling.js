import ManageStripeCustomer from "~/components/settings/manageStripeCustomer";

export default function ManageBilling({ dbUser }) {
  return (
    <div className="animate-fade-in">
      <ManageStripeCustomer
        subscriptionStatus={dbUser.subscriptionStatus}
        subscriptionMeta={dbUser.subscriptionMeta}
        stripeCustomerId={dbUser.stripeCustomerId}
      />
    </div>
  );
}
