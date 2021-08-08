import { useState } from "react";
import colors from "~/lib/colors";
import Modal from "~/components/modal";
import Button from "~/components/button";
import Svg from "~/components/svg";
import LoadingSpinner from "~/components/loadingSpinner";

export default function DeleteModal({
  iconSize = 24,
  title,
  isDeleting,
  deleteHandler,
  onlyIcon = false,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button minimal onClick={() => setIsOpen(true)}>
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
          <div>
            <Button onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button
              onClick={() => deleteHandler().then(() => setIsOpen(false))}
            >
              {!isDeleting && <span>Delete</span>}
              {isDeleting && <span className="animate-pulse">Deleting...</span>}
              <LoadingSpinner loading={isDeleting} />
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
