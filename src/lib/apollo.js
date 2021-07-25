import {
  ApolloClient,
  HttpLink,
  ApolloLink,
  from,
  InMemoryCache,
  makeVar,
} from "@apollo/client";

import { functionServer, processingServer } from "~/lib/axios";

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_HASURA_GRAPHQL_API_URL,
});

const authMiddleware = new ApolloLink((operation, forward) => {
  // This gets called every time there is a request
  const authState = authStateVar();

  let context = { headers: {} };
  // If a token exists, request as an authorised user
  if (authState.token) {
    context.headers.authorization = `Bearer ${authState.token}`;
    // Once x-hasura-role is set, user no longer treated as "public"
    // The citywalks role is set in Hasura to inherit the public role
    context.headers["x-hasura-role"] = process.env.REACT_APP_HASURA_ROLE_NAME;

    // Add JWT to function/processing server to enforce protection there
    functionServer.defaults.headers.common["Authorization"] = authState.token;
    processingServer.defaults.headers.common["Authorization"] = authState.token;
  }

  operation.setContext(context);

  return forward(operation);
});

export const authStateVar = makeVar({ status: "loading" });

export default new ApolloClient({
  connectToDevTools: true,
  cache: new InMemoryCache({
    typePolicies: {
      stt_fragment: {},
      Query: {
        fields: {
          authState: {
            read() {
              return authStateVar();
            },
          },
        },
      },
    },
  }),
  link: from([authMiddleware, httpLink]),
});
