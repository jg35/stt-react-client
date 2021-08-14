import { useState } from "react";
import colors from "~/lib/colors";
import Modal from "~/components/modal";
import Button from "~/components/button";
import Svg from "~/components/svg";
import useToastMessage from "~/hooks/useToastMessage";

export default function DeleteModal({
  iconSize = 24,
  title,
  deleteHandler,
  deleteSuccessMessage,
  onlyIcon = false,
}) {
  const { setError, setSuccess } = useToastMessage();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="minimal"
        size="compact"
        css="flex justify-between"
        onClick={() => setIsOpen(true)}
      >
        {!onlyIcon && "Delete"}
        <Svg
          name="delete"
          width={iconSize}
          height={iconSize}
          color={colors.darkGray}
        />
      </Button>
      {isOpen && (
        <Modal isOpen={isOpen} close={() => setIsOpen(false)}>
          <h1>{title}</h1>
          <div className="flex">
            <Button onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button
              variant="secondary"
              inProgress={isDeleting}
              onClick={() => {
                setIsDeleting(true);
                deleteHandler()
                  .then(() => {
                    setIsOpen(false);
                    setIsDeleting(false);
                    if (deleteSuccessMessage) {
                      setSuccess({
                        ref: deleteSuccessMessage,
                      });
                    }
                  })
                  .catch((e) => {
                    setError(e, {
                      ref: "DELETE",
                      params: ["item"],
                    });
                  });
              }}
            >
              {!isDeleting ? "Delete" : "Deleting..."}
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
