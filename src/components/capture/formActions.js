import Button from "~/components/button";
import ButtonGroup from "~/components/buttonGroup";

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
    <ButtonGroup css="justify-end pt-6 border-t border-lightGray">
      <Button
        disabled={isSubmitting}
        variant="minimal"
        size="large"
        css="w-36"
        onClick={closeModal}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        variant="cta"
        size="large"
        css="w-36"
        disabled={!formIsDirty}
        inProgress={isSubmitting}
      >
        {submitText}
      </Button>
    </ButtonGroup>
  );
}
