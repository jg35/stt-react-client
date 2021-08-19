import { useRef, useCallback, useEffect, useState } from "react";
import useClickOutside from "~/hooks/useClickOutside";
import { Button, Card } from "~/components/_styled";
import Svg from "~/components/svg";
import ModalCloseWarning from "~/components/modalCloseWarning";

export default function Modal({
  size,
  isOpen,
  children,
  close,
  canClose = true,
  formIsDirty = false,
  noScroll = false,
}) {
  const [showCloseWarning, setShowCloseWarning] = useState(false);
  const modal = useRef();
  const onClickOutside = useCallback(() => {
    if (canClose) {
      if (formIsDirty) {
        setShowCloseWarning(true);
      } else {
        close(true);
      }
    }
  }, [formIsDirty, canClose, close]);
  useClickOutside(modal, onClickOutside);

  useEffect(() => {
    document.querySelector("body").style.overflow = "hidden";
    return () => {
      document.querySelector("body").style.overflow = "auto";
    };
  }, []);

  let sizeStyles;
  switch (size) {
    case "sm":
      sizeStyles = "w-full h-full md:h-auto md:w-auto max-w-md";
      break;
    case "lg":
      sizeStyles = "w-full h-full lg:h-auto lg:w-4/5 max-w-5xl";
      break;
    case "full":
      sizeStyles = "w-full h-full max-h-full max-w-full";
      break;
    case "md":
    default:
      sizeStyles = "w-full h-full lg:h-auto lg:w-3/5 xl:w-1/2 max-w-2xl";
      break;
  }

  if (isOpen) {
    return (
      <div className="animate-fade-in fixed min-w-full h-full bg-lightestGray left-0 top-0 z-40 bg-opacity-90 flex justify-center items-center pt-2 md:pt-6 px-2 md:px-4 pb-4">
        <div
          ref={modal}
          className={`${sizeStyles} overflow-scroll relative`}
          id="capture-form-wrapper"
          onClick={(e) => e.stopPropagation()}
        >
          {canClose && (
            <Button
              size="compact"
              css="fixed right-4 top-4 w-auto font-medium rounded-2xl z-50 shadow bg-white"
              variant="minimal"
              onClick={() => close()}
            >
              Close <Svg name="cancel" width={18} height={18} css="ml-1" />
            </Button>
          )}

          <Card css="pt-12 pb-6 md:p-6">{children}</Card>
          <ModalCloseWarning
            isOpen={showCloseWarning}
            back={() => setShowCloseWarning(false)}
            close={close}
          />
        </div>
      </div>
    );
  }
  return null;
}
