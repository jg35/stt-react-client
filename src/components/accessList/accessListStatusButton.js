import { useCustomQuery } from "~/hooks/useCustomApollo";
import { FETCH_PRIVATE_ACCESS_TOKENS } from "~/lib/gql";
import { useContext } from "react";
import { UIContext } from "~/app";
import { Button, Text } from "~/components/_styled";

export default function AccessListStatusButton({
  text = "Manage share list",
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
    <div className="my-2">
      {isEmpty && showEmptyCta && (
        <Text css="text-red">
          No readers are on your share list. Add your first reader.
        </Text>
      )}
      <Button
        size={size}
        css="md:w-auto"
        onClick={() => updateUiState({ showAccessListModal: true }, false)}
      >
        {text}
      </Button>
    </div>
  );
}
