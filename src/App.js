import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ApolloProvider } from "@apollo/client/react";

import "./app.css";

// Initialise apollo client + firebase
import client from "./lib/apollo";
import "./lib/firebase";

import Timeline from "./routes/timeline";
import Publish from "./routes/publish";
import Share from "./routes/share";
import Settings from "./routes/settings";
import Login from "./routes/login";

import AuthWrap from "./components/authWrap";

export default function App() {
  return (
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
            <Route path="/share">
              <Share />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/">
              <Timeline />
            </Route>
          </Switch>
        </AuthWrap>
      </Router>
    </ApolloProvider>
  );
}
