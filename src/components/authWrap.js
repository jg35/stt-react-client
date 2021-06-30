import { createContext, useState, useEffect } from "react";
import { Redirect, useRouteMatch } from "react-router";
import { useQuery } from "@apollo/client";
import { FETCH_LOCAL_AUTH_STATE } from "~/lib/gql";

import Onboarding from "~/components/onboarding";

function handleSetAuth(
  newAuth,
  oldAuth = { status: "out", user: null, token: "" }
) {
  return {
    ...oldAuth,
    ...newAuth,
  };
}

export const AuthContext = createContext(handleSetAuth({}));

export default function AuthWrap({ children }) {
  const { data } = useQuery(FETCH_LOCAL_AUTH_STATE);
  const [authState, setAuthState] = useState(handleSetAuth(data.authState));
  let isLogin = useRouteMatch("/login");

  useEffect(() => {
    setAuthState(handleSetAuth(data.authState, authState));
  }, [data.authState]);

  switch (authState.status) {
    case "loading":
      return null;
    case "in":
      return (
        <AuthContext.Provider value={authState}>
          {children}
          <Onboarding />
        </AuthContext.Provider>
      );
    case "out":
      if (isLogin) {
        return (
          <AuthContext.Provider value={authState}>
            {children}
          </AuthContext.Provider>
        );
      }
    default:
      return (
        <Redirect
          to={{
            pathname: "login",
          }}
        />
      );
  }
}
