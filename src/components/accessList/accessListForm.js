import { Button, FormInput, Title } from "~/components/_styled";
import FormError from "~/components/formError";

export default function AccessListForm({ formProps, addNewToken }) {
  return (
    <>
      <Title tag="h2" size="compact" css="text-gray">
        Add readers
      </Title>

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
          variant="secondary"
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
