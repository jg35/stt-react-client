import React, { createContext, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ApolloProvider } from "@apollo/client/react";

import "react-datepicker/dist/react-datepicker.css";
import "@src/app.css";

// Initialise apollo client + firebase
import client from "@src/lib/apollo";
import { buildGoogleFontFaceString } from "@src/lib/util";

import Timeline from "@src/routes/timeline";
import Publish from "@src/routes/publish";
import PublishNewVersion from "@src/routes/publishNewVersion";
import Edit from "@src/routes/edit";
import Settings from "@src/routes/settings";
import Login from "@src/routes/login";
import Logout from "@src/routes/logout";
import NotFound from "@src/routes/404";

import AuthWrap from "@src/components/authWrap";
import uiManager from "@src/lib/uiManager";
import { createToastMessage } from "@src/lib/toast";
import { useSignedImageUrls } from "@src/hooks/useSignedUrl";
import ToastMessages from "@src/components/toastMessages";

export const UIContext = createContext({});

function Hooks({ children }) {
  // Gets/tracks signed urls for all images in app
  useSignedImageUrls();
  return children;
}

export default function App() {
  const [uiState, setUiState] = useState(uiManager.init());

  function update(newUi, persist = true) {
    // TODO this gets fucked when calls are made to close to eachother
    const updateUi = {
      ...uiState,
      ...newUi,
    };
    setUiState(updateUi);
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

  function setToastMessage({ type, ref, params, timeout }) {
    update(
      {
        messages: [
          ...uiState.messages,
          createToastMessage(type, ref, params, timeout),
        ],
      },
      false
    );
  }

  return (
    <UIContext.Provider
      value={{ uiState, updateUiState: update, setToastMessage }}
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
                <Route path="/logout" exact>
                  <Logout />
                </Route>
                <Route path="/" exact>
                  <Timeline />
                </Route>
                <Route path="">
                  <NotFound />
                </Route>
              </Switch>
              <ToastMessages />
            </Hooks>
          </AuthWrap>
        </Router>
      </ApolloProvider>
    </UIContext.Provider>
  );
}
