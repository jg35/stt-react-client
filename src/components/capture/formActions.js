import Button from "~/components/button";
import SubmitButton from "~/components/submitButton";

export default function FormActions({ closeModal, itemId, isSubmitting }) {
  let submitText;
  if (isSubmitting) {
    submitText = !itemId ? "Adding..." : "Updating...";
  } else {
    submitText = !itemId ? "Add" : "Update";
  }
  return (
    <div className="flex justify-end pt-6 mt-6 border-t border-lightGray">
      <Button
        minimal
        css="text-lg mr-2 w-36 py-2 duration-300"
        onClick={closeModal}
      >
        Cancel
      </Button>
      <SubmitButton isSubmitting={isSubmitting}>{submitText}</SubmitButton>
    </div>
  );
}
