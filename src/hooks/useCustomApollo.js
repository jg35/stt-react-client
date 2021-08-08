import { useContext, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { AuthContext } from "@src/components/authWrap";
import { UIContext } from "@src/app";
import { createToastMessage } from "@src/lib/toast";

export function useCustomQuery(
  gql,
  { variables = {}, context = {}, userId = false }
) {
  const { authState } = useContext(AuthContext);
  const { uiState, updateUiState } = useContext(UIContext);

  if (userId) {
    variables.userId = authState.user.id;
  }
  const { data, loading, error } = useQuery(gql, { variables, context });

  function setToastMessage(type, ref, timeout, blockPage) {
    updateUiState(
      {
        messages: [
          ...uiState.messages,
          createToastMessage(type, { ref }, timeout, blockPage),
        ],
      },
      false
    );
  }

  useEffect(() => {
    if (error) {
      const graphErr = error.graphQLErrors[0];
      // TODO - log any of these errors in Sentry
      console.log("Hasura error code: ", graphErr.extensions.code);
      switch (graphErr.extensions.code) {
        case "postgres-max-connections-error":
        case "busy":
          console.log("Redirect - show a busy banner?");
          break;
        case "jwt-missing-role-claims":
        case "jwt-invalid-claims":
        case "invalid-jwt":
        case "invalid-jwt-key":
          console.log("JWT has expired - redirect to login?");
          break;
        default:
          // Blocks the page, so the user can't use the app
          setToastMessage("ERROR", "FETCH_DEFAULT", false, true);
      }
    }
  }, [data, error, loading]);

  return {
    data,
    loading,
    error,
  };
}
