import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import App from "~/app";
import reportWebVitals from "~/reportWebVitals";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const subUrl = `${process.env.REACT_APP_NETLIFY_FUNCTIONS_TEST_URL}/actions/subscriptions`;

axios
  .get(`${subUrl}/config?appId=${process.env.REACT_APP_HASURA_APP_ID}`)
  .then(({ data }) => {
    const stripePromise = loadStripe(data.publishableKey);

    ReactDOM.render(
      <React.StrictMode>
        <Elements stripe={stripePromise}>
          <App />
        </Elements>
      </React.StrictMode>,

      document.getElementById("root")
    );
  });

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
