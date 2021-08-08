import FormInput from "@src/components/formInput";
import FormError from "@src/components/formError";
import Button from "@src/components/button";

export default function AccessListForm({ formProps, addNewToken }) {
  return (
    <>
      <h2 className="font-medium mb-2 text-lg text-gray">Add readers</h2>

      <div className="flex-1">
        <FormInput
          name="newToken.email"
          placeholder="Enter email"
          handleChange={formProps.handleChange}
          handleBlur={formProps.handleBlur}
          value={formProps.values.newToken.email}
          error={formProps.errors.newToken && formProps.errors.newToken.email}
        />
        <FormError
          error={formProps.errors.newToken && formProps.errors.newToken.email}
        />
      </div>
      <div className="ml-2">
        <Button
          disabled={formProps.errors.newToken}
          onClick={() => addNewToken()}
          isSubmitting={formProps.isSubmitting}
        >
          Add
        </Button>
      </div>
    </>
  );
}
