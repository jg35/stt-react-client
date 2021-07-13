import { useContext } from "react";
import { AuthContext } from "~/components/authWrap";
import Page from "~/components/page";
import Card from "~/components/card";

import ManageStripeCustomer from "~/components/settings/manageStripeCustomer";
export default function Settings() {
  const { dbUser } = useContext(AuthContext);
  return (
    <Page minimal>
      <div className="flex h-full">
        <div>
          {dbUser && (
            <Card>
              <ManageStripeCustomer
                subscriptionStatus={dbUser.subscriptionStatus}
                subscriptionMeta={dbUser.subscriptionMeta}
                stripeCustomerId={dbUser.stripeCustomerId}
              />
            </Card>
          )}
        </div>
      </div>
    </Page>
  );
}
