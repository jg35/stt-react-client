import { useCustomQuery } from "~/hooks/useCustomApollo";
import { useHistory } from "react-router";
import { FETCH_PRIVATE_ACCESS_TOKENS } from "~/lib/gql";
import { useContext } from "react";
import { UIContext } from "~/app";
import { Button } from "~/components/_styled";

export default function AccessListStatusButton({
  future = false,
  isPublic = false,
  size = "compact",
}) {
  const history = useHistory();
  const { data, loading } = useCustomQuery(FETCH_PRIVATE_ACCESS_TOKENS, {
    userId: true,
  });
  const { updateUiState } = useContext(UIContext);

  function getStatus() {
    const accessTokens = data.stt_accessToken.filter(
      (t) => t.type === "PRIVATE"
    );

    return (
      <>
        {accessTokens.length > 0 ? accessTokens.length : "No"} reader
        {accessTokens.length !== 1 && "s"}
      </>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="my-2">
      {isPublic ? (
        <Button
          // variant="secondary"
          size={size}
          css="md:w-auto"
          onClick={() => history.push("/settings#privacy")}
        >
          Manage privacy settings
        </Button>
      ) : (
        <Button
          // variant="secondary"
          size={size}
          css="md:w-auto"
          onClick={() => updateUiState({ showAccessListModal: true }, false)}
        >
          Manage share list
          {/* {getStatus()}&nbsp;-&nbsp; manage share list */}
        </Button>
      )}
    </div>
  );
}
