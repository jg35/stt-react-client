import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  createAccountWithEmail,
  loginWithEmail,
  sendResetPasswordEmail,
} from "~/lib/auth";
import { AuthContext } from "~/components/authWrap";

import EmailFormWrapper from "~/components/auth/emailFormWrapper";
import OAuthLogin from "~/components/auth/oAuthLogin";
import useToastMessage from "~/hooks/useToastMessage";
import { Card, Title, Text, Grid, Container } from "~/components/_styled";

export default function Login() {
  const { setSuccess } = useToastMessage();
  const [authView, setAuthView] = useState("LOGIN");
  const history = useHistory();
  const {
    authState: { status },
    updateAuthState,
  } = useContext(AuthContext);

  function getEmailSubmitHandler() {
    switch (authView) {
      case "LOGIN":
        return (form) =>
          loginWithEmail(form).then(() => {
            // setSuccess({ ref: "LOGIN" });
            history.push("/");
          });
      case "CREATE_ACCOUNT":
        return (form) => {
          // Don't resolve promise, as we need to wait until status changes before redirect
          return new Promise((resolve, reject) => {
            updateAuthState({ emailForm: form });
            setTimeout(() =>
              createAccountWithEmail(form)
                .then()
                .catch((e) => reject(e))
            );
          });
        };
      case "FORGOT_PASSWORD":
        return (form) =>
          sendResetPasswordEmail(form).then(() => {
            setAuthView("LOGIN");
            setSuccess({ ref: "SEND_RESET_EMAIL" });
          });
    }
  }

  if (!status || status === "loading") {
    return null;
  }

  if (status === "in") {
    history.push("/");
  }

  return (
    <Container
      css="flex flex-col justify-center"
      background={{
        backgroundImage: "url('bg.jpg')",
        backgroundSize: "cover",
        opacity: ".5",
        filter: "blur(1.5px) grayscale(.4) ",
      }}
    >
      <Grid
        colSpan={[
          "col-span-10 col-start-2 md:col-span-8 md:col-start-3 lg:col-span-4 lg:col-start-5",
        ]}
        css="mt-2"
      >
        <Card>
          <Title size="headline" css="mb-2 text-center">
            Stories To Tell
          </Title>
          <Text size="large" css="text-center">
            The easy way to create your life story
          </Text>

          <EmailFormWrapper
            setAuthView={setAuthView}
            authView={authView}
            submit={getEmailSubmitHandler()}
          />
          {authView === "LOGIN" && <OAuthLogin />}
        </Card>
      </Grid>
    </Container>
  );
}
