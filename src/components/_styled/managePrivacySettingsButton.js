import { Button } from "~/components/_styled";
import { useHistory } from "react-router";

export default function ManagePrivacySettingsButton() {
  const history = useHistory();
  return (
    <Button size="compact" onClick={() => history.push("/settings#privacy")}>
      Manage privacy settings
    </Button>
  );
}
