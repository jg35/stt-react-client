import { Button, Title, Text } from "~/components/_styled";
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
      className="flex flex-col justify-center pt-20 w-12/12 lg:w-6/12 mx-auto"
      style={{ maxWidth: "768px" }}
    >
      <Title>Decide how you would like to share your book</Title>

      <div className="mb-6">
        <ManagePrivacyStatus
          privacyStatus={values.privacyStatus}
          setPrivacyStatus={(val) => setFieldValue("privacyStatus", val)}
        />

        {values.privacyStatus === "PRIVATE" && (
          <div className="mt-6">
            <AccessListStatusButton userId={values.userId} future={true} />
          </div>
        )}
      </div>

      {!savedHandle && (
        <div className="mt-6">
          <Title tag="h2">URL handle</Title>
          <Text size="large">
            Now let's set your handle. This will form the web address where
            readers can access your book.
          </Text>
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

      <div className="mx-auto mt-6">
        <Button
          type="submit"
          size="large"
          disabled={!isValid}
          inProgress={isSubmitting}
          variant="cta"
          css="w-60"
        >
          {isSubmitting ? "Creating your book..." : "Create your book"}
        </Button>
      </div>
    </div>
  );
}
