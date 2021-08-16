import { useCustomQuery } from "~/hooks/useCustomApollo";
import { useHistory } from "react-router";
import { FETCH_PRIVATE_ACCESS_TOKENS } from "~/lib/gql";
import { useContext } from "react";
import { UIContext } from "~/app";
import { Button } from "~/components/_styled";

export default function AccessListStatusButton({
  future = false,
  isPublic = false,
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
        {accessTokens.length !== 1 && "s"} on your share list
      </>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="flex items-center my-2">
      {isPublic ? (
        <Button
          css="md:w-auto"
          onClick={() => history.push("/settings#privacy")}
        >
          Your book is public - manage privacy settings
        </Button>
      ) : (
        <Button
          css="md:w-auto"
          onClick={() => updateUiState({ showAccessListModal: true }, false)}
        >
          {getStatus()}&nbsp;-&nbsp; click to manage
        </Button>
      )}
    </div>
  );
}
