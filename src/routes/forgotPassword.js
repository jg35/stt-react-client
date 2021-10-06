import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { sendResetPasswordEmail } from "~/lib/auth";
import { AuthContext } from "~/components/authWrap";

import { Text } from "~/components/_styled";
import AuthCard from "~/components/auth/authCard";
import AuthCardLink from "~/components/auth/authCardLink";
import EmailFormWrapper from "~/components/auth/emailFormWrapper";
import useToastMessage from "~/hooks/useToastMessage";
import usePageTitle from "~/hooks/usePageTitle";
import AuthCardSeperator from "../components/auth/authSeperator";

export default function Login() {
  usePageTitle("Login");
  const { setSuccess } = useToastMessage();
  const history = useHistory();
  const {
    authState: { status },
  } = useContext(AuthContext);

  if (status === "in") {
    history.push("/");
  }

  return (
    <AuthCard title="Reset your password">
      <EmailFormWrapper
        formType="FORGOT_PASSWORD"
        submit={(form) => {
          return sendResetPasswordEmail(form).then(() => {
            history.push("/login");
            setSuccess({ ref: "SEND_RESET_EMAIL" });
          });
        }}
      />

      <AuthCardSeperator margin="my-4" />

      <AuthCardLink route="/login">Here by mistake? Login</AuthCardLink>
    </AuthCard>
  );
}
