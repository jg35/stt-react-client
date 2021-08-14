import { useCustomQuery } from "~/hooks/useCustomApollo";
import { useHistory } from "react-router";
import { FETCH_PRIVATE_ACCESS_TOKENS } from "~/lib/gql";
import { useContext } from "react";
import { UIContext } from "~/app";
import Button from "~/components/button";

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
      <span>
        {accessTokens.length > 0 ? accessTokens.length : "No"} reader
        {accessTokens.length !== 1 && "s"}{" "}
        {future ? "will be able to " : "can "} view your book
      </span>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="flex items-center my-2">
      {isPublic ? (
        <Button
          variant="secondary"
          onClick={() => history.push("/settings#privacy")}
        >
          Your book is public - Manage link
        </Button>
      ) : (
        <Button
          variant="secondary"
          onClick={() => updateUiState({ showAccessListModal: true }, false)}
        >
          {getStatus()}&nbsp;-&nbsp; Manage share list
        </Button>
      )}
    </div>
  );
}
