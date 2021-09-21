import { useState, useEffect } from "react";
import Modal from "~/components/modal";
import { Button, Grid, Title } from "~/components/_styled";

export default function ProceedModal({
  title,
  onProceed,
  onCancel,
  text = "Delete",
  inProgressText = "Deleting...",
}) {
  const [inProgress, setInProgress] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  function cancelHandler() {
    const ANIMATE_CLOSE_TIME = 200;
    setIsOpen(false);
    setTimeout(() => {
      onCancel();
    }, ANIMATE_CLOSE_TIME);
  }

  return (
    <Modal isOpen={isOpen} size="sm" close={cancelHandler} canClose={false}>
      <Title css="text-center">{title}</Title>
      <Grid colSpan={["col-span-6"]}>
        <Button onClick={cancelHandler}>Cancel</Button>
        <Button
          variant="secondary"
          inProgress={inProgress}
          onClick={() => {
            setInProgress(true);
            onProceed();
          }}
        >
          {!inProgress ? text : inProgressText}
        </Button>
      </Grid>
    </Modal>
  );
}
