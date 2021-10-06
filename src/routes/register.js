import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { createAccountWithEmail } from "~/lib/auth";
import { AuthContext } from "~/components/authWrap";

import { Text } from "~/components/_styled";
import AuthCard from "~/components/auth/authCard";
import AuthCardLink from "~/components/auth/authCardLink";
import EmailFormWrapper from "~/components/auth/emailFormWrapper";
import OAuthLogin from "~/components/auth/oAuthLogin";
import usePageTitle from "~/hooks/usePageTitle";
import AuthCardSeperator from "../components/auth/authSeperator";

export default function Login() {
  usePageTitle("Create account");
  const history = useHistory();
  const {
    authState: { status },
  } = useContext(AuthContext);

  if (status === "in") {
    history.push("/");
  }

  return (
    <AuthCard title="Create your account">
      <OAuthLogin screen="REGISTER" syncing={status === "syncing"} />

      <AuthCardSeperator>Or with email</AuthCardSeperator>

      <EmailFormWrapper
        formType="CREATE_ACCOUNT"
        submit={(form) => {
          // Don't resolve promise, as we need to wait until status changes before redirect
          return new Promise((resolve, reject) => {
            setTimeout(() =>
              createAccountWithEmail(form)
                .then()
                .catch((e) => reject(e))
            );
          });
        }}
        syncing={status === "syncing"}
      />

      <Text css="mt-4 text-darkGray">
        By continuing with Google, Facebook or Email, you agree to our{" "}
        <a
          className="text-blue font-medium hover:underline"
          target="_blank"
          href="https://www.iubenda.com/terms-and-conditions/26041690"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="https://www.iubenda.com/privacy-policy/26041690/legal"
          target="_blank"
          className="text-blue font-medium hover:underline"
        >
          Privacy Policy
        </a>
        .
      </Text>

      <AuthCardSeperator margin="my-4" />

      <AuthCardLink route="/login">Already have an account? Login</AuthCardLink>
    </AuthCard>
  );
}
