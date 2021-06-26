import React from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { FETCH_LOCAL_AUTH_STATE } from "~/lib/gql";
import { signInWithGoogle } from "~/lib/auth";

import Button from "~/components/button";
import Svg from "~/components/svg";

export default function Login() {
  const history = useHistory();
  const { data } = useQuery(FETCH_LOCAL_AUTH_STATE);

  const status = data.authState.status;

  if (status === "loading") {
    // console.log("show loading...");
  } else if (status === "out") {
    return (
      <>
        {/* <div
          className="absolute min-h-screen w-full opacity-10 left-0 top-0"
          style={{
            zIndex: -1,
            backgroundImage: "url('stt-login.jpg')",
            backgroundSize: "cover",
          }}
        ></div> */}
        <div className="flex flex-col min-h-screen justify-center items-center ">
          <div className="h-auto shadow-lg rounded-lg bg-white p-20">
            <div className="mb-6">
              <h1 className="text-4xl mb-10">Welcome to Stories To Tell</h1>
            </div>
            <Button
              css="text-xl font-medium rounded-lg"
              onClick={signInWithGoogle}
            >
              Sign in with Google
              <Svg name="google" css="ml-4" />
            </Button>
          </div>
        </div>
      </>
    );
  } else if (status === "in") {
    history.push("/");
  }
  return null;
}
