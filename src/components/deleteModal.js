import { useState } from "react";
import Modal from "~/components/modal";
import { Button, Grid, Title } from "~/components/_styled";

export default function DeleteModal({ title, onDelete, onCancel }) {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <Modal isOpen={true} size="sm" close={() => onCancel()}>
      <Title>{title}</Title>
      <Grid colSpan={["col-span-6"]}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          variant="secondary"
          inProgress={isDeleting}
          onClick={() => {
            setIsDeleting(true);
            onDelete();
          }}
        >
          {!isDeleting ? "Delete" : "Deleting..."}
        </Button>
      </Grid>
    </Modal>
  );
}
