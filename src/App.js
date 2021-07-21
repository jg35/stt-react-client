import React, { createContext, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ApolloProvider } from "@apollo/client/react";

import "react-datepicker/dist/react-datepicker.css";
import "~/app.css";

// Initialise apollo client + firebase
import client from "~/lib/apollo";
import "~/lib/firebase";
import { buildGoogleFontFaceString } from "~/lib/util";

import Timeline from "~/routes/timeline";
import Publish from "~/routes/publish";
import Edit from "~/routes/edit";
import Settings from "~/routes/settings";
import Login from "~/routes/login";
import Logout from "~/routes/logout";
import Read from "~/routes/read";

import AuthWrap from "~/components/authWrap";
import uiManager from "~/lib/uiManager";

export const UIContext = createContext({});

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
      localStorage.setItem("uiState", JSON.stringify(updateUi));
    }
  }

  return (
    <UIContext.Provider value={{ uiState, updateUiState: update }}>
      <style>{buildGoogleFontFaceString(uiState.googleFontStyles)}</style>
      <ApolloProvider client={client}>
        <Router>
          <AuthWrap>
            <Switch>
              <Route path="/settings">
                <Settings />
              </Route>
              <Route path="/publish">
                <Publish />
              </Route>
              <Route path="/edit">
                <Edit />
              </Route>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/logout">
                <Logout />
              </Route>
              <Route path="/read/:versionId">
                <Read />
              </Route>
              <Route path="/">
                <Timeline />
              </Route>
            </Switch>
          </AuthWrap>
        </Router>
      </ApolloProvider>
    </UIContext.Provider>
  );
}
