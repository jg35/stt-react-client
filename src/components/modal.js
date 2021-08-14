import { useRef, useCallback, useEffect, useState } from "react";
import useClickOutside from "~/hooks/useClickOutside";
import { Card } from "~/components/_styled";
import ModalCloseWarning from "~/components/modalCloseWarning";

export default function Modal({
  size,
  isOpen,
  children,
  close,
  canClose = true,
  formIsDirty = false,
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
      sizeStyles = "w-auto max-w-md";
      break;
    case "lg":
      sizeStyles = "w-4/5 max-w-5xl";
      break;
    case "full":
      sizeStyles = "h-full max-h-full w-full max-w-full";
      break;
    case "md":
    default:
      sizeStyles = "w-2/5 max-w-2xl";
      break;
  }

  if (isOpen) {
    return (
      <div className="animate-fade-in fixed min-w-full h-full bg-lightestGray left-0 top-0 z-40 bg-opacity-90 flex justify-center items-center p-4">
        <div
          ref={modal}
          className={`relative ${sizeStyles}`}
          id="capture-form-wrapper"
          onClick={(e) => e.stopPropagation()}
        >
          <Card css="p-6">{children}</Card>
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
