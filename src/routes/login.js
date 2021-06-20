import React from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { FETCH_LOCAL_AUTH_STATE } from "../lib/gql";
import { signInWithGoogle } from "../lib/auth";

import Button from "../components/button";

export default function Login() {
  const history = useHistory();
  const { data } = useQuery(FETCH_LOCAL_AUTH_STATE);

  const status = data.authState.status;

  if (status === "loading") {
    console.log("show loading...");
  } else if (status === "out") {
    return (
      <div className="flex flex-col min-h-screen justify-center items-center">
        <h1 className="text-4xl mb-10">Welcome to Stories To Tell</h1>
        <Button css="text-lg w" onClick={signInWithGoogle}>
          Sign in with Google
        </Button>
      </div>
    );
  } else if (status === "in") {
    history.push("/");
  }
  return null;
}
