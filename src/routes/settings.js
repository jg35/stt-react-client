import { useContext } from "react";
import axios from "axios";
import { useQuery } from "@apollo/client";

import { FETCH_USER } from "~/lib/gql";

import { AuthContext } from "~/components/authWrap";
import Page from "~/components/page";

import ManageSubscription from "~/components/settings/manageSubscription";

export default function Settings() {
  const { user } = useContext(AuthContext);
  const { data, loading } = useQuery(FETCH_USER, {
    variables: { userId: user.id },
  });

  return (
    <Page minimal>
      {data && (
        <ManageSubscription
          stripeCustomerId={data.stt_user_by_pk.stripeCustomerId}
          trialExpiresDate={data.stt_user_by_pk.trialExpiresDate}
          subscribed={data.stt_user_by_pk.subscribed}
        />
      )}
    </Page>
  );
}
