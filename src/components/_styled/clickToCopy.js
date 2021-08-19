import { useState } from "react";
import { joinTailwindClasses } from "~/lib/util";
import { Button } from "~/components/_styled";

export default function ClickToCopy({
  value,
  copyText = "Copy",
  copySuccessText = "Copied!",
  css = "",
}) {
  const [showCopied, setShowCopied] = useState(false);

  const baseCss = `ml-0 w-32 max-w-full justify-center font-medium ${
    showCopied
      ? "bg-green border-green hover:bg-green active:bg-green hover:border-green active:border-green"
      : ""
  }`;
  return (
    <Button
      title="Click to copy"
      size="compact"
      css={joinTailwindClasses([baseCss, css])}
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
        <span className="truncate w-full">{copyText}</span>
      )}
    </Button>
  );
}
