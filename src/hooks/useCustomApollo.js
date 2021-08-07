import { useContext, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { AuthContext } from "~/components/authWrap";
import { UIContext } from "~/app";
import { createToastMessage } from "~/lib/toast";

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

  function setToastMessage(type, ref) {
    updateUiState(
      {
        messages: [...uiState.messages, createToastMessage(type, ref)],
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
          setToastMessage("ERROR", "DEFAULT");
      }
    }
  }, [data, error, loading]);

  return {
    data,
    loading,
    error,
  };
}
