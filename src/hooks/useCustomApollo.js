import { useContext, useEffect } from "react";
import { useHistory } from "react-router";
import { useQuery } from "@apollo/client";
import { AuthContext } from "~/components/authWrap";
import { UIContext } from "~/app";
import { refreshToken } from "~/lib/firebase";
import { createToastMessage } from "~/lib/toast";

export function useCustomQuery(
  gql,
  {
    variables = {},
    context = {},
    userId = false,
    // userVariables = [],
    fetchPolicy = "cache-first",
  }
) {
  const history = useHistory();
  const { authState } = useContext(AuthContext);
  const { uiState, updateUiState } = useContext(UIContext);

  if (userId) {
    variables.userId = authState.user.uid;
  }
  const { data, loading, error } = useQuery(gql, {
    variables,
    context,
    fetchPolicy,
  });

  // useEffect(() => {
  //   if (userVariables && authState.dbUser) {
  //     runQuery({
  //       variables: {
  //         ...variables,
  //         ...pick(authState.dbUser, userVariables),
  //       },
  //     });
  //   } else if (!userVariables) {
  //     runQuery();
  //   }
  // }, [authState.dbUser]);

  function setToastMessage(type, ref) {
    updateUiState(
      {
        messages: [...uiState.messages, createToastMessage(type, { ref })],
      },
      false
    );
  }

  useEffect(() => {
    if (error) {
      const graphErr = error.graphQLErrors[0];
      // TODO - log any of these errors in Sentry
      switch (graphErr.extensions.code) {
        case "postgres-max-connections-error":
        case "busy":
          break;
        case "jwt-missing-role-claims":
        case "jwt-invalid-claims":
        case "invalid-jwt":
        case "invalid-jwt-key":
          refreshToken().catch((e) => {
            setToastMessage("ERROR", "SESSION_EXPIRED");
            history.push("/login");
          });
          break;
        default:
        // Blocks the page, so the user can't use the app
        // setToastMessage("ERROR", "FETCH_DEFAULT");
      }
    }
  }, [data, error, loading]);

  return {
    data,
    loading,
    error,
  };
}
