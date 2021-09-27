import { useRef, useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  outsideCloseWarning = false,
  cancelOutsideCloseWarning = null,
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
    if (!showCloseWarning && cancelOutsideCloseWarning) {
      cancelOutsideCloseWarning();
    }
  }, [showCloseWarning]);

  useEffect(() => {
    if (outsideCloseWarning) {
      setShowCloseWarning(true);
    }
  }, [outsideCloseWarning]);

  useEffect(() => {
    document.querySelector("body").style.overflow = "hidden";
    return () => {
      document.querySelector("body").style.overflow = "auto";
    };
  }, []);

  let sizeStyles;
  switch (size) {
    case "sm":
      sizeStyles = "w-4/5 h-auto max-w-xl";
      break;
    case "lg":
      sizeStyles = "w-full h-auto lg:w-4/5 max-w-5xl";
      break;
    case "full":
      sizeStyles = "w-full h-auto max-h-full lg:w-4/5 max-w-7xl";
      break;
    case "fullscreen":
      sizeStyles = "min-h-full min-w-full h-screen w-full fixed top-0 left-0";
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

  return (
    <motion.div
      variants={{
        open: {
          opacity: [0, 1],
          backgroundColor: ["#000000e6", "#000000e6"],
          transition: {
            duration: 0.5,
          },
        },
        close: {
          opacity: 0,
          transition: {
            duration: 0.2,
          },
        },
      }}
      transition="linear"
      animate={isOpen ? "open" : "close"}
      id="modal-wrapper"
      className={`fixed z-40 h-full opacity-0 w-full top-0 left-0 flex justify-center pt-2 md:pt-6 px-2 md:px-4 pb-4 ${position}`}
    >
      <motion.div
        ref={modal}
        variants={{
          open: {
            opacity: [0, 1],
            scale: [0.5, 1],
            rotate: [-5, 0],
            y: ["-12.5%", "0%"],
            transition: {
              duration: 0.2,
            },
          },
          close: {
            opacity: 0,
            rotate: 0,
            transition: {
              duration: 0.2,
            },
          },
        }}
        transition="linear"
        animate={isOpen ? "open" : "close"}
        className={`${sizeStyles} max-h-full ${
          !noScroll && "overflow-scroll"
        } relative`}
        id="capture-form-wrapper"
        style={{ ...(size === "full" ? { maxWidth: "1400px" } : {}) }}
        onClick={(e) => e.stopPropagation()}
      >
        <Card
          css={`min-h-full pt-6 px-6 pb-6 md:pt-12 relative`}
          onKeyUp={(e) => {
            if (e.code === "Escape" && canClose) {
              if (formIsDirty) {
                setShowCloseWarning(true);
              } else {
                close(true);
              }
            }
          }}
        >
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
              Close <Svg name="cancel" size={18} css="ml-1" />
            </Button>
          )}
          {children}
        </Card>

        <ModalCloseWarning
          isOpen={showCloseWarning}
          back={() => setShowCloseWarning(false)}
          close={close}
        />
      </motion.div>
    </motion.div>
  );
}
