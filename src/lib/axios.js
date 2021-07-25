import axios from "axios";

export const functionServer = axios.create({
  baseURL: process.env.REACT_APP_FUNCTIONS_SERVER_URL,
  headers: {
    common: {
      "content-type": "application/json",
      "x-hasura-role": process.env.REACT_APP_HASURA_ROLE_NAME,
    },
  },
});

export const processingServer = axios.create({
  baseURL: process.env.REACT_APP_PROCESSING_SERVER_URL,
  headers: {
    common: {
      "content-type": "application/json",
      "x-hasura-role": process.env.REACT_APP_HASURA_ROLE_NAME,
    },
  },
});
