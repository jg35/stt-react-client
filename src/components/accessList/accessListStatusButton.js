import { useCustomQuery } from "~/hooks/useCustomApollo";
import { FETCH_PRIVATE_ACCESS_TOKENS } from "~/lib/gql";
import { useContext } from "react";
import { UIContext } from "~/app";
import { Button, Text } from "~/components/_styled";
import { getHTMLTranslation } from "~/lib/util";

export default function AccessListStatusButton({
  text = "Manage your share list",
  size = "compact",
  showEmptyCta = true,
}) {
  const { data, loading } = useCustomQuery(FETCH_PRIVATE_ACCESS_TOKENS, {
    userId: true,
  });
  const { updateUiState } = useContext(UIContext);

  if (!data) {
    return null;
  }

  const isEmpty = !data.stt_accessToken.length;

  return (
    <>
      {isEmpty && showEmptyCta && (
        <Text css="text-orange">
          {getHTMLTranslation(
            "components.accessList.accessListStatusButton.accessListEmpty"
          )}
        </Text>
      )}
      <Button
        size={size}
        onClick={() => updateUiState({ showAccessListModal: true }, false)}
      >
        {text}
      </Button>
    </>
  );
}
