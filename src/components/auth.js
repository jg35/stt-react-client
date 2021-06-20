import React from "react";
import { useQuery } from "@apollo/client";
import { FETCH_LOCAL_AUTH_STATE } from "../lib/gql";
import { signInWithGoogle, signOut } from "../lib/auth";

export default function AuthActions() {
  const { data } = useQuery(FETCH_LOCAL_AUTH_STATE);

  function signIn() {
    signInWithGoogle().then(() => {
      console.log("yay, firebase.js stuff is done");
    });
  }

  const status = data.authState.status;
  if (status !== "loading") {
    return (
      <button
        className="fill text-right p-2"
        onClick={() => (status === "in" ? signOut() : signIn())}
      >
        {status === "in" ? "Sign out" : "Sign in"}
      </button>
    );
  }
  return null;
}
