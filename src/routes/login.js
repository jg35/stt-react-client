import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { signInWithGoogle } from "~/lib/auth";
import { AuthContext } from "~/components/authWrap";
import Button from "~/components/button";
import Svg from "~/components/svg";

export default function Login() {
  const history = useHistory();
  const { status } = useContext(AuthContext);

  if (status === "loading") {
  } else if (status === "out") {
    return (
      <>
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
