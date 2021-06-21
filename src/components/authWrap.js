import { Redirect, useRouteMatch } from "react-router";
import { useQuery } from "@apollo/client";
import { FETCH_LOCAL_AUTH_STATE } from "../lib/gql";

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
      return children;
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
