import React, { useContext, useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";

import UserDetailsForm from "~/components/onboarding/userDetailsForm";
import Tutorial from "~/components/tutorial";
import { FETCH_USER } from "~/lib/gql";
import { AuthContext } from "~/components/authWrap";

export default function Onboarding() {
  const { user } = useContext(AuthContext);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const { data } = useQuery(FETCH_USER, {
    variables: { userId: user.id },
  });

  useEffect(() => {
    if (data) {
      setShowTutorial(data && data.stt_user_by_pk.onboarding === false);
      setShowUserForm(
        data && !data.stt_user_by_pk.dob && !data.stt_user_by_pk.location
      );
    }
  }, [data]);

  if (showUserForm) {
    return <UserDetailsForm />;
  }

  if (showTutorial) {
    return <Tutorial />;
  }

  return null;
}
