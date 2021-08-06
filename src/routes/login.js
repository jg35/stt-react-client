import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  signInWithGoogle,
  signInWithFacebook,
  createAccountWithEmail,
  loginWithEmail,
  sendResetPasswordEmail,
} from "~/lib/auth";
import { AuthContext } from "~/components/authWrap";
import Button from "~/components/button";
import Svg from "~/components/svg";

function OAuthForm() {
  return (
    <>
      <p className="text-lg mb-4 font-medium font-medium text-center border-t border-lightGray mt-4 pt-4">
        Or continue with
      </p>
      <div className="flex items-center ">
        <div className="flex-1 pr-1">
          <Button
            bigCta
            css="text-xl py-3 px-4 w-full justify-center font-medium rounded bg-black text-white"
            onClick={signInWithGoogle}
          >
            <Svg name="google" css="h-5 w-5 mr-3" color="white" />
            Google
          </Button>
        </div>
        <div className="flex-1 pl-1">
          <Button
            bigCta
            css="text-xl py-3 px-4 w-full justify-center font-medium rounded text-white bg-facebook"
            onClick={signInWithFacebook}
          >
            <Svg name="facebook" css="h-5 w-5 mr-3" color="white" />
            Facebook
          </Button>
        </div>
      </div>
    </>
  );
}

function EmailForm({
  submit,
  setEmailFormState = null,
  authView,
  setAuthView,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  function getSubmitText() {
    switch (authView) {
      case "LOGIN":
        return "Login";
      case "CREATE_ACCOUNT":
        return "Create account";
      case "FORGOT_PASSWORD":
        return "Send reset email";
    }
  }

  return (
    <>
      <div>
        {authView === "CREATE_ACCOUNT" && (
          <div className="flex mb-4">
            <div className="pr-2">
              <input
                type="text"
                className="input"
                placeholder="Your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="pl-2">
              <input
                type="text"
                className="input"
                placeholder="Your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
        )}
        <input
          type="email"
          className="input mb-4"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {authView !== "FORGOT_PASSWORD" && (
          <input
            type="password"
            className="input mb-4"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}
        <div className="flex">
          <Button
            css="w-full text-xl py-3"
            bigCta
            onClick={() => submit(email, password, firstName, lastName)}
          >
            {getSubmitText()}
          </Button>
        </div>
      </div>
      <div className="flex justify-between pt-4">
        <div>
          {authView === "LOGIN" ? (
            <Button
              minimal
              css="w-full"
              onClick={() => setAuthView("CREATE_ACCOUNT")}
            >
              Create an account
            </Button>
          ) : (
            <Button minimal css="w-full" onClick={() => setAuthView("LOGIN")}>
              Back
            </Button>
          )}
        </div>
        <div>
          {authView === "LOGIN" && (
            <Button
              minimal
              css="w-full"
              onClick={() => setAuthView("FORGOT_PASSWORD")}
            >
              Forgotten password?
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

export default function Login() {
  const [showCreateAccountForm, setShowCreateAccountForm] = useState(false);
  const [authView, setAuthView] = useState("LOGIN");
  const history = useHistory();
  const {
    authState: { status, emailForm },
    updateAuthState,
  } = useContext(AuthContext);

  function setEmailFormState(form) {
    updateAuthState({ emailForm: form });
  }

  function getEmailSubmitHandler() {
    switch (authView) {
      case "LOGIN":
        return loginWithEmail;
      case "CREATE_ACCOUNT":
        return (email, password, firstName, lastName) => {
          updateAuthState({ emailForm: { firstName, lastName } });
          setTimeout(() => createAccountWithEmail(email, password));
        };
      case "FORGOT_PASSWORD":
        return sendResetPasswordEmail;
    }
  }

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
          <div
            className="h-auto shadow-2xl rounded-lg bg-white p-8 z-20 flex flex-col"
            style={{ width: "30rem", height: "33rem" }}
          >
            <div className="text-center">
              <h1 className="text-4xl mb-2 font-bold">Stories To Tell</h1>
              <p className="text-lg mb-6">
                The easy way to create your life story
              </p>
            </div>
            <EmailForm
              setAuthView={setAuthView}
              authView={authView}
              submit={getEmailSubmitHandler()}
              setEmailFormState={setEmailFormState}
            />
            {authView === "LOGIN" && (
              <OAuthForm setShowCreateAccountForm={setShowCreateAccountForm} />
            )}
          </div>
        </div>
      </>
    );
  } else if (status === "in") {
    history.push("/");
  }
  return null;
}
