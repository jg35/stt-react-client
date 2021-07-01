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
        <div className="flex flex-col min-h-screen justify-center items-center relative">
          <div
            className="min-h-screen w-full absolute top-0 left-0 z-10"
            style={{
              opacity: ".5",
              backgroundImage: "url('bg.jpg')",
              backgroundSize: "cover",
              filter: "blur(1.5px) grayscale(.4) ",
            }}
          ></div>
          <div className="h-auto shadow-2xl rounded-lg bg-white p-10 z-20 w-96">
            <div className="text-center">
              <h1 className="text-4xl mb-2 font-bold">Stories To Tell</h1>
              <p className="text-lg mb-12">
                The easy way to create your life story
              </p>
            </div>
            <p className="text-lg mb-4 font-medium text-center font-medium">
              Login below
            </p>

            <Button
              bigCta
              css="text-xl py-3 px-4 w-full justify-center font-medium rounded bg-black text-white"
              onClick={signInWithGoogle}
            >
              <Svg name="google" css="h-5 w-5 mr-3" color="white" />
              Continue with Google
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
