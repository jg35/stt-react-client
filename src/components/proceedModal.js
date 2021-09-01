import { useState } from "react";
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

  return (
    <Modal isOpen={true} size="sm" close={() => onCancel()} canClose={false}>
      <Title css="text-center">{title}</Title>
      <Grid colSpan={["col-span-6"]}>
        <Button onClick={onCancel}>Cancel</Button>
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
