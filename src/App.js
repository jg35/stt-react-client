import React, { createContext, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ApolloProvider } from "@apollo/client/react";

import "react-datepicker/dist/react-datepicker.css";
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
import Logout from "~/routes/logout";
import NotFound from "~/routes/404";

import AuthWrap from "~/components/authWrap";
import uiManager from "~/lib/uiManager";
import { createToastMessage } from "~/lib/toast";
import { useSignedImageUrls } from "~/hooks/useSignedUrl";
import ToastMessages from "~/components/toastMessages";

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
