import { BookPrivacyStatus, Button, Title, Text } from "~/components/_styled";
import ManagePrivacyStatus from "~/components/accessList/managePrivacyStatus";
import AccessListStatusButton from "~/components/accessList/accessListStatusButton";
import FormHandleAvailabilityInput from "~/components/formHandleAvailabilityInput";

export default function PublishOptionsForm({
  values,
  setFieldValue,
  handleBlur,
  handleChange,
  errors,
  isSubmitting,
  setFieldError,
  savedHandle,
  isValid,
}) {
  return (
    <div
      className="pt-10 md:pt-20 w-12/12 lg:w-6/12 mx-auto px-4"
      style={{ maxWidth: "600px" }}
    >
      {savedHandle && (
        <div className="mb-6">
          <Title tag="h2">
            Now let's set your handle. This is where readers will access your
            book.
          </Title>
          <FormHandleAvailabilityInput
            value={values.publicHandle}
            error={errors.publicHandle}
            handleBlur={handleBlur}
            handleChange={handleChange}
            setFieldError={setFieldError}
            savedHandle={savedHandle}
          />
        </div>
      )}

      <div className="mb-6">
        <Title tag="h2">
          Finally, decide how you would like to share your book.
        </Title>
        <ManagePrivacyStatus
          showLabel={false}
          privacyStatus={values.privacyStatus}
          setPrivacyStatus={(val) => setFieldValue("privacyStatus", val)}
        />
      </div>

      <div className="flex justify-center">
        <Button
          type="submit"
          size="large"
          disabled={!isValid}
          inProgress={isSubmitting}
          variant="cta"
          css="md:w-60"
        >
          {isSubmitting ? "Creating your book..." : "Create your book"}
        </Button>
      </div>
    </div>
  );
}
