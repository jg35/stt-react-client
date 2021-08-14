import Button from "~/components/button";
import SubmitButton from "~/components/submitButton";

export default function FormActions({
  closeModal,
  itemId,
  isSubmitting,
  formIsDirty = false,
  formId,
}) {
  let submitText;
  if (isSubmitting) {
    submitText = !itemId ? "Adding..." : "Updating...";
  } else {
    submitText = !itemId ? "Add" : "Update";
  }
  return (
    <div className="flex justify-end pt-6 border-t border-lightGray">
      <Button
        disabled={isSubmitting}
        variant="minimal"
        size="large"
        css="w-36 mr-2"
        onClick={closeModal}
      >
        Cancel
      </Button>
      <SubmitButton
        disabled={!formIsDirty}
        isSubmitting={isSubmitting}
        formId={formId}
      >
        {submitText}
      </SubmitButton>
    </div>
  );
}
