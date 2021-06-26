import Button from "~/components/button";

export default function FormActions({ closeModal, itemId }) {
  return (
    <div className="flex justify-end pt-6 mt-6 border-t border-lightGray">
      <Button
        minimal
        css="text-lg mr-2 w-32 py-2 duration-300"
        onClick={closeModal}
      >
        Cancel
      </Button>
      <Button type="submit" css="text-lg w-32 py-2 duration-300 ease-in" cta>
        {itemId ? "Update" : "Add"}
      </Button>
    </div>
  );
}
