import { useRef, useCallback, useEffect, useState } from "react";
import useClickOutside from "~/hooks/useClickOutside";
import { Button, Card } from "~/components/_styled";
import Svg from "~/components/svg";
import ModalCloseWarning from "~/components/modalCloseWarning";

export default function Modal({
  stickyTop = false,
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
      sizeStyles = "w-4/5 md:w-3/5 xl:w-2/5 h-auto md:h-auto max-w-xl";
      break;
    case "lg":
      sizeStyles = "w-full h-auto lg:h-auto lg:w-4/5 max-w-5xl";
      break;
    case "full":
      sizeStyles = "w-full h-auto lg:h-auto max-h-full max-w-full";
      break;
    case "md":
    default:
      sizeStyles = "w-full md:w-4/5 lg:w-3/5 xl:w-1/2 max-w-2xl";
      break;
  }

  let position = "md:items-baseline lg:items-center";
  if (size === "sm") {
    position = "items-center";
  } else if (stickyTop) {
    position = "md:items-baseline";
  }

  if (isOpen) {
    return (
      <div
        className={`animate-fade-in fixed min-w-full h-full bg-lightestGray left-0 top-0 z-40 bg-opacity-90 flex justify-center pt-2 md:pt-6 px-2 md:px-4 pb-4 ${position}`}
      >
        <div
          ref={modal}
          className={`${sizeStyles} max-h-full overflow-scroll relative`}
          id="capture-form-wrapper"
          style={{ ...(size === "full" ? { maxWidth: "1400px" } : {}) }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card css="min-h-full pt-6 px-6 pb-6 md:pt-12 relative">
            {canClose && (
              <Button
                size="compact"
                css="fixed lg:absolute lg:shadow-none right-4 top-6 md:top-8 md:right-6 lg:top-4 w-auto font-medium rounded-2xl z-40 shadow bg-white"
                variant="minimal"
                onClick={() => {
                  if (formIsDirty) {
                    setShowCloseWarning(true);
                  } else {
                    close(true);
                  }
                }}
              >
                Close <Svg name="cancel" width={18} height={18} css="ml-1" />
              </Button>
            )}
            {children}
          </Card>

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
