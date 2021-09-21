import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { authStateVar } from "~/lib/apollo";
import {
  createAccountWithEmail,
  loginWithEmail,
  sendResetPasswordEmail,
} from "~/lib/auth";
import { AuthContext } from "~/components/authWrap";

import EmailFormWrapper from "~/components/auth/emailFormWrapper";
import OAuthLogin from "~/components/auth/oAuthLogin";
import useToastMessage from "~/hooks/useToastMessage";
import usePageTitle from "~/hooks/usePageTitle";
import { Card, Title, Text, Grid, Container } from "~/components/_styled";
import { getHTMLTranslation } from "~/lib/util";

export default function Login() {
  usePageTitle("Login");
  const { setSuccess } = useToastMessage();
  const [authView, setAuthView] = useState("LOGIN");
  const history = useHistory();
  const {
    authState: { status },
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
            authStateVar({ status: "out", emailForm: form });

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
          "col-span-10 col-start-2 md:col-span-6 md:col-start-4 xl:col-span-4 xl:col-start-5",
        ]}
        css="mt-2"
      >
        <Card css="md:p-6">
          <a href={process.env.REACT_APP_HOME_URL} title="Go to homepage">
            <Title
              size="headline"
              css="my-4 text-center brand text-5xl md:text-6xl"
            >
              {getHTMLTranslation("routes.login.app.name")}
            </Title>

            <Text size="large" css="text-center mb-4">
              {getHTMLTranslation("routes.login.app.slogan")}
            </Text>
          </a>

          <EmailFormWrapper
            setAuthView={setAuthView}
            authView={authView}
            submit={getEmailSubmitHandler()}
            syncing={status === "syncing"}
          />
          {authView === "LOGIN" && (
            <OAuthLogin syncing={status === "syncing"} />
          )}
        </Card>
      </Grid>
    </Container>
  );
}
