import { useContext } from "react";
import { UIContext } from "~/app";
import AccessListModal from "~/components/accessList/accessListModal";

export default function AccessList({ userId }) {
  const { uiState, updateUiState } = useContext(UIContext);

  if (uiState.showAccessListModal) {
    return (
      <AccessListModal
        userId={userId}
        closeModal={() => updateUiState({ showAccessListModal: false }, false)}
      />
    );
  }
  return null;
}
