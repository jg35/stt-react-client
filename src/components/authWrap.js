import { createContext } from "react";
import { Redirect, useRouteMatch } from "react-router";
import { useQuery } from "@apollo/client";
import { FETCH_LOCAL_AUTH_STATE } from "~/lib/gql";

export const AuthContext = createContext({});

export default function AuthWrap({ children }) {
  let isLogin = useRouteMatch("/login");
  const { data } = useQuery(FETCH_LOCAL_AUTH_STATE);

  if (isLogin) {
    return children;
  }

  switch (data.authState.status) {
    case "loading":
      // console.log("show loading...");
      return null;
    case "in":
      // console.log("user logged in...");
      return (
        <AuthContext.Provider value={data.authState.userDetails}>
          {children}
        </AuthContext.Provider>
      );
    case "out":
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
