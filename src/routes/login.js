import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  createAccountWithEmail,
  loginWithEmail,
  sendResetPasswordEmail,
} from "@src/lib/auth";
import { AuthContext } from "@src/components/authWrap";

import EmailFormWrapper from "@src/components/auth/emailFormWrapper";
import OAuthLogin from "@src/components/auth/oAuthLogin";

export default function Login() {
  const [authView, setAuthView] = useState("LOGIN");
  const history = useHistory();
  const {
    authState: { status },
    updateAuthState,
  } = useContext(AuthContext);

  function getEmailSubmitHandler() {
    switch (authView) {
      case "LOGIN":
        return (form) => loginWithEmail(form).then(() => history.push("/"));
      case "CREATE_ACCOUNT":
        return (form) => {
          return new Promise((resolve) => {
            updateAuthState({ emailForm: form });
            setTimeout(() =>
              createAccountWithEmail(form).then(() => {
                resolve();
              })
            );
          });
        };
      case "FORGOT_PASSWORD":
        return (form) =>
          sendResetPasswordEmail(form).then(() => setAuthView("LOGIN"));
    }
  }

  if (!status || status === "loading") {
    return null;
  }

  if (status === "in") {
    history.push("/");
  }

  return (
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
      <div
        className="h-auto shadow-2xl rounded-lg bg-white p-8 z-20 flex flex-col"
        style={{ width: "30rem", minHeight: "100%" }}
      >
        <div className="text-center">
          <h1 className="text-4xl mb-2 font-bold">Stories To Tell</h1>
          <p className="text-lg mb-6">The easy way to create your life story</p>
        </div>
        <EmailFormWrapper
          setAuthView={setAuthView}
          authView={authView}
          submit={getEmailSubmitHandler()}
        />
        {authView === "LOGIN" && <OAuthLogin />}
      </div>
    </div>
  );
}
