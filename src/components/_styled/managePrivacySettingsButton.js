import { Button } from "~/components/_styled";
import { useHistory } from "react-router";

export default function ManagePrivacySettingsButton({ css = "" }) {
  const history = useHistory();
  const buttonCss = `md:w-auto ${css}`;
  return (
    <div className="my-2 mr-2">
      <Button
        size="compact"
        css={buttonCss}
        onClick={() => history.push("/settings#privacy")}
      >
        Privacy settings
      </Button>
    </div>
  );
}
