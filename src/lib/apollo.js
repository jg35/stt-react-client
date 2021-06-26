import {
  ApolloClient,
  HttpLink,
  ApolloLink,
  from,
  InMemoryCache,
  makeVar,
} from "@apollo/client";
// import { asyncMap } from "@apollo/client/utilities";

import { FragmentSchema, EventSchema } from "~/lib/yup";

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_HASURA_GRAPHQL_API_URL,
});

const authMiddleware = new ApolloLink((operation, forward) => {
  // setUIStateVar({ loading: true }, { persist: false });
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

// const endMiddleware = new ApolloLink((operation, forward) => {
//   return asyncMap(forward(operation), async (response) => {
//     setUIStateVar({ loading: false }, { persist: false });
//     return response;
//   });
// });

const uiState = localStorage.getItem("uiState");
export const authStateVar = makeVar({ status: "loading" });
export const uiStateVar = makeVar(
  (uiState && { ...JSON.parse(uiState), loading: false }) || {
    timelinePeriod: "YEAR",
    // loading: false,
    showPreview: false,
    capture: {
      showModal: false,
      item: null,
      event: null,
    },
  }
);

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
          uiState: {
            read() {
              return uiStateVar();
            },
          },
        },
      },
    },
  }),
  link: from([authMiddleware, httpLink]),
});

export const setUIStateVar = (newValues, options = { persist: true }) => {
  const updateAuthState = {
    ...uiStateVar(),
    ...newValues,
  };
  uiStateVar(updateAuthState);
  if (options.persist) {
    localStorage.setItem("uiState", JSON.stringify(updateAuthState));
  }
};

export function showCreateFragmentForm(initialValue = {}) {
  uiStateVar({
    ...uiStateVar(),
    ...{
      capture: {
        originatesFromQuestion: !!initialValue.questionId,
        showModal: true,
        item: FragmentSchema.cast(initialValue),
      },
    },
  });
}

export function showCreateUserEventForm(initialValue = {}) {
  uiStateVar({
    ...uiStateVar(),
    ...{
      capture: {
        showModal: true,
        item: EventSchema.cast(initialValue),
      },
    },
  });
}

export function showEditFragmentForm(editFragment) {
  uiStateVar({
    ...uiStateVar(),
    ...{
      capture: {
        showModal: true,
        item: { ...editFragment },
      },
    },
  });
}

export function showEditUserEventForm(userEvent) {
  uiStateVar({
    ...uiStateVar(),
    ...{
      capture: {
        showModal: true,
        item: { ...userEvent, type: "EVENT" },
      },
    },
  });
}
