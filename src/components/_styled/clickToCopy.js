import { useState } from "react";
import { Button } from "~/components/_styled";

export default function ClickToCopy({
  value,
  copyText = "Copy",
  copySuccessText = "Copied!",
}) {
  const [showCopied, setShowCopied] = useState(false);
  return (
    <Button
      size="compact"
      css={`ml-2 w-32 font-medium ${
        showCopied
          ? "bg-green border-green hover:bg-green active:bg-green hover:border-green active:border-green"
          : ""
      }`}
      onClick={() => {
        navigator.clipboard.writeText(value);
        setShowCopied(true);
        setTimeout(() => {
          setShowCopied(false);
        }, 2000);
      }}
    >
      {showCopied ? (
        <span className="animate-fade-in">{copySuccessText}</span>
      ) : (
        <span>{copyText}</span>
      )}
    </Button>
  );
}
