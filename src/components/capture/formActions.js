import { Button, ButtonGroup, Grid } from "~/components/_styled";

export default function FormActions({
  closeModal,
  itemId,
  isSubmitting,
  formIsDirty = false,
}) {
  let submitText;
  if (isSubmitting) {
    submitText = !itemId ? "Adding..." : "Updating...";
  } else {
    submitText = !itemId ? "Add" : "Update";
  }
  return (
    <div className="flex justify-end">
      <Button
        disabled={isSubmitting}
        variant="minimal"
        css="w-full md:w-36 mr-4"
        onClick={closeModal}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        variant="cta"
        css="w-full md:w-36"
        disabled={!formIsDirty}
        inProgress={isSubmitting}
      >
        {submitText}
      </Button>
    </div>
  );
}
