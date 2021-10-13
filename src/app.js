import React, { createContext, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ApolloProvider } from "@apollo/client/react";
import smoothscroll from "smoothscroll-polyfill";

import "~/app.css";

// Initialise apollo client + firebase
import client from "~/lib/apollo";
import { buildGoogleFontFaceString } from "~/lib/util";

import Timeline from "~/routes/timeline";
import Publish from "~/routes/publish";
import PublishNewVersion from "~/routes/publishNewVersion";
import Edit from "~/routes/edit";
import Settings from "~/routes/settings";
import Login from "~/routes/login";
import Register from "~/routes/register";
import ForgotPassword from "~/routes/forgotPassword";
import NotFound from "~/routes/404";
import ComponentLibrary from "~/routes/componentLibrary";

import AuthWrap from "~/components/authWrap";
import uiManager from "~/lib/uiManager";
import { createToastMessage } from "~/lib/toast";
import { useSignedImageUrls } from "~/hooks/useSignedUrl";
import ToastMessages from "~/components/toastMessages";

smoothscroll.polyfill();

const deleteModalInitState = () => ({
  show: false,
  cancelled: false,
  confirm: false,
  title: "",
});

export const UIContext = createContext({});

function Hooks({ children }) {
  // Gets/tracks signed urls for all images in app
  useSignedImageUrls();
  return children;
}

function setCSSVars() {
  // Set VH to accomodate for mobile keyboards etc
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

setCSSVars();
window.addEventListener("resize", () => {
  setCSSVars();
});

export default function App() {
  const [uiState, setUiState] = useState(uiManager.init());

  function update(newUi, persist = true) {
    setUiState((uiState) => ({ ...uiState, ...newUi }));
    if (persist) {
      localStorage.setItem(
        "uiState",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("uiState")),
          ...newUi,
        })
      );
    }
  }

  function setToastMessage({ type, ref, params }) {
    update(
      {
        messages: [...uiState.messages, createToastMessage(type, ref, params)],
      },
      false
    );
  }

  function showDeleteWarning({ title }) {
    return new Promise((resolve, reject) => {
      update(
        {
          deleteModal: {
            show: true,
            cancelled: false,
            confirm: false,
            title,
          },
        },
        false
      );
      // FIXME/TODO - this is grim. Better way of checking fresh state without putting it in set call?
      const wait = setInterval(() => {
        setUiState((uiState) => {
          if (uiState.deleteModal.confirm) {
            resolve();
            clearInterval(wait);
          } else if (uiState.deleteModal.cancelled) {
            clearInterval(wait);
            update({ deleteModal: deleteModalInitState() }, false);
            reject();
          }
          return uiState;
        });
      }, 500);
    });
  }

  return (
    <UIContext.Provider
      value={{
        uiState,
        updateUiState: update,
        setToastMessage,
        showDeleteWarning,
      }}
    >
      <style>{buildGoogleFontFaceString(uiState.googleFontStyles)}</style>
      <ApolloProvider client={client}>
        <Router>
          <AuthWrap>
            <Hooks>
              <Switch>
                <Route path="/settings" exact>
                  <Settings />
                </Route>
                <Route path="/publish/new" exact>
                  <PublishNewVersion />
                </Route>
                <Route path="/publish" exact>
                  <Publish />
                </Route>

                <Route path="/edit" exact>
                  <Edit />
                </Route>
                <Route path="/login" exact>
                  <Login />
                </Route>
                <Route path="/register" exact>
                  <Register />
                </Route>
                <Route path="/forgot-password" exact>
                  <ForgotPassword />
                </Route>
                <Route path="/" exact>
                  <Timeline />
                </Route>
                {process.env.NODE_ENV === "development" && (
                  <Route path="/library" exact>
                    <ComponentLibrary />
                  </Route>
                )}
                <Route path="">
                  <NotFound />
                </Route>
              </Switch>
            </Hooks>
          </AuthWrap>
          <ToastMessages />
        </Router>
      </ApolloProvider>
    </UIContext.Provider>
  );
}
