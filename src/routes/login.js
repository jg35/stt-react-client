import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { loginWithEmail } from "~/lib/auth";
import { AuthContext } from "~/components/authWrap";

import AuthCard from "~/components/auth/authCard";
import AuthCardLink from "~/components/auth/authCardLink";
import EmailFormWrapper from "~/components/auth/emailFormWrapper";
import OAuthLogin from "~/components/auth/oAuthLogin";
import usePageTitle from "~/hooks/usePageTitle";
import AuthCardSeperator from "../components/auth/authSeperator";

export default function Login() {
  usePageTitle("Login");
  const history = useHistory();
  const {
    authState: { status },
  } = useContext(AuthContext);

  if (status === "in") {
    history.push("/");
  }

  return (
    <AuthCard title="Login to your account">
      <OAuthLogin screen="LOGIN" syncing={status === "syncing"} />

      <AuthCardSeperator>Login with email</AuthCardSeperator>

      <EmailFormWrapper
        formType="LOGIN"
        submit={(form) => {
          return loginWithEmail(form).then(() => {
            history.push("/");
          });
        }}
      />

      <div className="flex mt-2">
        <AuthCardLink route="/forgot-password">
          Forgot your password?
        </AuthCardLink>
      </div>

      <AuthCardSeperator margin="my-4" />

      <AuthCardLink route="/register">Create an account</AuthCardLink>
    </AuthCard>
  );
}
