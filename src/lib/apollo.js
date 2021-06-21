import {
  ApolloClient,
  HttpLink,
  ApolloLink,
  InMemoryCache,
  concat,
  makeVar,
} from "@apollo/client";

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
  }

  operation.setContext(context);

  return forward(operation);
});

export const authStateVar = makeVar({ status: "loading" });
export const uiStateVar = makeVar({ showPreview: false });

export default new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          authState: {
            read() {
              return authStateVar();
            },
          },
          uiState: {
            read() {
              return uiStateVar();
            },
          },
        },
      },
    },
  }),
  link: concat(authMiddleware, httpLink),
});
