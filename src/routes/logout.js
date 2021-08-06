import React, { useContext, useEffect } from "react";
import { Redirect } from "react-router";
import { AuthContext } from "../components/authWrap";
import { signOut } from "~/lib/auth";

export default function Logout() {
  const {
    authState: { status },
  } = useContext(AuthContext);

  useEffect(() => {
    signOut();
  }, []);

  if (status === "out") {
    return (
      <Redirect
        to={{
          pathname: "/login",
        }}
      />
    );
  }

  return null;
}
