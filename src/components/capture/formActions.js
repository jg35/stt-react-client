import { Button, ButtonGroup, Grid } from "~/components/_styled";

export default function FormActions({
  closeHandler,
  itemId,
  isSubmitting,
  formIsDirty = false,
  isValid,
}) {
  let submitText;
  if (isSubmitting) {
    submitText = !itemId ? "Creating..." : "Saving...";
  } else {
    submitText = !itemId ? "Create" : "Save";
  }
  return (
    <div className="flex justify-end md:absolute top-0 right-0">
      <Button
        disabled={isSubmitting}
        css="w-full md:w-28 mr-4 md:mr-2"
        onClick={closeHandler}
      >
        Close
      </Button>
      <Button
        type="submit"
        variant="cta"
        form="capture-form"
        css="w-full md:w-32"
        disabled={!formIsDirty}
        inProgress={isSubmitting}
      >
        {submitText}
      </Button>
    </div>
  );
}
