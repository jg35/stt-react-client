import { useContext } from "react";
import { AuthContext } from "~/components/authWrap";
import Page from "~/components/page";

import ManageStripeCustomer from "~/components/settings/manageStripeCustomer";
export default function Settings() {
  const { dbUser } = useContext(AuthContext);
  return (
    <Page minimal>
      {dbUser && (
        <ManageStripeCustomer
          stripeCustomerId={dbUser && dbUser.stripeCustomerId}
        />
      )}
    </Page>
  );
}
