import { createContext, useState, useEffect } from "react";
import { Redirect, useRouteMatch } from "react-router";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import {
  FETCH_LOCAL_AUTH_STATE,
  FETCH_USER,
  ACTION_SYNC_USER,
} from "~/lib/gql";
import { onAuthStateChange } from "~/lib/firebase";

import AccessControlModals from "~/components/accessControlModals";

function handleSetAuth(
  newAuth,
  oldAuth = {
    status: "out",
    user: null,
    token: "",
    dbUser: null,
    emailForm: null,
  }
) {
  return {
    ...oldAuth,
    ...newAuth,
  };
}

export const AuthContext = createContext(handleSetAuth({}));

export default function AuthWrap({ children }) {
  const { data } = useQuery(FETCH_LOCAL_AUTH_STATE);
  const [getUser, { data: hasuraUser }] = useLazyQuery(FETCH_USER);
  const [syncUser] = useMutation(ACTION_SYNC_USER);

  const [authState, setAuthState] = useState(handleSetAuth(data.authState));
  let isLogin = useRouteMatch("/login");

  useEffect(() => {
    console.log("start");
    let onAuthStateChangeListener = onAuthStateChange(syncUser, authState);
    return () => {
      console.log("cancel");
      onAuthStateChangeListener = undefined;
    };
  }, [authState]);

  useEffect(() => {
    if (hasuraUser) {
      setAuthState(
        handleSetAuth(
          {
            dbUser: hasuraUser.stt_user_by_pk,
          },
          authState
        )
      );
    }
  }, [hasuraUser]);

  useEffect(() => {
    const auth = handleSetAuth(data.authState, authState);
    if (auth.user) {
      getUser({
        variables: {
          userId: auth.user.id,
        },
      });
    }
    setAuthState(auth);
  }, [data.authState]);

  switch (authState.status) {
    case "loading":
      return null;
    case "in":
      return (
        <AuthContext.Provider
          value={{
            authState,
            updateAuthState: (newAuth) => {
              setAuthState(handleSetAuth(newAuth, authState));
            },
          }}
        >
          {children}
          <AccessControlModals />
        </AuthContext.Provider>
      );
    case "out":
      if (isLogin) {
        return (
          <AuthContext.Provider
            value={{
              authState,
              updateAuthState: (newAuth) => {
                setAuthState(handleSetAuth(newAuth, authState));
              },
            }}
          >
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
